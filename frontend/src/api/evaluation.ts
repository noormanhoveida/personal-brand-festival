import { apiClient } from "./client";

export interface Criterion {
  id: string;
  key: string;
  title: string;
  description?: string | null;
  weight: number;
}

export interface Assignment {
  id: string;
  participant: { id: string; firstName: string; lastName: string; slug: string; city: string };
}

export interface EvaluationScore {
  id: string;
  criterionId: string;
  criterion: Criterion;
  score: number;
  comment?: string | null;
}

export interface Evaluation {
  id: string;
  participantId: string;
  evaluatorUserId: string;
  status: "DRAFT" | "SUBMITTED";
  transformationScore?: number | null;
  finalScore?: number | null;
  comment?: string | null;
  scores: EvaluationScore[];
}

export interface ReviewBundle {
  participant: {
    id: string;
    firstName: string;
    lastName: string;
    city: string;
    bio?: string | null;
    region?: { name: string } | null;
  };
  responses: {
    id: string;
    question: { text: string };
    versions: { versionNumber: number; content: string; stage: string; createdAt: string }[];
  }[];
  feedback: {
    authorName?: string | null;
    answers: Record<string, string>;
    createdAt: string;
  }[];
  ownEvaluation: Evaluation | null;
  criteria: Criterion[];
}

export async function listCriteria() {
  const { data } = await apiClient.get<{ criteria: Criterion[] }>(
    "/evaluations/criteria"
  );
  return data.criteria;
}

export async function createCriterion(input: {
  key: string;
  title: string;
  description?: string;
  weight: number;
}) {
  const { data } = await apiClient.post<{ criterion: Criterion }>(
    "/evaluations/criteria",
    input
  );
  return data.criterion;
}

export async function updateCriterion(id: string, weight: number) {
  const { data } = await apiClient.put<{ criterion: Criterion }>(
    `/evaluations/criteria/${id}`,
    { weight }
  );
  return data.criterion;
}

export async function listAssigned() {
  const { data } = await apiClient.get<{ assignments: Assignment[] }>(
    "/evaluations/assigned"
  );
  return data.assignments;
}

export async function assignEvaluator(evaluatorUserId: string, participantId: string) {
  const { data } = await apiClient.post("/evaluations/assignments", {
    evaluatorUserId,
    participantId,
  });
  return data;
}

export async function getReviewBundle(participantId: string) {
  const { data } = await apiClient.get<ReviewBundle>(
    `/evaluations/review/${participantId}`
  );
  return data;
}

export async function openEvaluation(participantId: string) {
  const { data } = await apiClient.post<{ evaluation: Evaluation }>(
    "/evaluations",
    { participantId }
  );
  return data.evaluation;
}

export async function saveDraft(
  evaluationId: string,
  input: {
    scores: { criterionId: string; score: number; comment?: string }[];
    comment?: string;
    transformationScore?: number;
  }
) {
  const { data } = await apiClient.put<{ evaluation: Evaluation }>(
    `/evaluations/${evaluationId}`,
    input
  );
  return data.evaluation;
}

export async function submitEvaluation(evaluationId: string) {
  const { data } = await apiClient.post<{ evaluation: Evaluation }>(
    `/evaluations/${evaluationId}/submit`
  );
  return data.evaluation;
}
