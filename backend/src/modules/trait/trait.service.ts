import * as XLSX from "xlsx";
import { prisma } from "../../config/db";
import { AppError } from "../../utils/errors";

export class TraitError extends AppError {}

/**
 * Traits available for a given situation, each with its weight in
 * that situation and (if defined) the situation-specific phrasing —
 * this is the tag pool a participant picks from when answering a
 * TRAIT_TAG question. Traits with no weight defined for this
 * situation are excluded — they don't apply here.
 */
export async function listTraitsForSituation(situationId: string) {
  const weights = await prisma.traitWeight.findMany({
    where: { situationId },
    include: { trait: true },
    orderBy: { weight: "desc" },
  });
  return weights.map((w) => ({
    traitId: w.traitId,
    name: w.text?.trim() || w.trait.name,
    weight: w.weight,
  }));
}

export async function listAllTraits() {
  return prisma.trait.findMany({
    include: { weights: { include: { situation: true } } },
    orderBy: { name: "asc" },
  });
}

type RawRow = Record<string, unknown>;

/**
 * XLSX keys rows by the literal header text in the sheet, so "Trait",
 * "trait" and "TRAIT" come back as three different keys. Every row is
 * normalized once to lowercase, trimmed keys so field lookups are
 * case-insensitive regardless of how the admin capitalized headers.
 * Persian headers are untouched by toLowerCase() and pass through as-is.
 */
function normalizeRowKeys(row: RawRow): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(row)) {
    out[key.trim().toLowerCase()] = row[key];
  }
  return out;
}

/** Returns the first non-empty value among several possible header names. */
function pickField(row: Record<string, unknown>, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = row[key.toLowerCase()];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return String(value).trim();
    }
  }
  return undefined;
}

function pickNumber(row: Record<string, unknown>, ...keys: string[]): number | undefined {
  const raw = pickField(row, ...keys);
  if (raw === undefined) return undefined;
  const n = Number(raw);
  return Number.isNaN(n) ? undefined : n;
}

/** Finds a sheet by (case-insensitive) name pattern, falling back to a positional index. */
function findSheet(
  workbook: XLSX.WorkBook,
  namePattern: RegExp,
  fallbackIndex: number
): XLSX.WorkSheet | undefined {
  const matchedName = workbook.SheetNames.find((n) => namePattern.test(n));
  const sheetName = matchedName ?? workbook.SheetNames[fallbackIndex];
  return sheetName ? workbook.Sheets[sheetName] : undefined;
}

async function upsertSituation(title: string, cache: Map<string, string>): Promise<string> {
  const cached = cache.get(title);
  if (cached) return cached;
  const key = title.replace(/\s+/g, "-").toLowerCase();
  const situation = await prisma.situation.upsert({
    where: { key },
    update: {},
    create: { key, title },
  });
  cache.set(title, situation.id as string);
  return situation.id as string;
}

async function upsertTrait(name: string, cache: Map<string, string>): Promise<string> {
  const cached = cache.get(name);
  if (cached) return cached;
  const trait = await prisma.trait.upsert({
    where: { name },
    update: {},
    create: { name },
  });
  cache.set(name, trait.id as string);
  return trait.id as string;
}

const OPTION_LETTERS = ["A", "B", "C", "D"] as const;

/**
 * Bulk-imports the full trait/situation Excel workbook. The workbook
 * has two sheets:
 *
 * 1. "Expressions" — one row per (trait, situation) phrasing. Columns
 *    (case-insensitive, Persian or English): Trait/صفت,
 *    Situation/موقعیت, Text/نحوه بیان (optional — falls back to the
 *    trait's bare name), Weight/وزن, MismatchWeight/وزن نامتناسب
 *    (optional, defaults to 0). Populates Trait + TraitWeight, which
 *    also feeds the TRAIT_TAG picker pool.
 *
 * 2. "SituationalQuestions" — one row per ready-made MCQ. Columns:
 *    Trait, Situation, Question, OptionA..OptionD, CorrectOption
 *    (a letter A–D — stored as-is, never converted to a numeric
 *    index), WeightCorrect, WeightIncorrect. These become Question
 *    rows directly (no auto-generation involved). Row n on this sheet
 *    corresponds to row n on the Expressions sheet; if a row's own
 *    WeightCorrect/WeightIncorrect are blank, they fall back to that
 *    corresponding Expressions row's Weight/MismatchWeight.
 *
 * Either sheet may be absent (a file with just phrasings, or just
 * questions, both import fine); sheet order is used as a fallback if
 * the names don't match, so a file with exactly two sheets in this
 * order also works even if untitled.
 */
