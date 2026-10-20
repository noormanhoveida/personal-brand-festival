import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import {
  ARTIFACT_AXES, ArtifactItem, CreateArtifactInput, ArtifactGuideData,
  createArtifact, deleteArtifact, getMyArtifacts, getArtifactGuide
} from "../api/artifact";
import { Button, Card, ErrorText, Input, Label, Spinner, Textarea } from "./ui";

const MEDIA_TYPES: { value: string; label: string }[] = [
  { value: "LINK", label: "پیوند اینترنتی (Link)" },
  { value: "DOCUMENT", label: "فایل و سند (Document)" },
  { value: "IMAGE", label: "تصویر (Image)" },
  { value: "VIDEO", label: "ویدیو (Video)" },
  { value: "AUDIO", label: "صوت و پادکست (Audio)" },
];

const STATUS_BADGE: Record<string, string> = {
  PENDING: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
  APPROVED: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  REJECTED: "bg-rose-500/20 text-rose-400 border border-rose-500/30",
};
const STATUS_LABEL: Record<string, string> = {
  PENDING: "در انتظار بررسی",
  APPROVED: "تایید شده",
  REJECTED: "رد شده",
};

function FieldHelp({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <span className="relative inline-flex items-center group cursor-help mr-1.5 align-middle">
      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-bold group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
        i
      </span>
      <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block group-focus:block z-50 w-64 p-2.5 rounded-lg bg-slate-900 border border-amber-500/40 text-slate-200 text-xs shadow-2xl shadow-black/80 leading-relaxed pointer-events-none">
        {text}
        <span className="absolute top-full right-2 border-4 border-transparent border-t-slate-900"></span>
      </div>
    </span>
  );
}

function pickError(err: unknown, fallback: string): string {
  const ax = err as AxiosError<any>;
  const d = ax?.response?.data;
  if (d?.error) return d.error;
  if (d?.message) return d.message;
  return fallback;
}

