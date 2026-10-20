import { apiClient } from "./client";
import { FeedbackAnswers } from "./feedback";

export interface DirectoryEntry {
  fullName: string;
  slug: string;
  city: string;
  professionalField?: string | null;
  tagline?: string | null;
  photoUrl?: string | null;
}

// Public — no auth. The community/directory page's data source.
export async function getDirectory() {
  const { data } = await apiClient.get<{ participants: DirectoryEntry[] }>("/public");
  return data.participants;
}

// Public — no auth. Open feedback directly on a participant's public
// page, identified by slug — no private link needed.
export async function submitFeedbackBySlug(
  slug: string,
  input: { authorName?: string; answers: FeedbackAnswers; anonymous?: boolean }
) {
  const { data } = await apiClient.post(`/feedback/by-slug/${slug}`, input);
  return data;
}
