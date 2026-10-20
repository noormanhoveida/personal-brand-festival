import { apiClient } from "./client";

export interface AnalyticsOverview {
  totalParticipants: number;
  onboardingCompletionRate: number;
  submittedEvaluations: number;
  totalBootcamps: number;
}

export interface BootcampEffectiveness {
  bootcampId: string;
  title: string;
  beforeCount: number;
  afterCount: number;
  followThroughRate: number;
}

export interface CriterionBreakdown {
  criterionId: string;
  title: string;
  averageScore: number;
  sampleSize: number;
}

export interface RegionalBreakdown {
  regionId: string;
  name: string;
  participantCount: number;
  averageFinalScore: number | null;
}

export async function getOverview() {
  const { data } = await apiClient.get<AnalyticsOverview>("/analytics/overview");
  return data;
}

export async function getBootcampEffectiveness() {
  const { data } = await apiClient.get<{ bootcamps: BootcampEffectiveness[] }>(
    "/analytics/bootcamps"
  );
  return data.bootcamps;
}

export async function getCriteriaBreakdown() {
  const { data } = await apiClient.get<{ criteria: CriterionBreakdown[] }>(
    "/analytics/criteria"
  );
  return data.criteria;
}

export async function getRegionalBreakdown() {
  const { data } = await apiClient.get<{ regions: RegionalBreakdown[] }>(
    "/analytics/regions"
  );
  return data.regions;
}
