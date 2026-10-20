import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  AnalyticsOverview,
  BootcampEffectiveness,
  CriterionBreakdown,
  RegionalBreakdown,
  getBootcampEffectiveness,
  getCriteriaBreakdown,
  getOverview,
  getRegionalBreakdown,
} from "../../api/analytics";
import { Criterion, createCriterion, listCriteria, updateCriterion } from "../../api/evaluation";
import { Button, Card, Input, LoadError, Spinner } from "../../components/ui";

function CriteriaManager() {
  const [criteria, setCriteria] = useState<Criterion[] | null>(null);
  const [newKey, setNewKey] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newWeight, setNewWeight] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const reload = () => {
    setLoadError(null);
    listCriteria()
      .then(setCriteria)
      .catch(() => setLoadError("بارگذاری معیارها با خطا مواجه شد."));
  };
  useEffect(reload, []);

  const totalWeight = (criteria ?? []).reduce((sum, c) => sum + c.weight, 0);

  const handleWeightChange = async (id: string, weight: number) => {
    await updateCriterion(id, weight);
    reload();
  };

  const handleAdd = async () => {
    if (!newKey.trim() || !newTitle.trim() || !newWeight) return;
    setSaving(true);
    try {
      await createCriterion({ key: newKey.trim(), title: newTitle.trim(), weight: Number(newWeight) });
      setNewKey("");
      setNewTitle("");
      setNewWeight("");
      reload();
    } finally {
      setSaving(false);
    }
  };

  if (loadError) return <LoadError message={loadError} onRetry={reload} />;

  if (!criteria) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">معیارهای ارزیابی و وزن هرکدام</h2>
        <span
          className="text-xs"
          style={{ color: Math.abs(totalWeight - 1) < 0.01 ? "var(--accent)" : "#e0a63f" }}
        >
          مجموع وزن‌ها: {Math.round(totalWeight * 100)}٪
        </span>
      </div>

      <div className="mt-3 space-y-2">
        {criteria.map((c) => (
          <div key={c.id} className="flex items-center gap-3 text-sm">
            <span className="flex-1">{c.title}</span>
            <input
              type="number"
              min={0}
              max={1}
              step={0.05}
              value={c.weight}
              onChange={(e) => handleWeightChange(c.id, Number(e.target.value))}
              className="w-20 rounded-lg border px-2 py-1 text-xs"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--surface)", color: "var(--text)" }}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4" style={{ borderColor: "var(--surface)" }}>
        <Input placeholder="کلید (لاتین)" className="w-32" value={newKey} onChange={(e) => setNewKey(e.target.value)} />
        <Input placeholder="عنوان معیار" className="flex-1" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
        <Input
          placeholder="وزن (۰ تا ۱)"
          className="w-24"
          value={newWeight}
          onChange={(e) => setNewWeight(e.target.value)}
        />
        <Button onClick={handleAdd} disabled={saving}>
          + افزودن معیار
        </Button>
      </div>
    </Card>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <h2 className="mb-4 text-sm font-semibold">{title}</h2>
      <div style={{ height: 260 }}>{children}</div>
    </Card>
  );
}

export function AdminAnalyticsPage() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [bootcamps, setBootcamps] = useState<BootcampEffectiveness[] | null>(null);
  const [criteria, setCriteria] = useState<CriterionBreakdown[] | null>(null);
  const [regions, setRegions] = useState<RegionalBreakdown[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const reload = () => {
    setLoadError(null);
    Promise.all([
      getOverview(),
      getBootcampEffectiveness(),
      getCriteriaBreakdown(),
      getRegionalBreakdown(),
    ])
      .then(([o, b, c, r]) => {
        setOverview(o);
        setBootcamps(b);
        setCriteria(c);
        setRegions(r);
      })
      .catch(() => setLoadError("بارگذاری آنالیتیکس با خطا مواجه شد."));
  };

  useEffect(reload, []);

  if (loadError) return <LoadError message={loadError} onRetry={reload} />;

  if (!overview || !bootcamps || !criteria || !regions) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#c9a24b";
  const gridColor = "rgba(255,255,255,0.08)";
  const tickStyle = { fill: "currentColor", fontSize: 12, opacity: 0.7 };

  return (
    <div>
      <h1 className="text-2xl font-bold">آنالیتیکس</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card><div className="text-2xl font-bold" style={{ color: "var(--accent)" }}>{overview.totalParticipants}</div><div className="text-xs opacity-60">شرکت‌کننده</div></Card>
        <Card><div className="text-2xl font-bold" style={{ color: "var(--accent)" }}>{Math.round(overview.onboardingCompletionRate * 100)}٪</div><div className="text-xs opacity-60">تکمیل onboarding</div></Card>
        <Card><div className="text-2xl font-bold" style={{ color: "var(--accent)" }}>{overview.submittedEvaluations}</div><div className="text-xs opacity-60">ارزیابی نهایی</div></Card>
        <Card><div className="text-2xl font-bold" style={{ color: "var(--accent)" }}>{overview.totalBootcamps}</div><div className="text-xs opacity-60">بوت‌کمپ</div></Card>
      </div>

      <div className="mt-6">
        <CriteriaManager />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="نرخ پیگیری بوت‌کمپ‌ها (قبل → بعد)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bootcamps.map((b) => ({ name: b.title, نرخ: Math.round(b.followThroughRate * 100) }))}>
              <CartesianGrid stroke={gridColor} vertical={false} />
              <XAxis dataKey="name" tick={tickStyle} />
              <YAxis tick={tickStyle} unit="٪" />
              <Tooltip contentStyle={{ direction: "rtl" }} />
              <Bar dataKey="نرخ" fill={accent} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="میانگین امتیاز هر معیار ارزیابی">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={criteria.map((c) => ({ name: c.title, امتیاز: Math.round(c.averageScore) }))} layout="vertical">
              <CartesianGrid stroke={gridColor} horizontal={false} />
              <XAxis type="number" tick={tickStyle} />
              <YAxis type="category" dataKey="name" tick={tickStyle} width={110} />
              <Tooltip contentStyle={{ direction: "rtl" }} />
              <Bar dataKey="امتیاز" fill={accent} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="مشارکت به تفکیک منطقه">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regions.map((r) => ({ name: r.name, نفر: r.participantCount }))}>
              <CartesianGrid stroke={gridColor} vertical={false} />
              <XAxis dataKey="name" tick={tickStyle} />
              <YAxis tick={tickStyle} />
              <Tooltip contentStyle={{ direction: "rtl" }} />
              <Bar dataKey="نفر" fill={accent} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