export function MyArtifacts() {
  const [items, setItems] = useState<ArtifactItem[]>([]);
  const [guide, setGuide] = useState<ArtifactGuideData | null>(null);
  const [showCriteria, setShowCriteria] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CreateArtifactInput>({
    axis: ARTIFACT_AXES[0],
    templateTitle: "",
    title: "",
    description: "",
    mediaType: "LINK",
    mediaUrl: "",
    coverImageUrl: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const load = async () => {
    try {
      const [userArtifacts, guideData] = await Promise.all([
        getMyArtifacts(),
        getArtifactGuide().catch(() => null),
      ]);
      setItems(Array.isArray(userArtifacts) ? userArtifacts : []);
      if (guideData) setGuide(guideData);
    } catch (err) {
      setError(pickError(err, "خطا در دریافت اطلاعات"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const currentAxisGuide = guide?.axes?.find((a: any) => a.name === form.axis);
  const tooltips = guide?.tooltips || {};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      await createArtifact(form);
      setSuccess("اثر شما با موفقیت ثبت شد و پس از بررسی تیم داوران، تایید و منتشر خواهد شد.");
      setForm({
        ...form,
        templateTitle: "",
        title: "",
        description: "",
        mediaUrl: "",
        coverImageUrl: "",
      });
      await load();
    } catch (err) {
      setError(pickError(err, "ثبت اثر ناموفق بود"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("آیا از حذف این اثر اطمینان دارید؟")) return;
    try {
      await deleteArtifact(id);
      await load();
    } catch (err) {
      setError(pickError(err, "حذف ناموفق بود"));
    }
  };

  if (loading) return <Card className="mt-6"><Spinner /></Card>;

  return (
    <Card className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <h2 className="text-xl font-bold text-amber-400">آثار و دستاوردهای من</h2>
        {guide?.judgingCriteria && (
          <button
            type="button"
            onClick={() => setShowCriteria(!showCriteria)}
            className="text-xs text-amber-300 hover:text-amber-200 underline font-medium"
          >
            {showCriteria ? "بستن معیارهای داوری ▲" : "مشاهده معیارهای داوری جشنواره ▼"}
          </button>
        )}
      </div>

      <p className="text-sm text-slate-400 mb-4">
        {guide?.generalDescription || "آثار خود را در شش محور ثبت کنید؛ پس از تایید داوران در صفحه عمومی نمایش داده می‌شوند."}
      </p>

      {showCriteria && guide?.judgingCriteria && (
        <div className="mb-6 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-slate-200">
          <h4 className="font-bold text-sm text-amber-300 mb-2">⚖️ معیارهای ارزیابی و داوری آثار:</h4>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
            {guide.judgingCriteria.map((crit: any, idx: number) => (
              <li key={idx}>{crit}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2 border-b border-slate-700/60 pb-6 mb-6">
        <div>
          <div className="flex items-center mb-1">
            <Label>محور اثر</Label>
            <FieldHelp text={tooltips.axis} />
          </div>
          <select
            value={form.axis}
            onChange={(e) => setForm({ ...form, axis: e.target.value })}
            className="w-full rounded-lg border border-slate-600 bg-slate-900 text-slate-100 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
          >
            {ARTIFACT_AXES.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex items-center mb-1">
            <Label>نوع رسانه</Label>
            <FieldHelp text={tooltips.mediaType} />
          </div>
          <select
            value={form.mediaType}
            onChange={(e) => setForm({ ...form, mediaType: e.target.value as any })}
            className="w-full rounded-lg border border-slate-600 bg-slate-900 text-slate-100 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
          >
            {MEDIA_TYPES.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        {currentAxisGuide && (
          <div className="sm:col-span-2 p-3 rounded-lg border border-slate-700 bg-slate-800/50 text-xs space-y-1">
            <p className="text-amber-300 font-medium">💡 درباره محور {currentAxisGuide.name}:</p>
            <p className="text-slate-300">{currentAxisGuide.description}</p>
            {currentAxisGuide.suggestedTemplates && (
              <p className="text-slate-400">قالب‌های پیشنهادی: <span className="text-amber-200">{currentAxisGuide.suggestedTemplates}</span></p>
            )}
          </div>
        )}

        <div>
          <div className="flex items-center mb-1">
            <Label>عنوان قالب اثر</Label>
            <FieldHelp text={tooltips.templateTitle} />
          </div>
          <Input
            value={form.templateTitle}
            onChange={(e) => setForm({ ...form, templateTitle: e.target.value })}
            placeholder="مثلاً: نقشه راه تخصص من یا مطالعه موردی"
            required
          />
        </div>

        <div>
          <div className="flex items-center mb-1">
            <Label>عنوان اثر</Label>
            <FieldHelp text={tooltips.title} />
          </div>
          <Input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="مثلاً: متدولوژی مدیریت پروژه چابک در تیم‌های فنی"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-center mb-1">
            <Label>لینک رسانه یا فایل اثر (الزامی)</Label>
            <FieldHelp text={tooltips.mediaUrl} />
          </div>
          <Input
            value={form.mediaUrl}
            onChange={(e) => setForm({ ...form, mediaUrl: e.target.value })}
            placeholder="https://..."
            required
          />
          <span className="text-[11px] text-slate-400">آدرس مستقیم لینک گوگل درایو، آپارات، گیتهاب، یوتیوب، فایل مستند یا وبسایت پروژه.</span>
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-center mb-1">
            <Label>لینک تصویر کاور اثر (اختیاری)</Label>
            <FieldHelp text={tooltips.coverImageUrl} />
          </div>
          <Input
            value={form.coverImageUrl}
            onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
            placeholder="https://..."
          />
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-center mb-1">
            <Label>توضیحات و شرح دستاورد</Label>
            <FieldHelp text={tooltips.description} />
          </div>
          <Textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="توضیح دهید این اثر چه مشکلی را حل کرده یا چه ارزشی به وجود آورده است..."
            rows={3}
          />
        </div>

        {error && <div className="sm:col-span-2"><ErrorText>{error}</ErrorText></div>}
        {success && <div className="sm:col-span-2 text-sm text-emerald-400 bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-500/30">{success}</div>}

        <div className="sm:col-span-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "در حال ثبت اثر..." : "ثبت و ارسال اثر برای داوری"}
          </Button>
        </div>
      </form>

      {items.length === 0 ? (
        <p className="text-sm text-slate-400">هنوز اثری در این بخش ثبت نکرده‌اید.</p>
      ) : (
        <ul className="space-y-3">
          {(Array.isArray(items) ? items : []).map((a) => (
            <li key={a.id} className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5">
                    {a.axis}
                  </span>
                  <span className={`text-xs rounded-full px-2 py-0.5 ${STATUS_BADGE[a.status] ?? ""}`}>
                    {STATUS_LABEL[a.status] ?? a.status}
                  </span>
                </div>
                <p className="font-semibold text-slate-100 mt-1">{a.title}</p>
                <p className="text-xs text-slate-400">
                  قالب: {a.templateTitle} · ⭐ {a.averageRating} ({a.ratingsCount} رأی) · 💬 {a.comments?.length ?? 0} نظر
                </p>
                {a.adminNote && (
                  <p className="text-xs text-rose-400 mt-1 bg-rose-950/20 p-1.5 rounded border border-rose-500/20">
                    یادداشت داور: {a.adminNote}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={a.mediaUrl || undefined}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-amber-400 hover:text-amber-300 underline font-medium px-2 py-1"
                >
                  مشاهده فایل / رسانه ↗
                </a>
                <button
                  type="button"
                  onClick={() => handleDelete(a.id)}
                  className="text-xs text-rose-400 hover:text-rose-300 border border-rose-500/30 px-2.5 py-1 rounded-lg hover:bg-rose-950/30 transition"
                >
                  حذف اثر
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
