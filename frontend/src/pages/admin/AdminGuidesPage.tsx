import { useEffect, useMemo, useState } from "react";
import { Button, Card, ErrorText, Input, LoadError, Spinner, Textarea } from "../../components/ui";
import {
  addSlide,
  deleteGuide,
  deleteSlide,
  Guide,
  GuideSlide,
  listAllGuides,
  upsertGuide,
  updateSlide,
} from "../../api/guides";

type GuideForm = {
  pagePath: string;
  title: string;
  isEnabled: boolean;
};

const emptyGuideForm: GuideForm = { pagePath: "/", title: "", isEnabled: true };

type SlideCreateForm = {
  title: string;
  description: string;
  order: number;
  imageFile: File | null;
};

const emptySlideCreateForm: SlideCreateForm = { title: "", description: "", order: 0, imageFile: null };

type SlideEditForm = {
  title: string;
  description: string;
  order: number;
  imageFile: File | null;
};

function buildSlideFormData(data: { title: string; description: string; order: number; imageFile?: File | null }) {
  const fd = new FormData();
  fd.append("title", data.title);
  fd.append("description", data.description);
  fd.append("order", String(data.order));
  if (data.imageFile) fd.append("image", data.imageFile);
  return fd;
}

export function AdminGuidesPage() {
  const [guides, setGuides] = useState<Guide[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [guideForm, setGuideForm] = useState<GuideForm>(emptyGuideForm);

  const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null);
  const selectedGuide = useMemo(
    () => guides?.find((g) => g.id === selectedGuideId) || null,
    [guides, selectedGuideId]
  );

  const [slideCreate, setSlideCreate] = useState<SlideCreateForm>(emptySlideCreateForm);

  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const editingSlide = useMemo<GuideSlide | null>(() => {
    if (!selectedGuide || !editingSlideId) return null;
    return selectedGuide.slides?.find((s) => s.id === editingSlideId) || null;
  }, [selectedGuide, editingSlideId]);

  const [slideEdit, setSlideEdit] = useState<SlideEditForm | null>(null);

  const load = async () => {
    setError(null);
    try {
      const data = await listAllGuides();
      setGuides(data);
      if (data.length && !selectedGuideId) setSelectedGuideId(data[0].id);
    } catch (e: any) {
      setError(e?.message || "خطا در دریافت لیست راهنماها");
      setGuides(null);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectGuide = (id: string) => {
    setSelectedGuideId(id);
    setEditingSlideId(null);
    setSlideEdit(null);
    setSlideCreate(emptySlideCreateForm);
  };

  const onSubmitGuide = async () => {
    setBusy(true);
    setError(null);
    try {
      if (!guideForm.pagePath?.trim()) throw new Error("pagePath الزامی است (مثلاً / یا /signup)");
      const payload = {
        pagePath: guideForm.pagePath.trim(),
        title: guideForm.title?.trim() || undefined,
        isEnabled: guideForm.isEnabled,
      };
      await upsertGuide(payload);
      await load();
      const fresh = await listAllGuides();
      setGuides(fresh);
      const found = fresh.find((g) => g.pagePath === payload.pagePath);
      if (found) setSelectedGuideId(found.id);
      setGuideForm(emptyGuideForm);
    } catch (e: any) {
      setError(e?.message || "خطا در ثبت/ویرایش راهنما");
    } finally {
      setBusy(false);
    }
  };

  const onDeleteGuide = async () => {
    if (!selectedGuide) return;
    if (!confirm(`راهنمای صفحه ${selectedGuide.pagePath} حذف شود؟`)) return;
    setBusy(true);
    setError(null);
    try {
      await deleteGuide(selectedGuide.id);
      await load();
      setSelectedGuideId(null);
    } catch (e: any) {
      setError(e?.message || "خطا در حذف راهنما");
    } finally {
      setBusy(false);
    }
  };

  const onAddSlide = async () => {
    if (!selectedGuide) return;
    setBusy(true);
    setError(null);
    try {
      if (!slideCreate.title.trim()) throw new Error("عنوان اسلاید الزامی است");
      const fd = buildSlideFormData({
        title: slideCreate.title.trim(),
        description: slideCreate.description,
        order: Number(slideCreate.order ?? 0),
        imageFile: slideCreate.imageFile,
      });
      await addSlide(selectedGuide.id, fd);
      setSlideCreate(emptySlideCreateForm);
      await load();
    } catch (e: any) {
      setError(e?.message || "خطا در افزودن اسلاید");
    } finally {
      setBusy(false);
    }
  };

  const startEditSlide = (slide: GuideSlide) => {
    setEditingSlideId(slide.id);
    setSlideEdit({
      title: slide.title || "",
      description: slide.description || "",
      order: slide.order ?? 0,
      imageFile: null,
    });
  };

  const cancelEditSlide = () => {
    setEditingSlideId(null);
    setSlideEdit(null);
  };

  const onUpdateSlide = async () => {
    if (!editingSlideId || !slideEdit) return;
    setBusy(true);
    setError(null);
    try {
      if (!slideEdit.title.trim()) throw new Error("عنوان اسلاید الزامی است");
      const fd = buildSlideFormData({
        title: slideEdit.title.trim(),
        description: slideEdit.description,
        order: Number(slideEdit.order ?? 0),
        imageFile: slideEdit.imageFile,
      });
      await updateSlide(editingSlideId, fd);
      await load();
      cancelEditSlide();
    } catch (e: any) {
      setError(e?.message || "خطا در ویرایش اسلاید");
    } finally {
      setBusy(false);
    }
  };

  const onDeleteSlide = async (slideId: string) => {
    if (!confirm("این اسلاید حذف شود؟")) return;
    setBusy(true);
    setError(null);
    try {
      await deleteSlide(slideId);
      await load();
      if (editingSlideId === slideId) cancelEditSlide();
    } catch (e: any) {
      setError(e?.message || "خطا در حذف اسلاید");
    } finally {
      setBusy(false);
    }
  };

  if (error && !guides) return <LoadError message={error} onRetry={load} />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">مدیریت راهنماهای صفحات (Guides)</h1>
        <Button onClick={load} disabled={busy}>
          بروزرسانی
        </Button>
      </div>

      {error && <ErrorText>{error}</ErrorText>}
      {(!guides || busy) && <Spinner />}

      <Card className="p-4 space-y-3">
        <h2 className="font-semibold">افزودن/ویرایش راهنمای یک صفحه</h2>

        <div className="grid md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <div className="text-sm opacity-70">pagePath</div>
            <Input
              value={guideForm.pagePath}
              onChange={(e) => setGuideForm((p) => ({ ...p, pagePath: e.target.value }))}
              placeholder="/ یا /signup یا /dashboard"
              dir="ltr"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <div className="text-sm opacity-70">عنوان (اختیاری)</div>
            <Input
              value={guideForm.title}
              onChange={(e) => setGuideForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="مثلاً: راهنمای خوش‌آمدگویی"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={guideForm.isEnabled}
            onChange={(e) => setGuideForm((p) => ({ ...p, isEnabled: e.target.checked }))}
          />
          فعال باشد (isEnabled)
        </label>

        <div className="flex gap-2">
          <Button onClick={onSubmitGuide} disabled={busy}>
            ثبت
          </Button>
          <Button
            variant="secondary"
            onClick={() => setGuideForm(emptyGuideForm)}
            disabled={busy}
          >
            پاک‌کردن فرم
          </Button>
        </div>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4 space-y-3">
          <h2 className="font-semibold">راهنماها</h2>

          <div className="space-y-2">
            {(guides || []).map((g) => (
              <button
                key={g.id}
                onClick={() => onSelectGuide(g.id)}
                className={[
                  "w-full text-right p-2 rounded border",
                  selectedGuideId === g.id ? "bg-black/5 border-black/20" : "border-black/10",
                ].join(" ")}
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium" dir="ltr">
                    {g.pagePath}
                  </div>
                  <div className="text-xs opacity-60">{g.isEnabled ? "فعال" : "غیرفعال"}</div>
                </div>
                <div className="text-sm opacity-70">{g.title || "بدون عنوان"}</div>
                <div className="text-xs opacity-60">Slides: {g.slides?.length ?? 0}</div>
              </button>
            ))}
          </div>

          <div className="pt-2 border-t flex items-center justify-between">
            <div className="text-sm opacity-70">
              انتخاب شده: <span dir="ltr">{selectedGuide?.pagePath || "-"}</span>
            </div>
            <Button variant="destructive" onClick={onDeleteGuide} disabled={busy || !selectedGuide}>
              حذف راهنما
            </Button>
          </div>
        </Card>

        <Card className="p-4 space-y-3 md:col-span-2">
          <h2 className="font-semibold">
            اسلایدها {selectedGuide ? <span className="opacity-60">({selectedGuide.pagePath})</span> : null}
          </h2>

          {!selectedGuide ? (
            <div className="text-sm opacity-70">یک راهنما را از لیست سمت چپ انتخاب کنید.</div>
          ) : (
            <>
              <Card className="p-3 space-y-2">
                <div className="font-medium">افزودن اسلاید جدید</div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="text-sm opacity-70">عنوان</div>
                    <Input
                      value={slideCreate.title}
                      onChange={(e) => setSlideCreate((p) => ({ ...p, title: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm opacity-70">ترتیب (order)</div>
                    <Input
                      type="number"
                      value={slideCreate.order}
                      onChange={(e) => setSlideCreate((p) => ({ ...p, order: Number(e.target.value) }))}
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <div className="text-sm opacity-70">توضیحات</div>
                    <Textarea
                      value={slideCreate.description}
                      onChange={(e) => setSlideCreate((p) => ({ ...p, description: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <div className="text-sm opacity-70">تصویر (اختیاری)</div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSlideCreate((p) => ({ ...p, imageFile: e.target.files?.[0] || null }))}
                    />
                  </div>
                </div>

                <Button onClick={onAddSlide} disabled={busy}>
                  افزودن اسلاید
                </Button>
              </Card>

              <div className="space-y-2">
                {(selectedGuide.slides || [])
                  .slice()
                  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                  .map((s) => (
                    <Card key={s.id} className="p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="font-semibold">
                            {s.title} <span className="text-xs opacity-60">(order: {s.order})</span>
                          </div>
                          <div className="text-sm opacity-70 whitespace-pre-wrap">{s.description}</div>
                          {s.imageUrl ? (
                            <a className="text-sm underline" href={s.imageUrl} target="_blank" rel="noreferrer">
                              مشاهده تصویر
                            </a>
                          ) : (
                            <div className="text-xs opacity-60">بدون تصویر</div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button variant="secondary" onClick={() => startEditSlide(s)} disabled={busy}>
                            ویرایش
                          </Button>
                          <Button variant="destructive" onClick={() => onDeleteSlide(s.id)} disabled={busy}>
                            حذف
                          </Button>
                        </div>
                      </div>

                      {editingSlideId === s.id && slideEdit && (
                        <div className="mt-3 pt-3 border-t space-y-2">
                          <div className="font-medium">ویرایش اسلاید</div>

                          <div className="grid md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <div className="text-sm opacity-70">عنوان</div>
                              <Input
                                value={slideEdit.title}
                                onChange={(e) => setSlideEdit((p) => (p ? { ...p, title: e.target.value } : p))}
                              />
                            </div>

                            <div className="space-y-1">
                              <div className="text-sm opacity-70">ترتیب (order)</div>
                              <Input
                                type="number"
                                value={slideEdit.order}
                                onChange={(e) =>
                                  setSlideEdit((p) => (p ? { ...p, order: Number(e.target.value) } : p))
                                }
                                dir="ltr"
                              />
                            </div>

                            <div className="space-y-1 md:col-span-2">
                              <div className="text-sm opacity-70">توضیحات</div>
                              <Textarea
                                value={slideEdit.description}
                                onChange={(e) =>
                                  setSlideEdit((p) => (p ? { ...p, description: e.target.value } : p))
                                }
                                rows={3}
                              />
                            </div>

                            <div className="space-y-1 md:col-span-2">
                              <div className="text-sm opacity-70">تعویض/افزودن تصویر (اختیاری)</div>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  setSlideEdit((p) => (p ? { ...p, imageFile: e.target.files?.[0] || null } : p))
                                }
                              />
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button onClick={onUpdateSlide} disabled={busy}>
                              ذخیره
                            </Button>
                            <Button variant="secondary" onClick={cancelEditSlide} disabled={busy}>
                              بستن
                            </Button>
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
