import { PrismaClient, FormType, QuestionInputType, FormStatus, AnswerStatus } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(text: string): string {
  const base = text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]+/g, "")
    .replace(/--+/g, "-");
  return base || `form-${Date.now()}`;
}

export interface CreateFormDto {
  title: string;
  description?: string;
  slug?: string;
  isActive?: boolean;
  status?: FormStatus;
  themeConfig?: any;
  startsAt?: Date;
  endsAt?: Date;
  bootcampId?: string;
  type?: FormType;
}

export interface UpdateFormDto extends Partial<CreateFormDto> {}

export interface QuestionDto {
  label: string;
  helpText?: string;
  inputType: QuestionInputType;
  options?: string[];
  isRequired?: boolean;
  weight?: number;
  order?: number;
  config?: any;
}

export interface SubmitAnswerDto {
  guestEmail?: string | null;
  guestName?: string | null;
  items: { questionId: string; value: any }[];
}

export const formService = {
  // --- Form CRUD ---
  async getPublicForms() {
    return prisma.form.findMany({
      where: {
        isActive: true,
        status: FormStatus.ACTIVE,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        startsAt: true,
        endsAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getAllFormsAdmin() {
    return prisma.form.findMany({
      include: {
        questions: { orderBy: { order: "asc" } },
        _count: { select: { answers: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getFormByIdOrSlug(idOrSlug: string, isAdmin = false) {
    const where = idOrSlug.length > 20 && !idOrSlug.includes("-") 
      ? { id: idOrSlug } 
      : { slug: idOrSlug };

    const form = await prisma.form.findFirst({
      where,
      include: {
        questions: { orderBy: { order: "asc" } },
        _count: { select: { answers: true } },
      },
    });

    if (!form) return null;
    if (!isAdmin && (!form.isActive || form.status !== FormStatus.ACTIVE)) {
      return null;
    }

    return form;
  },

  async createForm(data: CreateFormDto) {
    let slug = data.slug ? slugify(data.slug) : slugify(data.title);
    
    // اطمینان از یکتا بودن اسلاگ
    const existing = await prisma.form.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    return prisma.form.create({
      data: {
        title: data.title,
        description: data.description,
        slug,
        isActive: data.isActive ?? false,
        status: data.status ?? FormStatus.DRAFT,
        bootcampId: data.bootcampId,
        type: data.type ?? FormType.EVALUATION,
        themeConfig: data.themeConfig,
        startsAt: data.startsAt,
        endsAt: data.endsAt,
      },
      include: { questions: true },
    });
  },

  async updateForm(id: string, data: UpdateFormDto) {
    const updateData: any = { ...data };
    if (data.slug) {
      updateData.slug = slugify(data.slug);
    }
    return prisma.form.update({
      where: { id },
      data: updateData,
      include: { questions: { orderBy: { order: "asc" } } },
    });
  },

  async setFormStatus(id: string, status: FormStatus) {
    const isActive = status === FormStatus.ACTIVE;
    return prisma.form.update({
      where: { id },
      data: { status, isActive },
    });
  },

  async deleteForm(id: string) {
    // حذف آبشاری پاسخ‌ها و سوالات
    await prisma.formAnswerItem.deleteMany({
      where: { answer: { formId: id } },
    });
    await prisma.formAnswer.deleteMany({ where: { formId: id } });
    await prisma.formQuestion.deleteMany({ where: { formId: id } });
    return prisma.form.delete({ where: { id } });
  },

  async duplicateForm(id: string) {
    const original = await prisma.form.findUnique({
      where: { id },
      include: { questions: { orderBy: { order: "asc" } } },
    });
    if (!original) throw new Error("فرم مبدا یافت نشد.");

    const newSlug = `${original.slug}-copy-${Date.now()}`;
    return prisma.form.create({
      data: {
        title: `${original.title} (کپی)`,
        description: original.description,
        slug: newSlug,
        status: FormStatus.DRAFT,
        isActive: false,
        themeConfig: original.themeConfig as any,
        questions: {
          create: original.questions.map((q) => ({
            label: q.label,
            helpText: q.helpText,
            inputType: q.inputType,
            options: q.options,
            isRequired: q.isRequired,
            weight: q.weight,
            order: q.order,
            config: q.config as any,
          })),
        },
      },
      include: { questions: { orderBy: { order: "asc" } } },
    });
  },

  // --- Question Management ---
  async addQuestion(formId: string, data: QuestionDto) {
    let order = data.order;
    if (order === undefined) {
      const maxOrder = await prisma.formQuestion.aggregate({
        where: { formId },
        _max: { order: true },
      });
      order = (maxOrder._max.order ?? -1) + 1;
    }

    return prisma.formQuestion.create({
      data: {
        formId,
        label: data.label,
        helpText: data.helpText,
        inputType: data.inputType,
        options: data.options ?? [],
        isRequired: data.isRequired ?? true,
        weight: data.weight,
        order,
        config: data.config,
      },
    });
  },

  async updateQuestion(questionId: string, data: Partial<QuestionDto>) {
    return prisma.formQuestion.update({
      where: { id: questionId },
      data,
    });
  },

  async removeQuestion(questionId: string) {
    // پاک کردن جواب‌های مرتبط با این سوال
    await prisma.formAnswerItem.deleteMany({ where: { formQuestionId: questionId } });
    return prisma.formQuestion.delete({ where: { id: questionId } });
  },

  async reorderQuestions(formId: string, questionOrders: { id: string; order: number }[]) {
    return prisma.$transaction(
      questionOrders.map((q, idx) =>
        prisma.formQuestion.update({
          where: { id: q.id },
          data: { order: q.order ?? idx },
        })
      )
    );
  },

  // --- Submissions & Answers ---
  async submitAnswer(formId: string, userIdOrParticipantId: string | null, payload: SubmitAnswerDto) {
    let resolvedParticipantId: string | null = null;
    let fallbackGuestEmail: string | null | undefined = payload.guestEmail;
    let fallbackGuestName: string | null | undefined = payload.guestName;

    if (userIdOrParticipantId) {
      // بررسی می‌کنیم آیا ورودی مستقیماً id یک ParticipantProfile است یا userId یک کاربر
      const profile = await prisma.participantProfile.findFirst({
        where: {
          OR: [
            { id: userIdOrParticipantId },
            { userId: userIdOrParticipantId }
          ]
        },
        include: { user: true }
      });

      if (profile) {
        resolvedParticipantId = profile.id;
        if (!fallbackGuestEmail && profile.user?.email) {
          fallbackGuestEmail = profile.user.email;
        }
        if (!fallbackGuestName) {
          fallbackGuestName = fallbackGuestName || profile.user?.email || undefined;
        }
      } else {
        // اگر کاربر لاگین کرده ولی ParticipantProfile ندارد (مثلا ADMIN یا EVALUATOR)
        const user = await prisma.user.findUnique({ where: { id: userIdOrParticipantId } });
        if (user) {
          if (!fallbackGuestEmail) fallbackGuestEmail = user.email;
          if (!fallbackGuestName) fallbackGuestName = user.email;
        }
      }
    }

    const form = await prisma.form.findUnique({
      where: { id: formId },
      include: { questions: true },
    });

    if (!form) throw new Error("فرم مورد نظر یافت نشد.");
    if (!form.isActive || form.status !== FormStatus.ACTIVE) {
      throw new Error("این فرم در حال حاضر فعال و پذیرای پاسخ نیست.");
    }

    if (form.startsAt && new Date() < form.startsAt) {
      throw new Error("زمان پاسخ‌دهی به این فرم هنوز شروع نشده است.");
    }
    if (form.endsAt && new Date() > form.endsAt) {
      throw new Error("مهلت پاسخ‌دهی به این فرم به پایان رسیده است.");
    }

    // اعتبارسنجی سوالات اجباری
    const requiredQuestions = form.questions.filter((q) => q.isRequired);
    const answeredMap = new Map(payload.items.map((i) => [i.questionId, i.value]));

    for (const q of requiredQuestions) {
      const val = answeredMap.get(q.id);
      if (val === undefined || val === null || val === "" || (Array.isArray(val) && val.length === 0)) {
        throw new Error(`پاسخ به سوال «${q.label}» الزامی است.`);
      }
    }

    return prisma.formAnswer.create({
      data: {
        formId,
        participantId: resolvedParticipantId || undefined,
        guestEmail: fallbackGuestEmail || undefined,
        guestName: fallbackGuestName || undefined,
        status: AnswerStatus.SUBMITTED,
        submittedAt: new Date(),
        items: {
          create: payload.items.map((item) => ({
            formQuestionId: item.questionId,
            value: typeof item.value === "object" ? item.value : JSON.stringify(item.value),
          })),
        },
      },
      include: { items: true },
    });
  },

  async getAnswersByForm(formId: string) {
    return prisma.formAnswer.findMany({
      where: { formId },
      include: {
        participant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            user: { select: { email: true } },
          },
        },
        items: {
          include: { formQuestion: { select: { id: true, label: true, inputType: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  // --- Analytics & Statistics ---
  async getFormAnalytics(formId: string) {
    const form = await prisma.form.findUnique({
      where: { id: formId },
      include: {
        questions: { orderBy: { order: "asc" } },
        answers: {
          include: { items: true },
        },
      },
    });

    if (!form) throw new Error("فرم یافت نشد.");

    const totalSubmissions = form.answers.length;

    // خلاصه آماری برای هر سوال
    const questionAnalytics = form.questions.map((q) => {
      const answersForQuestion = form.answers
        .map((a) => a.items.find((it) => it.formQuestionId === q.id)?.value)
        .filter((v) => v !== undefined && v !== null);

      let distribution: Record<string, number> = {};

      if (["SINGLE_CHOICE", "MULTI_CHOICE", "TRAIT_TAG"].includes(q.inputType)) {
        for (const rawVal of answersForQuestion) {
          let val = rawVal;
          if (typeof val === "string") {
            try { val = JSON.parse(val); } catch {}
          }
          if (Array.isArray(val)) {
            val.forEach((item) => {
              distribution[String(item)] = (distribution[String(item)] || 0) + 1;
            });
          } else if (val !== undefined && val !== null) {
            distribution[String(val)] = (distribution[String(val)] || 0) + 1;
          }
        }
      }

      return {
        questionId: q.id,
        label: q.label,
        inputType: q.inputType,
        totalAnswers: answersForQuestion.length,
        distribution,
        recentAnswers: answersForQuestion.slice(0, 200),
      };
    });

    return {
      formId: form.id,
      title: form.title,
      status: form.status,
      totalSubmissions,
      createdAt: form.createdAt,
      questions: questionAnalytics,
    };
  },
};

export async function getPendingFormsForUser(userId: string) {
  // پیدا کردن فرم‌های فعال که این کاربر هنوز پاسخی با وضعیت نهایی برای آن ثبت نکرده است
  const activeForms = await prisma.form.findMany({
    where: {
      isActive: true,
      status: "ACTIVE",
    },
    include: {
      answers: {
        where: {
          participant: {
            userId: userId,
          },
        },
        select: { id: true, status: true },
      },
      _count: {
        select: { questions: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // فیلتر فرم‌هایی که بدون پاسخ هستند
  return activeForms
    .filter((f) => f.answers.length === 0)
    .map((f) => ({
      id: f.id,
      title: f.title,
      slug: f.slug,
      description: f.description,
      questionCount: f._count.questions,
      createdAt: f.createdAt,
    }));
}
