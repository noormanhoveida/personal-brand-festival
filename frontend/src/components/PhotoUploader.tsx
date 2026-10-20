import { useEffect, useRef, useState } from "react";
import { MediaItem, MediaType, deleteMedia, listMyMedia, uploadMedia } from "../api/media";
import { Avatar } from "./Avatar";

const TYPE_LABEL: Record<MediaType, string> = {
  PROFILE_PORTRAIT: "پروفایل",
  HERO_PORTRAIT: "هیرو",
  PROFESSIONAL: "حرفه‌ای",
  LIFESTYLE: "لایف‌استایل",
  GALLERY: "گالری",
};

const TYPES: MediaType[] = ["PROFILE_PORTRAIT", "HERO_PORTRAIT", "PROFESSIONAL", "LIFESTYLE", "GALLERY"];

export function PhotoUploader({ firstName = "", lastName = "" }: { firstName?: string; lastName?: string }) {
  const [media, setMedia] = useState<MediaItem[] | null>(null);
  const [uploadType, setUploadType] = useState<MediaType>("PROFILE_PORTRAIT");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const reload = () => {
    listMyMedia().then(setMedia);
  };

  useEffect(reload, []);

  const handleFile = async (file: File) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("فقط تصاویر JPEG، PNG یا WebP مجاز است.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("حجم تصویر باید کمتر از ۸ مگابایت باشد.");
      return;
    }
    setError(null);
    setUploading(true);
    try {
      await uploadMedia(file, uploadType);
      reload();
    } catch {
      setError("آپلود با خطا مواجه شد.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    await deleteMedia(id);
    reload();
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        <Avatar
          url={media?.find((m) => m.type === "PROFILE_PORTRAIT")?.url}
          firstName={firstName}
          lastName={lastName}
          size={110}
        />
        <p className="text-xs opacity-60">
          این عکس («پروفایل») همان چیزی‌ست که کنار نامت در جاهای مختلف سایت (مثل جلسه‌ی زنده و
          صفحه‌ی عمومی‌ات) نشان داده می‌شود.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <select
          className="rounded-lg border px-2 py-1.5 text-xs"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--surface)", color: "var(--text)" }}
          value={uploadType}
          onChange={(e) => setUploadType(e.target.value as MediaType)}
        >
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {TYPE_LABEL[t]}
            </option>
          ))}
        </select>
        <label
          className="cursor-pointer rounded-full px-4 py-2 text-sm font-medium"
          style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
        >
          {uploading ? "در حال آپلود..." : "+ افزودن عکس"}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            disabled={uploading}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </label>
      </div>
      {error && <p className="mt-1 text-xs" style={{ color: "#e0705f" }}>{error}</p>}

      {media && media.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {media.map((m) => (
            <div key={m.id} className="group relative aspect-square overflow-hidden rounded-lg">
              <img src={m.url} alt={TYPE_LABEL[m.type]} className="h-full w-full object-cover" />
              <span
                className="absolute bottom-1 right-1 rounded px-1.5 py-0.5 text-[10px]"
                style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
              >
                {TYPE_LABEL[m.type]}
              </span>
              <button
                onClick={() => handleDelete(m.id)}
                className="absolute left-1 top-1 hidden rounded-full px-2 py-0.5 text-xs group-hover:block"
                style={{ backgroundColor: "var(--bg)", color: "#e0705f" }}
              >
                حذف
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
