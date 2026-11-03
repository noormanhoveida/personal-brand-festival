import { useEffect, useRef, useState } from "react";
import { apiClient } from "../../api/client";
import ForceGraph from "force-graph";

type Node = { id: string; name: string; slug: string; avatarUrl: string | null; level?: number };
type Link = { source: string; target: string };
type Data = { nodes: Node[]; links: Link[] };

export default function MyNetworkGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let fg: any;

    apiClient
      .get<Data>("/network-graph/my-network")
      .then(({ data }) => {
        if (cancelled || !containerRef.current) return;

        const factory: any = ForceGraph;
        fg = factory()(containerRef.current)
          .width(containerRef.current.clientWidth)
          .height(420)
          .backgroundColor("rgba(0,0,0,0)")
          .nodeLabel((n: any) => n.name)
          .nodeCanvasObject((node: any, ctx: any, globalScale: number) => {
            const r = 10;
            ctx.beginPath();
            ctx.arc(node.x, node.y, r, 0, 2 * Math.PI, false);
            ctx.fillStyle = node.level === 0 ? "#7c3aed" : node.level === 1 ? "#a78bfa" : "#ddd6fe";
            ctx.fill();
            ctx.font = `${12 / globalScale}px Sans-Serif`;
            ctx.fillStyle = "#333";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(node.name, node.x, node.y + r + 8);
          })
          .linkColor(() => "#a78bfa");

        fg.graphData({ nodes: data.nodes, links: data.links });
        setLoading(false);
      })
      .catch(() => setLoading(false));

    return () => {
      cancelled = true;
      if (fg) fg._destructor?.();
    };
  }, []);

  return (
    <div>
      {loading && <p className="text-sm text-gray-500 py-10 text-center">در حال بارگذاری…</p>}
      <div ref={containerRef} className="w-full" dir="ltr" />
    </div>
  );
}
