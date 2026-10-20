import { AdminOverview, getOverview } from "../../api/admin";
import { useAsync } from "../../hooks/useAsync";
import { Card, LoadError, Spinner } from "../../components/ui";

const STAT_LABELS: { key: keyof AdminOverview; label: string }[] = [
  { key: "totalParticipants", label: "شرکت‌کنندگان" },
  { key: "totalBootcamps", label: "بوت‌کمپ‌ها / آکادمی" },
  { key: "submittedEvaluations", label: "ارزیابی‌های نهایی‌شده" },
  { key: "draftEvaluations", label: "ارزیابی‌های پیش‌نویس" },
  { key: "totalFeedback", label: "بازخوردهای دریافتی" },
  { key: "publishedPages", label: "صفحات منتشرشده" },
  { key: "regionCount", label: "مناطق" },
];

export function AdminOverviewPage() {
  const { data, error, loading, reload } = useAsync(() => getOverview());

  if (error) return <LoadError message={error} onRetry={reload} />;

  if (loading || !data) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">نمای کلی</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {STAT_LABELS.map((s) => (
          <Card key={s.key}>
            <div className="text-3xl font-bold" style={{ color: "var(--accent)" }}>
              {data[s.key]}
            </div>
            <div className="mt-1 text-sm opacity-70">{s.label}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
