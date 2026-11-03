import { apiClient } from "./client";

export async function getPublicSponsorBySlug(slug: string) {
  const res = await apiClient.get(`/sponsors/public/${encodeURIComponent(slug)}`);
  return res.data?.data;
}
