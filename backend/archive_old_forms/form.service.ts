import { PrismaClient } from "@prisma/client";
import { slugify } from "../utils/slugify";

const prisma = new PrismaClient();

export interface FieldDefinition {
  id: string;
  type:
    | "text"
    | "textarea"
    | "number"
    | "select"
    | "radio"
    | "checkbox"
    | "email"
    | "date";
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  order: number;
}

export interface CreateFormInput {
  title: string;
  description?: string;
  fields: FieldDefinition[];
  isPublished?: boolean;
}

function toQuestionCreateData(field: FieldDefinition, index: number) {
  return {
    label: field.label,
    inputType: field.type.toUpperCase() as any,
    options: field.options ?? [],
    isRequired: field.required ?? false,
    order: field.order ?? index,
    ...(field.placeholder
      ? {
          config: {
            placeholder: field.placeholder,
          },
        }
      : {}),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export const FormService = {
  async getAll() {
    return prisma.form.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            answers: true,
          },
        },
      },
    });
  },

  async getBySlug(slug: string) {
    return prisma.form.findUnique({
      where: { slug },
      include: {
        questions: {
          orderBy: { order: "asc" },
        },
      },
    });
  },

  async getById(id: string) {
    return prisma.form.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: "asc" },
        },
        answers: {
          orderBy: { createdAt: "desc" },
          include: {
            items: true,
          },
        },
      },
    });
  },

  async create(input: CreateFormInput) {
    const slug = slugify(input.title);
    const isActive = input.isPublished ?? false;

    return prisma.form.create({
      data: {
        title: input.title,
        slug,
        description: input.description,
        isActive,
        questions: {
          create: input.fields.map((field, index) =>
            toQuestionCreateData(field, index)
          ),
        },
      } as any,
    });
  },

  async update(id: string, input: Partial<CreateFormInput>) {
    const updateData: Record<string, unknown> = {};

    if (input.title !== undefined) {
      updateData.title = input.title;
      updateData.slug = slugify(input.title);
    }

    if (input.description !== undefined) {
      updateData.description = input.description;
    }

    if (input.isPublished !== undefined) {
      updateData.isActive = input.isPublished;
    }

    if (Array.isArray(input.fields)) {
      updateData.questions = {
        deleteMany: {},
        create: input.fields.map((field, index) =>
          toQuestionCreateData(field, index)
        ),
      };
    }

    return prisma.form.update({
      where: { id },
      data: updateData as any,
    });
  },

  async delete(id: string) {
    return prisma.form.delete({
      where: { id },
    });
  },

  async submit(
    slug: string,
    data: Record<string, unknown>
  ) {
    const form = await prisma.form.findUnique({
      where: { slug },
      include: {
        questions: true,
      },
    });

    if (!form) {
      throw new Error("Form not found");
    }

    if (!form.isActive) {
      throw new Error("Form is not published");
    }

    const answerValues =
      isRecord(data.answers)
        ? data.answers
        : isRecord(data.values)
          ? data.values
          : data;

    const items = form.questions
      .map((question) => {
        const possibleKeys = [
          question.id,
          String(question.order),
          `question_${question.id}`,
          `field_${question.order}`,
        ];

        const matchingKey = possibleKeys.find((key) =>
          Object.prototype.hasOwnProperty.call(answerValues, key)
        );

        if (!matchingKey) {
          return null;
        }

        return {
          formQuestionId: question.id,
          value: answerValues[matchingKey] as any,
        };
      })
      .filter(
        (
          item
        ): item is {
          formQuestionId: string;
          value: any;
        } => item !== null
      );

    const participantId =
      typeof data.participantId === "string"
        ? data.participantId
        : undefined;

    const guestEmail =
      typeof data.guestEmail === "string"
        ? data.guestEmail
        : undefined;

    const guestName =
      typeof data.guestName === "string"
        ? data.guestName
        : undefined;

    return prisma.formAnswer.create({
      data: {
        formId: form.id,
        participantId,
        guestEmail,
        guestName,
        status: "SUBMITTED" as any,
        submittedAt: new Date(),
        items: {
          create: items,
        },
      } as any,
      include: {
        items: true,
      },
    });
  },

  async getSubmissions(formId: string) {
    return prisma.formAnswer.findMany({
      where: { formId },
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
      },
    });
  },
};
