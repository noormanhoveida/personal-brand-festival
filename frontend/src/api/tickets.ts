import { apiClient } from "./client";

export interface TicketMessage {
  id: string;
  senderId: string;
  senderRole: "USER" | "ADMIN";
  message: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  userId: string;
  subject: string;
  status: "OPEN" | "ANSWERED" | "CLOSED";
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
  user?: {
    email?: string;
    phone?: string;
  };
}

export const ticketsApi = {
  getMyTickets: async () => {
    const { data } = await apiClient.get<Ticket[]>("/tickets/me");
    return data;
  },
  getAllTickets: async () => {
    const { data } = await apiClient.get<Ticket[]>("/tickets/admin/all");
    return data;
  },
  createTicket: async (subject: string, message: string) => {
    const { data } = await apiClient.post<Ticket>("/tickets", { subject, message });
    return data;
  },
  addMessage: async (ticketId: string, message: string) => {
    const { data } = await apiClient.post<TicketMessage>(`/tickets/${ticketId}/messages`, { message });
    return data;
  },
};
