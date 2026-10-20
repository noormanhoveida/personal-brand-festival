import { useEffect, useState } from "react";
import { Region, listParticipants, listRegions } from "../../api/admin";
import { AdminParticipant } from "../../api/admin";
import { Card, Input, LoadError, Spinner } from "../../components/ui";

export function AdminParticipantsPage() {
  const [participants, setParticipants] = useState<AdminParticipant[] | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [search, setSearch] = useState("");
  const [regionId, setRegionId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    listRegions()
      .then(setRegions)
      .catch(() => {
        /* region filter is a non-essential enhancement; fail silently */
      });
  }, []);

  useEffect(() => {
    setError(null);
    const t = setTimeout(() => {
      listParticipants({ search: search || undefined, regionId: regionId || undefined })
        .then(setParticipants)
        .catch(() => setError("بارگذاری شرکت‌کنندگان با خطا مواجه شد."));
    }, 300);
    return () => clearTimeout(t);
  }, [search, regionId, reloadKey]);

  return (
    <div>
      <h1 className="text-2xl font-bold">شرکت‌کنندگان</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        <Input
          placeholder="جست‌وجو (نام، شهر)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <select
          className="rounded-lg border px-3 py-2 text-sm"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--surface)", color: "var(--text)" }}
          value={regionId}
          onChange={(e) => setRegionId(e.target.value)}
        >
          <option value="">همه مناطق</option>
          {regions.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <LoadError message={error} onRetry={() => setReloadKey((k) => k + 1)} />
      ) : !participants ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {participants.map((p) => (
            <Card key={p.id} className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium">
                  {((p.firstName || p.lastName) ? `${p.firstName || ""} ${p.lastName || ""}`.trim() : (p.fullName || "کاربر بدون نام"))}
                </div>
                <div className="text-xs opacity-60">
                  {p.city} {p.region && `· ${p.region}`} · {p.responseCount} پاسخ
                </div>
              </div>
              {p.latestScore !== null && (
                <span className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
                  {p.latestScore.toFixed(1)}
                </span>
              )}
            </Card>
          ))}
          {participants.length === 0 && (
            <p className="text-sm opacity-60">موردی یافت نشد.</p>
          )}
        </div>
      )}
    </div>
  );
}
