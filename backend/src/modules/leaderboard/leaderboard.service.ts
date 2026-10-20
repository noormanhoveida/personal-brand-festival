import { prisma } from "../../config/db";
import { AppError } from "../../utils/errors";
import { SYSTEM_BOARDS, SystemBoardKey } from "./leaderboard.constants";

export class LeaderboardError extends AppError {}

type ParticipantNameMap = Map<string, { firstName: string; lastName: string; avatarUrl: string | null }>;

interface RankedEntry {
  participantId: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  score: number;
}

/**
 * Every SYSTEM board needs a Leaderboard row to hold its publish
 * toggle — this makes sure those 8 rows exist (upsert by key, so
 * calling this repeatedly is always safe) before any read/list.
 */
export async function ensureSystemBoards() {
  await Promise.all(
    SYSTEM_BOARDS.map((b) =>
      prisma.leaderboard.upsert({
        where: { key: b.key },
        update: {},
        create: { key: b.key, kind: "SYSTEM", title: b.title, description: b.description },
      })
    )
  );
}

async function baseParticipantMap(): Promise<ParticipantNameMap> {
  const profiles = await prisma.participantProfile.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      media: {
        where: { type: "PROFILE_PORTRAIT" },
        take: 1,
        orderBy: { createdAt: "desc" },
        select: { url: true },
      },
    },
  });
  return new Map(
    profiles.map((p) => [
      p.id,
      { firstName: p.firstName, lastName: p.lastName, avatarUrl: p.media[0]?.url ?? null },
    ])
  );
}

function toRanked(
  scores: Map<string, number>,
  names: ParticipantNameMap
): RankedEntry[] {
  return Array.from(names.entries())
    .map(([participantId, n]) => ({
      participantId,
      firstName: n.firstName,
      lastName: n.lastName,
      avatarUrl: n.avatarUrl,
      score: scores.get(participantId) ?? 0,
    }))
    .sort((a, b) => b.score - a.score);
}

function addCount(map: Map<string, number>, key: string, amount = 1) {
  map.set(key, (map.get(key) ?? 0) + amount);
}

/**
 * §"بیشترین فعالیت در سایت" — a simple additive composite over every
 * kind of contribution a participant can make. Deliberately a plain
 * sum of counts (not weighted) so it stays easy to explain; adjust
 * the weights here if some activity should count for more.
 */
async function computeSiteActivity(names: ParticipantNameMap) {
  const scores = new Map<string, number>();
  const [responses, tasks, challenges, messages, media] = await Promise.all([
    prisma.response.groupBy({ by: ["participantId"], _count: { _all: true } }),
    prisma.taskSubmission.groupBy({ by: ["participantId"], _count: { _all: true } }),
    prisma.challengeSubmission.groupBy({ by: ["participantId"], _count: { _all: true } }),
    prisma.liveMessage.groupBy({ by: ["senderId"], _count: { _all: true } }),
    prisma.media.groupBy({ by: ["participantId"], _count: { _all: true } }),
  ]);
  responses.forEach((r) => addCount(scores, r.participantId, r._count._all));
  tasks.forEach((r) => addCount(scores, r.participantId, r._count._all));
  challenges.forEach((r) => addCount(scores, r.participantId, r._count._all));
  messages.forEach((r) => addCount(scores, r.senderId, r._count._all));
  media.forEach((r) => addCount(scores, r.participantId, r._count._all));
  return toRanked(scores, names);
}

/** §"بیشترین امتیاز در پیش‌ارزیابی" — average self-rated "current" across the 6 axes, out of 100. */
async function computePreAssessmentScore(names: ParticipantNameMap) {
  const rows = await prisma.preAssessment.findMany({
    select: { participantId: true, selfAssessment: true },
  });
  const scores = new Map<string, number>();
  for (const row of rows) {
    const axes = row.selfAssessment as { current: number }[];
    if (!Array.isArray(axes) || axes.length === 0) continue;
    const avg = axes.reduce((s, a) => s + a.current, 0) / axes.length;
    scores.set(row.participantId, Number(((avg / 10) * 100).toFixed(1)));
  }
  return toRanked(scores, names);
}

/**
 * Shared by both evaluation-based boards: each participant's most
 * recently updated SUBMITTED evaluation (not the max across all of
 * them) is the authoritative one — a later evaluation is treated as
 * superseding an earlier one, same as the rest of the platform never
 * overwriting history but always reading the latest.
 */
