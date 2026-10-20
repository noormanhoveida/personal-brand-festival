import { apiClient } from "./client";

export interface SituationalTrait {
  traitId: string;
  name: string;
  weight: number;
}

export interface TraitWithWeights {
  id: string;
  name: string;
  weights: {
    weight: number;
    text?: string | null;
    mismatchWeight: number;
    situation: { id: string; title: string };
  }[];
}

// The tag pool for a specific situation — what a participant picks
// from when answering a TRAIT_TAG question.
export async function listTraitsForSituation(situationId: string) {
  const { data } = await apiClient.get<{ traits: SituationalTrait[] }>(
    `/traits/situation/${situationId}`
  );
  return data.traits;
}

export async function listAllTraits() {
  const { data } = await apiClient.get<{ traits: TraitWithWeights[] }>("/traits");
  return data.traits;
}

export interface ImportSectionResult {
  imported: number;
  totalRows: number;
  errors: string[];
}

// The Excel workbook has two sheets — "Expressions" (trait/situation
// phrasings + weights) and "SituationalQuestions" (ready-made MCQs with
// an explicit correct answer). Either sheet may be absent; each is
// reported separately since a file might contain just one of the two.
export interface TraitImportResult {
  expressions: ImportSectionResult;
  questions: ImportSectionResult;
}

export async function uploadTraitsExcel(file: File) {
  const form = new FormData();
  form.append("file", file);
  const { data } = await apiClient.post<TraitImportResult>("/traits/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export interface GenerateQuestionsResult {
  created: number;
  skipped: number;
  traitsConsidered: number;
}

// Auto-generates the per-trait × per-situation SINGLE_CHOICE question
// bank from the imported trait phrasings/weights.
export async function generateSituationalQuestions() {
  const { data } = await apiClient.post<GenerateQuestionsResult>(
    "/traits/generate-questions"
  );
  return data;
}

export interface BankQuestion {
  id: string;
  text: string;
  situationId: string;
  situation: { title: string };
  trait: { name: string };
}

export async function listQuestionBank(filters: { situationId?: string; search?: string }) {
  const { data } = await apiClient.get<{ questions: BankQuestion[] }>("/traits/questions", {
    params: filters,
  });
  return data.questions;
}
