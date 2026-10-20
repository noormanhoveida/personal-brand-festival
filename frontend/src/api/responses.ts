import { apiClient } from "./client";

export interface ResponseVersion {
  id: string;
  versionNumber: number;
  content: string;
  stage: "BEFORE" | "AFTER" | "REVISION";
  bootcampId?: string | null;
  autoScore?: number | null;
  createdAt: string;
}

export interface ResponseWithVersions {
  id: string;
  questionId: string;
  question: { id: string; text: string; stage: string; journeySectionId?: string | null };
  visibility: "PRIVATE" | "EVALUATOR_ONLY" | "PARTICIPANTS_ONLY" | "PUBLIC";
  versions: ResponseVersion[];
}

export async function listMyResponses() {
  const { data } = await apiClient.get<{ responses: ResponseWithVersions[] }>(
    "/responses"
  );
  return data.responses;
}

export async function createResponse(input: {
  questionId: string;
  content: string;
  stage: "BEFORE" | "AFTER" | "REVISION";
  bootcampId?: string;
}) {
  const { data } = await apiClient.post<{ response: ResponseWithVersions }>(
    "/responses",
    input
  );
  return data.response;
}

// Semantically an edit, but the backend appends a new version and
// never overwrites the previous one — see backend/response.service.ts.
export async function addResponseVersion(
  responseId: string,
  input: { content: string; stage: "BEFORE" | "AFTER" | "REVISION"; bootcampId?: string }
) {
  const { data } = await apiClient.put<{ version: ResponseVersion }>(
    `/responses/${responseId}`,
    input
  );
  return data.version;
}


export async function listParticipantResponses(participantId: string) {
  const { data } = await apiClient.get<{ responses: ResponseWithVersions[] }>(
    `/responses/admin/participant/${participantId}`
  );
  return data.responses;
}
