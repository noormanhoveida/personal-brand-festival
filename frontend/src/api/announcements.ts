import { apiClient } from "./client";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: "INFO" | "WARNING" | "SUCCESS" | "CRITICAL";
  createdAt: string;
}

export const announcementsApi = {
  getAnnouncements: async () => {
    const { data } = await apiClient.get<Announcement[]>("/announcements");
    return data;
  },
  createAnnouncement: async (payload: { title: string; content: string; type?: string }) => {
    const { data } = await apiClient.post<Announcement>("/announcements", payload);
    return data;
  },
  deleteAnnouncement: async (id: string) => {
    const { data } = await apiClient.delete(`/announcements/${id}`);
    return data;
  },
};
