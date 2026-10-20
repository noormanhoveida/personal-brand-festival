import { apiClient } from "./client";

export interface Situation {
  id: string;
  key: string;
  title: string;
}

export async function listSituations() {
  const { data } = await apiClient.get<{ situations: Situation[] }>("/situations");
  return data.situations;
}

export async function createSituation(key: string, title: string) {
  const { data } = await apiClient.post<{ situation: Situation }>("/situations", {
    key,
    title,
  });
  return data.situation;
}
