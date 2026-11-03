import { useEffect, useRef, useState } from "react";
import { apiClient } from "../../api/client";
import ForceGraph from "force-graph";

type Node = {
  id: string;
  name: string;
  slug: string;
  avatarUrl: string | null;
  level?: number;
};

type Link = {
  source: string | Node;
  target: string | Node;
  count?: number;
};

type Data = {
  nodes: Node[];
  links: Link[];
};

const normalizeAvatarUrl = (url: string | null): string | null => {
  if (!url) return null;

  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:") ||
    url.startsWith("blob:")
  ) {
    return url;
  }

  return url.startsWith("/") ? url : `/${url}`;
};

export default function MyNetworkGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [hasConnections, setHasConnections] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let fg: any;
    let resizeObserver: ResizeObserver | undefined;

    const imageCache = new Map<
      string,
      {
        image: HTMLImageElement;
        loaded: boolean;
        failed: boolean;
      }
    >();

    const loadAvatar = (node: Node) => {
      const src = normalizeAvatarUrl(node.avatarUrl);
      if (!src || imageCache.has(node.id)) return;

      const image = new Image();
      image.crossOrigin = "anonymous";

      const cacheItem = {
        image,
        loaded: false,
        failed: false,
      };

      imageCache.set(node.id, cacheItem);

      image.onload = () => {
        cacheItem.loaded = true;
        if (!cancelled && fg) fg.refresh();
      };

      image.onerror = () => {
        cacheItem.failed = true;
        if (!cancelled && fg) fg.refresh();
      };

      image.src = src;
    };

    apiClient
      .get<Data>("/network-graph/my-network")
      .then(({ data }) => {
        if (cancelled || !containerRef.current) return;

        setHasConnections(data.links.length > 0);

        data.nodes.forEach(loadAvatar);

        const factory: any = ForceGraph;

        fg = factory()(containerRef.current)
          .width(containerRef.current.clientWidth)
          .height(450)
          .backgroundColor("rgba(0,0,0,0)")
          .nodeLabel((node: any) => node.name)
          .nodeRelSize(12)
          .nodeCanvasObjectMode(() => "replace")
          .nodeCanvasObject(
            (node: Node & { x: number; y: number }, ctx: CanvasRenderingContext2D, globalScale: number) => {
              const isCurrentUser = node.level === 0;
              const radius = isCurrentUser ? 18 : 14;
              const cachedAvatar = imageCache.get(node.id);
              const canDrawAvatar =
                cachedAvatar?.loaded && !cachedAvatar.failed;

              ctx.save();

              // سایه و حاشیه نود
              ctx.beginPath();
              ctx.arc(node.x, node.y, radius + 2, 0, Math.PI * 2);
              ctx.fillStyle = isCurrentUser ? "#fbbf24" : "#8b5cf6";
              ctx.shadowColor = isCurrentUser
                ? "rgba(251,191,36,0.75)"
                : "rgba(139,92,246,0.45)";
              ctx.shadowBlur = isCurrentUser ? 12 : 7;
              ctx.fill();

              ctx.shadowBlur = 0;

              // برش دایره‌ای عکس
              ctx.beginPath();
              ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
              ctx.closePath();
              ctx.clip();

              if (canDrawAvatar && cachedAvatar) {
                const image = cachedAvatar.image;
                const size = radius * 2;
                const aspect = image.naturalWidth / image.naturalHeight;

                let drawWidth = size;
                let drawHeight = size;
                let drawX = node.x - radius;
                let drawY = node.y - radius;

                if (aspect > 1) {
                  drawWidth = size * aspect;
                  drawX = node.x - drawWidth / 2;
                } else if (aspect > 0 && aspect < 1) {
                  drawHeight = size / aspect;
                  drawY = node.y - drawHeight / 2;
                }

                ctx.drawImage(
                  image,
                  drawX,
                  drawY,
                  drawWidth,
                  drawHeight
                );
              } else {
                const gradient = ctx.createLinearGradient(
                  node.x - radius,
                  node.y - radius,
                  node.x + radius,
                  node.y + radius
                );

                if (isCurrentUser) {
                  gradient.addColorStop(0, "#f59e0b");
                  gradient.addColorStop(1, "#d97706");
                } else {
                  gradient.addColorStop(0, "#6366f1");
                  gradient.addColorStop(1, "#a855f7");
                }

                ctx.fillStyle = gradient;
                ctx.fillRect(
                  node.x - radius,
                  node.y - radius,
                  radius * 2,
                  radius * 2
                );

                ctx.fillStyle = "#ffffff";
                ctx.font = `bold ${radius}px Vazirmatn, Tahoma, sans-serif`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(
                  (node.name || "?").trim().slice(0, 1),
                  node.x,
                  node.y + 1
                );
              }

              ctx.restore();

              // نام کاربر
              const fontSize = Math.max(3, 11 / globalScale);

              ctx.save();
              ctx.font = `600 ${fontSize}px Vazirmatn, Tahoma, sans-serif`;
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";

              const label = isCurrentUser
                ? `${node.name} (شما)`
                : node.name;

              const textWidth = ctx.measureText(label).width;
              const labelY = node.y + radius + fontSize + 4;

              ctx.fillStyle = "rgba(255,255,255,0.92)";
              ctx.fillRect(
                node.x - textWidth / 2 - 3,
                labelY - fontSize / 2 - 2,
                textWidth + 6,
                fontSize + 4
              );

              ctx.fillStyle = isCurrentUser ? "#b45309" : "#312e81";
              ctx.fillText(label, node.x, labelY);
              ctx.restore();
            }
          )
          .linkColor(() => "rgba(139,92,246,0.55)")
          .linkWidth((link: Link) =>
            Math.min(1 + Number(link.count || 1) * 0.35, 4)
          )
          .onNodeClick((node: Node) => {
            if (node.slug) {
              window.open(`/participant/${node.slug}`, "_blank");
            }
          });

        // تنظیم فیزیک گراف برای باز شدن فاصله گره‌ها و جلوگیری از مچاله شدن
        fg.d3Force("charge")?.strength(-120);
        fg.d3Force("link")?.distance(90);

        fg.graphData({
          nodes: data.nodes,
          links: data.links,
        });

        resizeObserver = new ResizeObserver(() => {
          if (!containerRef.current || !fg) return;

          fg.width(containerRef.current.clientWidth);
          fg.height(450);
        });

        resizeObserver.observe(containerRef.current);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load personal network graph:", error);
        if (!cancelled) {
          setLoading(false);
          setHasConnections(false);
        }
      });

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();

      if (fg) {
        fg._destructor?.();
      }

      imageCache.clear();
    };
  }, []);

  return (
    <div>
      {loading && (
        <p className="py-10 text-center text-sm text-gray-500">
          در حال بارگذاری…
        </p>
      )}

      {!loading && !hasConnections && (
        <p className="py-5 text-center text-sm text-gray-500">
          هنوز ارتباط مستقیمی برای نمایش وجود ندارد.
        </p>
      )}

      <div
        ref={containerRef}
        className="w-full overflow-hidden rounded-xl"
        dir="ltr"
      />
    </div>
  );
}
