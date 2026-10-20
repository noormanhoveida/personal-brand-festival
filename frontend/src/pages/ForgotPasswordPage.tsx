import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword, resetPassword } from "../api/auth";

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"request" | "reset">("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      const res = await forgotPassword(email.trim());
      setMessage(res.message);
      setStep("reset");
    } catch (err: any) {
      setError(err?.response?.data?.message || "خطایی رخ داد. مجدداً تلاش کنید.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      const res = await resetPassword({
        email: email.trim(),
        code: code.trim(),
        newPassword,
      });
      setMessage(res.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message || "خطایی رخ داد. کد یا رمز را بررسی کنید.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-4 px-6 py-24">
      <h1 className="text-2xl font-bold">بازیابی رمز عبور</h1>

      {step === "request" ? (
        <form onSubmit={handleRequestSubmit} className="flex flex-col gap-3">
          <p className="text-sm opacity-80">
            ایمیل خود را وارد کنید تا کد بازیابی برای شما ارسال شود.
          </p>

          <input
            type="email"
            dir="ltr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ایمیل شما"
            required
            className="w-full rounded-lg px-4 py-3 text-right"
            style={{ backgroundColor: "var(--surface)" }}
          />

          {error && <p className="text-sm text-red-400">{error}</p>}
          {message && <p className="text-sm text-green-400">{message}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 rounded-full py-3 font-semibold disabled:opacity-50"
            style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
          >
            {isSubmitting ? "در حال ارسال..." : "ارسال کد بازیابی"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetSubmit} className="flex flex-col gap-3">
          <p className="text-sm opacity-80">
            کد ارسال‌شده به ایمیل <strong>{email}</strong> و رمز جدید خود را وارد کنید:
          </p>

          <input
            type="text"
            dir="ltr"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="کد ۶ رقمی"
            required
            className="w-full rounded-lg px-4 py-3 text-center tracking-widest"
            style={{ backgroundColor: "var(--surface)" }}
          />

          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="رمز عبور جدید (حداقل ۸ کاراکتر)"
            required
            className="w-full rounded-lg px-4 py-3"
            style={{ backgroundColor: "var(--surface)" }}
          />

          {error && <p className="text-sm text-red-400">{error}</p>}
          {message && <p className="text-sm text-green-400">{message}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 rounded-full py-3 font-semibold disabled:opacity-50"
            style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
          >
            {isSubmitting ? "در حال تغییر..." : "ثبت رمز جدید"}
          </button>
        </form>
      )}

      <p className="text-center text-sm opacity-70">
        <Link to="/login" style={{ color: "var(--accent)" }}>
          بازگشت به صفحه ورود
        </Link>
      </p>
    </div>
  );
}
