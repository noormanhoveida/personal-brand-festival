import { useNavigate } from "react-router-dom";
import { logout, changePassword } from "../api/auth";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { clearSession } from "../features/auth/authSlice";
import { ThemeSwitcher } from "../features/theme/ThemeSwitcher";
import { Button, Card } from "../components/ui";

const ROLE_LABEL: Record<string, string> = {
  VISITOR: "بازدیدکننده",
  PARTICIPANT: "شرکت‌کننده",
  EVALUATOR: "ارزیاب",
  BOOTCAMP_MANAGER: "مدیر بوت‌کمپ",
  ADMIN: "ادمین",
};

export function SettingsPage() {
  const role = useAppSelector((s) => s.auth.role);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      dispatch(clearSession());
      navigate("/login");
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-bold">تنظیمات</h1>

      <Card className="mt-6">
        <div className="text-sm">
          <span className="opacity-60">نقش شما: </span>
          {role ? ROLE_LABEL[role] : "—"}
        </div>
      </Card>

      <Card className="mt-4 flex items-center justify-between">
        <span className="text-sm">پوسته</span>
        <ThemeSwitcher />
      </Card>

      <Card className="mt-6">
        <h2 className="text-lg font-semibold mb-4">تغییر رمز عبور</h2>
        <ChangePasswordForm />
      </Card>
  

      <Button variant="ghost" className="mt-6" onClick={handleLogout}>
        خروج از حساب
      </Button>
    </div>
  );
}

function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    setIsSubmitting(true);
    try {
      const res = await changePassword({ currentPassword, newPassword });
      setMsg(res.message);
      setCurrentPassword("");
      setNewPassword("");
    } catch (e: any) {
      setErr(e?.response?.data?.message || "خطا در تغییر رمز عبور.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        placeholder="رمز عبور فعلی"
        required
        className="w-full rounded-lg px-4 py-2"
        style={{ backgroundColor: "var(--surface)" }}
      />
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="رمز عبور جدید (حداقل ۸ کاراکتر)"
        required
        className="w-full rounded-lg px-4 py-2"
        style={{ backgroundColor: "var(--surface)" }}
      />
      {err && <p className="text-sm text-red-400">{err}</p>}
      {msg && <p className="text-sm text-green-400">{msg}</p>}
      <Button type="submit" disabled={isSubmitting} className="mt-2 w-fit">
        {isSubmitting ? "در حال ثبت..." : "به‌روزرسانی رمز عبور"}
      </Button>
    </form>
  );
}
