import { ArtifactItem, ArtifactCommentItem, getPublicArtifacts, rateArtifact, commentArtifact } from "../api/artifact";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { PublicPage, getPublicPage } from "../api/personalPage";
import { endorseSkill, endorseTagsForSlug } from "../api/skills";
import { submitFeedbackBySlug } from "../api/community";
import { FeedbackAnswers } from "../api/feedback";
import { BrandMascot } from "../components/BrandMascot";
import { TagPicker } from "../components/TagPicker";
import { Button, Card, Input, Label, Spinner, Textarea } from "../components/ui";

const FEEDBACK_QUESTIONS: { key: keyof FeedbackAnswers; label: string }[] = [
  { key: "q1", label: "این فرد را در چهار کلمه توصیف کنید." },
  { key: "q2", label: "بزرگ‌ترین نقطه قوت این فرد چیست؟" },
  { key: "q3", label: "فکر می‌کنید این فرد در چه چیزی از دیگران متمایز است؟" },
  { key: "q4", label: "اگر بخواهید این فرد را به یک نفر دیگر معرفی کنید، چگونه او را توصیف می‌کنید؟" },
  { key: "q5", label: "فکر می‌کنید این فرد در چه زمینه‌ای می‌تواند بسیار موفق باشد؟" },
  { key: "q6", label: "چه هویت حرفه‌ای را با این فرد مرتبط می‌دانید؟" },
];

