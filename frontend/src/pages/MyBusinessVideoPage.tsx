import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  getMyBusinessVideos,
  uploadBusinessVideo,
  createBusinessVideo,
  deleteBusinessVideo,
  BusinessVideo,
  BusinessCategory,
} from "../api/businessShowcase";

const CATEGORY_OPTIONS: { value: BusinessCategory; label: string }[] = [
  { value: "TECH", label: "فناوری و نرم‌افزار" },
  { value: "SERVICES", label: "خدمات کسب‌وکار و مشاوره" },
  { value: "EDUCATION", label: "آموزش و پژوهش" },
  { value: "RETAIL", label: "فروشگاه و خرده‌فروشی" },
  { value: "CREATIVE", label: "صنایع خلاق و هنر" },
  { value: "OTHER", label: "سایر حوزه‌ها" },
];

export function MyBusinessVideoPage() {
  const [videos, setVideos] = useState<BusinessVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // وضعیت‌های فرم ثبت
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [category, setCategory] = useState<BusinessCategory>("TECH");
  const [description, setDescription] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [telegramUrl, setTelegramUrl] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // مدیریت فایل ویدیو
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [durationSeconds, setDurationSeconds] = useState<number>(0);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyBusinessVideos();
      setVideos(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "خطا در دریافت لیست ویدیوها.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    setSelectedFile(null);
    setDurationSeconds(0);

    const file = e.target.files?.[0];
    if (!file) return;

    // بررسی حجم (حداکثر ۵۰ مگابایت)
    const MAX_BYTES = 50 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      setFileError("حجم فایل نباید بیشتر از ۵۰ مگابایت باشد.");
      return;
    }

    // بررسی نوع فایل
    const allowed = ["video/mp4", "video/webm", "video/quicktime"];
    if (!allowed.includes(file.type)) {
      setFileError("فرمت فایل باید MP4، WebM یا MOV باشد.");
      return;
    }

    // اندازه‌گیری زمان واقعی ویدیو در مرورگر قبل از آپلود
    const url = URL.createObjectURL(file);
    const tempVideo = document.createElement("video");
    tempVideo.preload = "metadata";
    tempVideo.src = url;

    tempVideo.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      if (fileInputRef.current?.files?.[0] !== file) return;

      const sec = tempVideo.duration;
      if (!Number.isFinite(sec) || sec <= 0) {
        setFileError("مدت ویدیو قابل تشخیص نیست. لطفاً فایل دیگری انتخاب کنید.");
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else if (sec > 60) {
        setFileError(`طول ویدیو ${sec.toFixed(1)} ثانیه است. حداکثر ۶۰ ثانیه مجاز است.`);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setDurationSeconds(sec);
        setSelectedFile(file);
      }
    };

    tempVideo.onerror = () => {
      URL.revokeObjectURL(url);
      if (fileInputRef.current?.files?.[0] !== file) return;
      setFileError("امکان تحلیل فایل ویدیویی وجود ندارد. لطفاً فایل سالمی را انتخاب کنید.");
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setFileError("لطفاً فایل ویدیو را انتخاب کنید.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccessMessage(null);

      // مرحله اول: آپلود فایل ویدیو
      const uploadRes = await uploadBusinessVideo(selectedFile);

      // مرحله دوم: ثبت اطلاعات در دیتابیس
      await createBusinessVideo({
        businessName: businessName.trim(),
        ownerName: ownerName.trim(),
        category,
        videoUrl: uploadRes.videoUrl,
        durationSeconds: Math.round(durationSeconds || 0),
        fileSizeBytes: uploadRes.fileSizeBytes || selectedFile.size,
        description: description.trim() || null,
        websiteUrl: websiteUrl.trim() || null,
        instagramUrl: instagramUrl.trim() || null,
        telegramUrl: telegramUrl.trim() || null,
        phoneNumber: phoneNumber.trim() || null,
      });

      setSuccessMessage("ویدیوی معرفی شما با موفقیت ثبت شد و پس از بررسی منتشر خواهد شد.");
      
      // پاکسازی فرم
      setBusinessName("");
      setOwnerName("");
      setDescription("");
      setWebsiteUrl("");
      setInstagramUrl("");
      setTelegramUrl("");
      setPhoneNumber("");
      setSelectedFile(null);
      setDurationSeconds(0);
      if (fileInputRef.current) fileInputRef.current.value = "";

      await fetchVideos();
    } catch (err: any) {
      setError(err?.response?.data?.message || "خطا در ثبت و ارسال ویدیو.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("آیا از حذف این ویدیو اطمینان دارید؟ این عمل غیرقابل بازگشت است.")) {
      return;
    }

    try {
      await deleteBusinessVideo(id);
      setVideos((prev) => prev.filter((v) => v.id !== id));
    } catch (err: any) {
      alert(err?.response?.data?.message || "خطا در حذف ویدیو.");
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">تأیید شده</span>;
      case "REJECTED":
        return <span className="rounded-full bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-400">رد شده</span>;
      case "PENDING":
      default:
        return <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-400">در انتظار بررسی</span>;
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-4 md:p-6" dir="rtl">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">معرفی ویدیویی کسب‌وکار</h1>
          <p className="mt-1 text-sm text-neutral-400">
            ویدیوی ۶۰ ثانیه‌ای خود را برای حضور در ویترین کسب‌وکارهای جشنواره بارگذاری و مدیریت کنید.
          </p>
        </div>
        <Link
          to="/business-showcase"
          target="_blank"
          className="inline-flex items-center gap-1.5 self-start rounded-xl border border-neutral-700 bg-neutral-800/80 px-4 py-2 text-xs font-medium text-neutral-200 transition hover:bg-neutral-700"
        >
          <span>مشاهده ویترین عمومی</span>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </Link>
      </div>

      {/* اعلان‌ها */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-400">
          {successMessage}
        </div>
      )}

      {/* فرم آپلود ویدیو */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur">
        <h2 className="text-lg font-bold text-white">ثبت معرفی جدید</h2>
        <p className="mt-1 text-xs text-neutral-400">
          شرایط ویدیو: حداکثر ۶۰ ثانیه، حداکثر ۵۰ مگابایت، فرمت MP4 یا WebM.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-neutral-300">
                نام کسب‌وکار یا استارتاپ <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={100}
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="مثلاً: سامانه هوشمند رادین"
                className="mt-1.5 w-full rounded-xl border border-neutral-700 bg-neutral-800/80 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300">
                نام صاحب یا ارائه‌دهنده کسب‌وکار <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={100}
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="مثلاً: علی رضایی"
                className="mt-1.5 w-full rounded-xl border border-neutral-700 bg-neutral-800/80 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300">
                حوزه فعالیت <span className="text-amber-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as BusinessCategory)}
                className="mt-1.5 w-full rounded-xl border border-neutral-700 bg-neutral-800/80 px-3.5 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-neutral-900">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300">
                فایل ویدیوی معرفی (حداکثر ۶۰ ثانیه) <span className="text-amber-500">*</span>
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={handleFileChange}
                required
                className="mt-1.5 block w-full text-xs text-neutral-400 file:ml-3 file:rounded-lg file:border-0 file:bg-amber-500/20 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-amber-400 hover:file:bg-amber-500/30"
              />
              {fileError && <p className="mt-1.5 text-xs text-red-400">{fileError}</p>}
              {durationSeconds > 0 && (
                <p className="mt-1.5 text-xs text-emerald-400">
                  مدت زمان ویدیو: {durationSeconds.toFixed(1)} ثانیه (مجاز)
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300">
              توضیح کوتاه درباره خدمات، محصول یا ارزش پیشنهادی
            </label>
            <textarea
              rows={3}
              maxLength={2000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="خلاصه‌ای از آنچه مخاطب با تماشای ویدیو و استفاده از خدمات شما به دست می‌آورد..."
              className="mt-1.5 w-full rounded-xl border border-neutral-700 bg-neutral-800/80 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-neutral-300">آدرس وب‌سایت</label>
              <input
                type="text"
                inputMode="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="www.pbfestival.ir یا https://pbfestival.ir"
                dir="ltr"
                className="mt-1.5 w-full rounded-xl border border-neutral-700 bg-neutral-800/80 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300">آیدی اینستاگرام</label>
              <input
                type="text"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="مثلاً business_page"
                dir="ltr"
                className="mt-1.5 w-full rounded-xl border border-neutral-700 bg-neutral-800/80 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300">کانال یا آیدی تلگرام</label>
              <input
                type="text"
                value={telegramUrl}
                onChange={(e) => setTelegramUrl(e.target.value)}
                placeholder="مثلاً @channel_id"
                dir="ltr"
                className="mt-1.5 w-full rounded-xl border border-neutral-700 bg-neutral-800/80 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !!fileError || !selectedFile}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-950 border-t-transparent" />
                  <span>در حال آپلود و ثبت...</span>
                </>
              ) : (
                "بارگذاری و ارسال ویدیو"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* لیست ویدیوهای ثبت‌شده */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">ویدیوهای ثبت‌شده شما</h2>

        {loading ? (
          <div className="p-8 text-center text-sm text-neutral-400">در حال بارگذاری اطلاعات...</div>
        ) : videos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-800 p-8 text-center text-sm text-neutral-500">
            شما هنوز هیچ ویدیویی برای ویترین کسب‌وکارها ارسال نکرده‌اید.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {videos.map((vid) => (
              <div
                key={vid.id}
                className="flex flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-white">{vid.businessName}</h3>
                      <p className="mt-0.5 text-xs text-neutral-400">{vid.ownerName}</p>
                    </div>
                    {renderStatusBadge(vid.status)}
                  </div>

                  <div className="mt-3 aspect-video w-full overflow-hidden rounded-xl bg-black">
                    <video
                      src={vid.videoUrl}
                      controls
                      preload="metadata"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {vid.description && (
                    <p className="mt-3 line-clamp-2 text-xs text-neutral-300">
                      {vid.description}
                    </p>
                  )}

                  <div className="mt-3 flex items-center gap-4 text-xs text-neutral-400">
                    <span>مدت: {vid.durationSeconds} ثانیه</span>
                    <span>بازدید: {vid.viewCount}</span>
                    <span>پسند: {vid.likeCount}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end border-t border-neutral-800/80 pt-3">
                  <button
                    onClick={() => handleDelete(vid.id)}
                    className="text-xs font-medium text-red-400 transition hover:text-red-300"
                  >
                    حذف ویدیو
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
