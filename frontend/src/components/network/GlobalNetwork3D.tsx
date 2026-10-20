import React, { useEffect, useRef, useState } from 'react';
import ForceGraph3D from '3d-force-graph';
import * as THREE from 'three';

interface NodeData {
  id: string;
  name: string;
  headline?: string;
  avatarUrl?: string;
  val?: number;
  isMe?: boolean;
  fx?: number;
  fy?: number;
  fz?: number;
}

interface LinkData {
  source: string;
  target: string;
}

interface GraphData {
  nodes: NodeData[];
  links: LinkData[];
}

// تابع استخراج شناسه‌ کاربر از توکن JWT موجود در لوکال‌استوریج
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

// تولید تکسچر شفاف و شارپ؛ با تم طلایی اختصاصی برای نود کاربر
const createAvatarTexture = (imgSrc: string | undefined, name: string, isMe: boolean): Promise<THREE.Texture> => {
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
      } else {
        grad.addColorStop(0, '#6366f1');
        grad.addColorStop(1, '#a855f7');
      }
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(128, 128, 120, 0, Math.PI * 2);
      ctx.fill();

      ctx.lineWidth = isMe ? 12 : 8;
      ctx.strokeStyle = isMe ? '#fef08a' : '#ffffff';
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 90px Vazirmatn, Tahoma, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const initial = (name || '?').trim().slice(0, 1).toUpperCase();
      ctx.fillText(initial, 128, 134);

      if (isMe) {
        // برچسب «شما» در پایین آواتار
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

      // حاشیه نورانی طلایی برای کاربر جاری، بنفش برای دیگران
      ctx.beginPath();
      ctx.arc(128, 128, 116, 0, Math.PI * 2);
      ctx.lineWidth = isMe ? 14 : 10;
      ctx.strokeStyle = isMe ? '#fbbf24' : '#a855f7';
      ctx.stroke();

      if (isMe) {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(80, 205, 96, 36, 12);
        } else {
          ctx.rect(80, 205, 96, 36);
        }
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

    img.onerror = () => {
      drawFallback();
    };
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

    const FGConstructor: any = ForceGraph3D;
    const Graph = (typeof FGConstructor === 'function' ? (FGConstructor.prototype ? new FGConstructor() : FGConstructor()) : new (FGConstructor as any)())(containerRef.current);

    Graph
      .backgroundColor('#030712')
      .showNavInfo(false)
      .linkColor((link: any) => {
        const sId = typeof link.source === 'object' ? link.source.id : link.source;
        const tId = typeof link.target === 'object' ? link.target.id : link.target;
        if (currentUserId && (sId === currentUserId || tId === currentUserId)) {
          return 'rgba(251, 191, 36, 0.7)'; // لینک‌های طلایی متصل به کاربر جاری
        }
        return 'rgba(129, 140, 248, 0.35)';
      })
      .linkWidth((link: any) => {
        const sId = typeof link.source === 'object' ? link.source.id : link.source;
        const tId = typeof link.target === 'object' ? link.target.id : link.target;
        return (currentUserId && (sId === currentUserId || tId === currentUserId)) ? 2.5 : 1.2;
      })
      .linkDirectionalParticles(2)
      .linkDirectionalParticleSpeed(0.007)
      .linkDirectionalParticleWidth((link: any) => {
        const sId = typeof link.source === 'object' ? link.source.id : link.source;
        const tId = typeof link.target === 'object' ? link.target.id : link.target;
        return (currentUserId && (sId === currentUserId || tId === currentUserId)) ? 3.5 : 2;
      })
      .linkDirectionalParticleColor((link: any) => {
        const sId = typeof link.source === 'object' ? link.source.id : link.source;
        const tId = typeof link.target === 'object' ? link.target.id : link.target;
        return (currentUserId && (sId === currentUserId || tId === currentUserId)) ? '#fbbf24' : '#a855f7';
      })
      .onNodeHover((node: any) => {
        if (isMounted) setHoverNode(node || null);
      })
      .onNodeClick((node: any) => {
        if (node?.id) {
          window.open(`/participant/${node.id}`, '_blank');
        }
      });

    const resizeObserver = new ResizeObserver(() => {
      if (containerRef.current && Graph) {
        Graph.width(containerRef.current.clientWidth);
        Graph.height(containerRef.current.clientHeight || 750);
      }
    });
    resizeObserver.observe(containerRef.current);

    fetch('/api/network-graph/global')
      .then((res) => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(async (graphData: GraphData) => {
        if (!isMounted) return;

        // مشخص کردن نود کاربر جاری و قفل کردن مختصات آن در مرکز (0, 0, 0)
        let userNodeFound = false;
        graphData.nodes.forEach((n) => {
          if (currentUserId && n.id === currentUserId) {
            n.isMe = true;
            n.fx = 0;
            n.fy = 0;
            n.fz = 0;
            userNodeFound = true;
          }
        });

        // پیش‌بارگذاری تکسچرهای دایره‌ای
        const textureCache: Record<string, THREE.Texture> = {};
        await Promise.all(
          graphData.nodes.map(async (n) => {
            textureCache[n.id] = await createAvatarTexture(n.avatarUrl, n.name, Boolean(n.isMe));
          })
        );

        // رندر Sprite بدون هیچ کره بنفشی
        Graph.nodeThreeObject((node: any) => {
          const tex = textureCache[node.id];
          if (!tex) return new THREE.Object3D();

          const material = new THREE.SpriteMaterial({
            map: tex,
            transparent: true,
            depthWrite: false,
          });
          const sprite = new THREE.Sprite(material);

          // اگر نود کاربر باشد، سایز دوبرابر (۳۸ به بالا)؛ سایرین ۱۸ تا ۲۶
          const size = node.isMe
            ? 38
            : 18 + Math.min((node.val || 1) * 2, 14);

          sprite.scale.set(size, size, 1);
          return sprite;
        });

        Graph.graphData(graphData);

        // اگر کاربر لاگین بود، دوربین روی مرکز (0, 0, 0) تنظیم شود
        if (userNodeFound) {
          setTimeout(() => {
            if (Graph.cameraPosition) {
              Graph.cameraPosition({ x: 0, y: 0, z: 220 }, { x: 0, y: 0, z: 0 }, 1500);
            }
          }, 400);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching global network:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
      resizeObserver.disconnect();
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[750px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      {loading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm text-white">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-medium">در حال ترسیم کهکشان فیدبک‌ها و استخراج آواتارها...</p>
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
            <span>تعداد ارتباطات:</span>
            <span className={`font-semibold ${hoverNode.isMe ? 'text-amber-400' : 'text-indigo-400'}`}>{hoverNode.val || 1}</span>
          </div>
        </div>
      )}

      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};

export default GlobalNetwork3D;
