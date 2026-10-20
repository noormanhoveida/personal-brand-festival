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
   * دریافت گراف محلی ۲ سطحی برای کاربر احرازشده
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

    const adjacency = new Map<string, Set<string>>();
    const linkMap = new Map<string, number>();

    const addEdge = (u: string, v: string) => {
      if (!adjacency.has(u)) adjacency.set(u, new Set());
      if (!adjacency.has(v)) adjacency.set(v, new Set());
      adjacency.get(u)!.add(v);
      adjacency.get(v)!.add(u);

      const linkKey = `${u}->${v}`;
      linkMap.set(linkKey, (linkMap.get(linkKey) || 0) + 1);
    };

    for (const item of feedbackItems) {
      const src = item.authorParticipantId;
      const dst = item.request?.requesterId;
      if (src && dst && src !== dst) {
        addEdge(src, dst);
      }
    }

    const levelMap = new Map<string, number>();
    levelMap.set(participantId, 0);

    const queue: Array<{ id: string; depth: number }> = [{ id: participantId, depth: 0 }];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current.depth >= 2) continue;

      const neighbors = adjacency.get(current.id) || new Set();
      for (const neighbor of neighbors) {
        if (!levelMap.has(neighbor)) {
          levelMap.set(neighbor, current.depth + 1);
          queue.push({ id: neighbor, depth: current.depth + 1 });
        }
      }
    }

    const includedNodeIds = Array.from(levelMap.keys());

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
      level: levelMap.get(p.id) ?? 2,
    }));

    const includedSet = new Set(includedNodeIds);
    const links: GraphLink[] = [];

    linkMap.forEach((count, key) => {
      const [source, target] = key.split("->");
      if (includedSet.has(source) && includedSet.has(target)) {
        links.push({ source, target, count });
      }
    });

    return { nodes, links };
  }
}
