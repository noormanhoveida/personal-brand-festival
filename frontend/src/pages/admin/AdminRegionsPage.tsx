import { useState } from "react";
import { createRegion, listRegions } from "../../api/admin";
import { useAsync } from "../../hooks/useAsync";
import { Button, Card, Input, LoadError, Spinner } from "../../components/ui";

export function AdminRegionsPage() {
  const { data: regions, error, loading, reload } = useAsync(() => listRegions());
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const add = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await createRegion(name.trim());
      setName("");
      reload();
    } finally {
      setSaving(false);
    }
  };

  if (error) return <LoadError message={error} onRetry={reload} />;

  if (loading || !regions) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-bold">مناطق</h1>

      <Card className="mt-4 flex gap-2">
        <Input placeholder="نام منطقه (مثلاً تهران)" value={name} onChange={(e) => setName(e.target.value)} />
        <Button onClick={add} disabled={saving || !name.trim()}>
          افزودن
        </Button>
      </Card>

      <div className="mt-4 space-y-2">
        {regions.map((r) => (
          <Card key={r.id} className="py-3 text-sm">
            {r.name}
          </Card>
        ))}
      </div>
    </div>
  );
}
