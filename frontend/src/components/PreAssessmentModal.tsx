import { useState } from "react";
import {
  DIGITAL_PLATFORMS,
  DigitalPresenceEntry,
  PreAssessmentInput,
  PreAssessmentStatus,
  PROFESSIONAL_FIELD_OPTIONS,
  PROGRAM_GOAL_OPTIONS,
  QUALITATIVE_QUESTIONS,
  QualitativeEntry,
  SELF_ASSESSMENT_AXES,
  SelfAssessmentEntry,
  submitPreAssessment,
} from "../api/preAssessment";
import { Button, ErrorText, Input, Label, Textarea } from "./ui";

const STEPS = ["اطلاعات پایه", "خودارزیابی", "سؤالات کیفی", "حضور دیجیتال"] as const;

function emptySelfAssessment(): SelfAssessmentEntry[] {
  return SELF_ASSESSMENT_AXES.map((axis) => ({ axis, current: 5, target: 8 }));
}
function emptyQualitative(): QualitativeEntry[] {
  return QUALITATIVE_QUESTIONS.map((question) => ({ question, answer: "" }));
}
function emptyDigitalPresence(): DigitalPresenceEntry[] {
  return DIGITAL_PLATFORMS.map((platform) => ({
    platform,
    has: false,
    lastUpdate: "",
    followers: null,
    quality: null,
  }));
}

/**
 * §"فرم ارزیابی اولیه برند شخصی دانشجو" — every field from every sheet
 * of the coordinator's workbook except sheet 1's identity fields
 * (already collected at onboarding — shown read-only here, never
 * re-asked) and sheet 5 (fully derived server-side for the
 * coordinator's own view, not part of what the participant fills in).
 * Deliberately non-dismissible: no backdrop click, no close button —
 * it only unmounts once onDone() fires after a successful submit.
 */
