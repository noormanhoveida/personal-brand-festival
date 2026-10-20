import { useEffect, useState } from "react";
import { Situation, createSituation, listSituations } from "../../api/situations";
import {
  GenerateQuestionsResult,
  TraitImportResult,
  TraitWithWeights,
  generateSituationalQuestions,
  listAllTraits,
  uploadTraitsExcel,
} from "../../api/traits";
import { Button, Card, ErrorText, Input, Spinner } from "../../components/ui";

export function AdminSituationsPage() {
  const [situations, setSituations] = useState<Situation[] | null>(null);
  const [traits, setTraits] = useState<TraitWithWeights[] | null>(null);
  const [key, setKey] = useState("");
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [importResult, setImportResult] = useState<TraitImportResult | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generateResult, setGenerateResult] = useState<GenerateQuestionsResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const reload = () => {
    setLoadError(null);
    listSituations()
      .then(setSituations)
      .catch(() => setLoadError("بارگذاری موقعیت‌ها با خطا مواجه شد — احتمالاً migration پایگاه‌داده هنوز اجرا نشده."));
    listAllTraits()
      .then(setTraits)
      .catch(() => setLoadError("بارگذاری صفات با خطا مواجه شد — احتمالاً migration پایگاه‌داده هنوز اجرا نشده."));
  };

  useEffect(reload, []);

  const handleCreateSituation = async () => {
    if (!key.trim() || !title.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await createSituation(key.trim(), title.trim());
      setKey("");
      setTitle("");
      reload();
    } catch {
      setError("ساخت موقعیت با خطا مواجه شد — شاید این کلید قبلاً استفاده شده.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    setImportResult(null);
    try {
      const result = await uploadTraitsExcel(file);
      setImportResult(result);
      reload();
    } catch {
      setError("بارگذاری فایل با خطا مواجه شد.");
    } finally {
      setUploading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    setGenerateResult(null);
    try {
      const result = await generateSituationalQuestions();
      setGenerateResult(result);
    } catch {
      setError("ساخت سؤالات با خطا مواجه شد.");
    } finally {
      setGenerating(false);
    }
  };

  if (loadError) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <p className="text-sm" style={{ color: "#e0705f" }}>{loadError}</p>
      </div>
    );
  }

  if (!situations || !traits) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">موقعیت‌ها و صفات</h1>
      <p className="mt-1 text-sm opacity-70">
        هر صفت (مثلاً «خلاقیت») می‌تواند در هر موقعیت یک «نحوه بیان» مخصوص به خودش
        داشته باشد — یعنی جمله‌ای که همان ویژگی را در آن موقعیت خاص توصیف می‌کند. هر
        نحوه بیان دو وزن دارد: وزنی که وقتی در موقعیت خودش انتخاب شود می‌گیرد (وزن
        کامل)، و وزنی که وقتی در موقعیت دیگری انتخاب شود می‌گیرد (وزن نامتناسب،
        معمولاً کمتر). همه‌چیز کاملاً خودکار محاسبه می‌شود — بدون نیاز به امتیازدهی
        دستی ارزیاب.
      </p>

      {/* Create situation */}
      <Card className="mt-6">
        <h2 className="mb-3 text-sm font-semibold">ساخت موقعیت جدید</h2>
        <div className="flex flex-wrap gap-2">
          <Input placeholder="کلید (انگلیسی، یکتا) مثلاً hiring" value={key} onChange={(e) => setKey(e.target.value)} className="max-w-[180px]" />
          <Input placeholder="عنوان — مثلاً مصاحبه استخدام" value={title} onChange={(e) => setTitle(e.target.value)} className="max-w-xs" />
          <Button onClick={handleCreateSituation} disabled={saving || !key.trim() || !title.trim()}>
            افزودن موقعیت
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {situations.map((s) => (
            <span key={s.id} className="rounded-full px-3 py-1 text-xs" style={{ backgroundColor: "var(--surface)" }}>
              {s.title}
            </span>
          ))}
          {situations.length === 0 && <p className="text-xs opacity-60">هنوز موقعیتی ساخته نشده.</p>}
        </div>
      </Card>

      {/* Excel bulk import */}
      <Card className="mt-6">
        <h2 className="mb-2 text-sm font-semibold">بارگذاری دسته‌ای صفات و سؤالات از اکسل</h2>
        <p className="mb-3 text-xs opacity-60">
          فایل اکسل باید دو شیت داشته باشد (هر دو اختیاری‌اند — می‌توانید فقط یکی را
          هم بفرستید):
        </p>
        <p className="mb-1 text-xs font-semibold">شیت «Expressions» — نحوه‌بیان‌ها</p>
        <ul className="mb-3 list-inside list-disc text-xs opacity-70">
          <li><b>Trait</b> / صفت — نام پایه‌ی ویژگی، مثلاً «خلاقیت»</li>
          <li><b>Situation</b> / موقعیت — مثلاً «مصاحبه استخدام»؛ اگر نساخته باشید خودکار ساخته می‌شود</li>
          <li><b>Text</b> / نحوه بیان — جمله‌ی مخصوص این صفت در این موقعیت (اختیاری)</li>
          <li><b>Weight</b> / وزن — امتیاز وقتی این نحوه بیان در موقعیت خودش انتخاب شود</li>
          <li><b>MismatchWeight</b> / وزن نامتناسب — امتیاز وقتی همین نحوه بیان در موقعیتی دیگر انتخاب شود (اختیاری، پیش‌فرض ۰)</li>
        </ul>
        <p className="mb-1 text-xs font-semibold">شیت «SituationalQuestions» — سؤالات آماده</p>
        <ul className="mb-3 list-inside list-disc text-xs opacity-70">
          <li><b>Trait</b>, <b>Situation</b> — همان صفت/موقعیت بالا</li>
          <li><b>Question</b> — متن سؤال</li>
          <li><b>OptionA</b> تا <b>OptionD</b> — چهار گزینه</li>
          <li><b>CorrectOption</b> — یکی از حروف A تا D (حرف ذخیره می‌شود، نه شماره)</li>
          <li><b>WeightCorrect</b>, <b>WeightIncorrect</b> — امتیاز پاسخ درست/غلط (اگر خالی باشد، از ردیف هم‌شماره‌ی شیت Expressions خوانده می‌شود)</li>
        </ul>
        <p className="mb-3 text-xs opacity-60">
          سرستون‌ها به بزرگی/کوچکی حروف حساس نیستند. ردیف n از این شیت با ردیف n از
          شیت Expressions متناظر است.
        </p>
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
          }}
          className="text-sm"
        />
        {uploading && <p className="mt-2 text-xs opacity-60">در حال پردازش فایل...</p>}
        {importResult && (
          <div className="mt-3 space-y-2 rounded-lg p-3 text-xs" style={{ backgroundColor: "var(--surface)" }}>
            <p>
              نحوه‌بیان‌ها: {importResult.expressions.imported} از{" "}
              {importResult.expressions.totalRows} ردیف با موفقیت وارد شد.
            </p>
            {importResult.expressions.errors.length > 0 && (
              <ul className="list-inside list-disc opacity-70">
                {importResult.expressions.errors.slice(0, 10).map((e, i) => (
                  <li key={`exp-${i}`}>{e}</li>
                ))}
              </ul>
            )}
            <p>
              سؤالات: {importResult.questions.imported} از{" "}
              {importResult.questions.totalRows} ردیف با موفقیت وارد شد.
            </p>
            {importResult.questions.errors.length > 0 && (
              <ul className="list-inside list-disc opacity-70">
                {importResult.questions.errors.slice(0, 10).map((e, i) => (
                  <li key={`q-${i}`}>{e}</li>
                ))}
              </ul>
            )}
          </div>
        )}
        <ErrorText>{error}</ErrorText>
      </Card>

      {/* Generate the question bank */}
      <Card className="mt-6">
        <h2 className="mb-2 text-sm font-semibold">ساخت خودکار سؤالات (فقط برای فایل‌های بدون شیت سؤالات)</h2>
        <p className="mb-3 text-xs opacity-60">
          اگر فایل اکسل شما فقط شیت Expressions را داشت (و شیت
          SituationalQuestions را نداشت)، این دکمه را بزنید تا برای هر ترکیب
          (صفت × موقعیت) که حداقل در دو موقعیت نحوه بیان دارد، یک سؤال تستی
          خودکار ساخته شود. اگر فایل شما شیت SituationalQuestions را داشت، نیازی
          به این دکمه نیست — سؤالات همان لحظه‌ی آپلود مستقیماً وارد شده‌اند. این
          عملیات ایمن است و سؤالات تکراری دوباره نمی‌سازد.
        </p>
        <Button onClick={handleGenerate} disabled={generating}>
          {generating ? "در حال ساخت..." : "ساخت سؤالات موقعیتی"}
        </Button>
        {generateResult && (
          <p className="mt-2 text-xs opacity-70">
            {generateResult.created} سؤال جدید ساخته شد، {generateResult.skipped} مورد
            از قبل وجود داشت (از بین {generateResult.traitsConsidered} صفت بررسی‌شده).
          </p>
        )}
      </Card>

      {/* Current traits */}
      <h2 className="mt-8 text-lg font-semibold">صفات موجود ({traits.length})</h2>
      <div className="mt-3 space-y-2">
        {traits.map((t) => (
          <Card key={t.id} className="py-3">
            <div className="text-sm font-medium">{t.name}</div>
            <div className="mt-2 space-y-1">
              {t.weights.map((w, i) => (
                <div key={i} className="rounded-lg px-2 py-1 text-xs" style={{ backgroundColor: "var(--surface)" }}>
                  <span className="font-medium">{w.situation.title}</span>
                  {w.text && <span className="opacity-70"> — «{w.text}»</span>}
                  <span className="mr-2 opacity-60">
                    وزن: {w.weight} · وزن نامتناسب: {w.mismatchWeight}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))}
        {traits.length === 0 && <p className="text-sm opacity-60">هنوز صفتی ثبت نشده است.</p>}
      </div>
    </div>
  );
}
