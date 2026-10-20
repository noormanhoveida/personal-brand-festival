import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { Skill, addSkill, deleteSkill, listMySkills } from "../api/skills";
import { Button, Card, Input } from "./ui";

export function SkillsManager() {
  const [skills, setSkills] = useState<Skill[] | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = () => {
    listMySkills().then(setSkills);
  };

  useEffect(reload, []);

  const handleAdd = async () => {
    if (!name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await addSkill(name.trim());
      setName("");
      reload();
    } catch (err) {
      // Show the backend's actual message (e.g. real duplicate vs a
      // migration/DB issue) instead of guessing — a vague catch-all
      // here previously made every failure look like a duplicate.
      const message =
        (err as AxiosError<{ message?: string }>).response?.data?.message ??
        "ثبت مهارت با خطا مواجه شد.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteSkill(id);
    reload();
  };

  return (
    <Card>
      <h2 className="mb-1 text-sm font-semibold">مهارت‌ها</h2>
      <p className="mb-3 text-xs opacity-60">
        مهارتی که ادعا می‌کنید را اضافه کنید — دوستان و همکارانتان می‌توانند از طریق
        صفحه‌ی عمومی شما آن را تأیید یا رد کنند.
      </p>

      <div className="flex gap-2">
        <Input
          placeholder="مثلاً: اکسل"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <Button onClick={handleAdd} disabled={saving || !name.trim()}>
          افزودن
        </Button>
      </div>
      {error && <p className="mt-1 text-xs" style={{ color: "#e0705f" }}>{error}</p>}

      <div className="mt-4 space-y-2">
        {skills?.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between rounded-lg px-3 py-2 text-sm"
            style={{ backgroundColor: "var(--surface)" }}
          >
            <span>{s.name}</span>
            <div className="flex items-center gap-3">
              <span style={{ color: "var(--accent)" }}>✓ {s.endorseCount}</span>
              <span className="opacity-60">✕ {s.rejectCount}</span>
              <button onClick={() => handleDelete(s.id)} className="text-xs opacity-50 hover:opacity-100">
                حذف
              </button>
            </div>
          </div>
        ))}
        {skills?.length === 0 && (
          <p className="text-xs opacity-60">هنوز مهارتی اضافه نکرده‌اید.</p>
        )}
      </div>
    </Card>
  );
}
