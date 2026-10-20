import { apiClient } from "./client";

export interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  instructorName: string | null;
  instructorEmail: string | null;
  opensAt: string | null;
  deadline: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface ChallengeSubmissionVersion {
  id: string;
  challengeSubmissionId: string;
  versionNumber: number;
  textContent: string | null;
  photoUrl: string | null;
  documentUrl: string | null;
  linkUrl: string | null;
  createdAt: string;
}

export interface ChallengeSubmission {
  id: string;
  challengeId: string;
  participantId: string;
  textContent: string | null;
  photoUrl: string | null;
  documentUrl: string | null;
  linkUrl: string | null;
  submittedAt: string;
  updatedAt?: string;
  sentToInstructorAt: string | null;
  versions?: ChallengeSubmissionVersion[];
  participant?: {
    id: string;
    user?: {
      id: string;
      email: string;
      firstName?: string | null;
      lastName?: string | null;
      phone?: string | null;
    };
    firstName?: string;
    lastName?: string;
  };
}

export interface ChallengeInput {
  title: string;
  description: string;
  instructorName?: string;
  instructorEmail?: string;
  opensAt?: string;
  deadline?: string;
}

export async function listChallenges() {
  const { data } = await apiClient.get<{ challenges: WeeklyChallenge[] }>("/challenges");
  return data.challenges;
}

export async function createChallenge(input: ChallengeInput) {
  const { data } = await apiClient.post<WeeklyChallenge>("/challenges", input);
  return data;
}

export async function updateChallenge(challengeId: string, input: Partial<ChallengeInput & { isActive: boolean }>) {
  const { data } = await apiClient.patch<WeeklyChallenge>(`/challenges/${challengeId}`, input);
  return data;
}

export async function deleteChallenge(challengeId: string) {
  await apiClient.delete(`/challenges/${challengeId}`);
}

export async function getMySubmission(challengeId: string) {
  const { data } = await apiClient.get<ChallengeSubmission | null>(
    `/challenges/${challengeId}/submission/mine`
  );
  return data;
}

export async function submitChallengeWork(
  challengeId: string,
  input: { textContent?: string; photoUrl?: string; documentUrl?: string; linkUrl?: string }
) {
  const { data } = await apiClient.post<ChallengeSubmission>(
    `/challenges/${challengeId}/submission`,
    input
  );
  return data;
}

export async function uploadChallengeAttachment(challengeId: string, file: File) {
  const form = new FormData();
  form.append("file", file);
  const { data } = await apiClient.post<{ url: string }>(
    `/challenges/${challengeId}/submission/upload`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data.url;
}

export async function listChallengeSubmissions(challengeId: string) {
  const { data } = await apiClient.get<{ submissions: ChallengeSubmission[] }>(
    `/challenges/${challengeId}/submissions`
  );
  return data.submissions;
}

/** Actually sends the submission to the challenge's instructor by email */
export async function sendToInstructor(submissionId: string) {
  const { data } = await apiClient.post<ChallengeSubmission>(
    `/challenge-submissions/${submissionId}/send-to-instructor`
  );
  return data;
}
