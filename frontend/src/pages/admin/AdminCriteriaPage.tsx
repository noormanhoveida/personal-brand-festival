import { useState } from "react";
import { createCriterion, listCriteria, updateCriterion } from "../../api/evaluation";
import { useAsync } from "../../hooks/useAsync";
import { Button, Card, ErrorText, Input, Label, LoadError, Spinner } from "../../components/ui";

export function AdminCriteriaPage() {
  const { data: criteria, error: loadError, loading, reload } = useAsync(() => listCriteria());
  const [key, setKey] = useState("");
  const [title, setTitle] = useState("");
  const [weight, setWeight] = useState(0.1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalWeight = criteria?.reduce((sum, c) => sum + c.weight, 0) ?? 0;

  const handleCreate = async () => {
    if (!key.trim() || !title.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await createCriterion({ key: key.trim(), title: title.trim(), weight });
      setKey("");
      setTitle("");
      setWeight(0.1);
      reload();
    } catch {
      setError("ساخت معیار با خطا مواجه شد — شاید این کلید قبلاً استفاده شده.");
    } finally {
      setSaving(false);
    }
  };

  const handleWeightChange = async (id: string, newWeight: number) => {
    await updateCriterion(id, newWeight);
    reload();
  };

  if (loadError) return <LoadError message={loadError} onRetry={reload} />;

  if (loading || !criteria) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">معیارهای ارزیابی</h1>
      <p className="mt-1 text-sm opacity-70">
        هر معیار یک سهم (وزن) از امتیاز نهایی دارد. مجموع وزن‌ها ایده‌آل است که ۱٫۰
        (۱۰۰٪) باشد.
      </p>
      <p
        className="mt-2 text-sm font-medium"
        style={{ color: Math.abs(totalWeight - 1) < 0.01 ? "var(--accent)" : "#e0a63f" }}
      >
        مجموع فعلی وزن‌ها: {Math.round(totalWeight * 100)}٪
      </p>

      <div className="mt-4 space-y-2">
        {criteria.map((c) => (
          <Card key={c.id} className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-medium">{c.title}</div>
              {c.description && <div className="text-xs opacity-60">{c.description}</div>}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={1}
                step={0.05}
                value={c.weight}
                onChange={(e) => handleWeightChange(c.id, Number(e.target.value))}
                className="w-20 rounded-lg border px-2 py-1.5 text-sm"
                style={{ backgroundColor: "var(--surface)", borderColor: "var(--surface)", color: "var(--text)" }}
              />
              <span className="text-xs opacity-60">({Math.round(c.weight * 100)}٪)</span>
            </div>
          </Card>
        ))}
        {criteria.length === 0 && (
          <p className="text-sm opacity-60">هنوز معیاری تعریف نشده است.</p>
        )}
      </div>

      <Card className="mt-6">
        <h2 className="mb-3 text-sm font-semibold">معیار جدید</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <Label>کلید (انگلیسی، یکتا)</Label>
            <Input value={key} onChange={(e) => setKey(e.target.value)} placeholder="e.g. networking" />
          </div>
          <div>
            <Label>عنوان</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label>وزن (۰ تا ۱)</Label>
            <Input
              type="number"
              min={0}
              max={1}
              step={0.05}
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
            />
          </div>
        </div>
        <ErrorText>{error}</ErrorText>
        <Button className="mt-3" onClick={handleCreate} disabled={saving || !key.trim() || !title.trim()}>
          {saving ? "در حال ساخت..." : "افزودن معیار"}
        </Button>
      </Card>
    </div>
  );
}
