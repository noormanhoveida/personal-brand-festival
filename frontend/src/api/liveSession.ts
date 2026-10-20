import { apiClient } from "./client";

export interface LiveParticipant {
  id: string;
  firstName: string;
  lastName: string;
  media?: { url: string }[];
}

export interface LivePresence {
  id: string;
  participantId: string;
  participant: LiveParticipant;
  online: boolean;
  joinedAt: string;
  groupId: string | null;
  group?: { id: string; name: string } | null;
}

export interface LiveGroup {
  id: string;
  name: string;
  members: { participant: LiveParticipant }[];
}

export interface LiveSession {
  id: string;
  bootcampId: string;
  status: "OPEN" | "GROUPED" | "CLOSED";
  taskBrief?: string | null;
  bootcamp?: { id: string; title: string };
  groups?: LiveGroup[];
}

export interface LiveMessage {
  id: string;
  senderId: string;
  sender: LiveParticipant;
  receiverId: string | null;
  groupId: string | null;
  content: string | null;
  fileUrl: string | null;
  createdAt: string;
}

export async function getActiveSessionForBootcamp(bootcampId: string) {
  const { data } = await apiClient.get<{ session: LiveSession | null }>(
    `/bootcamps/${bootcampId}/live-session`
  );
  return data.session;
}

export async function startLiveSession(bootcampId: string) {
  const { data } = await apiClient.post<LiveSession>(`/bootcamps/${bootcampId}/live-sessions`);
  return data;
}

export async function getLiveSession(sessionId: string) {
  const { data } = await apiClient.get<LiveSession>(`/live-sessions/${sessionId}`);
  return data;
}

export async function listPresences(sessionId: string) {
  const { data } = await apiClient.get<{ presences: LivePresence[] }>(
    `/live-sessions/${sessionId}/presences`
  );
  return data.presences;
}

export async function getMyGroup(sessionId: string) {
  const { data } = await apiClient.get<{ group: LiveGroup | null }>(
    `/live-sessions/${sessionId}/my-group`
  );
  return data.group;
}

export async function listGroupMessages(sessionId: string, groupId: string) {
  const { data } = await apiClient.get<{ messages: LiveMessage[] }>(
    `/live-sessions/${sessionId}/groups/${groupId}/messages`
  );
  return data.messages;
}

export interface GroupingInput {
  taskBrief?: string;
  groups: { name: string; participantIds: string[] }[];
}

export async function confirmGrouping(sessionId: string, input: GroupingInput) {
  const { data } = await apiClient.post<{ groups: LiveGroup[] }>(
    `/live-sessions/${sessionId}/grouping`,
    input
  );
  return data.groups;
}

export async function closeLiveSession(sessionId: string) {
  const { data } = await apiClient.post(`/live-sessions/${sessionId}/close`);
  return data;
}

export async function getAdminLog(
  sessionId: string,
  filters: { groupId?: string; participantId?: string; from?: string; to?: string }
) {
  const { data } = await apiClient.get<{ presences: LivePresence[]; messages: LiveMessage[] }>(
    `/live-sessions/${sessionId}/admin-log`,
    { params: filters }
  );
  return data;
}

export async function listMyReceivedMessages() {
  const { data } = await apiClient.get<{ messages: LiveMessage[] }>("/my/live-messages");
  return data.messages;
}

export interface LiveGroupArchiveEntry extends LiveGroup {
  session: { bootcamp: { title: string } };
  messages: LiveMessage[];
}

export async function listMyGroupArchive() {
  const { data } = await apiClient.get<{ groups: LiveGroupArchiveEntry[] }>("/my/live-groups");
  return data.groups;
}
