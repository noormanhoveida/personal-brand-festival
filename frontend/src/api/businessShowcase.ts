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
