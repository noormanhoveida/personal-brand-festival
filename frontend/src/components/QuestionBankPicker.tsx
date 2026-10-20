import { useEffect, useState } from "react";
import { BankQuestion, listQuestionBank } from "../api/traits";
import { Button, Input } from "./ui";

export function QuestionBankPicker({ onAttach }: { onAttach: (questionId: string) => Promise<void> }) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<BankQuestion[]>([]);
  const [attachingId, setAttachingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      listQuestionBank({ search: search || undefined }).then(setResults);
    }, 300);
    return () => clearTimeout(t);
  }, [search, open]);

  const handleAttach = async (id: string) => {
    setAttachingId(id);
    try {
      await onAttach(id);
      setResults((r) => r.filter((q) => q.id !== id));
    } finally {
      setAttachingId(null);
    }
  };

  if (!open) {
    return (
      <Button variant="ghost" onClick={() => setOpen(true)} className="text-xs">
        انتخاب از بانک سؤالات موقعیتی
      </Button>
    );
  }

  return (
    <div className="w-full rounded-lg border p-2" style={{ borderColor: "var(--surface)" }}>
      <div className="flex items-center gap-2">
        <Input
          placeholder="جست‌وجوی نام صفت..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-xs"
        />
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg px-2 py-1 text-xs opacity-60"
          style={{ backgroundColor: "var(--surface)" }}
        >
          بستن
        </button>
      </div>
      <div className="mt-2 max-h-48 space-y-1 overflow-y-auto">
        {results.map((q) => (
          <div
            key={q.id}
            className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-xs"
            style={{ backgroundColor: "var(--surface)" }}
          >
            <span>
              <span className="opacity-60">[{q.situation.title} · {q.trait.name}]</span> {q.text}
            </span>
            <Button onClick={() => handleAttach(q.id)} disabled={attachingId === q.id} className="shrink-0 px-2 py-1 text-xs">
              اضافه کن
            </Button>
          </div>
        ))}
        {results.length === 0 && (
          <p className="px-2 py-1 text-xs opacity-50">
            {search ? "چیزی پیدا نشد." : "برای جست‌وجو در بانک سؤالات تایپ کنید."}
          </p>
        )}
      </div>
    </div>
  );
}
