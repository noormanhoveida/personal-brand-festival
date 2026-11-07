import React, { useEffect, useRef, useState } from 'react';
import ForceGraph3D from '3d-force-graph';
import * as THREE from 'three';

interface NodeData {
  id: string;
  name: string;
  headline?: string;
  avatarUrl?: string;
  val?: number;
  connectionCount?: number;
  isMe?: boolean;
  fx?: number;
  fy?: number;
  fz?: number;
}

interface LinkData {
  source: any;
  target: any;
}

interface GraphData {
  nodes: NodeData[];
  links: LinkData[];
}

const getCurrentUserId = (): string | null => {
  try {
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload.userId || payload.id || payload.sub || null;
  } catch (e) {
    return null;
  }
};

const createAvatarTexture = (imgSrc: string | undefined, name: string, isMe: boolean, isHub: boolean): Promise<THREE.Texture> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    const drawFallback = () => {
      ctx.clearRect(0, 0, 256, 256);
      const grad = ctx.createLinearGradient(0, 0, 256, 256);
      if (isMe) {
        grad.addColorStop(0, '#f59e0b');
        grad.addColorStop(1, '#d97706');
      } else if (isHub) {
        grad.addColorStop(0, '#ec4899');
        grad.addColorStop(1, '#8b5cf6');
      } else {
        grad.addColorStop(0, '#4f46e5');
        grad.addColorStop(1, '#06b6d4');
      }
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(128, 128, 118, 0, Math.PI * 2);
      ctx.fill();

      ctx.lineWidth = isMe ? 14 : (isHub ? 12 : 8);
      ctx.strokeStyle = isMe ? '#fef08a' : (isHub ? '#f472b6' : '#ffffff');
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 96px Vazirmatn, Tahoma, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText((name || '?').trim().slice(0, 1).toUpperCase(), 128, 134);

      if (isMe) {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(80, 205, 96, 36, 12) : ctx.rect(80, 205, 96, 36);
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 22px Vazirmatn, Tahoma, sans-serif';
        ctx.fillText('شما', 128, 224);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      resolve(texture);
    };

    if (!imgSrc) {
      drawFallback();
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imgSrc;
    img.onload = () => {
      ctx.clearRect(0, 0, 256, 256);
      ctx.save();
      ctx.beginPath();
      ctx.arc(128, 128, 114, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      const aspect = img.width / img.height;
      let drawW = 256;
      let drawH = 256;
      let dx = 0;
      let dy = 0;

      if (aspect > 1) {
        drawW = 256 * aspect;
        dx = (256 - drawW) / 2;
      } else {
        drawH = 256 / aspect;
        dy = (256 - drawH) / 2;
      }
      ctx.drawImage(img, dx, dy, drawW, drawH);
      ctx.restore();

      ctx.beginPath();
      ctx.arc(128, 128, 116, 0, Math.PI * 2);
      ctx.lineWidth = isMe ? 14 : (isHub ? 12 : 8);
      ctx.strokeStyle = isMe ? '#fbbf24' : (isHub ? '#f43f5e' : '#818cf8');
      ctx.stroke();

      if (isMe) {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(80, 205, 96, 36, 12) : ctx.rect(80, 205, 96, 36);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px Vazirmatn, Tahoma, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('شما', 128, 224);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      resolve(texture);
    };
    img.onerror = drawFallback;
  });
};

const GlobalNetwork3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [hoverNode, setHoverNode] = useState<NodeData | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let isMounted = true;
    const currentUserId = getCurrentUserId();
    const Graph = new (ForceGraph3D as any)(containerRef.current);

    Graph
      .backgroundColor('#030712')
      .showNavInfo(false)
      .linkColor((link: any) => {
        const sId = typeof link.source === 'object' ? link.source.id : link.source;
        const tId = typeof link.target === 'object' ? link.target.id : link.target;
        if (currentUserId && (sId === currentUserId || tId === currentUserId)) {
          return 'rgba(251, 191, 36, 0.95)';
        }
        return 'rgba(167, 139, 250, 0.65)';
      })
      .linkWidth((link: any) => {
        const sId = typeof link.source === 'object' ? link.source.id : link.source;
        const tId = typeof link.target === 'object' ? link.target.id : link.target;
        return (currentUserId && (sId === currentUserId || tId === currentUserId)) ? 4.0 : 2.5;
      })
      .linkDirectionalParticles(3)
      .linkDirectionalParticleSpeed(0.008)
      .linkDirectionalParticleWidth(3.5)
      .linkDirectionalParticleColor(() => '#c084fc')
      .onNodeHover((node: any) => {
        if (isMounted) setHoverNode(node || null);
      })
      .onNodeClick((node: any) => {
        if (node?.id) window.open(`/participant/${node.id}`, '_blank');
      });

    // تنظیم فیزیک نرم‌تر تا نودها خیلی پرتاب نشوند
    Graph.d3Force('charge')?.strength(-160);
    Graph.d3Force('link')?.distance(95);

    const resizeObserver = new ResizeObserver(() => {
      if (containerRef.current && Graph) {
        Graph.width(containerRef.current.clientWidth);
        Graph.height(containerRef.current.clientHeight || 750);
      }
    });
    resizeObserver.observe(containerRef.current);

    fetch('/api/network-graph/global')
      .then(res => res.json())
      .then(async (graphData: GraphData) => {
        if (!isMounted) return;

        // ۱. شمارش مستقیم و قطعی تعداد ارتباطات واقعی بر اساس لینک‌ها
        const connectionsMap: Record<string, number> = {};
        graphData.nodes.forEach(n => { connectionsMap[n.id] = 0; });

        graphData.links.forEach(l => {
          const s = typeof l.source === 'object' ? l.source.id : l.source;
          const t = typeof l.target === 'object' ? l.target.id : l.target;
          if (connectionsMap[s] !== undefined) connectionsMap[s]++;
          if (connectionsMap[t] !== undefined) connectionsMap[t]++;
        });

        // یافتن بزرگ‌ترین هاب (نودی که بیشترین ارتباط را دارد)
        let maxConnections = -1;
        let hubNodeId: string | null = null;

        graphData.nodes.forEach(n => {
          const count = connectionsMap[n.id] || n.val || 0;
          n.connectionCount = count;
          if (count > maxConnections) {
            maxConnections = count;
            hubNodeId = n.id;
          }
          if (currentUserId && n.id === currentUserId) {
            n.isMe = true;
          }
        });

        // ۲. قرار دادن بزرگ‌ترین مرکز شبکه (Hub) دقیقاً در مرکز ثقل (0,0,0)
        // اگر کاربر جاری لاگین بود، او را می‌گذاریم مرکز، وگرنه بزرگ‌ترین هاب را
        const centerId = (currentUserId && connectionsMap[currentUserId] !== undefined) ? currentUserId : hubNodeId;

        graphData.nodes.forEach(n => {
          if (n.id === centerId) {
            n.fx = 0;
            n.fy = 0;
            n.fz = 0;
          }
        });

        // پیش‌بارگذاری تکسچرها بر اساس هاب بودن
        const textureCache: Record<string, THREE.Texture> = {};
        await Promise.all(
          graphData.nodes.map(async (n) => {
            const isHub = (n.connectionCount || 0) >= 3 || n.id === hubNodeId;
            textureCache[n.id] = await createAvatarTexture(n.avatarUrl, n.name, Boolean(n.isMe), isHub);
          })
        );

        // ۳. سایزبندی کاملاً محسوس و بصری بر اساس تعداد اتصالات واقعی
        Graph.nodeThreeObject((node: any) => {
          const tex = textureCache[node.id];
          if (!tex) return new THREE.Object3D();
          const material = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
          const sprite = new THREE.Sprite(material);

          const count = node.connectionCount || 0;
          
          let size = 20; // سایز نودهای معمولی
          if (node.isMe) {
            size = 55; // نود شما بزرگ و طلایی
          } else if (count >= 5) {
            size = 50; // هاب‌های اصلی
          } else if (count >= 2) {
            size = 32 + (count * 3); // رشد پله‌ای
          } else {
            size = 18; // افراد تک‌ارتباطی یا بی‌ارتباط
          }

          sprite.scale.set(size, size, 1);
          return sprite;
        });

        Graph.graphData(graphData);

        // ۴. دوربین خودکار: ابتدا فوکوس و سپس کادربندی کل شبکه بدون افتادن در سیاهی
        setTimeout(() => {
          if (Graph.zoomToFit) {
            Graph.zoomToFit(1200, 80); // دقیقاً شبکه را با حاشیه ۸۰ پیکسلی وسط صفحه فیت می‌کند
          }
        }, 600);

        setLoading(false);
      })
      .catch((err) => {
        console.error('Network load error:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
      resizeObserver.disconnect();
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, []);

  return (
    <div className="relative w-full h-[750px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm text-white">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm font-medium mr-3">در حال چینش شبکه و مرکزیت‌سنجی ارتباطات...</p>
        </div>
      )}

      {hoverNode && (
        <div className={`absolute bottom-6 left-6 z-10 p-4 rounded-xl backdrop-blur-md shadow-xl text-white max-w-xs transition-all pointer-events-none ${
          hoverNode.isMe ? 'bg-amber-950/90 border border-amber-500/50' : 'bg-slate-900/90 border border-indigo-500/30'
        }`}>
          <div className="flex items-center gap-3">
            {hoverNode.avatarUrl ? (
              <img
                src={hoverNode.avatarUrl}
                alt=""
                className={`w-12 h-12 rounded-full object-cover border-2 ${hoverNode.isMe ? 'border-amber-400' : 'border-indigo-400'}`}
              />
            ) : (
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${hoverNode.isMe ? 'bg-amber-600' : 'bg-indigo-600'}`}>
                {hoverNode.name?.slice(0, 1)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-base leading-tight">{hoverNode.name}</h4>
                {hoverNode.isMe && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded-full font-semibold">
                    شما
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1 line-clamp-1">{hoverNode.headline || 'شرکت‌کننده جشنواره'}</p>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
            <span>تعداد ارتباطات واقعی:</span>
            <span className={`font-semibold ${hoverNode.isMe ? 'text-amber-400' : 'text-indigo-400'}`}>
              {hoverNode.connectionCount ?? hoverNode.val ?? 0}
            </span>
          </div>
        </div>
      )}

      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};

export default GlobalNetwork3D;
