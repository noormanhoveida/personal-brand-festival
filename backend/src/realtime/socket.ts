import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { Role } from "@prisma/client";
import { env } from "../config/env";
import { verifyAccessToken } from "../utils/tokens";
import { prisma } from "../config/db";
import * as liveSessionService from "../modules/live-session/live-session.service";

interface SocketData {
  userId: string;
  role: Role;
  participantId?: string;
}

let io: Server | null = null;

function sessionRoom(sessionId: string) {
  return `live-session:${sessionId}`;
}
function groupRoom(groupId: string) {
  return `live-group:${groupId}`;
}
function participantRoom(participantId: string) {
  return `live-participant:${participantId}`;
}

function participantName(participant: { firstName: string; lastName: string }) {
  return `${participant.firstName} ${participant.lastName}`.trim();
}

function participantAvatar(participant: { media?: { url: string }[] }): string | null {
  return participant.media?.[0]?.url ?? null;
}

/**
 * Wires up Socket.IO on top of the existing HTTP server. Auth mirrors
 * the REST middleware: the same access token (sent as
 * `socket.handshake.auth.token`) is verified with verifyAccessToken,
 * and PARTICIPANT sockets additionally resolve + cache their
 * participantId, since every live-session concept keys off that
 * (not the raw userId).
 */
