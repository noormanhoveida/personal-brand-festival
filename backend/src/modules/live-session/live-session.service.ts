import { prisma } from "../../config/db";
import { AppError } from "../../utils/errors";

export class LiveSessionError extends AppError {}

/**
 * Reused everywhere a participant is included in a live-session
 * response — fetches their most recent PROFILE_PORTRAIT media
 * alongside name, so avatars can render in the online list and group
 * screens without a separate round trip per participant.
 */
const participantWithAvatar = {
  select: {
    id: true,
    firstName: true,
    lastName: true,
    media: {
      where: { type: "PROFILE_PORTRAIT" as const },
      take: 1,
      orderBy: { createdAt: "desc" as const },
      select: { url: true },
    },
  },
} as const;

async function getParticipantId(userId: string): Promise<string> {
  const profile = await prisma.participantProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!profile) {
    throw new LiveSessionError("ابتدا باید پروفایل خود را تکمیل کنید.", 404);
  }
  return profile.id;
}

/**
 * Phase 1 — starts (or resumes) the live session for a bootcamp. Only
 * one OPEN/GROUPED session per bootcamp makes sense at a time, so this
 * returns the existing one if there already is a non-closed session
 * rather than creating a duplicate — safe for the manager to call more
 * than once (e.g. on page refresh).
 */
export async function startSession(bootcampId: string) {
  const existing = await prisma.liveSession.findFirst({
    where: { bootcampId, status: { in: ["OPEN", "GROUPED"] } },
    orderBy: { createdAt: "desc" },
  });
  if (existing) return existing;

  const bootcamp = await prisma.bootcamp.findUnique({ where: { id: bootcampId } });
  if (!bootcamp) throw new LiveSessionError("بوت‌کمپ یافت نشد.", 404);

  return prisma.liveSession.create({ data: { bootcampId, status: "OPEN" } });
}

export async function getSession(sessionId: string) {
  const session = await prisma.liveSession.findUnique({
    where: { id: sessionId },
    include: {
      bootcamp: { select: { id: true, title: true } },
      groups: { include: { members: { include: { participant: participantWithAvatar } } } },
    },
  });
  if (!session) throw new LiveSessionError("جلسه یافت نشد.", 404);
  return session;
}

/**
 * The session a participant should join right now for this bootcamp —
 * whatever OPEN/GROUPED session exists, most recent first. Returns
 * null (not an error) when the manager hasn't started one yet, so the
 * bootcamp detail page can show "جلسه‌ی زنده هنوز شروع نشده" instead of
 * failing.
 */
export async function getActiveSessionForBootcamp(bootcampId: string) {
  return prisma.liveSession.findFirst({
    where: { bootcampId, status: { in: ["OPEN", "GROUPED"] } },
    orderBy: { createdAt: "desc" },
    include: { bootcamp: { select: { id: true, title: true } } },
  });
}

/**
 * Phase 1 — marks a participant present in a session (idempotent: a
 * reconnect just refreshes lastSeenAt/online rather than duplicating
 * the row, since @@unique([sessionId, participantId]) backs it).
 * Returns the presence row plus their group assignment, if any exists
 * already — a participant reconnecting mid-GROUPED-session should land
 * straight back in their group screen, not the check-in screen.
 */
export async function checkIn(sessionId: string, userId: string) {
  const participantId = await getParticipantId(userId);
  const presence = await prisma.livePresence.upsert({
    where: { sessionId_participantId: { sessionId, participantId } },
    update: { online: true, lastSeenAt: new Date() },
    create: { sessionId, participantId, online: true },
    include: { participant: participantWithAvatar, group: { include: { members: { include: { participant: participantWithAvatar } } } } },
  });
  return presence;
}

export async function markOffline(sessionId: string, participantId: string) {
  await prisma.livePresence
    .update({
      where: { sessionId_participantId: { sessionId, participantId } },
      data: { online: false, lastSeenAt: new Date() },
    })
    .catch(() => {
      // presence row may not exist if they disconnected before ever checking in — fine to ignore
    });
}

/**
 * The manager's live list: every participant who has ever checked
 * into this session, each with their current online/offline status
 * and (once grouping happened) which group they're in — this is what
 * the "لیست آنلاین‌ها" dashboard is built from.
 */
export async function listPresences(sessionId: string) {
  return prisma.livePresence.findMany({
    where: { sessionId },
    include: { participant: participantWithAvatar, group: true },
    orderBy: { joinedAt: "asc" },
  });
}

interface GroupAssignmentInput {
  name: string;
  participantIds: string[];
}

/**
 * Phase 2 — the manager's grouping decision, applied atomically. Wipes
 * any previous grouping for this session (re-grouping is allowed
 * before the manager confirms) and creates fresh groups from the
 * chosen online participants. taskBrief is the group-work description
 * shown to everyone once grouping goes live. Only participants who are
 * currently marked online in this session may be assigned — this
 * mirrors "افراد آنلاین" in the spec (the manager groups people who
 * are actually present, not the whole roster).
 */
