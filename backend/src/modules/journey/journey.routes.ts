import { Router } from "express";
import { Role } from "@prisma/client";
import { z } from "zod";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/rbac.middleware";
import { validateBody } from "../../middleware/validate";
import {
  attachQuestion,
  createSection,
  createSectionQuestion,
  updateQuestion,
  deleteQuestion,
  updateSectionQuestion,
  deleteSection,
  getSection,
  listSections,
  updateSection,
} from "./journey.controller";

const attachSchema = z.object({ questionId: z.string().uuid() });

const createSectionSchema = z.object({
  key: z.string().min(1, "شناسه (key) الزامی است."),
  title: z.string().min(1, "عنوان الزامی است."),
  description: z.string().optional(),
  order: z.number().int().nonnegative().optional(),
});

const updateSectionSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  order: z.number().int().nonnegative().optional(),
});

const sectionQuestionSchema = z
  .object({
    text: z.string().min(1, "متن سؤال الزامی است."),
    inputType: z
      .enum(["TEXT", "LINK", "PHOTO", "TRAIT_TAG", "SINGLE_CHOICE", "MULTI_CHOICE"])
      .default("TEXT"),
    situationId: z.string().uuid().optional(),
    options: z.array(z.string().min(1)).optional(),
    order: z.number().int().nonnegative().optional(),
  })
  .refine(
    (data) =>
      (data.inputType !== "SINGLE_CHOICE" && data.inputType !== "MULTI_CHOICE") ||
      (data.options && data.options.length >= 2),
    { message: "سؤالات چندگزینه‌ای باید حداقل دو گزینه داشته باشند.", path: ["options"] }
  );

const router = Router();

// Journey structure (the 8 personal-brand sections) is only meaningful
// to logged-in participants/staff — visitors see it via marketing copy
// on the landing page, not this API.
router.use(requireAuth);

router.get("/", listSections);
router.get("/:sectionId", getSection);

// Roadmap authoring — the sections themselves (title/description/order),
// previously seed-data-only. Admin-only, same as everything else here.
router.post("/", requireRole(Role.ADMIN), validateBody(createSectionSchema), createSection);
router.patch(
  "/:sectionId",
  requireRole(Role.ADMIN),
  validateBody(updateSectionSchema),
  updateSection
);
router.delete("/:sectionId", requireRole(Role.ADMIN), deleteSection);

// Standalone prompts on a section, independent of any bootcamp —
// Admin-only, since journey sections are platform configuration.
router.post(
  "/:sectionId/questions",
  requireRole(Role.ADMIN),
  validateBody(sectionQuestionSchema),
  createSectionQuestion
);

// Attach an existing bank question (e.g. from the trait/situation
// question bank) instead of authoring a new one.
router.post(
  "/:sectionId/questions/attach",
  requireRole(Role.ADMIN),
  validateBody(attachSchema),
  attachQuestion
);


router.patch("/questions/:questionId", requireRole(Role.ADMIN), updateQuestion);
router.delete("/questions/:questionId", requireRole(Role.ADMIN), deleteQuestion);

export default router;
