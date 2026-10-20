import { FormattedContent } from "../../components/FormattedContent";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
ChallengeSubmission,
  listChallengeSubmissions,
  sendToInstructor,
  WeeklyChallenge,
  listChallenges,
} from "../../api/challenges";
import { Button, Card, ErrorText, LoadError, Spinner } from "../../components/ui";

export function ChallengeReviewPage() {
  const { challengeId } = useParams<{ challengeId: string }>();
  const [challenge, setChallenge] = useState<WeeklyChallenge | null>(null);
  const [submissions, setSubmissions] = useState<ChallengeSubmission[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [expandedSubmissions, setExpandedSubmissions] = useState<Record<string, boolean>>({});

  const load = () => {
    if (!challengeId) return;
    setLoadError(null);
    Promise.all([listChallenges(), listChallengeSubmissions(challengeId)])
      .then(([all, subs]) => {
        setChallenge(all.find((c) => c.id === challengeId) ?? null);
        setSubmissions(subs);
      })
      .catch(() => setLoadError("بارگذاری پاسخ‌ها با خطا مواجه شد."));
  };

  useEffect(load, [challengeId]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleHistory = (subId: string) => {
    setExpandedSubmissions((prev) => ({
      ...prev,
      [subId]: !prev[subId],
    }));
  };

  const handleSend = async (submission: ChallengeSubmission) => {
    setSendingId(submission.id);
    setError(null);
    try {
      await sendToInstructor(submission.id);
      load();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "ارسال ایمیل با خطا مواجه شد.");
    } finally {
      setSendingId(null);
    }
  };

  if (loadError) return <LoadError message={loadError} onRetry={load} />;
  if (!challenge || !submissions) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-xl font-bold">پاسخ‌های چالش: {challenge.title}</h1>
      <p className="mt-1 text-sm opacity-70">{submissions.length} شرکت‌کننده پاسخ ثبت کرده‌اند</p>
      <ErrorText>{error}</ErrorText>

      {submissions.map((s) => {
        const u = s.participant?.user;
        const displayName =
          [u?.firstName, u?.lastName].filter(Boolean).join(" ") ||
          [s.participant?.firstName, s.participant?.lastName].filter(Boolean).join(" ") ||
          u?.email ||
          "کاربر بدون نام";
        const versions = (s.versions && s.versions.length > 0)
          ? s.versions
          : [{
              id: s.id,
              versionNumber: 1,
              textContent: s.textContent,
              photoUrl: s.photoUrl,
              documentUrl: s.documentUrl,
              linkUrl: s.linkUrl,
              createdAt: s.updatedAt || s.submittedAt
            }];
        const isExpanded = !!expandedSubmissions[s.id];

        return (
          <Card key={s.id} className="mt-4 border border-white/10">
            <div className="flex items-start justify-between border-b border-white/10 pb-2">
              <div>
                <p className="font-semibold text-base">{displayName}</p>
                <p className="text-xs opacity-60">
                  {u?.email} {u?.phone ? `• ${u.phone}` : ""}
                </p>
              </div>
              <span className="text-xs rounded bg-white/10 px-2 py-1">
                تعداد ویرایش‌ها: {versions.length > 0 ? versions.length : 1}
              </span>
            </div>

            {/* آخرین نسخه فعلی */}
            <div className="mt-3">
              <span className="text-xs font-semibold text-accent">آخرین وضعیت ارسالی:</span>
              {s.textContent && <FormattedContent content={s.textContent} className="mt-1 text-sm opacity-90" />}
              {s.linkUrl && (
                <a href={s.linkUrl} target="_blank" rel="noreferrer" className="mt-1 block text-xs underline break-all">
                  🔗 {s.linkUrl}
                </a>
              )}
              {s.photoUrl && (
                <a href={s.photoUrl} target="_blank" rel="noreferrer" className="block mt-2">
                  <img src={s.photoUrl} alt="پیوست" className="h-28 rounded object-cover border border-white/10" />
                </a>
              )}
              {s.documentUrl && (
                <a href={s.documentUrl} target="_blank" rel="noreferrer" className="mt-2 block text-xs underline">
                  📄 دانلود فایل ضمیمه آخرین نسخه
                </a>
              )}
              <p className="mt-2 text-xs opacity-50">
                تاریخ آخرین ثبت: {new Date(s.updatedAt || s.submittedAt).toLocaleString("fa-IR")}
              </p>
            </div>

            {/* بخش مشاهده تمام نسخه‌ها */}
            {versions.length > 0 && (
              <div className="mt-3 border-t border-white/10 pt-2">
                <button
                  type="button"
                  onClick={() => toggleHistory(s.id)}
                  className="text-xs font-medium underline opacity-80 hover:opacity-100"
                >
                  {isExpanded ? "بستن تایم‌لاین نسخه‌ها ▲" : `مشاهده تایم‌لاین و تاریخچه تمام نسخه‌ها (${versions.length} نسخه) ▼`}
                </button>

                {isExpanded && (
                  <div className="mt-2 space-y-2">
                    {versions.map((ver) => (
                      <div key={ver.id} className="rounded border border-white/10 bg-black/20 p-2.5 text-xs">
                        <div className="flex items-center justify-between opacity-70 mb-1">
                          <span className="font-bold">نسخه {ver.versionNumber}</span>
                          <span>{new Date(ver.createdAt).toLocaleString("fa-IR")}</span>
                        </div>
                        {ver.textContent && <FormattedContent content={ver.textContent} className="opacity-90" />}
                        {ver.linkUrl && (
                          <a href={ver.linkUrl} target="_blank" rel="noreferrer" className="block underline mt-1 break-all">
                            🔗 {ver.linkUrl}
                          </a>
                        )}
                        {ver.photoUrl && (
                          <a href={ver.photoUrl} target="_blank" rel="noreferrer" className="block mt-1">
                            <img src={ver.photoUrl} alt="" className="h-16 rounded object-cover" />
                          </a>
                        )}
                        {ver.documentUrl && (
                          <a href={ver.documentUrl} target="_blank" rel="noreferrer" className="block underline mt-1">
                            📄 فایل پیوست نسخه {ver.versionNumber}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 pt-2 border-t border-white/10 flex items-center justify-between">
              {s.sentToInstructorAt ? (
                <span className="text-xs" style={{ color: "var(--accent)" }}>
                  ✓ برای مربی ارسال شد ({new Date(s.sentToInstructorAt).toLocaleDateString("fa-IR")})
                </span>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => handleSend(s)}
                  disabled={!challenge.instructorEmail || sendingId === s.id}
                >
                  {!challenge.instructorEmail
                    ? "ایمیل مربی ثبت نشده"
                    : sendingId === s.id
                    ? "در حال ارسال..."
                    : "ارسال به مربی"}
                </Button>
              )}
            </div>
          </Card>
        );
      })}
      {submissions.length === 0 && <p className="mt-4 text-sm opacity-60">هنوز پاسخی ثبت نشده.</p>}
    </div>
  );
}