export async function importFromExcel(buffer: Buffer) {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  if (workbook.SheetNames.length === 0) {
    throw new TraitError("فایل اکسل خالی است یا قابل خواندن نیست.", 400);
  }

  const expressionsSheet = findSheet(workbook, /expression/i, 0);
  const questionsSheet = findSheet(workbook, /situational ?questions?/i, 1);

  const expressionRows = expressionsSheet
    ? XLSX.utils.sheet_to_json<RawRow>(expressionsSheet).map(normalizeRowKeys)
    : [];
  const questionRows = questionsSheet
    ? XLSX.utils.sheet_to_json<RawRow>(questionsSheet).map(normalizeRowKeys)
    : [];

  if (expressionRows.length === 0 && questionRows.length === 0) {
    throw new TraitError("هیچ ردیف قابل خواندنی در شیت‌های اکسل پیدا نشد.", 400);
  }

  const situationCache = new Map<string, string>();
  const traitCache = new Map<string, string>();

  // ---- Sheet 1: Expressions -> Trait + TraitWeight ----
  let expressionsImported = 0;
  const expressionErrors: string[] = [];

  for (let i = 0; i < expressionRows.length; i++) {
    const row = expressionRows[i];
    const traitName = pickField(row, "trait", "صفت");
    const situationTitle = pickField(row, "situation", "موقعیت");
    const text = pickField(row, "text", "نحوه بیان");
    const weight = pickNumber(row, "weight", "وزن");
    const mismatchWeight = pickNumber(row, "mismatchweight", "وزن نامتناسب") ?? 0;

    if (!traitName || !situationTitle || weight === undefined) {
      expressionErrors.push(`Expressions ردیف ${i + 2}: داده ناقص یا نامعتبر (رد شد)`);
      continue;
    }

    const situationId = await upsertSituation(situationTitle, situationCache);
    const traitId = await upsertTrait(traitName, traitCache);

    await prisma.traitWeight.upsert({
      where: { traitId_situationId: { traitId, situationId } },
      update: { weight, text: text || undefined, mismatchWeight },
      create: { traitId, situationId, weight, text: text || undefined, mismatchWeight },
    });

    expressionsImported++;
  }

  // ---- Sheet 2: SituationalQuestions -> Question (explicit MCQ) ----
  let questionsImported = 0;
  const questionErrors: string[] = [];

  for (let i = 0; i < questionRows.length; i++) {
    const row = questionRows[i];
    const correspondingExpressionRow = expressionRows[i]; // same-index pairing between sheets

    const traitName = pickField(row, "trait", "صفت");
    const situationTitle = pickField(row, "situation", "موقعیت");
    const questionText = pickField(row, "question", "سوال", "متن سوال");
    const optionA = pickField(row, "optiona", "option a");
    const optionB = pickField(row, "optionb", "option b");
    const optionC = pickField(row, "optionc", "option c");
    const optionD = pickField(row, "optiond", "option d");
    const correctOptionRaw = pickField(row, "correctoption", "correct option", "گزینه صحیح");

    const weightCorrect =
      pickNumber(row, "weightcorrect", "weight correct") ??
      (correspondingExpressionRow ? pickNumber(correspondingExpressionRow, "weight", "وزن") : undefined);
    const weightIncorrect =
      pickNumber(row, "weightincorrect", "weight incorrect") ??
      (correspondingExpressionRow
        ? pickNumber(correspondingExpressionRow, "mismatchweight", "وزن نامتناسب")
        : undefined) ??
      0;

    const options = [optionA, optionB, optionC, optionD];
    const correctOption = correctOptionRaw?.trim().toUpperCase();

    if (!traitName || !situationTitle || !questionText) {
      questionErrors.push(`SituationalQuestions ردیف ${i + 2}: صفت/موقعیت/متن سؤال ناقص است (رد شد)`);
      continue;
    }
    if (options.some((o) => !o)) {
      questionErrors.push(`SituationalQuestions ردیف ${i + 2}: یکی از گزینه‌های A تا D خالی است (رد شد)`);
      continue;
    }
    if (!correctOption || !OPTION_LETTERS.includes(correctOption as (typeof OPTION_LETTERS)[number])) {
      questionErrors.push(
        `SituationalQuestions ردیف ${i + 2}: CorrectOption باید یکی از حروف A تا D باشد (رد شد)`
      );
      continue;
    }
    if (weightCorrect === undefined) {
      questionErrors.push(`SituationalQuestions ردیف ${i + 2}: وزن پاسخ صحیح مشخص نیست (رد شد)`);
      continue;
    }

    const situationId = await upsertSituation(situationTitle, situationCache);
    const traitId = await upsertTrait(traitName, traitCache);

    await prisma.question.upsert({
      where: { traitId_situationId: { traitId, situationId } },
      update: {
        text: questionText,
        inputType: "SINGLE_CHOICE",
        options: options as string[],
        correctOption,
        weightCorrect,
        weightIncorrect,
      },
      create: {
        text: questionText,
        stage: "BEFORE",
        inputType: "SINGLE_CHOICE",
        options: options as string[],
        situationId,
        traitId,
        correctOption,
        weightCorrect,
        weightIncorrect,
      },
    });

    questionsImported++;
  }

  return {
    expressions: { imported: expressionsImported, totalRows: expressionRows.length, errors: expressionErrors },
    questions: { imported: questionsImported, totalRows: questionRows.length, errors: questionErrors },
  };
}

