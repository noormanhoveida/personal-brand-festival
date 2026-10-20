import { apiClient } from "./client";

export type MediaType =
  | "PROFILE_PORTRAIT"
  | "HERO_PORTRAIT"
  | "PROFESSIONAL"
  | "LIFESTYLE"
  | "GALLERY";

export interface MediaItem {
  id: string;
  type: MediaType;
  url: string;
  mimeType: string;
  sizeBytes: number;
  order: number;
}

export async function listMyMedia() {
  const { data } = await apiClient.get<{ media: MediaItem[] }>("/media");
  return data.media;
}

export async function uploadMedia(file: File, type: MediaType) {
  const form = new FormData();
  form.append("file", file);
  form.append("type", type);
  const { data } = await apiClient.post<{ media: MediaItem }>("/media", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.media;
}

export async function deleteMedia(id: string) {
  await apiClient.delete(`/media/${id}`);
}
