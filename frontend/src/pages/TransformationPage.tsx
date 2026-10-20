import { useEffect, useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { listMyResponses, ResponseWithVersions } from "../api/responses";
import { JourneySection, listJourneySections } from "../api/journey";

export function TransformationPage() {
  const [sections, setSections] = useState<JourneySection[]>([]);
  const [responses, setResponses] = useState<ResponseWithVersions[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([listJourneySections(), listMyResponses()])
      .then(([s, r]) => {
        setSections(s);
        setResponses(r);
      })
      .catch((err) => console.error("Error loading transformation data:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  const responseByQuestion = new Map<string, any>();
  responses.forEach((r: any) => responseByQuestion.set(r.questionId, r));

  // بررسی وضعیت نمرات هر بخش
  const sectionStats = sections.map((sec: any) => {
    const questions: any[] = sec.questions || [];
    const secResponses: any[] = questions
      .map((q: any) => responseByQuestion.get(q.id))
      .filter((r: any) => Boolean(r && r.versions && r.versions.length > 0));

    // پاسخ‌هایی که هر دو نمره را دارند
    const fullyScored: any[] = secResponses.filter(
      (r: any) => r.selfTransformationScore != null && r.reviewerScore != null
    );

    const hasSelfOnly: boolean = secResponses.some(
      (r: any) => r.selfTransformationScore != null && r.reviewerScore == null
    );

    let avgSelf = 0;
    let avgReviewer = 0;
    let finalScore = 0;

    if (fullyScored.length > 0) {
      avgSelf = Math.round(
        fullyScored.reduce((acc: number, r: any) => acc + (r.selfTransformationScore || 0), 0) / fullyScored.length
      );
      avgReviewer = Math.round(
        fullyScored.reduce((acc: number, r: any) => acc + (r.reviewerScore || 0), 0) / fullyScored.length
      );
      finalScore = Math.round((avgSelf + avgReviewer) / 2);
    }

    return {
      section: sec,
      totalQuestions: questions.length,
      answeredCount: secResponses.length,
      fullyScoredCount: fullyScored.length,
      isUnlocked: fullyScored.length > 0,
      hasSelfOnly,
      avgSelf,
      avgReviewer,
      finalScore,
    };
  });

  const unlockedSections = sectionStats.filter((s) => s.isUnlocked);

  const radarData = unlockedSections.map((s) => ({
    subject: s.section.title,
    score: s.finalScore,
    fullMark: 100,
  }));

  // لیست مقایسه پاسخ‌های اول و آخر
  const evaluatedItems: {
    questionText: string;
    sectionTitle: string;
    firstVersion: any;
    latestVersion: any;
    selfScore: number | null;
    reviewerScore: number | null;
    reviewerFeedback: string | null;
  }[] = [];

  sections.forEach((sec: any) => {
    const questions: any[] = sec.questions || [];
    questions.forEach((q: any) => {
      const r = responseByQuestion.get(q.id);
      if (r && r.versions && r.versions.length >= 1) {
        const sorted = [...r.versions].sort((a: any, b: any) => a.versionNumber - b.versionNumber);
        evaluatedItems.push({
          questionText: q.text,
          sectionTitle: sec.title,
          firstVersion: sorted[0],
          latestVersion: sorted[sorted.length - 1],
          selfScore: r.selfTransformationScore ?? null,
          reviewerScore: r.reviewerScore ?? null,
          reviewerFeedback: r.reviewerFeedback ?? null,
        });
      }
    });
  });

  return (
    <div className="space-y-8 p-4 md:p-8">
      <div>
        <h1 className="text-xl font-bold text-slate-800">مسیر تحول</h1>
        <p className="mt-1 text-sm text-slate-500">
          نمودار رشد واقعی برند شما بر اساس ترکیب «خودارزیابی شما» و «امتیاز ارزیاب آکادمی».
        </p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-700">نمودار تحول در ابعاد برند</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              هر گام پس از ثبت خودارزیابی توسط شما و تایید و نمره‌دهی ارزیاب نمایان می‌شود.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
              تکمیل‌شده: {unlockedSections.length} از {sections.length} گام
            </span>
          </div>
        </div>

        {radarData.length >= 1 ? (
          <div className="space-y-6">
            {radarData.length >= 3 ? (
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "#475569", fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" />
                    <Radar
                      name="رشد تحول"
                      dataKey="score"
                      stroke="#4f46e5"
                      fill="#6366f1"
                      fillOpacity={0.5}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="rounded-lg bg-indigo-50/70 border border-indigo-100 p-4 text-center text-xs text-indigo-800">
                برای رسم گراف چندضلعی رادار حداقل ۳ گام باید توسط شما و ارزیاب نمره‌دهی شوند. درصد رشد در کارت‌های زیر قابل مشاهده است:
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              {sectionStats.map((st) => (
                <div
                  key={st.section.id}
                  className={`p-3.5 rounded-xl border ${
                    st.isUnlocked
                      ? 'border-emerald-200 bg-emerald-50/30'
                      : 'border-slate-200 bg-slate-50/60 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800">{st.section.title}</span>
                    {st.isUnlocked ? (
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        رشد نهایی: {st.finalScore}٪
                      </span>
                    ) : st.hasSelfOnly ? (
                      <span className="text-[11px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        ⏳ در انتظار نمره ارزیاب
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-full">
                        🔒 نیازمند پاسخ و خودارزیابی
                      </span>
                    )}
                  </div>

                  {st.isUnlocked ? (
                    <div className="space-y-1.5 mt-2">
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full transition-all"
                          style={{ width: `${st.finalScore}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-600 pt-1">
                        <span>نگاه شما: <strong>{st.avgSelf}٪</strong></span>
                        <span>نگاه ارزیاب: <strong>{st.avgReviewer}٪</strong></span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 mt-1">
                      پاسخ ثبت‌شده: {st.answeredCount} از {st.totalQuestions} سوال
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-12 text-center space-y-2 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <div className="text-3xl">🔒</div>
            <p className="text-sm font-semibold text-slate-700">
              نمودار تحول هنوز فعال نشده است
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              برای نمایش رشد و فعال شدن نمودار، پس از پاسخ‌دهی به گام‌های مسیر برند، درصد خودارزیابی را ثبت کنید تا توسط ارزیاب نمره‌دهی شود.
            </p>
          </div>
        )}
      </div>

      {evaluatedItems.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-700">پاسخ‌ها و ارزیابی تحول</h2>
          {evaluatedItems.map((item, idx) => (
            <div key={idx} className="rounded-xl bg-white p-5 shadow-sm border border-slate-100 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-medium text-indigo-600">{item.sectionTitle}</span>
                  <p className="mt-0.5 text-sm font-medium text-slate-800">{item.questionText}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${
                    item.selfScore != null
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}>
                    خودارزیابی: {item.selfScore != null ? `${item.selfScore}٪` : 'ثبت‌نشده'}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${
                    item.reviewerScore != null
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    امتیاز ارزیاب: {item.reviewerScore != null ? `${item.reviewerScore}٪` : 'در انتظار داوری'}
                  </span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3">
                  <span className="text-xs font-semibold text-amber-700">
                    پاسخ اولیه (نسخه {item.firstVersion.versionNumber})
                  </span>
                  <p className="mt-1 text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">
                    {item.firstVersion.content}
                  </p>
                </div>
                <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-3">
                  <span className="text-xs font-semibold text-emerald-700">
                    آخرین پاسخ (نسخه {item.latestVersion.versionNumber})
                  </span>
                  <p className="mt-1 text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">
                    {item.latestVersion.content}
                  </p>
                </div>
              </div>

              {item.reviewerFeedback && (
                <div className="rounded-lg bg-indigo-50/60 border border-indigo-100 p-3 text-xs text-slate-700">
                  <strong className="text-indigo-900">نظر و بازخورد ارزیاب: </strong>
                  {item.reviewerFeedback}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TransformationPage;
