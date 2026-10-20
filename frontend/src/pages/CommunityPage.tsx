import { Link } from "react-router-dom";
import { getDirectory } from "../api/community";
import { BrandMascot } from "../components/BrandMascot";
import { useAsync } from "../hooks/useAsync";
import { Card, LoadError, Spinner } from "../components/ui";

export function CommunityPage() {
  const { data: participants, error, loading, reload } = useAsync(() => getDirectory());

  if (error) return <LoadError message={error} onRetry={reload} />;

  if (loading || !participants) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 md:px-12">
      <h1 className="text-3xl font-bold" style={{ color: "var(--accent)" }}>
        اعضای فستیوال
      </h1>
      <p className="mt-2 opacity-70">
        همه‌ی شرکت‌کنندگانی که صفحه‌ی عمومی‌شان را منتشر کرده‌اند. روی هرکس کلیک کنید تا
        صفحه‌اش را ببینید و بازخورد یا تأییدیه‌ی مهارت برایش بگذارید — نیازی به لینک
        خصوصی نیست.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {participants.map((p) => (
          <Link key={p.slug} to={`/p/${p.slug}`}>
            <Card className="flex h-full flex-col items-center text-center transition-transform hover:-translate-y-1">
              {p.photoUrl ? (
                <img src={p.photoUrl} alt="" className="h-20 w-20 rounded-full object-cover" />
              ) : (
                <div className="w-16">
                  <BrandMascot />
                </div>
              )}
              <div className="mt-3 text-sm font-medium">{p.fullName}</div>
              <div className="mt-1 text-xs opacity-60">
                {p.city}
                {p.professionalField && ` · ${p.professionalField}`}
              </div>
            </Card>
          </Link>
        ))}
        {participants.length === 0 && (
          <p className="col-span-full text-sm opacity-60">
            هنوز کسی صفحه‌ی عمومی‌اش را منتشر نکرده است.
          </p>
        )}
      </div>
    </div>
  );
}
