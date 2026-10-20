import { apiClient } from "./client";
import { Role } from "../features/auth/authSlice";

export interface AdminOverview {
  totalParticipants: number;
  totalBootcamps: number;
  submittedEvaluations: number;
  draftEvaluations: number;
  totalFeedback: number;
  publishedPages: number;
  regionCount: number;
}

export interface AdminUser {
  id: string;
  email: string | null;
  phone: string | null;
  role: Role;
  isBlocked?: boolean;
  createdAt: string;
  participantProfile?: {
    firstName: string;
    lastName: string;
    fullName?: string;
    slug: string;
  } | null;
}

export interface Region {
  id: string;
  name: string;
}

export interface AdminParticipant {
  id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  slug: string;
  city: string;
  region: string | null;
  responseCount: number;
  latestScore: number | null;
}

export async function getOverview() {
  const { data } = await apiClient.get<AdminOverview>("/admin/overview");
  return data;
}

export async function listUsers(role?: Role): Promise<AdminUser[]> {
  const { data } = await apiClient.get<any>("/admin/users", {
    params: role ? { role } : undefined,
  });
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.users)) return data.users;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export async function updateUserRole(userId: string, role: Role) {
  const { data } = await apiClient.put<{ user: AdminUser }>(
    `/admin/users/${userId}/role`,
    { role }
  );
  return data.user;
}

export async function toggleBlockUser(userId: string, blocked: boolean) {
  const { data } = await apiClient.put<{ user: AdminUser }>(
    `/admin/users/${userId}/block`,
    { blocked }
  );
  return data.user;
}

export async function deleteUserApi(userId: string) {
  const { data } = await apiClient.delete<{ success: boolean; message: string }>(
    `/admin/users/${userId}`
  );
  return data;
}

export async function listRegions() {
  const { data } = await apiClient.get<{ regions: Region[] }>("/admin/regions");
  return data.regions;
}

export async function createRegion(name: string) {
  const { data } = await apiClient.post<{ region: Region }>("/admin/regions", {
    name,
  });
  return data.region;
}

export async function listParticipants(filters: { regionId?: string; search?: string }) {
  const { data } = await apiClient.get<{ participants: AdminParticipant[] }>(
    "/admin/participants",
    { params: filters }
  );
  return data.participants;
}
