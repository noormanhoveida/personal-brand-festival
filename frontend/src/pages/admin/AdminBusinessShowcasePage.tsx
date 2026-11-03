import { useState, useEffect, useCallback } from "react";
import {
  getAdminBusinessVideos,
  reviewAdminBusinessVideo,
  deleteBusinessVideo,
  AdminBusinessVideoItem,
  BusinessVideoStatus,
} from "../../api/businessShowcase";
import { Button, Card, Spinner, Input } from "../../components/ui";

const CATEGORY_LABELS: Record<string, string> = {
  TECH: "فناوری و نرم‌افزار",
  SERVICES: "خدمات کسب‌وکار و مشاوره",
  EDUCATION: "آموزش و پژوهش",
  RETAIL: "فروشگاه و خرده‌فروشی",
  CREATIVE: "صنایع خلاق، طراحی و هنر",
  OTHER: "سایر حوزه‌ها",
};

export function AdminBusinessShowcasePage() {
  const [videos, setVideos] = useState<AdminBusinessVideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<BusinessVideoStatus | "ALL">("PENDING");
  const [busyId, setBusyId] = useState<string | null>(null);

  // مودال رد ویدیو
  const [rejectingVideo, setRejectingVideo] = useState<AdminBusinessVideoItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // ویدیو در حال پخش در مودال
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminBusinessVideos({
        status: statusFilter === "ALL" ? undefined : statusFilter,
        page: 1,
        limit: 50,
      });
      setVideos(res.items);
    } catch (e: any) {
      setError(e?.response?.data?.message || "خطا در دریافت لیست ویدیوها");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleApprove = async (video: AdminBusinessVideoItem) => {
    if (!confirm(`آیا از تأیید ویدیوی «${video.businessName}» و انتشار آن در ویترین مطمئن هستید؟`)) return;
    setBusyId(video.id);
    try {
      await reviewAdminBusinessVideo(video.id, {
        status: "APPROVED",
        isFeatured: video.isFeatured,
      });
      await fetchVideos();
    } catch (e: any) {
      alert(e?.response?.data?.message || "خطا در تایید ویدیو");
    } finally {
      setBusyId(null);
    }
  };

  const handleOpenReject = (video: AdminBusinessVideoItem) => {
    setRejectingVideo(video);
    setRejectionReason("");
  };

  const handleConfirmReject = async () => {
    if (!rejectingVideo) return;
    if (!rejectionReason.trim()) {
      alert("لطفاً دلیل رد ویدیو را بنویسید تا برای کاربر ارسال شود.");
      return;
    }
    setBusyId(rejectingVideo.id);
    try {
      await reviewAdminBusinessVideo(rejectingVideo.id, {
        status: "REJECTED",
        rejectionReason: rejectionReason.trim(),
      });
      setRejectingVideo(null);
      setRejectionReason("");
      await fetchVideos();
    } catch (e: any) {
      alert(e?.response?.data?.message || "خطا در رد ویدیو");
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleFeatured = async (video: AdminBusinessVideoItem) => {
    setBusyId(video.id);
    try {
      await reviewAdminBusinessVideo(video.id, {
        status: video.status as BusinessVideoStatus,
        isFeatured: !video.isFeatured,
      });
      await fetchVideos();
    } catch (e: any) {
      alert(e?.response?.data?.message || "خطا در تغییر وضعیت ویژه");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (video: AdminBusinessVideoItem) => {
    if (!confirm(`آیا از حذف کامل ویدیوی کسب‌وکار «${video.businessName}» اطمینان دارید؟ این عمل غیرقابل بازگشت است.`)) return;
    setBusyId(video.id);
    try {
      await deleteBusinessVideo(video.id);
      await fetchVideos();
    } catch (e: any) {
      alert(e?.response?.data?.message || "خطا در حذف ویدیو");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* سربرگ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4 border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-amber-500">مدیریت ویترین کسب‌وکارها</h1>
          <p className="mt-1 text-sm opacity-70">
            بررسی ویدیوی ۶۰ ثانیه‌ای ارسالی اعضا، احراز صلاحیت، تایید انتشار یا ارسال بازخورد و رد
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => fetchVideos()} disabled={loading}>
            بروزرسانی لیست 🔄
          </Button>
        </div>
      </div>

      {/* فیلتر وضعیت */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setStatusFilter("PENDING")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            statusFilter === "PENDING"
              ? "bg-amber-500 text-black"
              : "bg-white/5 hover:bg-white/10 opacity-70"
          }`}
        >
          در انتظار بررسی ⏳
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter("APPROVED")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            statusFilter === "APPROVED"
              ? "bg-emerald-500 text-black"
              : "bg-white/5 hover:bg-white/10 opacity-70"
          }`}
        >
          تأیید و منتشر شده ✅
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter("REJECTED")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            statusFilter === "REJECTED"
              ? "bg-rose-500 text-white"
              : "bg-white/5 hover:bg-white/10 opacity-70"
          }`}
        >
          رد شده ❌
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter("ALL")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            statusFilter === "ALL"
              ? "bg-blue-500 text-white"
              : "bg-white/5 hover:bg-white/10 opacity-70"
          }`}
        >
          همه ویدیوها 📋
        </button>
      </div>

      {/* محتوا */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : error ? (
        <Card className="p-6 text-center text-rose-400 bg-rose-500/10 border-rose-500/30">
          <p>{error}</p>
          <Button size="sm" variant="ghost" className="mt-3" onClick={() => fetchVideos()}>
            تلاش مجدد
          </Button>
        </Card>
      ) : videos.length === 0 ? (
        <Card className="p-12 text-center opacity-60">
          <p className="text-base font-semibold">هیچ ویدیویی در این وضعیت یافت نشد.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {videos.map((video) => {
            const isBusy = busyId === video.id;
            const ownerName =
              video.ownerName ||
              (video.user?.participantProfile?.firstName
                ? `${video.user.participantProfile.firstName} ${video.user.participantProfile.lastName || ""}`
                : video.user?.email || "نامشخص");

            return (
              <Card key={video.id} className="p-4 flex flex-col justify-between space-y-4 border border-white/10">
                <div className="space-y-3">
                  {/* پیش‌نمایش ویدیو */}
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black/60 border border-white/5 flex items-center justify-center group">
                    <video
                      src={video.videoUrl}
                      preload="metadata"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setPreviewVideoUrl(video.videoUrl)}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors"
                      title="پخش کامل ویدیو"
                    >
                      <span className="w-12 h-12 rounded-full bg-amber-500 text-black flex items-center justify-center font-bold text-xl shadow-lg transform group-hover:scale-110 transition-transform">
                        ▶
                      </span>
                    </button>
                    {video.durationSeconds > 0 && (
                      <span className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[11px] text-white">
                        {video.durationSeconds} ثانیه
                      </span>
                    )}
                    {video.isFeatured && (
                      <span className="absolute top-2 left-2 bg-amber-500 text-black px-2 py-0.5 rounded text-[11px] font-bold">
                        ⭐ ویژه
                      </span>
                    )}
                  </div>

                  {/* مشخصات کسب‌وکار */}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-amber-400">
                        {CATEGORY_LABELS[video.category] || video.category}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-bold ${
                          video.status === "APPROVED"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : video.status === "REJECTED"
                            ? "bg-rose-500/20 text-rose-400"
                            : "bg-amber-500/20 text-amber-400"
                        }`}
                      >
                        {video.status === "APPROVED"
                          ? "تأیید شده"
                          : video.status === "REJECTED"
                          ? "رد شده"
                          : "در انتظار بررسی"}
                      </span>
                    </div>

                    <h3 className="font-bold text-base mt-2 text-white">{video.businessName}</h3>
                    <p className="text-xs opacity-75 mt-0.5">صاحب کسب‌وکار: {ownerName}</p>
                    {video.user?.email && (
                      <p className="text-[11px] opacity-50 dir-ltr text-right mt-0.5">{video.user.email}</p>
                    )}
                  </div>

                  {/* توضیحات */}
                  {video.description && (
                    <p className="text-xs opacity-70 line-clamp-3 leading-relaxed bg-white/5 p-2 rounded-lg">
                      {video.description}
                    </p>
                  )}

                  {/* پیوندها */}
                  <div className="flex flex-wrap gap-2 text-[11px] pt-1">
                    {video.websiteUrl && (
                      <a
                        href={video.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                      >
                        🌐 وب‌سایت
                      </a>
                    )}
                    {video.instagramUrl && (
                      <a
                        href={video.instagramUrl.startsWith("http") ? video.instagramUrl : `https://instagram.com/${video.instagramUrl.replace("@", "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-1 rounded bg-pink-500/10 text-pink-400 hover:bg-pink-500/20"
                      >
                        📸 اینستاگرام
                      </a>
                    )}
                    {video.phoneNumber && (
                      <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400">
                        📞 {video.phoneNumber}
                      </span>
                    )}
                  </div>
                </div>

                {/* دکمه‌های اقدام */}
                <div className="border-t border-white/10 pt-3 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {video.status !== "APPROVED" && (
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-1.5"
                        disabled={isBusy}
                        onClick={() => handleApprove(video)}
                      >
                        {isBusy ? "..." : "✓ تایید و انتشار"}
                      </Button>
                    )}
                    {video.status !== "REJECTED" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-rose-400 hover:bg-rose-500/10 text-xs py-1.5"
                        disabled={isBusy}
                        onClick={() => handleOpenReject(video)}
                      >
                        ✕ رد ویدیو
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleToggleFeatured(video)}
                      className={`text-xs hover:underline ${
                        video.isFeatured ? "text-amber-400 font-bold" : "opacity-60"
                      }`}
                    >
                      {video.isFeatured ? "⭐ حذف از ویژه" : "☆ افزودن به ویژه"}
                    </button>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleDelete(video)}
                      className="text-xs text-rose-400/80 hover:text-rose-400 hover:underline"
                    >
                      حذف دائم
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* مودال پیش‌نمایش پخش ویدیو */}
      {previewVideoUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewVideoUrl(null)}
        >
          <div
            className="relative bg-zinc-900 rounded-2xl max-w-2xl w-full p-4 overflow-hidden border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-sm text-white">پیش‌نمایش ویدیوی کسب‌وکار</h3>
              <button
                type="button"
                onClick={() => setPreviewVideoUrl(null)}
                className="text-white/60 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <video
              src={previewVideoUrl}
              controls
              autoPlay
              className="w-full rounded-xl max-h-[70vh] bg-black"
            />
          </div>
        </div>
      )}

      {/* مودال رد ویدیو و ثبت دلیل */}
      {rejectingVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setRejectingVideo(null)}
        >
          <div
            className="relative bg-zinc-900 rounded-2xl max-w-md w-full p-5 overflow-hidden border border-rose-500/30 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-rose-400">
                رد ویدیوی «{rejectingVideo.businessName}»
              </h3>
              <button
                type="button"
                onClick={() => setRejectingVideo(null)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs opacity-75">
              دلیل رد ویدیو را بنویسید تا در پنل کاربر به او اطلاع داده شود و بتواند ویدیوی اصلاح‌شده بارگذاری کند:
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="مثال: کیفیت صدا نامناسب است یا مدت زمان بیش از ۶۰ ثانیه است..."
              rows={4}
              className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-rose-500"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRejectingVideo(null)}
              >
                انصراف
              </Button>
              <Button
                size="sm"
                className="bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs"
                onClick={handleConfirmReject}
              >
                تأیید رد ویدیو
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
