import { apiClient } from "./client";

export interface Leaderboard {
  id: string;
  key: string | null;
  kind: "SYSTEM" | "CUSTOM";
  title: string;
  description: string | null;
  published: boolean;
  publishedAt: string | null;
  createdByUserId: string | null;
}

export interface RankedEntry {
  participantId: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  score: number;
  note?: string | null;
}

export interface MyBoardSummary {
  leaderboardId: string;
  title: string;
  kind: "SYSTEM" | "CUSTOM";
  published: boolean;
  score: number;
  rank: number | null;
  totalParticipants: number;
}

export async function listPublishedLeaderboards() {
  const { data } = await apiClient.get<{ boards: Leaderboard[] }>("/leaderboards/published");
  return data.boards;
}

export async function getPublicLeaderboardRanking(leaderboardId: string) {
  const { data } = await apiClient.get<{ board: Leaderboard; ranking: RankedEntry[] }>(
    `/leaderboards/published/${leaderboardId}/ranking`
  );
  return data;
}

export async function listAllLeaderboards() {
  const { data } = await apiClient.get<{ boards: Leaderboard[] }>("/leaderboards");
  return data.boards;
}

export async function getLeaderboardRanking(leaderboardId: string) {
  const { data } = await apiClient.get<{ board: Leaderboard; ranking: RankedEntry[] }>(
    `/leaderboards/${leaderboardId}/ranking`
  );
  return data;
}

export async function createCustomLeaderboard(input: { title: string; description?: string }) {
  const { data } = await apiClient.post<Leaderboard>("/leaderboards", input);
  return data;
}

export async function deleteLeaderboard(leaderboardId: string) {
  await apiClient.delete(`/leaderboards/${leaderboardId}`);
}

export async function setLeaderboardEntryScore(
  leaderboardId: string,
  input: { participantId: string; score: number; note?: string }
) {
  const { data } = await apiClient.post(`/leaderboards/${leaderboardId}/entries`, input);
  return data;
}

export async function setLeaderboardPublished(leaderboardId: string, published: boolean) {
  const { data } = await apiClient.post<Leaderboard>(`/leaderboards/${leaderboardId}/publish`, {
    published,
  });
  return data;
}

export async function getMyLeaderboardSummary() {
  const { data } = await apiClient.get<{ boards: MyBoardSummary[] }>("/leaderboards/mine");
  return data.boards;
}

export interface ScorableParticipant {
  id: string;
  firstName: string;
  lastName: string;
}

export async function listParticipantsForScoring() {
  const { data } = await apiClient.get<{ participants: ScorableParticipant[] }>(
    "/leaderboards/participants"
  );
  return data.participants;
}
