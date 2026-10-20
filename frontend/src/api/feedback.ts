import { apiClient } from "./client";

export interface FeedbackRequestItem {
  id: string;
  linkToken: string;
  createdAt: string;
  expiresAt?: string | null;
  responses: { id: string }[];
}

export interface FeedbackAnswers {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
  q6: string;
}

export interface ReceivedFeedbackItem {
  id: string;
  authorName?: string | null;
  answers: FeedbackAnswers;
  visibility: "ANONYMOUS" | "PUBLIC" | "PRIVATE" | "EVALUATOR_ONLY";
  createdAt: string;
}

export async function createFeedbackRequest(expiresInDays?: number) {
  const { data } = await apiClient.post<{ request: FeedbackRequestItem }>(
    "/feedback/request",
    expiresInDays ? { expiresInDays } : {}
  );
  return data.request;
}

export async function listMyFeedback() {
  const { data } = await apiClient.get<{
    requests: FeedbackRequestItem[];
    received: ReceivedFeedbackItem[];
  }>("/feedback");
  return data;
}

// Public — no auth. Used by the /feedback/:token page anyone can open.
export async function submitFeedback(input: {
  linkToken: string;
  authorName?: string;
  answers: FeedbackAnswers;
  anonymous?: boolean;
}) {
  const { data } = await apiClient.post("/feedback/submit", input);
  return data;
}

// Public — no auth. Resolves who a feedback link belongs to.
export async function getLinkInfo(token: string) {
  const { data } = await apiClient.get<{
    requester: { firstName: string; lastName: string; slug: string };
  }>(`/feedback/link-info/${token}`);
  return data.requester;
}
