import { Request, Response } from "express";
import { formService } from "./form.service";
import { FormStatus } from "@prisma/client";

export const formController = {
  async getPendingForms(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (!user?.id) return res.status(401).json({ error: "کاربر احراز هویت نشده است." });
      const pending = await (formService as any).getPendingFormsForUser(user.id);
      res.json(pending);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "خطا در دریافت فرم‌های منتظر تکمیل" });
    }
  },
  // Public
  async getPublicForms(req: Request, res: Response) {
    try {
      const forms = await formService.getPublicForms();
      res.json(forms);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "خطا در دریافت لیست فرم‌ها" });
    }
  },

  async getPublicByIdOrSlug(req: Request, res: Response) {
    try {
      const form = await formService.getFormByIdOrSlug(req.params.idOrSlug, false);
      if (!form) return res.status(404).json({ error: "فرم یافت نشد یا در دسترس نیست." });
      res.json(form);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "خطا در دریافت اطلاعات فرم" });
    }
  },

  async submitAnswer(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const participantId = user?.participantProfileId ?? user?.userId ?? user?.id ?? null;
      const { guestEmail, guestName, items } = req.body;

      if (!participantId && !guestEmail) {
        return res.status(400).json({
          error: "برای ثبت پاسخ، ورود به حساب کاربری یا درج ایمیل الزامی است.",
        });
      }

      if (!items || !Array.isArray(items)) {
        return res.status(400).json({ error: "پاسخ‌ها باید به صورت آرایه‌ای از سوالات ارسال شوند." });
      }

      const answer = await formService.submitAnswer(req.params.id, participantId, {
        guestEmail,
        guestName,
        items,
      });

      res.status(201).json({ message: "پاسخ شما با موفقیت ثبت شد.", answer });
    } catch (err: any) {
      res.status(400).json({ error: err.message || "خطا در ثبت پاسخ" });
    }
  },

  // Admin
  async getAllAdmin(req: Request, res: Response) {
    try {
      const forms = await formService.getAllFormsAdmin();
      res.json(forms);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "خطا در دریافت لیست فرم‌های ادمین" });
    }
  },

  async getAdminById(req: Request, res: Response) {
    try {
      const form = await formService.getFormByIdOrSlug(req.params.id, true);
      if (!form) return res.status(404).json({ error: "فرم یافت نشد." });
      res.json(form);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "خطا در دریافت جزئیات فرم" });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const { title, description, slug, isActive, status, themeConfig, startsAt, endsAt } = req.body;
      if (!title) return res.status(400).json({ error: "عنوان فرم الزامی است." });

      const form = await formService.createForm({
        title,
        description,
        slug,
        isActive,
        status,
        themeConfig,
        startsAt: startsAt ? new Date(startsAt) : undefined,
        endsAt: endsAt ? new Date(endsAt) : undefined,
      });
      res.status(201).json(form);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "خطا در ایجاد فرم" });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const form = await formService.updateForm(req.params.id, req.body);
      res.json(form);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "خطا در بروزرسانی فرم" });
    }
  },

  async setStatus(req: Request, res: Response) {
    try {
      const { status } = req.body;
      if (!Object.values(FormStatus).includes(status)) {
        return res.status(400).json({ error: "وضعیت ارسالی نامعتبر است." });
      }
      const form = await formService.setFormStatus(req.params.id, status);
      res.json(form);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "خطا در تغییر وضعیت فرم" });
    }
  },

  async duplicate(req: Request, res: Response) {
    try {
      const form = await formService.duplicateForm(req.params.id);
      res.status(201).json(form);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "خطا در کپی فرم" });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      await formService.deleteForm(req.params.id);
      res.status(204).send();
    } catch (err: any) {
      res.status(500).json({ error: err.message || "خطا در حذف فرم" });
    }
  },

  // Questions
  async addQuestion(req: Request, res: Response) {
    try {
      const question = await formService.addQuestion(req.params.id, req.body);
      res.status(201).json(question);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "خطا در افزودن سوال" });
    }
  },

  async updateQuestion(req: Request, res: Response) {
    try {
      const question = await formService.updateQuestion(req.params.questionId, req.body);
      res.json(question);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "خطا در بروزرسانی سوال" });
    }
  },

  async removeQuestion(req: Request, res: Response) {
    try {
      await formService.removeQuestion(req.params.questionId);
      res.status(204).send();
    } catch (err: any) {
      res.status(500).json({ error: err.message || "خطا در حذف سوال" });
    }
  },

  async reorderQuestions(req: Request, res: Response) {
    try {
      const { orders } = req.body;
      if (!Array.isArray(orders)) {
        return res.status(400).json({ error: "آرایه ترتیب سوالات نامعتبر است." });
      }
      await formService.reorderQuestions(req.params.id, orders);
      res.json({ message: "ترتیب سوالات با موفقیت بروزرسانی شد." });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "خطا در ذخیره ترتیب سوالات" });
    }
  },

  // Answers & Analytics
  async getAnswers(req: Request, res: Response) {
    try {
      const answers = await formService.getAnswersByForm(req.params.id);
      res.json(answers);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "خطا در دریافت پاسخ‌ها" });
    }
  },

  async getAnalytics(req: Request, res: Response) {
    try {
      const analytics = await formService.getFormAnalytics(req.params.id);
      res.json(analytics);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "خطا در دریافت گزارش آماری" });
    }
  },
};
