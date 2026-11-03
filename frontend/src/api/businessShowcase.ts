import { apiClient } from "./client";

export interface BusinessVideo {
  id: string;
  businessName: string;
  ownerName: string;
  category: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  durationSeconds: number;
  description: string | null;
  websiteUrl: string | null;
  instagramUrl: string | null;
  telegramUrl: string | null;
  phoneNumber: string | null;
  status: string;
  viewCount: number;
  likeCount: number;
  isFeatured: boolean;
  createdAt: string;
  _count?: { comments: number; likes: number };
  user?: {
    id: string;
    participantProfile?: {
      firstName?: string | null;
      lastName?: string | null;
      slug?: string | null;
    } | null;
  };
}

export interface BusinessVideoList {
  items: BusinessVideo[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BusinessVideoFilters {
  category?: string;
  page?: number;
  limit?: number;
}

export async function getPublicBusinessVideos(
  filters: BusinessVideoFilters = {},
): Promise<BusinessVideoList> {
  const { data } = await apiClient.get<BusinessVideoList>(
    "/business-showcase/public",
    { params: filters },
  );
  return data;
}

export async function getPublicBusinessVideo(id: string): Promise<BusinessVideo> {
  const { data } = await apiClient.get<BusinessVideo>(
    `/business-showcase/${encodeURIComponent(id)}`,
  );
  return data;
}

// دسته‌ها و وضعیت‌های مصرف‌شده در صفحات کاربر و مدیر.
export type BusinessCategory =
  | "TECH"
  | "SERVICES"
  | "EDUCATION"
  | "RETAIL"
  | "CREATIVE"
  | "OTHER";

export type BusinessVideoStatus = BusinessVideo["status"];

export interface BusinessComment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    participantProfile?: {
      firstName?: string | null;
      lastName?: string | null;
      slug?: string | null;
    } | null;
  };
  replies?: BusinessComment[];
}

export interface AdminBusinessVideoItem extends BusinessVideo {
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    participantProfile?: {
      firstName?: string | null;
      lastName?: string | null;
      slug?: string | null;
    } | null;
  };
  rejectionReason?: string | null;
}

export interface AdminBusinessVideoList
  extends Omit<BusinessVideoList, "items"> {
  items: AdminBusinessVideoItem[];
}

export async function uploadBusinessVideo(
  file: File,
): Promise<{ videoUrl: string; fileSizeBytes?: number }> {
  const formData = new FormData();
  formData.append("video", file);
  const { data } = await apiClient.post<{ videoUrl: string }>(
    "/business-showcase/upload",
    formData,
  );
  return data;
}

export async function createBusinessVideo(
  payload: Record<string, unknown>,
): Promise<BusinessVideo> {
  const { data } = await apiClient.post<BusinessVideo>(
    "/business-showcase",
    payload,
  );
  return data;
}

export async function getMyBusinessVideos(): Promise<BusinessVideo[]> {
  const { data } = await apiClient.get<BusinessVideo[]>(
    "/business-showcase/user/my-videos",
  );
  return data;
}

export async function deleteBusinessVideo(id: string): Promise<void> {
  await apiClient.delete(
    `/business-showcase/${encodeURIComponent(id)}`,
  );
}

export async function getAdminBusinessVideos(
  params: { status?: BusinessVideoStatus; page?: number; limit?: number } = {},
): Promise<AdminBusinessVideoList> {
  const { data } = await apiClient.get<AdminBusinessVideoList>(
    "/business-showcase/admin/list",
    { params },
  );
  return data;
}

export async function reviewAdminBusinessVideo(
  id: string,
  payload: {
    status: BusinessVideoStatus;
    isFeatured?: boolean;
    rejectionReason?: string;
  },
): Promise<AdminBusinessVideoItem> {
  const { data } = await apiClient.patch<AdminBusinessVideoItem>(
    `/business-showcase/admin/${encodeURIComponent(id)}/review`,
    payload,
  );
  return data;
}

export async function toggleLikeBusinessVideo(
  id: string,
): Promise<{ liked: boolean; likeCount?: number }> {
  const { data } = await apiClient.post<{ liked: boolean; likeCount?: number }>(
    `/business-showcase/${encodeURIComponent(id)}/like`,
  );
  return data;
}

export async function getBusinessComments(
  id: string,
): Promise<BusinessComment[]> {
  const { data } = await apiClient.get<BusinessComment[]>(
    `/business-showcase/${encodeURIComponent(id)}/comments`,
  );
  return data;
}

export async function addBusinessComment(
  id: string,
  content: string,
): Promise<BusinessComment> {
  const { data } = await apiClient.post<BusinessComment>(
    `/business-showcase/${encodeURIComponent(id)}/comments`,
    { content },
  );
  return data;
}

export interface BusinessLiker {
  id: string;
  firstName: string;
  lastName: string;
  slug: string;
  avatarUrl: string | null;
}

export async function getBusinessVideoLikes(id: string): Promise<BusinessLiker[]> {
  const { data } = await apiClient.get<BusinessLiker[]>(
    `/business-showcase/${encodeURIComponent(id)}/likes`,
  );
  return data;
}
