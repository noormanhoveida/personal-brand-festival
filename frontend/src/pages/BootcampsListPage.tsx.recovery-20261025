import { FormattedContent } from "../components/FormattedContent";
import { Link } from "react-router-dom";
import { Bootcamp, listBootcamps } from "../api/bootcamps";
import { useAsync } from "../hooks/useAsync";
import { Card, LoadError, Spinner } from "../components/ui";
import { BrandMascot } from "../components/BrandMascot";

const STATUS_LABEL: Record<Bootcamp["status"], string> = {
  LOCKED: "قفل‌شده",
  COMING_SOON: "به‌زودی",
  ACTIVE: "فعال",
  DEADLINE_APPROACHING: "مهلت رو به پایان",
  SUBMITTED: "ثبت‌شده",
  COMPLETED: "تکمیل‌شده",
};

const STATUS_COLOR: Record<Bootcamp["status"], string> = {
  LOCKED: "#6b7280",
  COMING_SOON: "#8b8b8b",
  ACTIVE: "var(--accent)",
  DEADLINE_APPROACHING: "#e0a63f",
  SUBMITTED: "#4fbf8f",
  COMPLETED: "#4fbf8f",
};

export function BootcampsListPage() {
  const { data: bootcamps, error, loading, reload } = useAsync(() => listBootcamps());

  if (error) return <LoadError message={error} onRetry={reload} />;

  if (loading || !bootcamps) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">بوت‌کمپ‌ها / آکادمی</h1>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {bootcamps.map((b) => (
          <Link key={b.id} to={`/dashboard/bootcamps/${b.id}`}>
            <Card className="glass flex h-full flex-col overflow-hidden p-0 transition-transform hover:-translate-y-1">
              <div className="relative h-36 w-full">
                {b.teaserVideoUrl ? (
                  <video
                    src={b.teaserVideoUrl}
                    poster={b.coverImageUrl ?? undefined}
                    className="h-full w-full object-cover"
                    muted
                    loop
                    playsInline
                    onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                    onMouseLeave={(e) => e.currentTarget.pause()}
                  />
                ) : b.coverImageUrl ? (
                  <img src={b.coverImageUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center" style={{ backgroundColor: "var(--surface)" }}>
                    <div className="w-14">
                      <BrandMascot />
                    </div>
                  </div>
                )}
                <span
                  className="absolute top-2 right-2 rounded-full px-3 py-1 text-xs font-medium"
                  style={{ backgroundColor: "var(--bg)", color: STATUS_COLOR[b.status] }}
                >
                  {STATUS_LABEL[b.status]}
                </span>
                {b.teaserVideoUrl && (
                  <span
                    className="absolute bottom-2 left-2 rounded-full px-2 py-0.5 text-[10px]"
                    style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
                  >
                    ▶ تیزر
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="font-semibold">{b.title}</div>
                {b.description && (
                <FormattedContent content={b.description} className="mt-1 text-xs opacity-70 line-clamp-2" />
              )}
                <div className="mt-auto pt-2 text-xs opacity-60">
                  {new Date(b.date).toLocaleDateString("fa-IR")}
                  {b.journeySection && ` · ${b.journeySection.title}`}
                  {b.instructor && ` · مربی: ${b.instructor}`}
                </div>
              </div>
            </Card>
          </Link>
        ))}
        {bootcamps.length === 0 && (
          <p className="text-sm opacity-60">هنوز بوت‌کمپی تعریف نشده است.</p>
        )}
      </div>
    </div>
  );
}
