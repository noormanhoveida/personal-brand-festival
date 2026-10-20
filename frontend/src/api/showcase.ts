import { apiClient } from "./client";

export interface ShowcaseCard {
  slug: string;
  fullName: string;
  city: string;
  professionalField?: string | null;
  tagline?: string | null;
  coverImage?: string | null;
}

export interface PublicShowcase {
  featured: ShowcaseCard[];
  finalists: ShowcaseCard[];
  winners: Record<string, ShowcaseCard[]>;
}

export interface AdminShowcaseParticipant {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  city: string;
  slug: string;
  avatarUrl: string | null;
  featured: boolean;
  finalist: boolean;
  winnerCategory: string | null;
  isPublished: boolean;
}

export interface ShowcaseCategoryItem {
  name: string;
  count: number;
  active: boolean;
}

export interface AdminShowcaseData {
  participants: AdminShowcaseParticipant[];
  categories: ShowcaseCategoryItem[];
}

export async function getPublicShowcase() {
  const { data } = await apiClient.get<PublicShowcase>("/showcase");
  return data;
}

export async function getAdminShowcaseList() {
  const { data } = await apiClient.get<AdminShowcaseData>("/showcase/admin/list");
  return data;
}

export async function renameCategory(oldName: string, newName: string | null) {
  const { data } = await apiClient.post<{ success: boolean }>("/showcase/admin/category/rename", {
    oldName,
    newName,
  });
  return data;
}

export async function setFeatured(participantId: string, featured: boolean) {
  await apiClient.post(`/showcase/${participantId}/featured`, { featured });
}

export async function setFinalist(participantId: string, finalist: boolean) {
  await apiClient.post(`/showcase/${participantId}/finalist`, { finalist });
}

export async function setWinner(participantId: string, winnerCategory: string | null) {
  await apiClient.post(`/showcase/${participantId}/winner`, { winnerCategory });
}