export function PreAssessmentModal({
  status,
  onDone,
}: {
  status: PreAssessmentStatus;
  onDone: () => void;
}) {
  const [step, setStep] = useState(0);
  const [university, setUniversity] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [personalWebsiteUrl, setPersonalWebsiteUrl] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");
  const [professionalField, setProfessionalField] = useState<string>("");
  const [programGoal, setProgramGoal] = useState<string>("");
  const [goalDescription, setGoalDescription] = useState("");
  const [selfAssessment, setSelfAssessment] = useState(emptySelfAssessment());
  const [qualitative, setQualitative] = useState(emptyQualitative());
  const [digitalPresence, setDigitalPresence] = useState(emptyDigitalPresence());
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const updateSelfAssessment = (i: number, field: "current" | "target", value: number) => {
    setSelfAssessment((prev) => prev.map((row, idx) => (idx === i ? { ...row, [field]: value } : row)));
  };
  const updateQualitative = (i: number, answer: string) => {
    setQualitative((prev) => prev.map((row, idx) => (idx === i ? { ...row, answer } : row)));
  };
  const updateDigital = (i: number, patch: Partial<DigitalPresenceEntry>) => {
    setDigitalPresence((prev) => prev.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  };

  const avgCurrent = selfAssessment.reduce((s, a) => s + a.current, 0) / selfAssessment.length;
  const avgTarget = selfAssessment.reduce((s, a) => s + a.target, 0) / selfAssessment.length;
  const activeCount = digitalPresence.filter((p) => p.has).length;

  const canGoNext = () => {
    if (step === 0) return university.trim() !== "" && professionalField !== "" && programGoal !== "";
    if (step === 2) return qualitative.every((q) => q.answer.trim() !== "");
    return true;
  };

  const handleSubmit = async () => {
    if (!qualitative.every((q) => q.answer.trim() !== "")) {
      setStep(2);
      setError("لطفاً به همه‌ی سؤالات کیفی پاسخ بده.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const input: PreAssessmentInput = {
        university: university.trim(),
        linkedinUrl: linkedinUrl.trim() || null,
        personalWebsiteUrl: personalWebsiteUrl.trim() || null,
        instagramHandle: instagramHandle.trim() || null,
        professionalField: professionalField as PreAssessmentInput["professionalField"],
        programGoal: programGoal as PreAssessmentInput["programGoal"],
        goalDescription: goalDescription.trim() || null,
        selfAssessment,
        qualitativeAnswers: qualitative,
        digitalPresence: digitalPresence.map((p) => ({
          ...p,
          followers: p.has ? p.followers : null,
          quality: p.has ? p.quality : null,
          lastUpdate: p.has ? p.lastUpdate : null,
        })),
      };
      await submitPreAssessment(input);
      onDone();
    } catch {
      setError("ثبت پیش‌ارزیابی با خطا مواجه شد. لطفاً دوباره تلاش کن.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border"
        style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--surface)" }}
      >
        <div className="border-b px-6 py-4" style={{ borderColor: "var(--surface)" }}>
          <h1 className="text-lg font-bold">پیش‌ارزیابی برند شخصی</h1>
          <p className="mt-1 text-xs opacity-60">
            قبل از شروع مسیر، این فرم کوتاه رو تکمیل کن — کمک می‌کنه برنامه رو دقیق‌تر متناسب با
            جایگاه فعلی‌ات تنظیم کنیم.
          </p>
          <div className="mt-3 flex gap-1">
            {STEPS.map((label, i) => (
              <div
                key={label}
                className="h-1 flex-1 rounded-full"
                style={{ backgroundColor: i <= step ? "var(--accent)" : "var(--surface)" }}
              />
            ))}
          </div>
          <p className="mt-1 text-xs opacity-50">
            {step + 1} از {STEPS.length} — {STEPS[step]}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {step === 0 && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 rounded-lg p-3 text-xs opacity-70" style={{ backgroundColor: "var(--surface)" }}>
                <p>نام و نام خانوادگی: {status.prefill.firstName} {status.prefill.lastName}</p>
                <p>موبایل: {status.prefill.mobile}</p>
                <p>ایمیل: {status.prefill.email}</p>
                <p>رشته تحصیلی: {status.prefill.fieldOfStudy || status.prefill.educationLevel || "—"}</p>
              </div>

              <div>
                <Label>دانشگاه</Label>
                <Input value={university} onChange={(e) => setUniversity(e.target.value)} placeholder="نام دانشگاه و شهر" />
              </div>
              <div>
                <Label>لینکدین (اختیاری)</Label>
                <Input value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="آدرس کامل پروفایل" />
              </div>
              <div>
                <Label>سایت شخصی (اختیاری)</Label>
                <Input value={personalWebsiteUrl} onChange={(e) => setPersonalWebsiteUrl(e.target.value)} />
              </div>
              <div>
                <Label>اینستاگرام (اختیاری)</Label>
                <Input value={instagramHandle} onChange={(e) => setInstagramHandle(e.target.value)} placeholder="آیدی صفحه" />
              </div>
              <div>
                <Label>حوزه تخصصی مورد نظر</Label>
                <div className="flex flex-wrap gap-2">
                  {PROFESSIONAL_FIELD_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setProfessionalField(opt)}
                      className="rounded-full px-3 py-1 text-xs"
                      style={{
                        backgroundColor: professionalField === opt ? "var(--accent)" : "var(--surface)",
                        color: professionalField === opt ? "var(--bg)" : "var(--text)",
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label>هدف از شرکت در برنامه</Label>
                <div className="flex flex-wrap gap-2">
                  {PROGRAM_GOAL_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setProgramGoal(opt)}
                      className="rounded-full px-3 py-1 text-xs"
                      style={{
                        backgroundColor: programGoal === opt ? "var(--accent)" : "var(--surface)",
                        color: programGoal === opt ? "var(--bg)" : "var(--text)",
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label>توضیح آزاد درباره هدف (اختیاری)</Label>
                <Textarea rows={2} value={goalDescription} onChange={(e) => setGoalDescription(e.target.value)} />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <p className="text-xs opacity-60">برای هر محور، وضعیت فعلی و وضعیت هدفت رو از ۱ تا ۱۰ مشخص کن.</p>
              {selfAssessment.map((row, i) => (
                <div key={row.axis} className="rounded-lg p-3" style={{ backgroundColor: "var(--surface)" }}>
                  <p className="mb-2 text-sm font-medium">{row.axis}</p>
                  <div className="flex items-center gap-4">
                    <label className="flex flex-1 items-center gap-2 text-xs">
                      فعلی
                      <input
                        type="range"
                        min={1}
                        max={10}
                        value={row.current}
                        onChange={(e) => updateSelfAssessment(i, "current", Number(e.target.value))}
                        className="flex-1"
                      />
                      <span className="w-5 text-center">{row.current}</span>
                    </label>
                    <label className="flex flex-1 items-center gap-2 text-xs">
                      هدف
                      <input
                        type="range"
                        min={1}
                        max={10}
                        value={row.target}
                        onChange={(e) => updateSelfAssessment(i, "target", Number(e.target.value))}
                        className="flex-1"
                      />
                      <span className="w-5 text-center">{row.target}</span>
                    </label>
                  </div>
                  <p className="mt-1 text-xs opacity-50">شکاف: {row.target - row.current}</p>
                </div>
              ))}
              <p className="text-xs opacity-70">
                میانگین کل — فعلی: {avgCurrent.toFixed(1)} / هدف: {avgTarget.toFixed(1)} / شکاف:{" "}
                {(avgTarget - avgCurrent).toFixed(1)}
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {qualitative.map((row, i) => (
                <div key={row.question}>
                  <Label>{row.question}</Label>
                  <Textarea rows={2} value={row.answer} onChange={(e) => updateQualitative(i, e.target.value)} />
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <p className="text-xs opacity-60">برای هر پلتفرم مشخص کن که داری یا نه — اگر داری، جزئیاتش رو هم وارد کن.</p>
              {digitalPresence.map((row, i) => (
                <div key={row.platform} className="rounded-lg p-3" style={{ backgroundColor: "var(--surface)" }}>
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input type="checkbox" checked={row.has} onChange={(e) => updateDigital(i, { has: e.target.checked })} />
                    {row.platform}
                  </label>
                  {row.has && (
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      <Input
                        type="date"
                        value={row.lastUpdate ?? ""}
                        onChange={(e) => updateDigital(i, { lastUpdate: e.target.value })}
                        className="text-xs"
                      />
                      <Input
                        type="number"
                        min={0}
                        placeholder="تعداد فالوور/ارتباط"
                        value={row.followers ?? ""}
                        onChange={(e) => updateDigital(i, { followers: e.target.value ? Number(e.target.value) : null })}
                        className="text-xs"
                      />
                      <Input
                        type="number"
                        min={1}
                        max={5}
                        placeholder="کیفیت (۱-۵)"
                        value={row.quality ?? ""}
                        onChange={(e) => updateDigital(i, { quality: e.target.value ? Number(e.target.value) : null })}
                        className="text-xs"
                      />
                    </div>
                  )}
                </div>
              ))}
              <p className="text-xs opacity-70">تعداد پلتفرم‌های فعال: {activeCount}</p>
            </div>
          )}

          <ErrorText>{error}</ErrorText>
        </div>

        <div className="flex items-center justify-between border-t px-6 py-4" style={{ borderColor: "var(--surface)" }}>
          <Button variant="ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
            قبلی
          </Button>
          {step < STEPS.length - 1 ? (
            <Button disabled={!canGoNext()} onClick={() => setStep((s) => s + 1)}>
              بعدی
            </Button>
          ) : (
            <Button disabled={submitting} onClick={handleSubmit}>
              {submitting ? "در حال ثبت..." : "ثبت پیش‌ارزیابی"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
