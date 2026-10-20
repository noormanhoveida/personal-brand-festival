import { apiClient } from "./client";

export interface Skill {
  id: string;
  name: string;
  endorseCount: number;
  rejectCount: number;
}

export async function listMySkills() {
  const { data } = await apiClient.get<{ skills: Skill[] }>("/skills");
  return data.skills;
}

export async function addSkill(name: string) {
  const { data } = await apiClient.post<{ skill: Skill }>("/skills", { name });
  return data.skill;
}

export async function deleteSkill(id: string) {
  await apiClient.delete(`/skills/${id}`);
}

// Public — no auth. Used from the public profile page.
export async function endorseSkill(
  skillId: string,
  vote: "ENDORSE" | "REJECT",
  endorserName?: string
) {
  await apiClient.post(`/skills/${skillId}/endorse`, { vote, endorserName });
}

// Public — no auth. The global tag pool for the feedback form's skill picker.
export async function listAllTags() {
  const { data } = await apiClient.get<{ tags: string[] }>("/skills/tags");
  return data.tags;
}

// Public — no auth. Endorses one or more tags for a participant (by
// slug) in bulk — used when feedback is submitted with tags selected.
export async function endorseTagsForSlug(
  slug: string,
  tagNames: string[],
  endorserName?: string
) {
  const { data } = await apiClient.post<{ applied: string[] }>(
    `/skills/by-slug/${slug}/tags`,
    { tagNames, endorserName }
  );
  return data.applied;
}