export function initRealtime(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: { origin: [env.frontendUrl, "https://bare-danesh.ir", "https://pbfestival.ir", "https://www.pbfestival.ir"], credentials: true },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token as string | undefined;
      if (!token) return next(new Error("توکن احراز هویت ارسال نشده است."));
      const payload = verifyAccessToken(token);

      const data: SocketData = { userId: payload.userId, role: payload.role };
      if (payload.role === Role.PARTICIPANT) {
        const profile = await prisma.participantProfile.findUnique({
          where: { userId: payload.userId },
          select: { id: true },
        });
        if (!profile) return next(new Error("پروفایل شرکت‌کننده یافت نشد."));
        data.participantId = profile.id;
      }
      socket.data = data;
      next();
    } catch {
      next(new Error("توکن نامعتبر یا منقضی شده است."));
    }
  });

  io.on("connection", (socket: Socket) => {
    const data = socket.data as SocketData;

    // ---- Phase 1: presence / check-in ----
    socket.on("session:join", async ({ sessionId }: { sessionId: string }) => {
      try {
        if (!data.participantId) {
          socket.emit("session:error", { message: "فقط شرکت‌کننده‌ها می‌توانند وارد جلسه شوند." });
          return;
        }
        const presence = await liveSessionService.checkIn(sessionId, data.userId);
        socket.join(sessionRoom(sessionId));
        socket.join(participantRoom(data.participantId));
        if (presence.groupId) socket.join(groupRoom(presence.groupId));

        socket.emit("session:state", {
          status: presence.group ? "GROUPED" : "OPEN",
          group: presence.group ?? null,
        });

        io!.to(sessionRoom(sessionId)).emit("presence:update", {
          participantId: presence.participantId,
          name: participantName(presence.participant),
          avatarUrl: participantAvatar(presence.participant),
          online: true,
          joinedAt: presence.joinedAt,
          groupId: presence.groupId,
        });
      } catch (err) {
        socket.emit("session:error", { message: (err as Error).message });
      }
    });

    // Manager dashboard subscribes to the same session room read-only,
    // plus gets an immediate full snapshot (rather than waiting for the
    // next presence delta) so the list isn't empty on first load.
    socket.on("session:admin-subscribe", async ({ sessionId }: { sessionId: string }) => {
      if (data.role !== Role.ADMIN && data.role !== Role.BOOTCAMP_MANAGER) {
        socket.emit("session:error", { message: "دسترسی غیرمجاز." });
        return;
      }
      socket.join(sessionRoom(sessionId));
      const presences = await liveSessionService.listPresences(sessionId);
      socket.emit("presence:snapshot", {
        presences: presences.map((p) => ({
          participantId: p.participantId,
          name: participantName(p.participant),
          avatarUrl: participantAvatar(p.participant),
          online: p.online,
          joinedAt: p.joinedAt,
          groupId: p.groupId,
          groupName: p.group?.name ?? null,
        })),
      });
    });

    // ---- Phase 3: group + personal chat ----
    socket.on(
      "group:message",
      async (payload: { sessionId: string; groupId: string; content?: string; fileUrl?: string }) => {
        try {
          const message = await liveSessionService.saveMessage({
            sessionId: payload.sessionId,
            senderUserId: data.userId,
            groupId: payload.groupId,
            content: payload.content,
            fileUrl: payload.fileUrl,
          });
          io!.to(groupRoom(payload.groupId)).emit("group:message", {
            id: message.id,
            groupId: payload.groupId,
            senderId: message.senderId,
            senderName: participantName(message.sender),
            content: message.content,
            fileUrl: message.fileUrl,
            createdAt: message.createdAt,
          });
        } catch (err) {
          socket.emit("session:error", { message: (err as Error).message });
        }
      }
    );

    socket.on(
      "direct:message",
      async (payload: {
        sessionId: string;
        receiverId: string;
        groupId?: string;
        content?: string;
        fileUrl?: string;
      }) => {
        try {
          const message = await liveSessionService.saveMessage({
            sessionId: payload.sessionId,
            senderUserId: data.userId,
            groupId: payload.groupId,
            receiverId: payload.receiverId,
            content: payload.content,
            fileUrl: payload.fileUrl,
          });
          const outgoing = {
            id: message.id,
            senderId: message.senderId,
            senderName: participantName(message.sender),
            receiverId: payload.receiverId,
            groupId: payload.groupId ?? null,
            content: message.content,
            fileUrl: message.fileUrl,
            createdAt: message.createdAt,
          };
          io!.to(participantRoom(payload.receiverId)).emit("direct:message", outgoing);
          socket.emit("direct:message", outgoing); // echo back to sender's own screen
        } catch (err) {
          socket.emit("session:error", { message: (err as Error).message });
        }
      }
    );

    socket.on("disconnect", async () => {
      if (!data.participantId) return;
      // We don't track which session(s) this socket had joined here to
      // keep the payload small; the client re-sends session:join with
      // the relevant sessionId on reconnect, and offline participants
      // still show correctly to managers via the periodic REST refresh.
      const rooms = Array.from(socket.rooms).filter((r) => r.startsWith("live-session:"));
      for (const room of rooms) {
        const sessionId = room.replace("live-session:", "");
        await liveSessionService.markOffline(sessionId, data.participantId);
        io!.to(sessionRoom(sessionId)).emit("presence:update", {
          participantId: data.participantId,
          online: false,
        });
      }
    });
  });

  return io;
}

/**
 * Called from the REST grouping-confirmation endpoint (business logic
 * and validation live there) to push the result live to everyone in
 * the session — this is what makes every participant's screen switch
 * to their group at the same moment the manager confirms, per spec.
 */
export function broadcastGrouping(
  sessionId: string,
  groups: Array<{ id: string; name: string; members: Array<{ participant: { id: string } }> }>,
  taskBrief?: string
) {
  if (!io) return;
  io.to(sessionRoom(sessionId)).emit("grouping:done", {
    groups: groups.map((g) => ({
      id: g.id,
      name: g.name,
      memberIds: g.members.map((m) => m.participant.id),
    })),
    taskBrief,
  });
  for (const group of groups) {
    for (const member of group.members) {
      io.to(participantRoom(member.participant.id)).emit("group:assigned", {
        groupId: group.id,
        groupName: group.name,
        taskBrief,
      });
      io.sockets.sockets.forEach((socket) => {
        if ((socket.data as SocketData)?.participantId === member.participant.id) {
          socket.join(groupRoom(group.id));
        }
      });
    }
  }
}

export function broadcastSessionClosed(sessionId: string) {
  if (!io) return;
  io.to(sessionRoom(sessionId)).emit("session:closed");
}