/**
 * For every trait that has a phrasing defined in 2+ situations,
 * auto-generates one SINGLE_CHOICE question per (trait, situation)
 * pair — the "بانک سؤالات موقعیتی" the admin then hand-picks from to
 * attach to specific bootcamps/journey sections. Idempotent: skips
 * pairs that already have a generated question. The options on each
 * generated question are that trait's phrasings across every situation
 * it has one for, so scoring can tell a "right phrasing, right
 * situation" pick from a "right phrasing, wrong situation" one.
 */
export async function generateSituationalQuestions() {
  const traits = await prisma.trait.findMany({
    include: { weights: { include: { situation: true } } },
  });

  let created = 0;
  let skipped = 0;

  for (const trait of traits) {
    if (trait.weights.length < 2) continue; // need at least 2 situations to make this meaningful

    const optionTexts = trait.weights.map((w) => w.text?.trim() || trait.name);

    for (const w of trait.weights) {
      const existing = await prisma.question.findUnique({
        where: { traitId_situationId: { traitId: trait.id, situationId: w.situationId } },
      });
      if (existing) {
        skipped++;
        continue;
      }

      await prisma.question.create({
        data: {
          text: `در موقعیت «${w.situation.title}»، کدام توصیف از ویژگی «${trait.name}» به شما نزدیک‌تر است؟`,
          stage: "BEFORE",
          inputType: "SINGLE_CHOICE",
          options: optionTexts,
          situationId: w.situationId,
          traitId: trait.id,
        },
      });
      created++;
    }
  }

  return { created, skipped, traitsConsidered: traits.length };
}

/**
 * Browsable list of the auto-generated per-trait situational
 * questions — the bank an admin picks from to attach individual items
 * to a specific bootcamp or journey section, since authoring 2000
 * questions by hand isn't realistic.
 */
export async function listQuestionBank(filters: { situationId?: string; search?: string }) {
  return prisma.question.findMany({
    where: {
      traitId: { not: null },
      ...(filters.situationId && { situationId: filters.situationId }),
      ...(filters.search && {
        trait: { name: { contains: filters.search, mode: "insensitive" } },
      }),
    },
    include: { trait: true, situation: true },
    orderBy: { text: "asc" },
    take: 200, // a sane page size — the bank can hold thousands
  });
}
