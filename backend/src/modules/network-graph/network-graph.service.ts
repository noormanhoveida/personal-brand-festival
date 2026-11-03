import { prisma } from "../../config/db";

export interface GraphNode {
  id: string;
  name: string;
  slug: string;
  avatarUrl: string | null;
  roleOrField: string | null;
  level?: number;
}

export interface GraphLink {
  source: string;
  target: string;
  count: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export class NetworkGraphService {
  /**
   * دریافت گراف کلی تمام شرکت‌کنندگان و بازخوردها
   */
  static async getGlobalGraph(): Promise<GraphData> {
    const participants = await prisma.participantProfile.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        slug: true,
        professionalField: true,
        occupation: true,
        media: {
          where: { type: "PROFILE_PORTRAIT" },
          orderBy: { order: "asc" },
          take: 1,
          select: { url: true },
        },
      },
    });

    const feedbackItems = await prisma.feedbackResponse.findMany({
      where: {
        authorParticipantId: { not: null },
      },
      select: {
        authorParticipantId: true,
        request: {
          select: {
            requesterId: true,
          },
        },
      },
    });

    const linkMap = new Map<string, number>();

    for (const item of feedbackItems) {
      const source = item.authorParticipantId;
      const target = item.request?.requesterId;
      if (source && target && source !== target) {
        const key = `${source}->${target}`;
        linkMap.set(key, (linkMap.get(key) || 0) + 1);
      }
    }

    const links: GraphLink[] = [];
    linkMap.forEach((count, key) => {
      const [source, target] = key.split("->");
      links.push({ source, target, count });
    });

    const nodes: GraphNode[] = participants.map((p: any) => ({
      id: p.id,
      name: `${p.firstName} ${p.lastName}`.trim(),
      slug: p.slug,
      avatarUrl: p.media?.[0]?.url || null,
      roleOrField: p.occupation || p.professionalField || null,
    }));

    return { nodes, links };
  }

  /**
   * دریافت ارتباط‌های مستقیم کاربر احرازشده
   */
  static async getMyNetworkGraph(participantId: string): Promise<GraphData> {
    const feedbackItems = await prisma.feedbackResponse.findMany({
      where: {
        authorParticipantId: { not: null },
      },
      select: {
        authorParticipantId: true,
        request: {
          select: {
            requesterId: true,
          },
        },
      },
    });

    // فقط ارتباط‌هایی که یک سرشان کاربر فعلی است.
    const directNodeIds = new Set<string>([participantId]);
    const directLinkMap = new Map<string, number>();

    for (const item of feedbackItems) {
      const source = item.authorParticipantId;
      const target = item.request?.requesterId;

      if (!source || !target || source === target) continue;
      if (source !== participantId && target !== participantId) continue;

      const connectedParticipantId =
        source === participantId ? target : source;

      directNodeIds.add(connectedParticipantId);

      // هر ارتباط مستقیم، صرف‌نظر از جهت بازخورد، یک لینک محسوب می‌شود.
      const linkKey = [participantId, connectedParticipantId]
        .sort()
        .join("->");

      directLinkMap.set(
        linkKey,
        (directLinkMap.get(linkKey) || 0) + 1
      );
    }

    const includedNodeIds = Array.from(directNodeIds);

    const participants = await prisma.participantProfile.findMany({
      where: {
        id: { in: includedNodeIds },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        slug: true,
        professionalField: true,
        occupation: true,
        media: {
          where: { type: "PROFILE_PORTRAIT" },
          orderBy: { order: "asc" },
          take: 1,
          select: { url: true },
        },
      },
    });

    const nodes: GraphNode[] = participants.map((p: any) => ({
      id: p.id,
      name: `${p.firstName} ${p.lastName}`.trim(),
      slug: p.slug,
      avatarUrl: p.media?.[0]?.url || null,
      roleOrField: p.occupation || p.professionalField || null,
      level: p.id === participantId ? 0 : 1,
    }));

    const links: GraphLink[] = [];

    directLinkMap.forEach((count, key) => {
      const [source, target] = key.split("->");
      links.push({ source, target, count });
    });

    return { nodes, links };
  }
}
