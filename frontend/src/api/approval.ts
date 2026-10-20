import { apiClient } from "./client";

export interface PendingResponseVersion {
  id: string;
  content: string;
  stage: string;
  autoScore?: number | null;
  createdAt: string;
  response: {
    question: { text: string; inputType: string };
    participant: { id: string; firstName: string; lastName: string };
  };
}

export interface PendingTaskSubmission {
  id: string;
  content: string;
  createdAt: string;
  task: { title: string };
  participant: { id: string; firstName: string; lastName: string };
}

export async function getMyPoints() {
  const { data } = await apiClient.get<{ points: number; pending: number }>(
    "/approval/points/me"
  );
  return data;
}

export async function listPendingApprovals() {
  const { data } = await apiClient.get<{
    responseVersions: PendingResponseVersion[];
    taskSubmissions: PendingTaskSubmission[];
  }>("/approval/pending");
  return data;
}

export async function decideResponseVersion(
  versionId: string,
  status: "APPROVED" | "REJECTED"
) {
  const { data } = await apiClient.post(`/approval/responses/${versionId}/decide`, {
    status,
  });
  return data;
}

export async function decideTaskSubmission(
  submissionId: string,
  status: "APPROVED" | "REJECTED"
) {
  const { data } = await apiClient.post(`/approval/tasks/${submissionId}/decide`, {
    status,
  });
  return data;
}
