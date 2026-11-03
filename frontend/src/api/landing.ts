import { apiClient } from "./client";

export type HeroSectionItem = {
  id: string;
  desc?: string;
  title?: string;
};

export type HeroSectionData = {
  sections?: Array<{
    id: string;
    badge?: string;
    title?: string;
    subtitle?: string;
    items?: HeroSectionItem[];
  }>;
};

export async function getHeroSetting() {
  const { data } = await apiClient.get("/landing/hero");
  return data as { key?: string; data?: HeroSectionData };
}