async function latestSubmittedEvaluationPerParticipant() {
  const evaluations = await prisma.evaluation.findMany({
    where: { status: "SUBMITTED" },
    orderBy: { updatedAt: "desc" },
    select: { participantId: true, finalScore: true, transformationScore: true },
  });
  const latest = new Map<string, { finalScore: number | null; transformationScore: number | null }>();
  for (const e of evaluations) {
    if (!latest.has(e.participantId)) {
      latest.set(e.participantId, { finalScore: e.finalScore, transformationScore: e.transformationScore });
    }
  }
  return latest;
}

async function computeFinalEvaluationScore(names: ParticipantNameMap) {
  const latest = await latestSubmittedEvaluationPerParticipant();
  const scores = new Map<string, number>();
  latest.forEach((v, participantId) => {
    if (v.finalScore !== null) scores.set(participantId, v.finalScore);
  });
  return toRanked(scores, names);
}

async function computeTransformationProgress(names: ParticipantNameMap) {
  const latest = await latestSubmittedEvaluationPerParticipant();
  const scores = new Map<string, number>();
  latest.forEach((v, participantId) => {
    if (v.transformationScore !== null) scores.set(participantId, v.transformationScore);
  });
  return toRanked(scores, names);
}

/** §"بیشترین تعداد دریافت بازخورد" — FeedbackResponse count, grouped by the requester (recipient) of the "آینه من" link. */
async function computeFeedbackReceived(names: ParticipantNameMap) {
  const responses = await prisma.feedbackResponse.findMany({
    select: { request: { select: { requesterId: true } } },
  });
  const scores = new Map<string, number>();
  responses.forEach((r) => addCount(scores, r.request.requesterId));
  return toRanked(scores, names);
}

/** §"بیشترین دریافت تاییدیه مهارت‌ها" — ENDORSE votes only (rejections don't count for this board). */
async function computeSkillEndorsements(names: ParticipantNameMap) {
  const endorsements = await prisma.skillEndorsement.findMany({
    where: { vote: "ENDORSE" },
    select: { skill: { select: { participantId: true } } },
  });
  const scores = new Map<string, number>();
  endorsements.forEach((e) => addCount(scores, e.skill.participantId));
  return toRanked(scores, names);
}

/** §"بیشترین امتیاز دریافتی در تکالیف" — sum of TaskSubmission.score across their APPROVED submissions. */
async function computeTaskScores(names: ParticipantNameMap) {
  const grouped = await prisma.taskSubmission.groupBy({
    by: ["participantId"],
    where: { approvalStatus: "APPROVED", score: { not: null } },
    _sum: { score: true },
  });
  const scores = new Map<string, number>();
  grouped.forEach((g) => scores.set(g.participantId, g._sum.score ?? 0));
  return toRanked(scores, names);
}

/** §"بیشترین مشارکت در کار گروهی زنده" — group-chat messages sent (personal DMs during a session don't count). */
async function computeLiveGroupParticipation(names: ParticipantNameMap) {
  const grouped = await prisma.liveMessage.groupBy({
    by: ["senderId"],
    where: { groupId: { not: null }, receiverId: null },
    _count: { _all: true },
  });
  const scores = new Map<string, number>();
  grouped.forEach((g) => scores.set(g.senderId, g._count._all));
  return toRanked(scores, names);
}

async function computeSystemRanking(key: SystemBoardKey): Promise<RankedEntry[]> {
  const names = await baseParticipantMap();
  switch (key) {
    case "site_activity":
      return computeSiteActivity(names);
    case "pre_assessment_score":
      return computePreAssessmentScore(names);
    case "final_evaluation_score":
      return computeFinalEvaluationScore(names);
    case "transformation_progress":
      return computeTransformationProgress(names);
    case "feedback_received":
      return computeFeedbackReceived(names);
    case "skill_endorsements":
      return computeSkillEndorsements(names);
    case "task_scores":
      return computeTaskScores(names);
    case "live_group_participation":
      return computeLiveGroupParticipation(names);
  }
}

/**
 * The plain participant roster (id + name only) — used by the
 * evaluator UI to pick who to score on a CUSTOM board. EVALUATOR
 * doesn't have general participant-list access (that's admin-only),
 * so this is scoped narrowly to just what the scoring form needs.
 */
export async function listParticipantsForScoring() {
  const profiles = await prisma.participantProfile.findMany({
    select: { id: true, firstName: true, lastName: true },
    orderBy: { firstName: "asc" },
  });
  return profiles;
}

