import { apiClient } from "./client";
import { Skill } from "./skills";

export interface PersonalPage {
  participantId: string;
  tagline?: string | null;
  identityWords: string[];
  introText?: string | null;
  roadmapText?: string | null;
  publishedAt?: string | null;
}

export interface PersonalPageInput {
  tagline?: string;
  identityWords?: string[];
  introText?: string;
  roadmapText?: string;
}

export async function getOwnPersonalPage() {
  const { data } = await apiClient.get<{ page: PersonalPage | null }>(
    "/personal-page"
  );
  return data.page;
}

export async function updatePersonalPage(input: PersonalPageInput) {
  const { data } = await apiClient.put<{ page: PersonalPage }>(
    "/personal-page",
    input
  );
  return data.page;
}

export async function publishPersonalPage() {
  const { data } = await apiClient.post<{ page: PersonalPage }>(
    "/personal-page/publish"
  );
  return data.page;
}

export async function unpublishPersonalPage() {
  const { data } = await apiClient.post<{ page: PersonalPage }>(
    "/personal-page/unpublish"
  );
  return data.page;
}

export interface PublicPage {
  firstName: string;
  lastName: string;
  city: string;
  province: string;
  professionalField?: string | null;
  occupation?: string | null;
  educationLevel?: string | null;
  fieldOfStudy?: string | null;
  interests: string[];
  bio?: string | null;
  slug: string;
  media: { url: string; type: string }[];
  page: PersonalPage | null;
  skills: Skill[];
  highlightedResponses: { question: string; stage: string; content: string | null }[];
  feedback: { authorName?: string | null; answers: Record<string, string>; createdAt: string }[];
}

// Public — no auth. Used by the /p/:slug route.
export async function getPublicPage(slug: string) {
  const { data } = await apiClient.get<{ page: PublicPage }>(`/public/${slug}`);
  return data.page;
}
