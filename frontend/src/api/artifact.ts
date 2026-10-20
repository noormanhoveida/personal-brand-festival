import { apiClient } from "./client";

export const ARTIFACT_AXES = [
  "تخصص من",
  "حرفه من",
  "مهارت من",
  "امضای من",
  "آینه من",
  "حضور من",
] as const;

export type ArtifactStatus = "PENDING" | "APPROVED" | "REJECTED";
export type ArtifactMediaType = "VIDEO" | "AUDIO" | "LINK" | "DOCUMENT" | "IMAGE";

export interface CreateArtifactInput {
  axis: string;
  templateTitle?: string;
  title: string;
  description?: string;
  mediaType?: string;
  mediaUrl?: string;
  coverImageUrl?: string;
  [key: string]: any;
}

export interface ArtifactCommentItem {
  id: string;
  artifactId: string;
  userId: string;
  parentId?: string | null;
  content: string;
  createdAt: string;
  likedUserIds?: string[];
  dislikedUserIds?: string[];
  user?: {
    id?: string;
    fullName?: string;
    name?: string;
    email?: string;
    role?: string;
  } | null;
}

export interface ArtifactRatingItem {
  id: string;
  artifactId: string;
  userId: string;
  score: number;
}

export interface ArtifactItem {
  id: string;
  userId: string;
  axis: string;
  templateTitle?: string;
  title: string;
  description?: string;
  mediaType?: ArtifactMediaType;
  mediaUrl?: string;
  coverImageUrl?: string;
  status: ArtifactStatus;
  adminFeedback?: string;
  averageRating?: number;
  ratingsCount?: number;
  userRating?: number;
  comments?: ArtifactCommentItem[];
  ratings?: ArtifactRatingItem[];
  createdAt: string;
  updatedAt?: string;
  user?: {
    id?: string;
    fullName?: string;
    name?: string;
    email?: string;
    role?: string;
  } | null;
  [key: string]: any;
}

export interface ArtifactGuideData {
  axis: string;
  title?: string;
  description?: string;
  judgingCriteria?: Array<{
    title?: string;
    weight?: number;
    description?: string;
    [key: string]: any;
  }>;
  [key: string]: any;
}

export async function createArtifact(data: CreateArtifactInput): Promise<ArtifactItem> {
  const res = await apiClient.post("/artifacts", data);
  return res.data?.data || res.data;
}

export async function getMyArtifacts(): Promise<ArtifactItem[]> {
  const res = await apiClient.get("/artifacts/my");
  return res.data?.data || res.data;
}

export async function getApprovedArtifacts(params?: { axis?: string; limit?: number }): Promise<ArtifactItem[]> {
  const res = await apiClient.get("/artifacts/approved", { params });
  return res.data?.data || res.data;
}

export async function getPublicArtifacts(userId?: string): Promise<ArtifactItem[]> {
  const res = await apiClient.get("/artifacts/approved", { params: { userId } });
  return res.data?.data || res.data;
}

export async function getArtifactGuide(axis?: string): Promise<ArtifactGuideData> {
  const res = await apiClient.get("/artifacts/guide", { params: { axis } }).catch(() => ({ data: {} }));
  return res.data?.data || res.data || {};
}

export async function deleteArtifact(id: string): Promise<any> {
  const res = await apiClient.delete(`/artifacts/${id}`);
  return res.data?.data || res.data;
}

export async function rateArtifact(id: string, score: number): Promise<any> {
  const res = await apiClient.post(`/artifacts/${id}/rate`, { score });
  return res.data?.data || res.data;
}

export async function commentArtifact(id: string, content: string, parentId?: string): Promise<ArtifactCommentItem> {
  const payload: { content: string; parentId?: string } = { content };
  if (parentId) payload.parentId = parentId;
  const res = await apiClient.post(`/artifacts/${id}/comments`, payload).catch(() => apiClient.post(`/artifacts/${id}/comment`, payload));
  return res.data?.data || res.data;
}

export async function getAdminArtifacts(status?: string): Promise<ArtifactItem[]> {
  const res = await apiClient.get("/artifacts/admin/all", { params: { status } });
  return res.data?.data || res.data;
}

export async function reviewArtifact(id: string, status: string, feedback?: string): Promise<ArtifactItem> {
  const res = await apiClient.patch(`/artifacts/admin/${id}/review`, { status, feedback });
  return res.data?.data || res.data;
}

export async function getArtifactDetails(id: string): Promise<ArtifactItem> {
  const res = await apiClient.get(`/artifacts/${id}`);
  return res.data?.data || res.data;
}

export async function reactToArtifactComment(commentId: string, action: "LIKE" | "DISLIKE") {
  const res = await apiClient.post(`/artifacts/comments/${commentId}/react`, { action });
  return res.data;
}

export async function getArtifactComments(artifactId: string): Promise<ArtifactCommentItem[]> {
  try {
    const res = await apiClient.get(`/artifacts/${artifactId}/comments`);
    return Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
  } catch (err) {
    console.error("Error fetching comments:", err);
    return [];
  }
}


export async function editArtifactComment(commentId: string, content: string): Promise<ArtifactCommentItem> {
  const res = await apiClient.patch(`/artifacts/comments/${commentId}`, { content });
  return res.data?.data || res.data;
}

export async function deleteArtifactComment(commentId: string): Promise<{ success: boolean }> {
  const res = await apiClient.delete(`/artifacts/comments/${commentId}`);
  return res.data?.data || res.data;
}
