import { apiClient } from "./client";

export interface Bootcamp {
  id: string;
  title: string;
  description?: string | null;
  instructor?: string | null;
  coverImageUrl?: string | null;
  teaserVideoUrl?: string | null;
  recordingUrl?: string | null;
  date: string;
  startTime: string;
  endTime: string;
  deadline?: string | null;
  status:
    | "LOCKED"
    | "COMING_SOON"
    | "ACTIVE"
    | "DEADLINE_APPROACHING"
    | "SUBMITTED"
    | "COMPLETED";
  journeySection?: { id: string; title: string } | null;
}

export interface BootcampDetail extends Bootcamp {
  hasRecordingAccess?: boolean;
  questions: {
    id: string;
    text: string;
    stage: string;
    inputType: "TEXT" | "LINK" | "PHOTO" | "TRAIT_TAG" | "SINGLE_CHOICE" | "MULTI_CHOICE";
    situationId?: string | null;
    options?: string[];
    order: number;
  }[];
  tasks: { id: string; title: string; description?: string | null }[];
}

export interface ParticipantAccessItem {
  userId: string;
  fullName: string;
  email: string;
  hasAccess: boolean;
}

export async function listBootcamps() {
  const { data } = await apiClient.get<{ bootcamps: Bootcamp[] }>("/bootcamps");
  return data.bootcamps;
}

export async function getBootcamp(id: string) {
  const { data } = await apiClient.get<{ bootcamp: BootcampDetail }>(
    `/bootcamps/${id}`
  );
  return data.bootcamp;
}

export interface BootcampInput {
  title: string;
  description?: string;
  instructor?: string;
  coverImageUrl?: string;
  teaserVideoUrl?: string;
  recordingUrl?: string;
  date: string;
  startTime: string;
  endTime: string;
  deadline?: string;
  journeySectionId?: string;
}

export async function uploadBootcampMedia(file: File) {
  const form = new FormData();
  form.append("file", file);
  const { data } = await apiClient.post<{ url: string }>("/bootcamps/media/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.url;
}

export async function createBootcamp(input: BootcampInput) {
  const { data } = await apiClient.post<{ bootcamp: Bootcamp }>(
    "/bootcamps",
    input
  );
  return data.bootcamp;
}

export async function updateBootcamp(id: string, input: Partial<BootcampInput>) {
  const { data } = await apiClient.put<{ bootcamp: Bootcamp }>(
    `/bootcamps/${id}`,
    input
  );
  return data.bootcamp;
}

export async function setBootcampStatus(id: string, status: Bootcamp["status"]) {
  const { data } = await apiClient.patch<{ bootcamp: Bootcamp }>(
    `/bootcamps/${id}/status`,
    { status }
  );
  return data.bootcamp;
}

export async function addBootcampQuestion(
  bootcampId: string,
  input: {
    text: string;
    stage: "BEFORE" | "AFTER" | "REVISION";
    inputType?: "TEXT" | "LINK" | "PHOTO" | "TRAIT_TAG" | "SINGLE_CHOICE" | "MULTI_CHOICE";
    situationId?: string;
    options?: string[];
    order?: number;
  }
) {
  const { data } = await apiClient.post(`/bootcamps/${bootcampId}/questions`, input);
  return data;
}

export async function attachQuestionToBootcamp(bootcampId: string, questionId: string) {
  const { data } = await apiClient.post(`/bootcamps/${bootcampId}/questions/attach`, {
    questionId,
  });
  return data;
}

export async function getBootcampAccessList(bootcampId: string) {
  const { data } = await apiClient.get<{ participants: ParticipantAccessItem[] }>(
    `/bootcamps/${bootcampId}/access`
  );
  return data.participants;
}

export async function toggleBootcampAccess(bootcampId: string, userId: string, hasAccess: boolean) {
  const { data } = await apiClient.post(`/bootcamps/${bootcampId}/access`, {
    userId,
    hasAccess,
  });
  return data;
}
