import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProfile, ParticipantProfile } from "../api/profile";
import { listBootcamps, Bootcamp } from "../api/bootcamps";
import { listMyResponses, ResponseWithVersions } from "../api/responses";
import { listMyFeedback } from "../api/feedback";
import { getMyPoints } from "../api/approval";
import { getMyPendingForms } from "../api/forms";
import { motion } from "framer-motion";
import { Card, Spinner } from "../components/ui";
import { ApprovedArtifactsCarousel } from "../components/ApprovedArtifactsCarousel";
import { getApprovedArtifacts } from "../api/artifact";

export function DashboardHomePage() {
  const [profile, setProfile] = useState<ParticipantProfile | null>(null);
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);
  const [bootcamps, setBootcamps] = useState<Bootcamp[]>([]);
  const [responses, setResponses] = useState<ResponseWithVersions[]>([]);
  const [pendingFeedback, setPendingFeedback] = useState(0);
  const [points, setPoints] = useState<{ points: number; pending: number } | null>(null);
  const [pendingForms, setPendingForms] = useState<any[]>([]);
  const [approvedArtifacts, setApprovedArtifacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadErrors, setLoadErrors] = useState<string[]>([]);

  useEffect(() => {
    Promise.allSettled([
      getMyPendingForms(),
      getProfile(),
      listBootcamps(),
      listMyResponses(),
      listMyFeedback(),
      getMyPoints(),
      getApprovedArtifacts(),
    ]).then(([pendingFormsRes, profileRes, bootcampsRes, responsesRes, feedbackRes, pointsRes, artifactsRes]) => {
      if (artifactsRes && artifactsRes.status === "fulfilled") setApprovedArtifacts(artifactsRes.value || []);
      if (pendingFormsRes.status === "fulfilled") setPendingForms(pendingFormsRes.value);
      const errors: string[] = [];

      if (profileRes.status === "fulfilled") {
        setProfile(profileRes.value.profile);
        setOnboardingComplete(profileRes.value.onboardingComplete);
      } else {
        errors.push("پروفایل");
      }

      if (bootcampsRes.status === "fulfilled") {
        setBootcamps(bootcampsRes.value);
      } else {
        errors.push("بوت‌کمپ‌ها");
      }

      if (responsesRes.status === "fulfilled") {
        setResponses(responsesRes.value);
      } else {
        errors.push("پاسخ‌ها");
      }

      if (feedbackRes.status === "fulfilled") {
        setPendingFeedback(
          (feedbackRes?.value?.requests || []).reduce((sum, r) => sum + ((r?.responses?.length || 0) === 0 ? 1 : 0), 0)
        );
      } else {
        errors.push("بازخوردها");
      }

      if (pointsRes.status === "fulfilled") {
        setPoints(pointsRes.value);
      } else {
        errors.push("امتیازات");
      }

      setLoadErrors(errors);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
      <Spinner />
      </div>
    );
  }

  if (!onboardingComplete) {
    return (
      <Card className="glass mx-auto max-w-lg text-center p-6">
        <h1 className="text-xl font-bold">به فستیوال برند شخصی خوش آمدید</h1>
        <p className="mt-2 text-sm opacity-70">
          قبل از شروع مسیر، لطفاً چند دقیقه‌ای پروفایل خود را تکمیل کنید.
        </p>
        <Link
          to="/dashboard/profile"
          className="mt-4 inline-block rounded-full px-5 py-2 text-sm font-semibold transition hover:opacity-90"
          style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
        >
          تکمیل پروفایل
        </Link>
      </Card>
    );
  }

  const safeBootcamps = Array.isArray(bootcamps) ? bootcamps : [];
  const safeResponses = Array.isArray(responses) ? responses : [];

  const answeredCount = safeResponses.length;

  const recentActivity = [...safeResponses]
    .flatMap((r) => (Array.isArray(r?.versions) ? r.versions : []).map((v) => ({ ...v, questionText: r?.question?.text || "" })))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const mainActions = [
    {
      title: "مسیر برند من",
      desc: "گام‌به‌گام تا خلق هویت و کشف رسالت فردی",
      to: "/dashboard/journey",
      color: "from-sky-500/20 to-blue-600/20",
      border: "hover:border-sky-500/60",
      badge: "نقشه راه",
      icon: (
        <svg className="w-6 h-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      )
    },
    {
      title: "بوت‌کمپ‌ها / آکادمی",
      desc: "کارگاه‌های تعاملی، وبینارهای زنده و تجربیات عملی",
      to: "/dashboard/bootcamps",
      color: "from-amber-500/20 to-orange-600/20",
      border: "hover:border-amber-500/60",
      badge: "آموزش و رویداد",
      icon: (
        <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      title: "چالش‌های هفتگی",
      desc: "تمرین‌های مأموریتی، ثبت دستاورد و ارزیابی مربیان",
      to: "/dashboard/challenges",
      color: "from-emerald-500/20 to-teal-600/20",
      border: "hover:border-emerald-500/60",
      badge: "اکشن و ارزیابی",
      icon: (
        <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      )
    },
    {
      title: "مسیر تحول",
      desc: "مشاهده رشد، تغییرات خودشناسی و اثرگذاری برند",
      to: "/dashboard/transformation",
      color: "from-purple-500/20 to-pink-600/20",
      border: "hover:border-purple-500/60",
      badge: "گزارش پیشرفت",
      icon: (
        <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* پیام خوش‌آمدگویی و هدایت اولیه */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            سلام {profile?.firstName} 👋
          </h1>
          <p className="mt-1 text-sm opacity-70">به میز کار شخصی خود در فستیوال برند خوش آمدید.</p>
        </div>
      </div>

      {/* اعلان‌های فرم‌های در انتظار تکمیل */}
      {pendingForms.length > 0 && (
        <div className="flex flex-col gap-3">
          {pendingForms.map((pf) => (
            <motion.div
              key={pf.id}
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative overflow-hidden rounded-2xl border-2 border-amber-500/80 bg-gradient-to-r from-amber-500/15 via-amber-600/20 to-orange-500/15 p-4 shadow-lg shadow-amber-500/10"
            >
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-3.5 w-3.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full">فرم در انتظار</span>
                      <h3 className="text-base font-bold text-white">{pf.title}</h3>
                    </div>
                    {pf.description && <p className="text-xs text-zinc-300 mt-0.5">{pf.description}</p>}
                  </div>
                </div>
                <Link
                  to={`/forms/${pf.slug}`}
                  className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-zinc-950 transition hover:bg-amber-400 shadow-md flex items-center gap-1.5"
                >
                  تکمیل فرم ارزیابی
                  <span>←</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {loadErrors.length > 0 && (
        <div
          className="rounded-xl px-4 py-2 text-xs"
          style={{ backgroundColor: "var(--surface)", color: "#e0a63f" }}
        >
          بارگذاری این بخش‌ها با خطا مواجه شد: {loadErrors.join("، ")}.
        </div>
      )}

      {/* ۱. کارت‌های ناوبری اصلی (مراکز اصلی عملکرد) */}
      <div>
        <h2 className="text-sm font-semibold opacity-70 mb-3">بخش‌های اصلی فستیوال</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mainActions.map((item, idx) => (
            <Link
              key={idx}
              to={item.to}
              className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 bg-gradient-to-br ${item.color} ${item.border} hover:-translate-y-1 hover:shadow-xl`}
              style={{ borderColor: "rgba(255,255,255,0.08)", backgroundColor: "var(--surface)" }}
            >
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/10 opacity-80">
                  {item.badge}
                </span>
              </div>
              <h3 className="mt-4 text-base font-bold group-hover:text-amber-400 transition-colors">
                {item.title}
              </h3>
              <p className="mt-1 text-xs opacity-65 leading-relaxed">
                {item.desc}
              </p>
              <div className="mt-3 flex items-center text-xs font-semibold gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                <span>ورود به بخش</span>
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ۲. کارت‌های آماری سریع و کلیک‌پذیر (جمع‌وجور و فشرده) */}
      <div>
        <h2 className="text-sm font-semibold opacity-70 mb-3">وضعیت و آمارهای من</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Link
            to="/dashboard/journey"
            className="group block rounded-xl border p-3.5 transition-all hover:border-sky-500/50 hover:bg-white/5"
            style={{ backgroundColor: "var(--surface)", borderColor: "rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs opacity-60">پاسخ‌های ثبت‌شده</span>
              <span className="text-xs text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity">مشاهده ←</span>
            </div>
            <div className="mt-2 text-2xl font-black text-sky-400">{answeredCount}</div>
            <div className="text-[11px] opacity-40 mt-0.5">در مسیر برند من</div>
          </Link>

          <Link
            to="/dashboard/leaderboards"
            className="group block rounded-xl border p-3.5 transition-all hover:border-amber-500/50 hover:bg-white/5"
            style={{ backgroundColor: "var(--surface)", borderColor: "rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs opacity-60">امتیاز من</span>
              <span className="text-xs text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">رده‌بندی ←</span>
            </div>
            <div className="mt-2 text-2xl font-black text-amber-400">{points?.points ?? 0}</div>
            <div className="text-[11px] opacity-40 mt-0.5">
              {points && points.pending > 0 ? `${points.pending} در انتظار بررسی` : "امتیاز فعال"}
            </div>
          </Link>

          <Link
            to="/dashboard/mirror"
            className="group col-span-2 sm:col-span-1 block rounded-xl border p-3.5 transition-all hover:border-purple-500/50 hover:bg-white/5"
            style={{ backgroundColor: "var(--surface)", borderColor: "rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs opacity-60">بازخورد در انتظار</span>
              <span className="text-xs text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">آینه ←</span>
            </div>
            <div className="mt-2 text-2xl font-black text-purple-400">{pendingFeedback}</div>
            <div className="text-[11px] opacity-40 mt-0.5">درخواست‌های بازخورد ۳۶۰</div>
          </Link>
        </div>
      </div>

      <ApprovedArtifactsCarousel artifacts={approvedArtifacts} loading={loading} />

      {/* ۳. فعالیت‌های اخیر */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold opacity-70">آخرین فعالیت‌های ثبت‌شده</h2>
          <Link to="/dashboard/journey" className="text-xs text-amber-400 hover:underline">
            مشاهده کل مسیر ←
          </Link>
        </div>
        <div className="space-y-2">
          {recentActivity.map((a, i) => (
            <div
              key={i}
              className="rounded-xl border p-3 text-xs leading-relaxed transition-all"
              style={{ backgroundColor: "var(--surface)", borderColor: "rgba(255,255,255,0.05)" }}
            >
              <span className="font-semibold text-amber-400/90">{a.questionText}: </span>
              <span className="opacity-80">{a.content}</span>
            </div>
          ))}
          {recentActivity.length === 0 && (
            <div
              className="rounded-xl border p-5 text-center text-xs opacity-60"
              style={{ backgroundColor: "var(--surface)", borderColor: "rgba(255,255,255,0.05)" }}
            >
              هنوز فعالیتی ثبت نکرده‌اید — از{" "}
              <Link to="/dashboard/journey" className="text-amber-400 underline font-semibold">مسیر برند من</Link> شروع کنید.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
