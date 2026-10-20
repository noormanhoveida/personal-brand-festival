import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getPreAssessmentForParticipant,
  PreAssessmentRecord,
  PreAssessmentSummary,
  setCoordinatorNote,
} from "../../api/preAssessment";
import { Button, Card, LoadError, Spinner, Textarea } from "../../components/ui";

/**
 * §Sheet 5 "خلاصه و امتیاز کلی" lives here: everything above the
 * coordinator-note box is derived server-side from the participant's
 * own answers (never independently entered), and the note itself is
 * the one thing the evaluator/coordinator writes.
 */
export function EvaluatorPreAssessmentPage() {
  const { participantId } = useParams<{ participantId: string }>();
  const [record, setRecord] = useState<(PreAssessmentRecord & { summary: PreAssessmentSummary }) | null>(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const load = () => {
    if (!participantId) return;
    setError(null);
    setNotFound(false);
    getPreAssessmentForParticipant(participantId)
      .then((r) => {
        setRecord(r);
        setNote(r.coordinatorNote ?? "");
      })
      .catch((err) => {
        if (err?.response?.status === 404) setNotFound(true);
        else setError("بارگذاری پیش‌ارزیابی با خطا مواجه شد.");
      });
  };

  useEffect(load, [participantId]); // eslint-disable-line react-hooks/exhaustive-deps

  const saveNote = async () => {
    if (!participantId) return;
    setSaving(true);
    try {
      await setCoordinatorNote(participantId, note);
    } catch {
      setError("ذخیره‌ی یادداشت با خطا مواجه شد.");
    } finally {
      setSaving(false);
    }
  };

  if (error) return <LoadError message={error} onRetry={load} />;
  if (notFound) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <p className="text-sm opacity-70">این شرکت‌کننده هنوز پیش‌ارزیابی خود را ثبت نکرده است.</p>
      </div>
    );
  }
  if (!record) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/dashboard/admin/pre-assessment" className="text-sm opacity-70">
        ← بازگشت
      </Link>
      <h1 className="mt-2 text-xl font-bold">پیش‌ارزیابی برند شخصی</h1>

      <Card className="mt-4">
        <h2 className="mb-2 text-sm font-semibold">اطلاعات پایه</h2>
        <div className="grid grid-cols-2 gap-2 text-xs opacity-80">
          <p>دانشگاه: {record.university}</p>
          <p>حوزه تخصصی: {record.professionalField}</p>
          <p>هدف: {record.programGoal}</p>
          {record.linkedinUrl && <p>لینکدین: {record.linkedinUrl}</p>}
          {record.personalWebsiteUrl && <p>سایت: {record.personalWebsiteUrl}</p>}
          {record.instagramHandle && <p>اینستاگرام: {record.instagramHandle}</p>}
        </div>
        {record.goalDescription && <p className="mt-2 text-xs opacity-70">{record.goalDescription}</p>}
      </Card>

      <Card className="mt-4">
        <h2 className="mb-2 text-sm font-semibold">خودارزیابی</h2>
        {record.summary.selfAssessment.map((row) => (
          <p key={row.axis} className="text-xs opacity-80">
            {row.axis}: فعلی {row.current} / هدف {row.target} / شکاف {row.gap}
          </p>
        ))}
        <p className="mt-2 text-xs font-medium">
          میانگین کل — فعلی {record.summary.selfAssessmentAverage.current.toFixed(1)} / هدف{" "}
          {record.summary.selfAssessmentAverage.target.toFixed(1)} / شکاف{" "}
          {record.summary.selfAssessmentAverage.gap.toFixed(1)}
        </p>
      </Card>

      <Card className="mt-4">
        <h2 className="mb-2 text-sm font-semibold">سؤالات کیفی</h2>
        {record.qualitativeAnswers.map((q) => (
          <div key={q.question} className="mb-2 text-xs">
            <p className="opacity-60">{q.question}</p>
            <p className="opacity-90">{q.answer}</p>
          </div>
        ))}
      </Card>

      <Card className="mt-4">
        <h2 className="mb-2 text-sm font-semibold">چک‌لیست حضور دیجیتال</h2>
        {record.digitalPresence
          .filter((p) => p.has)
          .map((p) => (
            <p key={p.platform} className="text-xs opacity-80">
              {p.platform} — فالوور: {p.followers ?? "—"} — کیفیت: {p.quality ?? "—"}
            </p>
          ))}
        <p className="mt-2 text-xs font-medium">
          پلتفرم‌های فعال: {record.summary.digitalPresenceTotals.activeCount} — میانگین کیفیت:{" "}
          {record.summary.digitalPresenceTotals.averageQuality.toFixed(1)}
        </p>
      </Card>

      <Card className="mt-4">
        <h2 className="mb-2 text-sm font-semibold">یادداشت هماهنگ‌کننده</h2>
        <Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
        <Button className="mt-2" onClick={saveNote} disabled={saving}>
          {saving ? "در حال ذخیره..." : "ذخیره یادداشت"}
        </Button>
      </Card>
    </div>
  );
}
