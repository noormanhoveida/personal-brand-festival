import { apiClient } from "./client";

export type BootcampRegistrationStatus = "INITIAL" | "PAID" | "FINALIZED" | "DONE";

export type BootcampRegistrationItem = {
  id: string;
  bootcampId: string;
  trackingCode: string;
  fullName: string;
  phone: string;
  email?: string;
  telegramId?: string;
  notes?: string;
  cardLastDigits?: string;
  status: BootcampRegistrationStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateBootcampRegistrationInput = {
  bootcampId: string;
  fullName: string;
  phone: string;
  email?: string;
  telegramId?: string;
  cardLastDigits?: string;
  note?: string;
  receiptUrl?: string;
};

export async function uploadReceiptFile(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const { data } = await apiClient.post<{ success: boolean; url: string }>(
    "/bootcamp-registrations/public/upload-receipt",
    form,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data.url;
}

export async function createBootcampRegistration(input: CreateBootcampRegistrationInput) {
  let combinedNotes = input.note || "";
  if (input.receiptUrl) {
    combinedNotes = combinedNotes
      ? `${combinedNotes}\n[لینک رسید پرداخت: ${input.receiptUrl}]`
      : `[لینک رسید پرداخت: ${input.receiptUrl}]`;
  }

  const payload = {
    bootcampId: input.bootcampId,
    fullName: input.fullName,
    phone: input.phone,
    email: input.email || undefined,
    telegramId: input.telegramId || undefined,
    cardLastDigits: input.cardLastDigits || undefined,
    notes: combinedNotes || undefined,
  };
  const { data } = await apiClient.post("/bootcamp-registrations/public/register", payload);
  return data;
}

export async function trackBootcampRegistration(code: string) {
  const { data } = await apiClient.get(`/bootcamp-registrations/public/track/${code}`);
  return data;
}

export async function listBootcampRegistrations(params?: {
  bootcampId?: string;
  status?: BootcampRegistrationStatus;
}): Promise<{ success: boolean; data: BootcampRegistrationItem[] }> {
  const { data } = await apiClient.get("/bootcamp-registrations/admin/list", { params });
  return data;
}

export async function updateBootcampRegistrationStatus(
  id: string,
  status: BootcampRegistrationStatus
) {
  const { data } = await apiClient.patch(`/bootcamp-registrations/admin/${id}/status`, { status });
  return data;
}

// ===== Public: prevent duplicate registrations & complete payment =====

export async function findBootcampRegistration(params: {
  bootcampId: string;
  email: string;
}): Promise<{ success: boolean; data: BootcampRegistrationItem | null }> {
  const { data } = await apiClient.get("/bootcamp-registrations/public/find", { params });
  return data;
}

export async function completeBootcampRegistrationPayment(input: {
  trackingCode: string;
  cardLastDigits?: string;
  receiptUrl?: string;
  note?: string;
}): Promise<{ success: boolean; data: BootcampRegistrationItem; receiptUrl?: string | null }> {
  const { trackingCode, ...payload } = input;
  const { data } = await apiClient.patch(`/bootcamp-registrations/public/${trackingCode}/payment`, payload);
  return data;
}

export type MyRegistrationItem = {
  id: string;
  bootcampId: string;
  bootcampTitle?: string;
  status: BootcampRegistrationStatus;
  trackingCode: string;
  createdAt: string;
  updatedAt: string;
};

export async function listMyBootcampRegistrations(): Promise<{
  success: boolean;
  data: MyRegistrationItem[];
}> {
  try {
    const { data } = await apiClient.get("/bootcamp-registrations/my");
    return data;
  } catch {
    return { success: false, data: [] };
  }
}
