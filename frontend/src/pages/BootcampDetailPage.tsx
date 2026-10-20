import { FormattedContent } from "../components/FormattedContent";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { BootcampDetail, getBootcamp } from "../api/bootcamps";
import { Task, TaskSubmission, listBootcampTasks, listMySubmissions, submitTask } from "../api/tasks";
import { ResponseWithVersions, listMyResponses } from "../api/responses";
import { getActiveSessionForBootcamp, LiveSession } from "../api/liveSession";
import { QuestionBlock } from "../components/QuestionBlock";
import { Button, Card, LoadError, Spinner, Textarea } from "../components/ui";

function TaskCard({ task }: { task: Task }) {
  const [submissions, setSubmissions] = useState<TaskSubmission[] | null>(null);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    listMySubmissions(task.id).then(setSubmissions);
  }, [task.id]);

  const handleSubmit = async () => {
    if (!draft.trim()) return;
    setSaving(true);
    try {
      await submitTask(task.id, draft);
      setDraft("");
      listMySubmissions(task.id).then(setSubmissions);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <p className="font-medium">{task.title}</p>
      {task.description && (
      <FormattedContent content={task.description} className="mt-1 text-sm opacity-70" />
    )}

      {submissions && submissions.length > 0 && (
        <div className="mt-3 space-y-2 border-t pt-3" style={{ borderColor: "var(--surface)" }}>
          {submissions.map((s) => (
            <div key={s.id} className="rounded-lg p-2 text-sm" style={{ backgroundColor: "var(--surface)" }}>
              <div className="text-xs opacity-60">{new Date(s.createdAt).toLocaleDateString("fa-IR")}</div>
              {s.content}
            </div>
          ))}
        </div>
      )}

      <div className="mt-3">
        <Textarea rows={2} placeholder="ارسال جدید..." value={draft} onChange={(e) => setDraft(e.target.value)} />
        <Button className="mt-2" onClick={handleSubmit} disabled={saving || !draft.trim()}>
          {saving ? "در حال ارسال..." : "ارسال"}
        </Button>
      </div>
    </Card>
  );
}

const STATUS_LABEL: Record<string, string> = {
  LOCKED: "قفل‌شده",
  COMING_SOON: "به‌زودی",
  ACTIVE: "فعال",
  DEADLINE_APPROACHING: "مهلت رو به پایان",
  SUBMITTED: "ثبت‌شده",
  COMPLETED: "تکمیل‌شده",
};

function relevantStageFor(status: string): "BEFORE" | "AFTER" | null {
  if (status === "LOCKED" || status === "COMING_SOON") return "BEFORE";
  if (status === "SUBMITTED" || status === "COMPLETED") return "AFTER";
  return null;
}

