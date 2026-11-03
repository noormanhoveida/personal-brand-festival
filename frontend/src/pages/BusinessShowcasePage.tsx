import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { 
  getPublicBusinessVideos,
  getPublicBusinessVideo, 
  toggleLikeBusinessVideo, 
  getBusinessComments, 
  addBusinessComment,
  type BusinessVideo,
  type BusinessComment,
} from "../api/businessShowcase";
import { Card } from "../components/ui";
import { Avatar } from "../components/Avatar";
import { getBusinessVideoLikes, type BusinessLiker } from "../api/businessShowcase";

export function BusinessShowcasePage() {
  const [videos, setVideos] = useState<BusinessVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Modal State
  const [activeVideo, setActiveVideo] = useState<BusinessVideo | null>(null);
  const [likersList, setLikersList] = useState<BusinessLiker[]>([]);
  const [showLikersModal, setShowLikersModal] = useState(false);
  const [comments, setComments] = useState<BusinessComment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentNotice, setCommentNotice] = useState<string | null>(null);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const res = await getPublicBusinessVideos({
        category: category || undefined,
        page,
        limit: 12,
      });
      setVideos(res.items);
      setTotalPages(res.pagination.totalPages);
    } catch (err: any) {
      setError("خطا در بارگذاری ویدیوهای ویترین");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, [category, page]);

  const openVideoModal = async (video: BusinessVideo) => {
    setActiveVideo(video);
    setLikesCount(video.likeCount || 0);
    setIsLiked(false);
    setActionError(null);
    setCommentNotice(null);
    setLikersList([]);
    setComments([]);

    // 1. ثبت بازدید و همگام‌سازی جزییات از بک‌اند
    getPublicBusinessVideo(video.id)
      .then((detail: any) => {
        if (detail) {
          setActiveVideo((prev) => (prev && prev.id === video.id ? { ...prev, ...detail } : prev));
          if (typeof detail.viewCount === "number") {
            // آپدیت همزمان در لیست برای انعکاس سریع بازدید
            setVideos((prev) =>
              prev.map((v) => (v.id === video.id ? { ...v, viewCount: detail.viewCount } : v))
            );
          }
          if (typeof detail.likeCount === "number") {
            setLikesCount(detail.likeCount);
          }
          if (typeof detail.isLikedByCurrentUser === "boolean") {
            setIsLiked(detail.isLikedByCurrentUser);
          }
        }
      })
      .catch(() => {});

    // 2. دریافت کامنت‌ها به صورت کاملاً مستقل
    getBusinessComments(video.id)
      .then((comms) => {
        if (Array.isArray(comms)) setComments(comms);
      })
      .catch(() => {
        setComments([]);
      });

    // 3. دریافت لیست لایک‌کنندگان به صورت کاملاً مستقل
    getBusinessVideoLikes(video.id)
      .then((likers) => {
        if (Array.isArray(likers)) setLikersList(likers);
      })
      .catch(() => {
        setLikersList([]);
      });
  };

  const handleToggleLike = async (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await toggleLikeBusinessVideo(videoId);
      setIsLiked(res.liked);
      setLikesCount((prev) => (res.liked ? prev + 1 : Math.max(0, prev - 1)));
      try {
        const likers = await getBusinessVideoLikes(videoId);
        setLikersList(likers);
      } catch {}
    } catch (err: any) {
      if (err.response?.status === 401) {
        setActionError("برای لایک کردن ویدیو ابتدا وارد حساب کاربری خود شوید.");
      } else {
        setActionError("خطا در ثبت لایک");
      }
    }
  };

  const handleAddComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!activeVideo || commentText.trim().length < 2) return;
    try {
      setCommentSubmitting(true);
      setActionError(null);
      await addBusinessComment(activeVideo.id, commentText.trim());
      setCommentText("");
      setCommentNotice("نظر شما ثبت شد؛ پس از تأیید مدیر نمایش داده خواهد شد.");
      const comms = await getBusinessComments(activeVideo.id);
      setComments(comms);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setActionError("برای ثبت نظر ابتدا وارد حساب کاربری خود شوید.");
      } else {
        setActionError("خطا در ثبت نظر");
      }
    } finally {
      setCommentSubmitting(false);
    }
  };

  const categories = [
    { label: "همه دسته‌ها", value: "" },
    { label: "فناوری و استارتاپ", value: "TECH" },
    { label: "خدمات کسب‌وکار", value: "SERVICES" },
    { label: "آموزش و پژوهش", value: "EDUCATION" },
    { label: "خرده‌فروشی", value: "RETAIL" },
    { label: "صنایع خلاق", value: "CREATIVE" },
    { label: "سایر", value: "OTHER" },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg,var(--background,#0d1117))] text-[var(--text,#e6edf3)] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-[var(--accent,#f0b429)] mb-2">ویترین کسب‌وکارها</h1>
          <p className="text-[var(--muted,#8b949e)]">ویدیوهای معرفی کسب‌وکارهایی که بررسی و تأیید شده‌اند.</p>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => { setCategory(cat.value); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                category === cat.value
                  ? "bg-[var(--accent,#f0b429)] text-gray-900 shadow-lg"
                  : "bg-[var(--surface,#161b22)] text-[var(--text,#e6edf3)] hover:bg-gray-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-[var(--muted,#8b949e)]">در حال بارگذاری ویدیوها...</div>
        ) : error ? (
          <div className="text-center py-20 text-red-400">{error}</div>
        ) : videos.length === 0 ? (
          <div className="text-center py-20 text-[var(--muted,#8b949e)]">ویدیویی در این دسته یافت نشد.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => {
              const authorName = video.user?.participantProfile
                ? `${video.user.participantProfile.firstName || ""} ${video.user.participantProfile.lastName || ""}`.trim()
                : "کاربر گرامی";
              const slug = video.user?.participantProfile?.slug;

              return (
                <div
                  key={video.id}
                  role="button"
                  tabIndex={0}
                  className="cursor-pointer"
                  onClick={() => openVideoModal(video)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      void openVideoModal(video);
                    }
                  }}
                >
                  <Card className="bg-[var(--surface,#161b22)] border border-[var(--border,#30363d)] rounded-2xl overflow-hidden shadow-xl hover:border-[var(--accent,#f0b429)] transition-all flex flex-col">
                  <div className="relative aspect-video bg-black flex items-center justify-center">
                    {video.thumbnailUrl ? (
                      <img src={video.thumbnailUrl} alt={video.businessName} className="w-full h-full object-cover" />
                    ) : (
                      <video src={video.videoUrl} className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="px-4 py-2 bg-[var(--accent,#f0b429)] text-gray-900 rounded-full font-bold text-sm shadow">مشاهده ویدیو و نظرات</span>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--accent,#f0b429)]/10 text-[var(--accent,#f0b429)] font-medium">
                          {video.category}
                        </span>
                        <span className="text-xs text-[var(--muted,#8b949e)]">{video.viewCount} بازدید</span>
                      </div>
                      <h3 className="text-lg font-bold text-[var(--text,#e6edf3)] mb-1">{video.businessName}</h3>
                      <p className="text-sm text-[var(--muted,#8b949e)] mb-3">
                        {slug ? (
                          <Link to={`/p/${slug}`} onClick={(e) => e.stopPropagation()} className="hover:text-[var(--accent,#f0b429)] underline">
                            {authorName}
                          </Link>
                        ) : (
                          authorName
                        )}
                        {video.ownerName ? ` • ${video.ownerName}` : ""}
                      </p>
                      {video.description && (
                        <p className="text-sm text-gray-300 line-clamp-2 mb-4">{video.description}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-[var(--border,#30363d)] text-sm">
                      <button 
                        onClick={(e) => handleToggleLike(video.id, e)}
                        className="flex items-center gap-1.5 text-pink-400 hover:text-pink-300 transition-colors"
                      >
                        <span>♥ پسندیدم</span>
                        <span className="bg-pink-500/10 px-2 py-0.5 rounded-full text-xs">{video.likeCount || 0}</span>
                      </button>
                      <span className="text-xs text-[var(--muted,#8b949e)]">مشاهده نظرات</span>
                    </div>
                  </div>
                  </Card>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-4 py-2 rounded-xl text-sm font-bold ${
                  page === i + 1 
                    ? "bg-[var(--accent,#f0b429)] text-gray-900" 
                    : "bg-[var(--surface,#161b22)] text-[var(--text,#e6edf3)]"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[var(--surface,#161b22)] border border-[var(--border,#30363d)] rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col">
            <button 
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700 font-bold"
            >
              ✕
            </button>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-lg flex items-center justify-center">
                <video src={activeVideo.videoUrl} controls autoPlay className="w-full h-full object-contain" />
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                  <h2 className="text-2xl font-extrabold text-[var(--text,#e6edf3)]">{activeVideo.businessName}</h2>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={(e) => handleToggleLike(activeVideo.id, e)}
                        className="flex items-center gap-2 px-4 py-2 bg-pink-500/10 text-pink-400 rounded-xl hover:bg-pink-500/20 font-medium transition-all"
                      >
                        <span>{isLiked ? "♥ پسندیده‌اید" : "♡ پسندیدن"}</span>
                        <span className="bg-pink-500 text-white px-2 py-0.5 rounded-full text-xs">{likesCount}</span>
                      </button>
                      <span className="text-xs text-[var(--muted,#8b949e)] bg-white/5 border border-white/10 px-3 py-2 rounded-xl flex items-center gap-1.5">
                        <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {activeVideo.viewCount ?? 0} بازدید
                      </span>
                    </div>
                    {likersList.length > 0 && (
                      <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-xl border border-[var(--border,#30363d)]">
                        <div className="flex -space-x-2 overflow-hidden rtl:space-x-reverse" title={`${likersList.length} نفر این ویدیو را پسندیده‌اند`}>
                          {likersList.slice(0, 5).map((liker) => (
                            <Link key={liker.id} to={`/p/${liker.slug}`} title={`${liker.firstName} ${liker.lastName}`}>
                              <Avatar url={liker.avatarUrl} firstName={liker.firstName} lastName={liker.lastName} size={28} />
                            </Link>
                          ))}
                        </div>
                        <span className="text-xs text-pink-400 font-bold ml-1">
                          {likersList.length}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-sm text-[var(--muted,#8b949e)] mb-4">
                  ثبت شده توسط{" "}
                  {activeVideo.user?.participantProfile?.slug ? (
                    <Link to={`/p/${activeVideo.user.participantProfile.slug}`} className="text-[var(--accent,#f0b429)] underline font-semibold">
                      {activeVideo.user.participantProfile.firstName} {activeVideo.user.participantProfile.lastName}
                    </Link>
                  ) : (
                    "کاربر گرامی"
                  )}
                  {activeVideo.websiteUrl && (
                    <a href={activeVideo.websiteUrl} target="_blank" rel="noreferrer" className="mr-4 text-blue-400 underline">
                      مشاهده وب‌سایت ↗
                    </a>
                  )}
                </p>

                {activeVideo.description && (
                  <p className="text-gray-300 text-sm leading-relaxed bg-black/20 p-4 rounded-xl border border-[var(--border,#30363d)]">
                    {activeVideo.description}
                  </p>
                )}
              </div>

              {actionError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm">
                  {actionError}
                </div>
              )}

              {/* Comments Section */}
              <div className="border-t border-[var(--border,#30363d)] pt-6">
                <h3 className="text-lg font-bold mb-4 text-[var(--text,#e6edf3)]">نظرات ({comments.length})</h3>

                <form onSubmit={handleAddComment} className="mb-6 space-y-3">
                  <textarea 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="نظر خود را بنویسید (حداقل ۲ کاراکتر)..."
                    rows={3}
                    className="w-full bg-black/30 border border-[var(--border,#30363d)] rounded-xl p-3 text-[var(--text,#e6edf3)] text-sm focus:border-[var(--accent,#f0b429)] outline-none"
                    required
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[var(--muted,#8b949e)]">نظرات پس از تأیید مدیر نمایش داده می‌شوند.</span>
                    <button 
                      type="submit" 
                      disabled={commentSubmitting}
                      className="px-6 py-2 bg-[var(--accent,#f0b429)] text-gray-900 rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
                    >
                      {commentSubmitting ? "در حال ثبت..." : "ثبت نظر"}
                    </button>
                  </div>
                  {commentNotice && <p className="text-xs text-green-400">{commentNotice}</p>}
                </form>

                <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                  {comments.length === 0 ? (
                    <p className="text-sm text-[var(--muted,#8b949e)] text-center py-4">هنوز نظری ثبت نشده است. اولین نفر باشید!</p>
                  ) : (
                    comments.map((comm) => {
                      const commAuthor = comm.user?.participantProfile
                        ? `${comm.user.participantProfile.firstName || ""} ${comm.user.participantProfile.lastName || ""}`.trim()
                        : "کاربر گرامی";
                      const commSlug = comm.user?.participantProfile?.slug;

                      return (
                        <div key={comm.id} className="bg-black/20 p-4 rounded-xl border border-[var(--border,#30363d)] space-y-1">
                          <div className="flex items-center justify-between text-xs text-[var(--muted,#8b949e)]">
                            {commSlug ? (
                              <Link to={`/p/${commSlug}`} className="font-bold text-[var(--text,#e6edf3)] hover:text-[var(--accent,#f0b429)]">
                                {commAuthor}
                              </Link>
                            ) : (
                              <span className="font-bold text-[var(--text,#e6edf3)]">{commAuthor}</span>
                            )}
                            <span>{new Date(comm.createdAt).toLocaleDateString("fa-IR")}</span>
                          </div>
                          <p className="text-sm text-gray-200">{comm.content}</p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
