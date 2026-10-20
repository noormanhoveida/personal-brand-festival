import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register as registerApi } from "../api/auth";

export function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (password.length < 8) {
      setServerError("رمز عبور باید حداقل ۸ کاراکتر باشد.");
      return;
    }

    setIsSubmitting(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      await registerApi({ email: cleanEmail, password });
      navigate("/verify-email", { state: { email: cleanEmail, channel: "email" } });
    } catch (err: any) {
      setServerError(err?.response?.data?.message ?? "خطایی در ثبت‌نام رخ داد.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-4 px-6 py-24">
      <h1 className="text-2xl font-bold">ثبت‌نام در فستیوال</h1>

      {/* انتخاب روش ثبت‌نام */}
      <div className="flex rounded-lg p-1" style={{ backgroundColor: "var(--surface)" }}>
        <button
          type="button"
          disabled
          title="ثبت‌نام با شماره موبایل به زودی فعال می‌شود"
          className="flex-1 cursor-not-allowed rounded-md py-2 text-sm font-medium opacity-40"
        >
          شماره موبایل (به‌زودی)
        </button>
        <button
          type="button"
          className="flex-1 rounded-md py-2 text-sm font-bold shadow"
          style={{
            backgroundColor: "var(--accent)",
            color: "var(--bg)",
          }}
        >
          ایمیل
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <input
            type="email"
            dir="ltr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
            className="w-full rounded-lg px-4 py-3 text-right"
            style={{ backgroundColor: "var(--surface)" }}
          />
        </div>

        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="رمز عبور (حداقل ۸ کاراکتر)"
            required
            className="w-full rounded-lg px-4 py-3"
            style={{ backgroundColor: "var(--surface)" }}
          />
        </div>

        {serverError && <p className="text-sm text-red-400">{serverError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg py-3 font-semibold transition opacity-90 hover:opacity-100 disabled:opacity-50"
          style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
        >
          {isSubmitting ? "در حال ثبت‌نام..." : "ثبت‌نام"}
        </button>
      </form>

      <div className="text-center text-sm opacity-75">
        قبلاً ثبت‌نام کرده‌اید؟{" "}
        <Link to="/login" className="underline font-bold" style={{ color: "var(--accent)" }}>
          ورود
        </Link>
      </div>
    </div>
  );
}
