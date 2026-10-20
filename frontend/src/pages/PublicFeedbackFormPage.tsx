import { RichTextEditor } from "../components/RichTextEditor";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { FeedbackAnswers, getLinkInfo, submitFeedback } from "../api/feedback";
import { endorseTagsForSlug } from "../api/skills";
import { TagPicker } from "../components/TagPicker";
import { Button, Card, ErrorText, Input, Label, Spinner, Textarea } from "../components/ui";

const QUESTIONS: { key: keyof FeedbackAnswers; label: string }[] = [
  { key: "q1", label: "این فرد را در چهار کلمه توصیف کنید." },
  { key: "q2", label: "بزرگ‌ترین نقطه قوت این فرد چیست؟" },
  { key: "q3", label: "فکر می‌کنید این فرد در چه چیزی از دیگران متمایز است؟" },
  { key: "q4", label: "اگر بخواهید این فرد را به یک نفر دیگر معرفی کنید، چگونه او را توصیف می‌کنید؟" },
  { key: "q5", label: "فکر می‌کنید این فرد در چه زمینه‌ای می‌تواند بسیار موفق باشد؟" },
  { key: "q6", label: "چه هویت حرفه‌ای را با این فرد مرتبط می‌دانید؟" },
];

export function PublicFeedbackFormPage() {
  const { token } = useParams<{ token: string }>();
  const [requester, setRequester] = useState<{ firstName: string; lastName: string; slug: string } | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [authorName, setAuthorName] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [answers, setAnswers] = useState<FeedbackAnswers>({
    q1: "", q2: "", q3: "", q4: "", q5: "", q6: "",
  });
  const [tags, setTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) return;
    getLinkInfo(token)
      .then(setRequester)
      .catch((err: AxiosError<{ message?: string }>) => {
        setLinkError(err.response?.data?.message ?? "این لینک معتبر نیست.");
      });
  }, [token]);

  const setAnswer = (key: keyof FeedbackAnswers, value: string) =>
    setAnswers((a) => ({ ...a, [key]: value }));

  const handleSubmit = async () => {
    if (!token || !requester) return;
    setSubmitting(true);
    setError(null);
    try {
      if (Object.values(answers).some((v) => v.trim())) {
        await submitFeedback({
          linkToken: token,
          authorName: anonymous ? undefined : authorName || undefined,
          answers,
          anonymous,
        });
      }
      if (tags.length > 0) {
        await endorseTagsForSlug(requester.slug, tags, anonymous ? undefined : authorName || undefined);
      }
      setDone(true);
    } catch (err) {
      setError(
        (err as AxiosError<{ message?: string }>).response?.data?.message ??
          "ثبت بازخورد با خطا مواجه شد."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (linkError) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">لینک نامعتبر</h1>
        <p className="mt-2 opacity-70">{linkError}</p>
      </div>
    );
  }

  if (!requester) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">سپاسگزاریم 🙏</h1>
        <p className="mt-2 opacity-70">بازخورد شما با موفقیت ثبت شد.</p>
      </div>
    );
  }

  const hasContent = Object.values(answers).some((v) => v.trim()) || tags.length > 0;

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-bold">آینه من</h1>
      <p className="mt-1 text-sm opacity-70">
        {requester.firstName} {requester.lastName} از شما خواسته دیدگاه خود را درباره‌اش
        به اشتراک بگذارید.
      </p>

      <Card className="mt-6 space-y-4">
        <div>
          <Label>چه ویژگی‌ها یا مهارت‌هایی رو براش تأیید می‌کنی؟</Label>
          <p className="mb-2 text-xs opacity-60">
            از بین برچسب‌هایی که اعضای دیگر برای خودشان نوشته‌اند انتخاب کن — شاید
            چیزی رو ببینی که {requester.firstName} خودش هنوز به آن اشاره نکرده.
          </p>
          <TagPicker selected={tags} onChange={setTags} />
        </div>

        {QUESTIONS.map((q) => (
          <div key={q.key}>
            <Label>{q.label}</Label>
            <RichTextEditor
              content={answers[q.key] || ""}
              onChange={(val) => setAnswer(q.key, val)}
              placeholder="پاسخ خود را بنویسید..."
            />
          </div>
        ))}

        <div className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            id="anonymous"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
          />
          <label htmlFor="anonymous">می‌خواهم ناشناس بمانم</label>
        </div>

        {!anonymous && (
          <div>
            <Label>نام شما (اختیاری)</Label>
            <Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
          </div>
        )}

        <ErrorText>{error}</ErrorText>

        <Button onClick={handleSubmit} disabled={submitting || !hasContent}>
          {submitting ? "در حال ارسال..." : "ارسال بازخورد"}
        </Button>
      </Card>
    </div>
  );
}
