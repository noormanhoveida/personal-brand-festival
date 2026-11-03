import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Spinner } from "../components/ui";
import { FormattedContent } from "../components/FormattedContent";
import { getPublicSponsorBySlug } from "../api/sponsor";

export function SponsorDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [sponsor, setSponsor] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getPublicSponsorBySlug(slug)
      .then((data) => setSponsor(data || null))
      .catch(() => setSponsor(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl py-24 text-center">
        <Spinner />
        <p className="mt-3 text-sm opacity-60">در حال دریافت اطلاعات حامی...</p>
      </div>
    );
  }

  if (!sponsor) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <h2 className="text-xl font-bold">حامی مورد نظر یافت نشد</h2>
        <p className="mt-2 text-sm opacity-60">ممکن است صفحه حذف شده یا آدرس اشتباه باشد.</p>
        <Link to="/dashboard" className="mt-4 inline-block text-sm" style={{ color: "var(--accent)" }}>
          ← بازگشت به جشنواره
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-12">
      <Link to="/dashboard" className="text-sm opacity-70 hover:opacity-100">
        ← بازگشت به جشنواره
      </Link>

      {sponsor.coverImageUrl && (
        <div className="relative aspect-video sm:aspect-[21/9] w-full overflow-hidden rounded-2xl shadow-lg border border-opacity-10" style={{ borderColor: "var(--surface)" }}>
          <img
            src={sponsor.coverImageUrl}
            alt={sponsor.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-[var(--accent)] font-semibold">حامی رسمی جشنواره</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{sponsor.name}</h1>
              {sponsor.tagline && <p className="text-sm text-gray-200 mt-1">{sponsor.tagline}</p>}
            </div>
          </div>
        </div>
      )}

      {sponsor.fullDescription && (
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">درباره {sponsor.name}</h2>
          <FormattedContent content={sponsor.fullDescription} />
        </Card>
      )}

      {(sponsor.websiteUrl || sponsor.instagramUrl || sponsor.linkedinUrl || sponsor.telegramUrl || sponsor.externalLinkUrl) && (
        <Card className="p-6">
          <h3 className="text-base font-bold mb-3">راه‌های ارتباطی و پیوندها</h3>
          <div className="flex flex-wrap gap-3">
            {sponsor.websiteUrl && (
              <a href={sponsor.websiteUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg bg-[var(--surface-variant)] text-sm hover:opacity-80 transition-opacity">
                🌐 وب‌سایت رسمی
              </a>
            )}
            {sponsor.instagramUrl && (
              <a href={sponsor.instagramUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg bg-[var(--surface-variant)] text-sm hover:opacity-80 transition-opacity">
                📷 اینستاگرام
              </a>
            )}
            {sponsor.linkedinUrl && (
              <a href={sponsor.linkedinUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg bg-[var(--surface-variant)] text-sm hover:opacity-80 transition-opacity">
                💼 لینکدین
              </a>
            )}
            {sponsor.telegramUrl && (
              <a href={sponsor.telegramUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg bg-[var(--surface-variant)] text-sm hover:opacity-80 transition-opacity">
                ✈️ تلگرام
              </a>
            )}
            {sponsor.externalLinkUrl && (
              <a href={sponsor.externalLinkUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                🔗 {sponsor.externalLinkLabel || "مشاهده پیوند"}
              </a>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
