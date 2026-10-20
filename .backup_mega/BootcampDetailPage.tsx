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
      {task.description && <p className="mt-1 text-sm opacity-70">{task.description}</p>}

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

/**
 * The bootcamp's lifecycle stage decides what a participant should be
 * doing right now: before it starts, answer the "before" questions to
 * establish a baseline; while it's running, do the tasks/activities;
 * once it's done, answer the "after" questions to reflect on the
 * change. Showing everything at once would bury the actual next step.
 */
function relevantStageFor(status: string): "BEFORE" | "AFTER" | null {
  if (status === "LOCKED" || status === "COMING_SOON") return "BEFORE";
  if (status === "SUBMITTED" || status === "COMPLETED") return "AFTER";
  return null; // ACTIVE / DEADLINE_APPROACHING → tasks are the focus, not Q&A
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

  const relevantStage = relevantStageFor(bootcamp.status);
  const visibleQuestions = relevantStage
    ? bootcamp.questions.filter((q) => q.stage === relevantStage)
    : [];
  const showTasks = relevantStage === null; // i.e. ACTIVE / DEADLINE_APPROACHING

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/dashboard/bootcamps" className="text-sm opacity-70">
        ← بازگشت به بوت‌کمپ‌ها
      </Link>

      <div className="mt-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{bootcamp.title}</h1>
        <span className="rounded-full px-3 py-1 text-xs" style={{ backgroundColor: "var(--surface)", color: "var(--accent)" }}>
          {STATUS_LABEL[bootcamp.status] ?? bootcamp.status}
        </span>
      </div>

      {bootcamp.description && <p className="mt-2 text-sm opacity-80">{bootcamp.description}</p>}
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

      {/* Stage-aware guidance so the participant knows what to do right now */}
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
