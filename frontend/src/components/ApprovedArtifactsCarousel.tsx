import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { 
  ChevronRight, ChevronLeft, Award, Star, Play, 
  MessageSquare, FileText, Image as ImageIcon, Eye
} from "lucide-react";
import { ArtifactItem } from "../api/artifact";
import { ArtifactDetailModal } from "./ArtifactDetailModal";

interface Props {
  artifacts: ArtifactItem[];
  loading?: boolean;
}

export const ApprovedArtifactsCarousel: React.FC<Props> = ({ artifacts, loading }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedArtifact, setSelectedArtifact] = useState<ArtifactItem | null>(null);
  const [localArtifacts, setLocalArtifacts] = useState<ArtifactItem[]>(artifacts);

  React.useEffect(() => {
    setLocalArtifacts(artifacts);
  }, [artifacts]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm animate-pulse">
        <div className="h-6 w-48 bg-slate-800 rounded-lg mb-4" />
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="min-w-[280px] h-64 bg-slate-800/50 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!localArtifacts || localArtifacts.length === 0) {
    return null;
  }

  const handleArtifactUpdated = (updated: ArtifactItem) => {
    setLocalArtifacts(prev => prev.map(a => a.id === updated.id ? updated : a));
    setSelectedArtifact(updated);
  };

  return (
    <>
      <section className="relative w-full bg-gradient-to-b from-slate-900/70 to-slate-950/70 border border-amber-500/20 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-xl overflow-hidden mb-8">
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative flex items-center justify-between mb-5 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                ویترین آثار برگزیده و تأییدشده
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {localArtifacts.length} اثر
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                مشاهده دستاوردها، تماشای آنلاین آثار، ثبت نظر و امتیازدهی به هم‌دانشگاهیان
              </p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scroll("right")}
              className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-amber-500/20 border border-slate-700/60 hover:border-amber-500/40 text-slate-300 hover:text-amber-400 flex items-center justify-center transition shadow-sm"
              title="قبلی"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("left")}
              className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-amber-500/20 border border-slate-700/60 hover:border-amber-500/40 text-slate-300 hover:text-amber-400 flex items-center justify-center transition shadow-sm"
              title="بعدی"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Slider */}
        <div
          ref={scrollContainerRef}
          className="relative flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {localArtifacts.map((artifact) => {
            const author =
              artifact.participant?.user?.name ||
              artifact.participant?.name ||
              artifact.user?.name ||
              "شرکت‌کننده جشنواره";

            const mediaUrl = artifact.mediaUrl || "";
            const isVideo =
              (artifact.mediaType || "").toUpperCase() === "VIDEO" ||
              mediaUrl.includes("aparat.com") ||
              mediaUrl.includes("youtube.com") ||
              /\.(mp4|webm|mov)(\?.*)?$/i.test(mediaUrl);

            return (
              <motion.div
                key={artifact.id}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedArtifact(artifact)}
                className="group relative flex-none w-[280px] sm:w-[320px] bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 rounded-xl overflow-hidden transition-all duration-300 shadow-lg hover:shadow-amber-500/10 cursor-pointer snap-start flex flex-col"
              >
                {/* Media / Thumbnail preview */}
                <div className="relative w-full h-40 bg-slate-950 overflow-hidden flex items-center justify-center">
                  {artifact.coverImageUrl ? (
                    <img
                      src={artifact.coverImageUrl}
                      alt={artifact.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center">
                      {isVideo ? (
                        <Play className="w-10 h-10 text-amber-400/40" />
                      ) : (
                        <FileText className="w-10 h-10 text-slate-700" />
                      )}
                    </div>
                  )}

                  {/* Axis badge */}
                  <div className="absolute top-2.5 right-2.5 z-10">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-black/60 backdrop-blur-md text-amber-400 border border-amber-500/30">
                      {artifact.axis}
                    </span>
                  </div>

                  {/* Play / Inspect Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-amber-500/30">
                      {isVideo ? <Play className="w-3.5 h-3.5 fill-current" /> : <Eye className="w-3.5 h-3.5" />}
                      مشاهده و تعامل
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-sm text-white line-clamp-1 group-hover:text-amber-400 transition">
                      {artifact.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                      {artifact.description || "بدون توضیحات تکمیلی"}
                    </p>
                  </div>

                  {/* Footer details */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px] truncate max-w-[130px]">
                      {author}
                    </span>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-amber-400 font-semibold text-[11px]">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{Number(artifact.averageRating || 0).toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{artifact._count?.comments ?? artifact.commentsCount ?? artifact.comments?.length ?? 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Modal Detail & Engagement */}
      <ArtifactDetailModal
        artifact={selectedArtifact}
        currentUserId={localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "{}").id : undefined}
        currentUserRole={localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "{}").role : undefined}
        onClose={() => setSelectedArtifact(null)}
        onUpdated={handleArtifactUpdated}
      />
    </>
  );
};
