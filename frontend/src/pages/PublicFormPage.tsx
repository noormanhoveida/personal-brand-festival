import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FormDetail, getPublicFormByIdOrSlug, submitFormAnswer } from "../api/forms";
import { uploadMedia } from "../api/media";
import { Button, Card, Input, Label, LoadError, Spinner, Textarea } from "../components/ui";
import { useAppSelector } from "../hooks/redux";

export function PublicFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { slug } = useParams<{ slug: string }>();
  const [form, setForm] = useState<FormDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // User auth check
  const authState = useAppSelector((s) => s.auth);
  const isAuthenticated = authState.status === "authenticated";

  // Guest inputs
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  // Answers State
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const loadForm = async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getPublicFormByIdOrSlug(slug);
      setForm(data);
    } catch {
      setError("فرم مورد نظر یافت نشد یا در حال حاضر فعال نیست.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForm();
  }, [slug]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
    }
  }, [loading, isAuthenticated, location.pathname, navigate]);

  const handleValueChange = (questionId: string, val: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: val }));
  };

  const handlePhotoUpload = async (questionId: string, file: File) => {
    try {
      const media = await uploadMedia(file, "GALLERY");
      handleValueChange(questionId, media.url);
    } catch {
      alert("خطا در آپلود عکس");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    if (!isAuthenticated && !guestEmail.trim()) {
      setSubmitError("لطفاً ایمیل خود را برای ثبت پاسخ وارد نمایید.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const items = Object.entries(answers).map(([questionId, value]) => ({
      questionId,
      value,
    }));

    try {
      await submitFormAnswer(form.id, {
        guestEmail: guestEmail.trim() || undefined,
        guestName: guestName.trim() || undefined,
        items,
      });
      setSubmitSuccess(true);
    } catch (err: any) {
      setSubmitError(err.response?.data?.error || "خطا در ثبت پاسخ‌های فرم");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (error || !form) {
    return <LoadError message={error || "فرم یافت نشد"} onRetry={loadForm} />;
  }

  if (submitSuccess) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <Card className="space-y-4">
          <div className="text-4xl">🎉</div>
          <h1 className="text-xl font-bold">پاسخ شما با موفقیت ثبت شد!</h1>
          <p className="text-xs opacity-70">با تشکر از مشارکت و زمان شما برای تکمیل این فرم.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-8 px-4">
      <Card className="space-y-2 border-t-4 border-t-[var(--accent)]">
        <h1 className="text-2xl font-bold">{form.title}</h1>
        {form.description && <p className="text-sm opacity-80 leading-relaxed">{form.description}</p>}
      </Card>

      <form onSubmit={handleSubmit} className="space-y-5">
        {!isAuthenticated && (
          <Card className="space-y-3">
            <h2 className="font-semibold text-sm">اطلاعات پاسخ‌دهنده</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <Label>نام و نام‌خانوادگی (اختیاری)</Label>
                <Input
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="علی محمدی"
                />
              </div>
              <div>
                <Label>ایمیل *</Label>
                <Input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="yourname@example.com"
                  required
                />
              </div>
            </div>
          </Card>
        )}

        {form.questions.map((q, idx) => {
          const val = answers[q.id];
          return (
            <Card key={q.id} className="space-y-3">
              <div>
                <div className="flex items-center gap-1.5 font-semibold text-sm">
                  <span>{idx + 1}.</span>
                  <span>{q.label}</span>
                  {q.isRequired && <span className="text-red-400">*</span>}
                </div>
                {q.helpText && <p className="mt-1 text-xs opacity-60">{q.helpText}</p>}
              </div>

              {/* Render by Question Input Type */}
              {q.inputType === "TEXT" && (
                <Input
                  value={val || ""}
                  onChange={(e) => handleValueChange(q.id, e.target.value)}
                  placeholder="پاسخ خود را اینجا بنویسید..."
                  required={q.isRequired}
                />
              )}

              {q.inputType === "LINK" && (
                <Input
                  type="url"
                  value={val || ""}
                  onChange={(e) => handleValueChange(q.id, e.target.value)}
                  placeholder="https://example.com"
                  required={q.isRequired}
                />
              )}

              {q.inputType === "PHOTO" && (
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handlePhotoUpload(q.id, file);
                    }}
                  />
                  {val && <img src={val} alt="uploaded" className="h-32 rounded-lg object-cover" />}
                </div>
              )}

              {q.inputType === "SINGLE_CHOICE" && (
                <div className="space-y-2">
                  {q.options.map((opt) => (
                    <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name={q.id}
                        value={opt}
                        checked={val === opt}
                        onChange={() => handleValueChange(q.id, opt)}
                        required={q.isRequired && !val}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.inputType === "MULTI_CHOICE" && (
                <div className="space-y-2">
                  {q.options.map((opt) => {
                    const currentArr = Array.isArray(val) ? val : [];
                    const isChecked = currentArr.includes(opt);
                    return (
                      <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleValueChange(q.id, [...currentArr, opt]);
                            } else {
                              handleValueChange(
                                q.id,
                                currentArr.filter((o: string) => o !== opt)
                              );
                            }
                          }}
                        />
                        <span>{opt}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </Card>
          );
        })}

        {submitError && <p className="text-xs text-red-400">{submitError}</p>}

        <div className="flex justify-end">
          <Button type="submit" disabled={submitting} className="px-8">
            {submitting ? "در حال ثبت..." : "ارسال پاسخ‌ها"}
          </Button>
        </div>
      </form>
    </div>
  );
}
