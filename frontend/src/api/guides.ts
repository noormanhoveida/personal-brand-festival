import { apiClient } from "./client";

export interface GuideSlide {
  id: string;
  guideId: string;
  title: string;
  description: string;
  imageUrl?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Guide {
  id: string;
  pagePath: string;
  title?: string;
  isEnabled: boolean;
  slides: GuideSlide[];
  createdAt: string;
  updatedAt: string;
}

export async function listAllGuides(): Promise<Guide[]> {
  const res = await apiClient.get("/guides/admin/all");
  return res.data.data || [];
}

export async function upsertGuide(data: { pagePath: string; title?: string; isEnabled?: boolean }): Promise<Guide> {
  const res = await apiClient.post("/guides/admin/guide", data);
  return res.data.data;
}

export async function deleteGuide(guideId: string): Promise<void> {
  await apiClient.delete(`/guides/admin/guide/${guideId}`);
}

export async function addSlide(guideId: string, formData: FormData): Promise<GuideSlide> {
  const res = await apiClient.post(`/guides/admin/guide/${guideId}/slide`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
}

export async function updateSlide(slideId: string, formData: FormData): Promise<GuideSlide> {
  const res = await apiClient.patch(`/guides/admin/slide/${slideId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
}

export async function deleteSlide(slideId: string): Promise<void> {
  await apiClient.delete(`/guides/admin/slide/${slideId}`);
}