function OpenFeedbackForm({ slug, firstName }: { slug: string; firstName: string }) {
  const [authorName, setAuthorName] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [answers, setAnswers] = useState<FeedbackAnswers>({
    q1: "", q2: "", q3: "", q4: "", q5: "", q6: "",
  });
  const [tags, setTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setAnswer = (key: keyof FeedbackAnswers, value: string) =>
    setAnswers((a) => ({ ...a, [key]: value }));

  const hasAnyAnswer = Object.values(answers).some((v) => v.trim()) || tags.length > 0;

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      if (Object.values(answers).some((v) => v.trim())) {
        await submitFeedbackBySlug(slug, {
          authorName: anonymous ? undefined : authorName || undefined,
          answers,
          anonymous,
        });
      }
      if (tags.length > 0) {
        await endorseTagsForSlug(slug, tags, anonymous ? undefined : authorName || undefined);
      }
      setDone(true);
    } catch {
      setError("ثبت بازخورد با خطا مواجه شد.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <Card className="mt-6 text-center">
        <p className="text-sm" style={{ color: "var(--accent)" }}>
          سپاسگزاریم — بازخورد شما ثبت شد ✓
        </p>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <h2 className="text-lg font-semibold">نظر شما درباره {firstName}</h2>
      <p className="mt-1 text-xs opacity-60">
        اگر {firstName} را می‌شناسید، دیدگاه خود را آزادانه با او (و در صورت تمایل، با
        بقیه) به اشتراک بگذارید. نیازی به لینک دعوت یا حساب کاربری نیست.
      </p>

      <div className="mt-4 space-y-3">
        <div>
          <Label>چه ویژگی‌ها یا مهارت‌هایی رو براش تأیید می‌کنی؟</Label>
          <p className="mb-2 text-xs opacity-60">
            از بین برچسب‌هایی که اعضای دیگر برای خودشان نوشته‌اند انتخاب کن — شاید
            چیزی رو ببینی که {firstName} خودش هنوز به آن اشاره نکرده.
          </p>
          <TagPicker selected={tags} onChange={setTags} />
        </div>

        {FEEDBACK_QUESTIONS.map((q) => (
          <div key={q.key}>
            <Label>{q.label}</Label>
            <Textarea rows={2} value={answers[q.key]} onChange={(e) => setAnswer(q.key, e.target.value)} />
          </div>
        ))}

        <div className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            id="open-fb-anon"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
          />
          <label htmlFor="open-fb-anon">می‌خواهم ناشناس بمانم</label>
        </div>

        {!anonymous && (
          <div>
            <Label>نام شما (اختیاری)</Label>
            <Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
          </div>
        )}

        {error && <p className="text-xs" style={{ color: "#e0705f" }}>{error}</p>}

        <Button onClick={handleSubmit} disabled={submitting || !hasAnyAnswer}>
          {submitting ? "در حال ارسال..." : "ارسال بازخورد"}
        </Button>
      </div>
    </Card>
  );
}

function EndorsementSection({ page }: { page: PublicPage }) {
  const [endorserName, setEndorserName] = useState("");
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
  const [localCounts, setLocalCounts] = useState<Record<string, { endorse: number; reject: number }>>(
    Object.fromEntries(
      page.skills.map((s) => [s.id, { endorse: s.endorseCount, reject: s.rejectCount }])
    )
  );

  if (page.skills.length === 0) return null;

  const vote = async (skillId: string, kind: "ENDORSE" | "REJECT") => {
    if (votedIds.has(skillId)) return; // one vote per visit, per skill
    setVotedIds((prev) => new Set(prev).add(skillId));
    setLocalCounts((prev) => ({
      ...prev,
      [skillId]: {
        endorse: prev[skillId].endorse + (kind === "ENDORSE" ? 1 : 0),
        reject: prev[skillId].reject + (kind === "REJECT" ? 1 : 0),
      },
    }));
    try {
      await endorseSkill(skillId, kind, endorserName || undefined);
    } catch {
      // silently ignore — the optimistic UI already reflects intent,
      // and this is a low-stakes social signal, not a critical action
    }
  };

  return (
    <Card className="mt-6">
      <h2 className="text-lg font-semibold">مهارت‌ها</h2>
      <p className="mt-1 text-xs opacity-60">
        اگر {page.firstName} را می‌شناسید، مهارت‌هایش را تأیید یا رد کنید.
      </p>

      <Input
        className="mt-3"
        placeholder="نام شما (اختیاری)"
        value={endorserName}
        onChange={(e) => setEndorserName(e.target.value)}
      />

      <div className="mt-3 space-y-2">
        {page.skills.map((s) => {
          const counts = localCounts[s.id];
          const voted = votedIds.has(s.id);
          return (
            <div
              key={s.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg px-3 py-2"
              style={{ backgroundColor: "var(--surface)" }}
            >
              <span className="text-sm">{s.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: "var(--accent)" }}>
                  ✓ {counts.endorse}
                </span>
                <span className="text-xs opacity-60">✕ {counts.reject}</span>
                <Button
                  variant="ghost"
                  className="px-3 py-1 text-xs"
                  disabled={voted}
                  onClick={() => vote(s.id, "ENDORSE")}
                >
                  تأیید
                </Button>
                <Button
                  variant="ghost"
                  className="px-3 py-1 text-xs"
                  disabled={voted}
                  onClick={() => vote(s.id, "REJECT")}
                >
                  رد
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export function PublicProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<PublicPage | null>(null);
  const [errorStatus, setErrorStatus] = useState<number | "unknown" | null>(null);

  useEffect(() => {
    if (!slug) return;
    // Clear whatever was on screen before fetching — otherwise navigating
    // from one member's page straight to another briefly (or, if the new
    // fetch fails, indefinitely) keeps showing the previous person's data.
    setPage(null);
    setErrorStatus(null);
    getPublicPage(slug)
      .then(setPage)
      .catch((err: AxiosError) => {
        setErrorStatus(err.response?.status ?? "unknown");
      });
  }, [slug]);

  if (!page && errorStatus === null) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  if (errorStatus === 404) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">این صفحه یافت نشد</h1>
        <p className="mt-2 opacity-70">شاید هنوز منتشر نشده یا آدرس اشتباه است.</p>
      </div>
    );
  }

  if (errorStatus !== null) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">خطایی رخ داد</h1>
        <p className="mt-2 opacity-70">
          مشکلی در ارتباط با سرور پیش آمد (کد خطا: {errorStatus}). این با «صفحه یافت
          نشد» فرق دارد — احتمالاً یک مشکل فنی سمت سرور است، نه نبودِ این صفحه. اگر
          تازه آپدیت گرفته‌اید، migration پایگاه‌داده را بررسی کنید.
        </p>
      </div>
    );
  }

  if (!page) return null;

  const coverImage = page.media.find((m) => m.type === "HERO_PORTRAIT") ?? page.media[0];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      {/* Hero */}
      <div className="text-center">
        {coverImage ? (
          <img
            src={coverImage.url}
            alt=""
            className="mx-auto h-32 w-32 rounded-full object-cover"
          />
        ) : (
          <div className="mx-auto w-24">
            <BrandMascot />
          </div>
        )}
        <h1 className="mt-4 text-3xl font-bold">
          {page.firstName} {page.lastName}
        </h1>
        {page.page?.tagline && (
          <p className="mt-2 text-lg opacity-80">{page.page.tagline}</p>
        )}
        <p className="mt-1 text-sm opacity-60">
          {page.city}
          {page.professionalField && ` · ${page.professionalField}`}
        </p>
      </div>

      {/* Identity words */}
      {page.page?.identityWords && page.page.identityWords.length > 0 && (
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {page.page.identityWords.map((w, i) => (
            <span
              key={i}
              className="rounded-full px-4 py-1.5 text-sm"
              style={{ backgroundColor: "var(--surface)", color: "var(--accent)" }}
            >
              {w}
            </span>
          ))}
        </div>
      )}

      {/* About */}
      {page.bio && (
        <Card className="mt-8">
          <h2 className="text-lg font-semibold">درباره من</h2>
          <p className="mt-2 text-sm opacity-80">{page.bio}</p>
        </Card>
      )}

      {/* Full profile attributes — everything the participant has completed */}
      {(page.occupation || page.educationLevel || page.fieldOfStudy || page.interests.length > 0) && (
        <Card className="mt-6">
          <h2 className="text-lg font-semibold">مشخصات</h2>
          <dl className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            {page.occupation && (
              <div>
                <dt className="text-xs opacity-60">شغل</dt>
                <dd>{page.occupation}</dd>
              </div>
            )}
            {page.educationLevel && (
              <div>
                <dt className="text-xs opacity-60">سطح تحصیلات</dt>
                <dd>{page.educationLevel}</dd>
              </div>
            )}
            {page.fieldOfStudy && (
              <div>
                <dt className="text-xs opacity-60">رشته تحصیلی</dt>
                <dd>{page.fieldOfStudy}</dd>
              </div>
            )}
            {page.interests.length > 0 && (
              <div className="sm:col-span-2">
                <dt className="mb-1 text-xs opacity-60">علایق حرفه‌ای</dt>
                <dd className="flex flex-wrap gap-1.5">
                  {page.interests.map((i, idx) => (
                    <span
                      key={idx}
                      className="rounded-full px-2.5 py-1 text-xs"
                      style={{ backgroundColor: "var(--surface)" }}
                    >
                      {i}
                    </span>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </Card>
      )}

      {/* Skill endorsements — LinkedIn-style تأیید/رد */}
      <EndorsementSection page={page} />

      {/* 30-second intro */}
      {page.page?.introText && (
        <Card className="mt-6">
          <h2 className="text-lg font-semibold">معرفی من</h2>
          <p className="mt-2 text-sm opacity-80">{page.page.introText}</p>
        </Card>
      )}

      {/* Highlighted public responses */}
      {page.highlightedResponses.length > 0 && (
        <Card className="mt-6">
          <h2 className="text-lg font-semibold">مسیر من</h2>
          <div className="mt-3 space-y-3">
            {page.highlightedResponses.map((r, i) => (
              <div key={i}>
                <p className="text-xs opacity-60">{r.question}</p>
                <p className="text-sm">{r.content}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Roadmap */}
      {page.page?.roadmapText && (
        <Card className="mt-6">
          <h2 className="text-lg font-semibold">نقشه آینده</h2>
          <p className="mt-2 text-sm opacity-80">{page.page.roadmapText}</p>
        </Card>
      )}

      {/* Selected feedback */}
      {page.feedback.length > 0 && (
        <Card className="mt-6">
          <h2 className="text-lg font-semibold">دیگران درباره من می‌گویند</h2>
          <div className="mt-3 space-y-3">
            {page.feedback.map((f, i) => (
              <div key={i} className="rounded-lg p-3" style={{ backgroundColor: "var(--surface)" }}>
                <p className="text-sm">{f.answers.q1}</p>
                <p className="mt-1 text-xs opacity-60">— {f.authorName ?? "ناشناس"}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Open feedback form — anyone can leave feedback directly here,
          no private link required (spec-extension per user request). */}
      <OpenFeedbackForm slug={page.slug} firstName={page.firstName} />

      {/* Brand signature — the same mascot as the landing hero, so
          every published page carries a consistent, recognizable mark. */}
      <div className="mt-10 flex flex-col items-center opacity-60">
        <div className="w-10">
          <BrandMascot />
        </div>
        <span className="mt-1 text-xs">فستیوال برند شخصی</span>
        <span className="mt-0.5 text-[10px] opacity-40">build: 2026-09-06-tags</span>
      </div>
    </div>
  );
}

function PublicArtifacts({ slug }: { slug: string }) {
  const [items, setItems] = useState<ArtifactItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [myScore, setMyScore] = useState<Record<string, number>>({});

  useEffect(() => {
    getPublicArtifacts(slug)
      .then(setItems)
      .catch(() => setItems([]));
  }, [slug]);

  if (items === null) return null;
  if (items.length === 0) return null;

  const handleRate = async (id: string, score: number) => {
    setMyScore((s) => ({ ...s, [id]: score }));
    try {
      const r = await rateArtifact(id, score);
      setItems((prev) => prev!.map((a) => a.id === id ? { ...a, averageRating: r.averageRating, ratingsCount: r.ratingsCount } : a));
    } catch (err) {
      setMyScore((s) => ({ ...s, [id]: 0 }));
      setError((err as AxiosError<{ message?: string }>).response?.data?.message ?? "برای امتیازدهی ابتدا وارد حساب شوید.");
    }
  };

  const handleComment = async (id: string) => {
    const text = (commentText[id] ?? "").trim();
    if (!text) return;
    try {
      const c = await commentArtifact(id, text);
      setItems((prev) => prev!.map((a) => a.id === id ? { ...a, comments: [c, ...(a.comments ?? [])] } : a));
      setCommentText((t) => ({ ...t, [id]: "" }));
    } catch (err) {
      setError((err as AxiosError<{ message?: string }>).response?.data?.message ?? "برای ثبت نظر ابتدا وارد حساب شوید.");
    }
  };

  return (
    <Card className="mt-6">
      <h2 className="text-lg font-bold mb-4">آثار</h2>
      {error && <p className="text-sm text-rose-500 mb-3">{error}</p>}
      <ul className="space-y-6">
        {items.map((a) => (
          <li key={a.id} className="rounded-xl border p-4">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs rounded-full bg-indigo-50 text-indigo-700 px-2 py-0.5">{a.axis}</span>
              <span className="text-xs text-gray-400">{a.templateTitle}</span>
            </div>
            <p className="font-bold">{a.title}</p>
            {a.description && <p className="text-sm text-gray-600 mt-1">{a.description}</p>}

            {a.mediaType === "IMAGE" && a.mediaUrl && (
              <img src={a.mediaUrl || undefined} alt={a.title} className="mt-3 rounded-lg max-h-80 object-cover w-full" />
            )}
            {a.mediaType === "VIDEO" && (
              <a href={a.mediaUrl || undefined} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 underline mt-2 inline-block">مشاهده ویدیو</a>
            )}
            {a.mediaType === "AUDIO" && (
              <audio controls src={a.mediaUrl || undefined} className="mt-3 w-full" />
            )}
            {a.mediaType === "LINK" && (
              <a href={a.mediaUrl || undefined} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 underline mt-2 inline-block">مشاهده لینک</a>
            )}
            {a.mediaType === "DOCUMENT" && (
              <a href={a.mediaUrl || undefined} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 underline mt-2 inline-block">دانلود سند</a>
            )}

            <div className="flex items-center gap-1 mt-3" dir="ltr">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => handleRate(a.id, s)}
                  className={`text-xl transition ${s <= (myScore[a.id] ?? 0) ? "text-amber-400" : "text-gray-300 hover:text-amber-300"}`}>★</button>
              ))}
              <span className="text-xs text-gray-500 mr-2">⭐ {a.averageRating} ({a.ratingsCount} رأی)</span>
            </div>

            <div className="mt-4 border-t pt-3 space-y-2">
              {(a.comments ?? []).map((c: ArtifactCommentItem) => (
                <div key={c.id} className="text-sm">
                  <span className="font-semibold">
                    {((c?.user as any)?.participantProfile ? `${(c.user as any).participantProfile.firstName || ""} ${(c.user as any).participantProfile.lastName || ""}`.trim() : (c?.user as any)?.fullName || "کاربر")}
                  </span>
                  <span className="text-gray-600">: {c.content}</span>
                </div>
              ))}
              <div className="flex gap-2">
                <Input value={commentText[a.id] ?? ""} placeholder="نظر خود را بنویسید..."
                  onChange={(e) => setCommentText((t) => ({ ...t, [a.id]: e.target.value }))} />
                <Button variant="ghost" onClick={() => handleComment(a.id)}>ارسال</Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
