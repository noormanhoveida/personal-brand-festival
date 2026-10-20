import { useEffect, useState } from "react";
import { AdminParticipant, AdminUser, listParticipants, listUsers } from "../../api/admin";
import { assignEvaluator } from "../../api/evaluation";
import { Button, Card, LoadError, Spinner } from "../../components/ui";

export function AdminAssignmentsPage() {
  const [evaluators, setEvaluators] = useState<AdminUser[] | null>(null);
  const [participants, setParticipants] = useState<AdminParticipant[] | null>(null);
  const [selectedEvaluator, setSelectedEvaluator] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const reload = () => {
    setLoadError(null);
    Promise.all([listUsers("EVALUATOR"), listParticipants({})])
      .then(([e, p]) => {
        setEvaluators(e);
        setParticipants(p);
      })
      .catch(() => setLoadError("بارگذاری اطلاعات با خطا مواجه شد."));
  };

  useEffect(reload, []);

  const toggleParticipant = (id: string) => {
    setSelectedParticipants((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAssign = async () => {
    if (!selectedEvaluator || selectedParticipants.size === 0) return;
    setSaving(true);
    setDone(false);
    try {
      await Promise.all(
        [...selectedParticipants].map((pid) => assignEvaluator(selectedEvaluator, pid))
      );
      setSelectedParticipants(new Set());
      setDone(true);
      setTimeout(() => setDone(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  if (loadError) return <LoadError message={loadError} onRetry={reload} />;

  if (!evaluators || !participants) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">تخصیص ارزیاب</h1>
      <p className="mt-1 text-sm opacity-70">
        یک ارزیاب و یک یا چند شرکت‌کننده انتخاب کنید تا آن شرکت‌کنندگان در داشبورد آن
        ارزیاب قابل بررسی و امتیازدهی شوند.
      </p>

      {evaluators.length === 0 && (
        <p className="mt-4 text-sm" style={{ color: "#e0a63f" }}>
          هنوز هیچ کاربری نقش «ارزیاب» ندارد — اول از صفحه‌ی «کاربران» نقش یک کاربر را
          به ارزیاب تغییر دهید.
        </p>
      )}

      <Card className="mt-4">
        <label className="mb-1 block text-xs opacity-70">ارزیاب</label>
        <select
          className="w-full rounded-lg border px-3 py-2 text-sm"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--surface)", color: "var(--text)" }}
          value={selectedEvaluator}
          onChange={(e) => setSelectedEvaluator(e.target.value)}
        >
          <option value="">— انتخاب کنید —</option>
          {evaluators.map((e) => (
            <option key={e.id} value={e.id}>
              {e.participantProfile
                ? `${e.participantProfile.firstName} ${e.participantProfile.lastName}`
                : e.email}
            </option>
          ))}
        </select>

        <label className="mb-1 mt-4 block text-xs opacity-70">شرکت‌کنندگان</label>
        <div className="max-h-72 space-y-1 overflow-y-auto rounded-lg p-2" style={{ backgroundColor: "var(--surface)" }}>
          {participants.map((p) => (
            <label key={p.id} className="flex items-center gap-2 rounded px-2 py-1.5 text-sm">
              <input
                type="checkbox"
                checked={selectedParticipants.has(p.id)}
                onChange={() => toggleParticipant(p.id)}
              />
              {p.firstName} {p.lastName}
              <span className="opacity-50">— {p.city}</span>
            </label>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Button
            onClick={handleAssign}
            disabled={saving || !selectedEvaluator || selectedParticipants.size === 0}
          >
            {saving ? "در حال تخصیص..." : `تخصیص ${selectedParticipants.size || ""}`.trim()}
          </Button>
          {done && <span className="text-xs" style={{ color: "var(--accent)" }}>تخصیص داده شد ✓</span>}
        </div>
      </Card>
    </div>
  );
}
