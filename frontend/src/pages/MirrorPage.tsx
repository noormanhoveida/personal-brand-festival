import { useEffect, useState } from "react";
import {
  FeedbackAnswers,
  FeedbackRequestItem,
  ReceivedFeedbackItem,
  createFeedbackRequest,
  listMyFeedback,
} from "../api/feedback";
import { Button, Card, Spinner } from "../components/ui";

const QUESTIONS: { key: keyof FeedbackAnswers; label: string }[] = [
  { key: "q1", label: "این فرد را در چهار کلمه توصیف کنید." },
  { key: "q2", label: "بزرگ‌ترین نقطه قوت این فرد چیست؟" },
  { key: "q3", label: "این فرد در چه چیزی از دیگران متمایز است؟" },
  { key: "q4", label: "این فرد را چگونه به یک نفر دیگر معرفی می‌کنید؟" },
  { key: "q5", label: "این فرد در چه زمینه‌ای می‌تواند بسیار موفق باشد؟" },
  { key: "q6", label: "چه هویت حرفه‌ای را با این فرد مرتبط می‌دانید؟" },
];

export function MirrorPage() {
  const [requests, setRequests] = useState<FeedbackRequestItem[]>([]);
  const [received, setReceived] = useState<ReceivedFeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const reload = () => {
    listMyFeedback()
      .then((data) => {
        setRequests(data?.requests || []);
        setReceived(data?.received || []);
      })
      .catch(() => {
        setRequests([]);
        setReceived([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    reload();
  }, []);

  const handleCreate = async () => {
    setCreating(true);
    try {
      await createFeedbackRequest();
      reload();
    } catch (e) {
      console.error(e);
    } finally {
      setCreating(false);
    }
  };

  const copyLink = (token: string) => {
    const url = `${window.location.origin}/feedback/${token}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">آینه من</h1>
      <p className="mt-1 text-sm opacity-70">
        از دوستان، همکاران یا استادان خود بخواهید شما را ببینند — نه آن‌طور که خودتان
        فکر می‌کنید، بلکه آن‌طور که آن‌ها می‌بینند.
      </p>

      <Card className="mt-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">لینک‌های بازخورد شما</p>
          <Button onClick={handleCreate} disabled={creating}>
            {creating ? "در حال ساخت..." : "+ ساخت لینک جدید"}
          </Button>
        </div>

        <div className="mt-4 space-y-2">
          {(requests || []).map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm"
              style={{ backgroundColor: "var(--surface)" }}
            >
              <span className="opacity-70">
                {(r.responses?.length || 0)} پاسخ دریافت شده — {r.createdAt ? new Date(r.createdAt).toLocaleDateString("fa-IR") : ""}
              </span>
              <button
                onClick={() => copyLink(r.linkToken)}
                className="text-xs"
                style={{ color: "var(--accent)" }}
              >
                {copiedToken === r.linkToken ? "کپی شد ✓" : "کپی لینک"}
              </button>
            </div>
          ))}
          {(!requests || requests.length === 0) && (
            <p className="text-sm opacity-60">هنوز لینکی نساخته‌اید.</p>
          )}
        </div>
      </Card>

      <h2 className="mt-8 text-lg font-semibold">بازخوردهای دریافتی</h2>
      <div className="mt-3 space-y-3">
        {(received || []).map((r) => (
          <Card key={r.id}>
            <div className="flex justify-between text-xs opacity-60">
              <span>{r.authorName ?? "ناشناس"}</span>
              <span>{r.createdAt ? new Date(r.createdAt).toLocaleDateString("fa-IR") : ""}</span>
            </div>
            <dl className="mt-3 space-y-2">
              {QUESTIONS.map((q) => (
                <div key={q.key}>
                  <dt className="text-xs opacity-60">{q.label}</dt>
                  <dd className="text-sm">
                    {r.answers ? (r.answers as Record<string, any>)[q.key] || "-" : "-"}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>
        ))}
        {(!received || received.length === 0) && (
          <p className="text-sm opacity-60">هنوز بازخوردی دریافت نکرده‌اید.</p>
        )}
      </div>
    </div>
  );
}
