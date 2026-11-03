import { apiClient } from "./client";

export type BootcampRegistrationStatus = "INITIAL" | "PAID" | "FINALIZED" | "DONE";

export type CreateBootcampRegistrationInput = {
  bootcampId: string;
  fullName: string;
  phone: string;
  email?: string;
  instagram?: string;
  telegramId?: string;
  note?: string;
};

export async function createBootcampRegistration(input: CreateBootcampRegistrationInput) {
  const { data } = await apiClient.post("/bootcamp-registrations/public/register", input);
  return data;
}

export async function trackBootcampRegistration(code: string) {
  const { data } = await apiClient.get(`/bootcamp-registrations/public/track/${code}`);
  return data;
}

// Admin (طبق بک‌اند)
export async function listBootcampRegistrations(params?: {
  bootcampId?: string;
  status?: BootcampRegistrationStatus;
}) {
  const { data } = await apiClient.get("/bootcamp-registrations/admin/list", { params });
  return data;
}

export async function patchBootcampRegistrationStatus(id: string, status: BootcampRegistrationStatus) {
  const { data } = await apiClient.patch(`/bootcamp-registrations/admin/${id}/status`, { status });
  return data;
}
