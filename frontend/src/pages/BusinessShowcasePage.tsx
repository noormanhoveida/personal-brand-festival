import { useEffect, useState } from "react";
import {
  BusinessVideoList,
  getPublicBusinessVideos,
} from "../api/businessShowcase";
import { Card, LoadError, Spinner } from "../components/ui";

const categories = [
  { value: "", label: "همهٔ دسته‌ها" },
  { value: "TECH", label: "فناوری" },
  { value: "SERVICES", label: "خدمات کسب‌وکار" },
  { value: "EDUCATION", label: "آموزش" },
  { value: "RETAIL", label: "خرده‌فروشی" },
  { value: "CREATIVE", label: "صنایع خلاق" },
  { value: "OTHER", label: "سایر" },
];

export function BusinessShowcasePage() {
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [retry, setRetry] = useState(0);
  const [data, setData] = useState<BusinessVideoList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    getPublicBusinessVideos({ category: category || undefined, page, limit: 12 })
      .then((result) => {
        if (active) setData(result);
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(
            cause instanceof Error
              ? cause.message
              : "دریافت ویدیوها با خطا روبه‌رو شد.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [category, page, retry]);

  return (
    <main className="hero-glow mx-auto max-w-5xl px-6 py-16 md:px-12">
      <h1 className="text-3xl font-bold" style={{ color: "var(--accent)" }}>
        ویترین کسب‌وکارها
      </h1>
      <p className="mt-2 opacity-70">
        ویدیوهای معرفی کسب‌وکارهایی که بررسی و تأیید شده‌اند.
      </p>

      <div className="mt-8">
        <label htmlFor="business-category" className="mb-2 block text-sm">
          دسته‌بندی
        </label>
        <select
          id="business-category"
          className="rounded-lg border px-3 py-2 text-sm"
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);
            setPage(1);
          }}
        >
          {categories.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <div className="mt-8">
          <LoadError message={error} onRetry={() => setRetry((value) => value + 1)} />
        </div>
      ) : loading || !data ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : data.items.length === 0 ? (
        <p className="mt-10 text-sm opacity-70">
          هنوز ویدیوی تأییدشده‌ای در این دسته ثبت نشده است.
        </p>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((video) => (
              <Card key={video.id} className="glass h-full">
                <video
                  className="aspect-video w-full rounded-lg bg-black"
                  src={video.videoUrl}
                  poster={video.thumbnailUrl || undefined}
                  controls
                  preload="none"
                  playsInline
                  aria-label={`ویدیوی معرفی ${video.businessName}`}
                >
                  مرورگر شما امکان پخش این ویدیو را ندارد.
                </video>
                <h2 className="mt-3 text-lg font-semibold">{video.businessName}</h2>
                <p className="mt-1 text-sm opacity-70">
                  {video.ownerName} ·{" "}
                  {categories.find((item) => item.value === video.category)?.label ??
                    video.category}
                </p>
                {video.description && (
                  <p className="mt-3 text-sm opacity-80">{video.description}</p>
                )}
              </Card>
            ))}
          </div>

          {data.pagination.totalPages > 1 && (
            <nav
              className="mt-8 flex items-center justify-center gap-4"
              aria-label="صفحه‌بندی ویدیوها"
            >
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((value) => value - 1)}
                className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
              >
                قبلی
              </button>
              <span className="text-sm">
                صفحهٔ {page.toLocaleString("fa-IR")} از{" "}
                {data.pagination.totalPages.toLocaleString("fa-IR")}
              </span>
              <button
                type="button"
                disabled={page >= data.pagination.totalPages}
                onClick={() => setPage((value) => value + 1)}
                className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
              >
                بعدی
              </button>
            </nav>
          )}
        </>
      )}
    </main>
  );
}