export async function listBoards() {
  await ensureSystemBoards();
  return prisma.leaderboard.findMany({ orderBy: [{ kind: "asc" }, { createdAt: "asc" }] });
}

export async function listPublishedBoards() {
  await ensureSystemBoards();
  return prisma.leaderboard.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" } });
}

async function getBoard(leaderboardId: string) {
  const board = await prisma.leaderboard.findUnique({ where: { id: leaderboardId } });
  if (!board) throw new LeaderboardError("این تابلوی امتیاز یافت نشد.", 404);
  return board;
}

export async function getRanking(leaderboardId: string) {
  const board = await getBoard(leaderboardId);
  if (board.kind === "SYSTEM") {
    return { board, ranking: await computeSystemRanking(board.key as SystemBoardKey) };
  }
  const entries = await prisma.leaderboardEntry.findMany({
    where: { leaderboardId },
    include: {
      participant: {
        select: {
          firstName: true,
          lastName: true,
          media: {
            where: { type: "PROFILE_PORTRAIT" },
            take: 1,
            orderBy: { createdAt: "desc" },
            select: { url: true },
          },
        },
      },
    },
    orderBy: { score: "desc" },
  });
  return {
    board,
    ranking: entries.map((e) => ({
      participantId: e.participantId,
      firstName: e.participant.firstName,
      lastName: e.participant.lastName,
      avatarUrl: e.participant.media[0]?.url ?? null,
      score: e.score,
      note: e.note,
    })),
  };
}

/**
 * Same ranking, but for the public showcase — which has no login at
 * all, unlike the evaluator's management view. Refuses (as a plain
 * 404, not revealing whether the board exists) unless it's published,
 * so an unpublished board's standings can't be probed by guessing IDs.
 */
export async function getPublicRanking(leaderboardId: string) {
  const board = await getBoard(leaderboardId);
  if (!board.published) {
    throw new LeaderboardError("این تابلوی امتیاز یافت نشد.", 404);
  }
  return getRanking(leaderboardId);
}

export async function createCustomBoard(
  createdByUserId: string,
  input: { title: string; description?: string }
) {
  return prisma.leaderboard.create({
    data: { kind: "CUSTOM", title: input.title, description: input.description, createdByUserId },
  });
}

export async function deleteCustomBoard(leaderboardId: string) {
  const board = await getBoard(leaderboardId);
  if (board.kind !== "CUSTOM") {
    throw new LeaderboardError("تابلوهای سیستمی قابل حذف نیستند.", 400);
  }
  await prisma.leaderboard.delete({ where: { id: leaderboardId } });
}

export async function setEntryScore(
  leaderboardId: string,
  scoredByUserId: string,
  input: { participantId: string; score: number; note?: string }
) {
  const board = await getBoard(leaderboardId);
  if (board.kind !== "CUSTOM") {
    throw new LeaderboardError("فقط تابلوهای سفارشی قابل امتیازدهی دستی هستند.", 400);
  }
  return prisma.leaderboardEntry.upsert({
    where: { leaderboardId_participantId: { leaderboardId, participantId: input.participantId } },
    update: { score: input.score, note: input.note, scoredByUserId, scoredAt: new Date() },
    create: {
      leaderboardId,
      participantId: input.participantId,
      score: input.score,
      note: input.note,
      scoredByUserId,
    },
  });
}

export async function setPublished(leaderboardId: string, published: boolean) {
  await getBoard(leaderboardId);
  return prisma.leaderboard.update({
    where: { id: leaderboardId },
    data: { published, publishedAt: published ? new Date() : null },
  });
}

/**
 * §Participant's own profile — their score and rank on every board
 * (published or not; it's their own data). Ranking every board for
 * every profile view is a bit of extra work, but board/participant
 * counts here are small enough that it's not worth caching yet.
 */
export async function getParticipantSummary(participantId: string) {
  const boards = await listBoards();
  const results = await Promise.all(
    boards.map(async (board) => {
      const { ranking } = await getRanking(board.id);
      const index = ranking.findIndex((r) => r.participantId === participantId);
      return {
        leaderboardId: board.id,
        title: board.title,
        kind: board.kind,
        published: board.published,
        score: index >= 0 ? ranking[index].score : 0,
        rank: index >= 0 ? index + 1 : null,
        totalParticipants: ranking.length,
      };
    })
  );
  return results;
}