export async function confirmGrouping(
  sessionId: string,
  groups: GroupAssignmentInput[],
  taskBrief?: string
) {
  const session = await prisma.liveSession.findUnique({ where: { id: sessionId } });
  if (!session) throw new LiveSessionError("جلسه یافت نشد.", 404);

  const allParticipantIds = groups.flatMap((g) => g.participantIds);
  if (allParticipantIds.length === 0) {
    throw new LiveSessionError("حداقل یک گروه با حداقل یک عضو لازم است.", 400);
  }
  const onlineIds = new Set(
    (
      await prisma.livePresence.findMany({
        where: { sessionId, online: true, participantId: { in: allParticipantIds } },
        select: { participantId: true },
      })
    ).map((p) => p.participantId)
  );
  const missing = allParticipantIds.filter((id) => !onlineIds.has(id));
  if (missing.length > 0) {
    throw new LiveSessionError(
      "برخی از افراد انتخاب‌شده در حال حاضر آنلاین نیستند.",
      400
    );
  }

  return prisma.$transaction(async (tx) => {
    // Detach existing members and delete previous groups for this session
    // so re-grouping before confirmation doesn't leave orphaned groups.
    await tx.livePresence.updateMany({ where: { sessionId }, data: { groupId: null } });
    await tx.liveGroup.deleteMany({ where: { sessionId } });

    const createdGroups = [];
    for (const g of groups) {
      const group = await tx.liveGroup.create({ data: { sessionId, name: g.name } });
      await tx.livePresence.updateMany({
        where: { sessionId, participantId: { in: g.participantIds } },
        data: { groupId: group.id },
      });
      createdGroups.push(group);
    }

    await tx.liveSession.update({
      where: { id: sessionId },
      data: { status: "GROUPED", groupedAt: new Date(), taskBrief: taskBrief ?? session.taskBrief },
    });

    return tx.liveGroup.findMany({
      where: { sessionId },
      include: { members: { include: { participant: participantWithAvatar } } },
    });
  });
}

export async function closeSession(sessionId: string) {
  return prisma.liveSession.update({ where: { id: sessionId }, data: { status: "CLOSED", closedAt: new Date() } });
}

/** The group a participant currently belongs to in this session, if any. */
export async function getMyGroup(sessionId: string, userId: string) {
  const participantId = await getParticipantId(userId);
  const presence = await prisma.livePresence.findUnique({
    where: { sessionId_participantId: { sessionId, participantId } },
    include: { group: { include: { members: { include: { participant: participantWithAvatar } } } } },
  });
  return presence?.group ?? null;
}

/**
 * Phase 3 — persists one chat message (group message when receiverId
 * is omitted, personal message otherwise) and returns it with the
 * sender's display name attached, ready to broadcast as-is.
 */
export async function saveMessage(input: {
  sessionId: string;
  senderUserId: string;
  groupId?: string;
  receiverId?: string;
  content?: string;
  fileUrl?: string;
}) {
  const senderId = await getParticipantId(input.senderUserId);
  if (!input.content?.trim() && !input.fileUrl) {
    throw new LiveSessionError("پیام نمی‌تواند خالی باشد.", 400);
  }

  // A group message must come from a current member of that group;
  // a personal message just needs both people to share the session.
  if (input.groupId && !input.receiverId) {
    const membership = await prisma.livePresence.findFirst({
      where: { sessionId: input.sessionId, participantId: senderId, groupId: input.groupId },
    });
    if (!membership) {
      throw new LiveSessionError("شما عضو این گروه نیستید.", 403);
    }
  }

  return prisma.liveMessage.create({
    data: {
      sessionId: input.sessionId,
      groupId: input.groupId,
      senderId,
      receiverId: input.receiverId,
      content: input.content,
      fileUrl: input.fileUrl,
    },
    include: { sender: true, receiver: true },
  });
}

export async function listGroupMessages(sessionId: string, groupId: string) {
  return prisma.liveMessage.findMany({
    where: { sessionId, groupId, receiverId: null },
    include: { sender: true },
    orderBy: { createdAt: "asc" },
  });
}

/**
 * Phase 4a — personal messages this user has received across every
 * live session, each with the sender's name and when it arrived.
 */
export async function listReceivedPersonalMessages(userId: string) {
  const participantId = await getParticipantId(userId);
  return prisma.liveMessage.findMany({
    where: { receiverId: participantId },
    include: { sender: true, session: { include: { bootcamp: { select: { title: true } } } } },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Phase 4b — every group-work thread this user has ever taken part
 * in, full archive: each group they were placed in, its members, and
 * every group message exchanged there (not just messages they sent).
 */
export async function listMyGroupArchive(userId: string) {
  const participantId = await getParticipantId(userId);
  const presences = await prisma.livePresence.findMany({
    where: { participantId, groupId: { not: null } },
    include: {
      group: {
        include: {
          members: { include: { participant: participantWithAvatar } },
          messages: {
            where: { receiverId: null },
            include: { sender: true },
            orderBy: { createdAt: "asc" },
          },
          session: { include: { bootcamp: { select: { title: true } } } },
        },
      },
    },
    orderBy: { joinedAt: "desc" },
  });
  return presences.map((p) => p.group).filter((g): g is NonNullable<typeof g> => g !== null);
}

/**
 * Phase 5 — admin/manager access to everything: every conversation,
 * file, and presence log for a session, optionally narrowed by group,
 * participant, or a time range.
 */
export async function adminSessionLog(
  sessionId: string,
  filters: { groupId?: string; participantId?: string; from?: Date; to?: Date }
) {
  const [presences, messages] = await Promise.all([
    prisma.livePresence.findMany({
      where: {
        sessionId,
        ...(filters.groupId && { groupId: filters.groupId }),
        ...(filters.participantId && { participantId: filters.participantId }),
      },
      include: { participant: participantWithAvatar, group: true },
      orderBy: { joinedAt: "asc" },
    }),
    prisma.liveMessage.findMany({
      where: {
        sessionId,
        ...(filters.groupId && { groupId: filters.groupId }),
        ...(filters.participantId && {
          OR: [{ senderId: filters.participantId }, { receiverId: filters.participantId }],
        }),
        ...((filters.from || filters.to) && {
          createdAt: { ...(filters.from && { gte: filters.from }), ...(filters.to && { lte: filters.to }) },
        }),
      },
      include: { sender: true, receiver: true, group: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  return { presences, messages };
}