export function BootcampDetailPage() {
  const { bootcampId } = useParams<{ bootcampId: string }>();
  const [bootcamp, setBootcamp] = useState<BootcampDetail | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [responses, setResponses] = useState<ResponseWithVersions[]>([]);
  const [liveSession, setLiveSession] = useState<LiveSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const reload = () => {
    if (!bootcampId) return;
    setLoading(true);
    setLoadError(null);
    Promise.all([getBootcamp(bootcampId), listBootcampTasks(bootcampId), listMyResponses()])
      .then(([bootcampData, tasksData, responsesData]) => {
        setBootcamp(bootcampData);
        setTasks(tasksData);
        setResponses(responsesData);
        setLoading(false);
      })
      .catch(() => {
        setLoadError("بارگذاری اطلاعات بوت‌کمپ با خطا مواجه شد.");
        setLoading(false);
      });
    getActiveSessionForBootcamp(bootcampId)
      .then(setLiveSession)
      .catch(() => setLiveSession(null));
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bootcampId]);

  if (loadError) return <LoadError message={loadError} onRetry={reload} />;

  if (loading || !bootcamp) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  const bootcampForms = (bootcamp as any).forms as
    | Array<{ id: string; title: string; slug: string; description?: string | null; answers: unknown[] }>
    | undefined;
  const visibleForms = (bootcampForms || []).filter(
    (f) => !f.answers || f.answers.length === 0
  );

  const relevantStage = relevantStageFor(bootcamp.status);
  const visibleQuestions = relevantStage
    ? bootcamp.questions.filter((q) => q.stage === relevantStage)
    : [];
  const showTasks = relevantStage === null;

  const renderBootcampForms = visibleForms.length > 0 && (
    <div className="mb-6 space-y-3">
      {visibleForms.map((f) => (
        <div
          key={f.id}
          className="rounded-xl border-2 border-amber-400 bg-amber-50 p-5 shadow-sm"
        >
          <h3 className="mb-1 text-lg font-bold text-amber-900">📝 {f.title}</h3>
          {f.description && (
            <FormattedContent content={f.description} className="mb-3 text-sm text-amber-800" />
          )}
          <a
            href={`/forms/${f.slug}`}
            className="inline-block rounded-lg bg-amber-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-amber-700"
          >
            تکمیل فرم
          </a>
        </div>
      ))}
    </div>
  );

  return (
    <div className="mx-auto max-w-2xl">
{renderBootcampForms}
      <Link to="/dashboard/bootcamps" className="text-sm opacity-70">
        ← بازگشت به بوت‌کمپ‌ها / بوت‌کمپ‌ها / آکادمی
      </Link>

      <div className="mt-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{bootcamp.title}</h1>
        <span className="rounded-full px-3 py-1 text-xs" style={{ backgroundColor: "var(--surface)", color: "var(--accent)" }}>
          {STATUS_LABEL[bootcamp.status] ?? bootcamp.status}
        </span>
      </div>

      {bootcamp.description && <FormattedContent content={bootcamp.description} className="mt-2 text-sm opacity-80" />}
      <div className="mt-2 text-xs opacity-60">
        {new Date(bootcamp.date).toLocaleDateString("fa-IR")}
        {bootcamp.instructor && ` · مربی: ${bootcamp.instructor}`}
      </div>

      {bootcamp.journeySection && (
        <Link
          to={`/dashboard/journey/${bootcamp.journeySection.id}`}
          className="mt-3 inline-block text-sm"
          style={{ color: "var(--accent)" }}
        >
          مشاهده بخش مرتبط در مسیر برند من ←
        </Link>
      )}

      {/* Recording Download Section for Completed Bootcamps */}
      {bootcamp.status === "COMPLETED" && (
        <div className="mt-6">
          {bootcamp.recordingUrl ? (
            <Card className="border border-opacity-30 border-[var(--accent)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <span>🎬</span> ویدیو و فایل ضبط‌شده جلسه
                  </h3>
                  <p className="text-xs opacity-70 mt-1">
                    دسترسی دانلود فایل کامل این بوت‌کمپ در سرور ابری مگا برای شما فعال شده است.
                  </p>
                </div>
                <a
                  href={bootcamp.recordingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-transform active:scale-95 shadow-md"
                  style={{
                    backgroundColor: "var(--accent)",
                    color: "var(--bg)",
                  }}
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z" />
                  </svg>
                  دانلود از مگا (Mega.nz)
                </a>
              </div>
            </Card>
          ) : (
            <div className="rounded-xl p-4 text-xs opacity-75 border" style={{ backgroundColor: "var(--surface)", borderColor: "var(--surface)" }}>
              🔒 این بوت‌کمپ به اتمام رسیده است. فایل ضبط‌شده جلسه برای شرکت‌کنندگان مجاز توسط مسئولین به اشتراک گذاشته می‌شود.
            </div>
          )}
        </div>
      )}

      {relevantStage === "BEFORE" && bootcamp.questions.some((q) => q.stage === "BEFORE") && (
        <p className="mt-4 text-xs opacity-60">
          این بوت‌کمپ هنوز شروع نشده — با پاسخ به سؤالات زیر، نقطه‌ی شروع خودت را ثبت کن.
        </p>
      )}
      {relevantStage === "AFTER" && bootcamp.questions.some((q) => q.stage === "AFTER") && (
        <p className="mt-4 text-xs opacity-60">
          این بوت‌کمپ تمام شده — حالا به همین سؤالات دوباره جواب بده تا تحولت ثبت شود.
        </p>
      )}
      {showTasks && (
        <p className="mt-4 text-xs opacity-60">
          این بوت‌کمپ الان فعال است — تکالیف زیر را انجام بده.
        </p>
      )}

      {liveSession && (
        <Card className="mt-4">
          <p className="text-sm font-medium">جلسه‌ی کار گروهی زنده در حال برگزاری است</p>
          <p className="mt-1 text-xs opacity-70">
            وارد شو تا حضورت ثبت شود؛ به‌محض تقسیم‌بندی گروه‌ها توسط مسئول بوت‌کمپ، صفحه‌ات
            خودکار به گروهت تغییر می‌کند.
          </p>
          <Link to={`/dashboard/bootcamps/live/${liveSession.id}`}>
            <Button className="mt-2">ورود به جلسه‌ی زنده</Button>
          </Link>
        </Card>
      )}

      {visibleQuestions.length > 0 && (
        <div className="mt-4 space-y-3">
          {visibleQuestions.map((q) => (
            <QuestionBlock
              key={q.id}
              question={q}
              existingResponse={responses.find((r) => r.questionId === q.id)}
              onSaved={reload}
            />
          ))}
        </div>
      )}

      {showTasks && tasks.length > 0 && (
        <div className="mt-4 space-y-3">
          {tasks.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
        </div>
      )}

      {visibleQuestions.length === 0 && !(showTasks && tasks.length > 0) && (
        <p className="mt-8 text-sm opacity-60">
          {showTasks
            ? "هنوز تکلیفی برای این بوت‌کمپ تعریف نشده است."
            : "هنوز سؤالی متناسب با وضعیت فعلی این بوت‌کمپ تعریف نشده است."}
        </p>
      )}
    </div>
  );
}
