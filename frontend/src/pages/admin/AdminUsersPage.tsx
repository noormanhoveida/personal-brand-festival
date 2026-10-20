import React, { useState } from "react";
import { AdminUser, listUsers, updateUserRole, toggleBlockUser, deleteUserApi } from "../../api/admin";
import { Role } from "../../features/auth/authSlice";
import { useAsync } from "../../hooks/useAsync";
import { Card, LoadError, Spinner } from "../../components/ui";

const ROLES: Role[] = ["VISITOR", "PARTICIPANT", "EVALUATOR", "BOOTCAMP_MANAGER", "ADMIN"];
const ROLE_LABEL: Record<Role, string> = {
  VISITOR: "بازدیدکننده",
  PARTICIPANT: "شرکت‌کننده",
  EVALUATOR: "ارزیاب",
  BOOTCAMP_MANAGER: "مدیر بوت‌کمپ",
  ADMIN: "ادمین",
};

export function AdminUsersPage() {
  const { data: rawUsers, error, loading, reload } = useAsync(() => listUsers());
  const [processingId, setProcessingId] = useState<string | null>(null);

  // اطمینان از آرایه بودن داده‌ها
  const users: AdminUser[] = Array.isArray(rawUsers)
    ? rawUsers
    : ((rawUsers as any)?.users || (rawUsers as any)?.data || []);

  const changeRole = async (userId: string, role: Role) => {
    try {
      setProcessingId(userId);
      await updateUserRole(userId, role);
      await reload();
    } catch (err: any) {
      alert("خطا در تغییر نقش: " + (err.response?.data?.message || err.message));
    } finally {
      setProcessingId(null);
    }
  };

  const handleToggleBlock = async (u: AdminUser) => {
    const isCurrentlyBlocked = Boolean(u.isBlocked);
    const actionLabel = isCurrentlyBlocked ? "رفع مسدودیت" : "مسدود کردن";
    const displayName = u.participantProfile
      ? `${u.participantProfile.firstName || ""} ${u.participantProfile.lastName || ""}`.trim()
      : (u.email || u.phone || "کاربر");

    if (!window.confirm(`آیا از ${actionLabel} کاربر «${displayName}» اطمینان دارید؟`)) {
      return;
    }

    try {
      setProcessingId(u.id);
      await toggleBlockUser(u.id, !isCurrentlyBlocked);
      await reload();
    } catch (err: any) {
      alert("خطا در تغییر وضعیت مسدودی: " + (err.response?.data?.message || err.message));
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteUser = async (u: AdminUser) => {
    const displayName = u.participantProfile
      ? `${u.participantProfile.firstName || ""} ${u.participantProfile.lastName || ""}`.trim()
      : (u.email || u.phone || "کاربر");

    if (!window.confirm(`⚠️ هشدار جدی:\nآیا از حذف کامل کاربر «${displayName}» اطمینان دارید؟\nتمام اطلاعات، رزومه و سوابق این کاربر به طور دائم پاک خواهد شد!`)) {
      return;
    }

    try {
      setProcessingId(u.id);
      await deleteUserApi(u.id);
      await reload();
    } catch (err: any) {
      alert("خطا در حذف کاربر: " + (err.response?.data?.message || err.message));
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">مدیریت کاربران سامانه</h1>
          <p className="text-xs text-slate-400 mt-1">
            مشاهده اطلاعات، تعیین نقش، مسدودسازی دسترسی و حذف حساب‌های اسپم/جعلی
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700">
            تعداد کل: {users.length} کاربر
          </span>
          <button
            type="button"
            onClick={() => reload()}
            className="text-xs bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 px-3 py-1.5 rounded-lg border border-amber-500/40 transition"
          >
            بروزرسانی لیست
          </button>
        </div>
      </div>

      {loading && <Spinner />}
      {error && <LoadError message={typeof error === "string" ? error : (error as any)?.message || "خطا در دریافت اطلاعات"} onRetry={reload} />}

      {!loading && !error && users.length === 0 && (
        <Card className="text-center py-12 text-slate-400 text-sm">
          هیچ کاربری در سامانه یافت نشد.
        </Card>
      )}

      <div className="space-y-3">
        {users.map((u) => {
          const isBusy = processingId === u.id;
          const isBlocked = Boolean(u.isBlocked);
          const name = u.participantProfile
            ? `${u.participantProfile.firstName || ""} ${u.participantProfile.lastName || ""}`.trim()
            : null;

          return (
            <Card
              key={u.id}
              className={`p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition ${
                isBlocked ? "border-rose-900/60 bg-rose-950/10 opacity-75" : "border-slate-800 bg-slate-900/60"
              }`}
            >
              {/* مشخصات کاربر */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-white text-sm">
                    {name || "بدون نام"}
                  </span>
                  {isBlocked && (
                    <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full font-medium">
                      مسدود شده
                    </span>
                  )}
                  <span className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-full">
                    {ROLE_LABEL[u.role] || u.role}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                  <span>ایمیل: {u.email || "—"}</span>
                  {u.phone && <span>تلفن: {u.phone}</span>}
                  <span className="opacity-60 text-[11px]">
                    ثبت‌نام: {new Date(u.createdAt).toLocaleDateString("fa-IR")}
                  </span>
                </div>
              </div>

              {/* عملیات و تغییر نقش */}
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  disabled={isBusy}
                  value={u.role}
                  onChange={(e) => changeRole(u.id, e.target.value as Role)}
                  className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {ROLE_LABEL[r]}
                    </option>
                  ))}
                </select>

                {/* دکمه مسدود / رفع مسدودیت */}
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => handleToggleBlock(u)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                    isBlocked
                      ? "bg-amber-600/20 text-amber-300 border border-amber-600/40 hover:bg-amber-600/30"
                      : "bg-slate-800 text-slate-300 border border-slate-700 hover:border-amber-500 hover:text-amber-300"
                  }`}
                  title={isBlocked ? "فعال‌سازی مجدد حساب کاربر" : "مسدودسازی دسترسی کاربر"}
                >
                  {isBlocked ? "رفع مسدودیت" : "مسدود کردن"}
                </button>

                {/* دکمه حذف دائمی */}
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => handleDeleteUser(u)}
                  className="text-xs px-3 py-1.5 rounded-lg font-medium bg-rose-600/20 text-rose-300 border border-rose-600/40 hover:bg-rose-600/40 transition"
                  title="حذف کامل و قطعی کاربر از پایگاه‌داده"
                >
                  حذف کاربر
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
