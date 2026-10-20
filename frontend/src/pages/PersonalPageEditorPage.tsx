import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import {
  PersonalPage,
  getOwnPersonalPage,
  publishPersonalPage,
  unpublishPersonalPage,
  updatePersonalPage,
} from "../api/personalPage";
import { getProfile } from "../api/profile";
import { Button, Card, Input, Label, LoadError, Spinner, Textarea } from "../components/ui";

export function PersonalPageEditorPage() {
  const [page, setPage] = useState<PersonalPage | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [tagline, setTagline] = useState("");
  const [identityWords, setIdentityWords] = useState(["", "", "", ""]);
  const [introText, setIntroText] = useState("");
  const [roadmapText, setRoadmapText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getOwnPersonalPage(), getProfile()])
      .then(([p, profileRes]) => {
        setPage(p);
        setSlug(profileRes.profile?.slug ?? null);
        if (p) {
          setTagline(p.tagline ?? "");
          setIdentityWords([0, 1, 2, 3].map((i) => p.identityWords[i] ?? ""));
          setIntroText(p.introText ?? "");
          setRoadmapText(p.roadmapText ?? "");
        }
        setLoading(false);
      })
      .catch(() => {
        setLoadError("بارگذاری صفحه عمومی با خطا مواجه شد.");
        setLoading(false);
      });
  }, []);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    const updated = await updatePersonalPage({
      tagline: tagline || undefined,
      identityWords: identityWords.filter(Boolean),
      introText: introText || undefined,
      roadmapText: roadmapText || undefined,
    });
    setPage(updated);
    setSaving(false);
    setSaved(true);
  };

  const togglePublish = async () => {
    setPublishing(true);
    setPublishError(null);
    try {
      const updated = page?.publishedAt
        ? await unpublishPersonalPage()
        : await publishPersonalPage();
      setPage(updated);
    } catch (err) {
      setPublishError(
        (err as AxiosError<{ message?: string }>).response?.data?.message ??
          "این عملیات با خطا مواجه شد."
      );
    } finally {
      setPublishing(false);
    }
  };

  if (loadError) return <LoadError message={loadError} />;

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  const publicUrl = slug ? `${window.location.origin}/p/${slug}` : null;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">صفحه عمومی من</h1>
        <Button variant={page?.publishedAt ? "ghost" : "primary"} onClick={togglePublish} disabled={publishing}>
          {publishing ? "..." : page?.publishedAt ? "لغو انتشار" : "انتشار صفحه"}
        </Button>
      </div>

      {publishError && (
        <p className="mt-2 text-sm" style={{ color: "#e0705f" }}>
          {publishError}
        </p>
      )}

      {publicUrl && (
        <p className="mt-1 text-sm">
          آدرس عمومی:{" "}
          <a href={publicUrl} target="_blank" rel="noreferrer" style={{ color: "var(--accent)" }}>
            {publicUrl}
          </a>{" "}
          {page?.publishedAt ? "(منتشرشده)" : "(هنوز منتشر نشده)"}
        </p>
      )}

      <Card className="mt-6 space-y-4">
        <div>
          <Label>شعار شخصی (Tagline)</Label>
          <Input value={tagline} onChange={(e) => setTagline(e.target.value)} maxLength={200} />
        </div>

        <div>
          <Label>چهار کلمه هویت من</Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {identityWords.map((w, i) => (
              <Input
                key={i}
                value={w}
                onChange={(e) => {
                  const next = [...identityWords];
                  next[i] = e.target.value;
                  setIdentityWords(next);
                }}
              />
            ))}
          </div>
        </div>

        <div>
          <Label>معرفی ۳۰ ثانیه‌ای</Label>
          <Textarea rows={4} value={introText} onChange={(e) => setIntroText(e.target.value)} />
        </div>

        <div>
          <Label>نقشه آینده حرفه‌ای</Label>
          <Textarea rows={4} value={roadmapText} onChange={(e) => setRoadmapText(e.target.value)} />
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={save} disabled={saving}>
            {saving ? "در حال ذخیره..." : "ذخیره"}
          </Button>
          {saved && <span className="text-xs" style={{ color: "var(--accent)" }}>ذخیره شد ✓</span>}
        </div>
      </Card>
    </div>
  );
}
