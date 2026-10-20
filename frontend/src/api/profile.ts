import { apiClient } from "./client";

export interface RegionItem {
  id: string;
  name: string;
}

export interface ParticipantProfile {
  id: string;
  firstName: string;
  lastName: string;
  mobile: string;
  province?: string;
  regionId?: string | null;
  region?: RegionItem | null;
  city: string;
  educationLevel?: string | null;
  fieldOfStudy?: string | null;
  professionalField?: string | null;
  occupation?: string | null;
  bio?: string | null;
  interests: string[];
  slug: string;
  pageVisibility: "PRIVATE" | "EVALUATOR_ONLY" | "PARTICIPANTS_ONLY" | "PUBLIC";
}

export interface OnboardingInput {
  firstName: string;
  lastName: string;
  mobile: string;
  regionId: string;
  city: string;
  educationLevel?: string;
  fieldOfStudy?: string;
  professionalField?: string;
  occupation?: string;
  bio?: string;
  interests?: string[];
}

export async function getProfile() {
  const { data } = await apiClient.get<{
    profile: ParticipantProfile | null;
    onboardingComplete: boolean;
  }>("/profile");
  return data;
}

export async function completeOnboarding(input: OnboardingInput) {
  const { data } = await apiClient.post<{ profile: ParticipantProfile }>(
    "/profile/onboarding",
    input
  );
  return data.profile;
}

export async function updateProfile(input: Partial<OnboardingInput>) {
  const { data } = await apiClient.put<{ profile: ParticipantProfile }>(
    "/profile",
    input
  );
  return data.profile;
}

export async function getRegions(): Promise<RegionItem[]> {
  const { data } = await apiClient.get<RegionItem[] | { regions: RegionItem[] }>("/regions");
  if (Array.isArray(data)) return data;
  if (data && Array.isArray((data as any).regions)) return (data as any).regions;
  return [];
}
