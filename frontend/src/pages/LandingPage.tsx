import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import { apiClient } from "../api/client";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";


interface CardItem {
  id: string;
  stepNumber?: string;
  icon: string;
  badge?: string;
  title: string;
  desc: string;
}

interface SectionItem {
  id: string;
  title: string;
  badge?: string;
  items: CardItem[];
}

const DEFAULT_SECTIONS: SectionItem[] = [
  {
    id: "steps-section",
    title: "مسیر گام‌به‌گام برندسازی شخصی",
    badge: "گام‌های مسیر",
    items: [
      { id: "1", stepNumber: "۰۱", icon: "🧬", title: "هویت و خودشناسی", desc: "سنجش ۱۰۰ شاخصه کلیدی رفتاری، فن‌بیان و نحوه تصمیم‌گیری در شرایط واقعی." },
      { id: "2", stepNumber: "۰۲", icon: "🪞", title: "کشف زاویه دید دیگران", desc: "آینه ۳۶۰ درجه برای شفاف‌سازی تصویری که کارفرما، شبکه همکاران و اساتید از شما دارند." },
      { id: "3", stepNumber: "۰۳", icon: "⚡", title: "بازآفرینی و مهارت‌آموزی", desc: "بوت‌کمپ‌های تخصصی، سناریونویسی پرزنت و منتورینگ اختصاصی با رهبران صنعت." },
      { id: "4", stepNumber: "۰۴", icon: "🚀", title: "ویترین ملی و اتصال", desc: "معرفی به جشنواره کشوری، دریافت شناسنامه هویت حرفه‌ای و ورود به شبکه فرصت‌ها." }
    ]
  },
  {
    id: "features-section",
    title: "ویژگی‌ها و ابزارهای متمایز پلتفرم",
    badge: "ماتریس رفتار و بازخورد",
    items: [
      { id: "5", stepNumber: "", icon: "📊", badge: "ماتریس رفتار", title: "مسیر هوشمند برند شخصی", desc: "از خودشناسی تا معرفی عمومی در هشت فاز داده‌محور؛ با تحلیل ۴ سناریوی واقعی کاری، مصاحبه و سرمایه‌گذاری." },
      { id: "6", stepNumber: "", icon: "🎯", badge: "بازخورد هوشمند", title: "ارزیابی ۳۶۰ درجه (My Mirror)", desc: "ترکیب ادراک فردی با بازخورد واقعی هم‌تیمی‌ها، منتورها و کارفرمایان جهت کشف نقاط کور اثرگذاری." },
      { id: "7", stepNumber: "", icon: "💎", badge: "شناسنامه حرفه‌ای", title: "شناسنامه عمومی و رتبه ملی", desc: "یک هویت آنلاین معتبر با لینک اختصاصی و تاییدیه داوران برای درخشش در بازار کار و اکوسیستم کارآفرینی." }
    ]
  }
];

const GRADIENTS = [
  "from-amber-500/20 to-orange-500/10",
  "from-indigo-500/20 to-purple-500/10",
  "from-cyan-500/20 to-blue-500/10",
  "from-emerald-500/20 to-teal-500/10",
  "from-rose-500/20 to-pink-500/10",
  "from-violet-500/20 to-purple-500/10"
];

const NUM_LIST = ["۰۱", "۰۲", "۰۳", "۰۴", "۰۵", "۰۶", "۰۷", "۰۸"];

export function LandingPage() {
  const [verticalSponsors, setVerticalSponsors] = useState<any[]>([]);
  const [sections, setSections] = useState<SectionItem[]>(DEFAULT_SECTIONS);
  const [heroVideoUrl, setHeroVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    // دریافت اسپانسرهای عمودی لندینگ
    apiClient.get("/sponsors/public?placement=LANDING_VERTICAL")
      .then(res => setVerticalSponsors(res.data?.data || []))
      .catch(() => setVerticalSponsors([]));
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const res = await apiClient.get("/landing");
        if (res?.data?.success) {
          if (Array.isArray(res.data.data?.sections) && res.data.data.sections.length > 0) {
            console.log("SECTIONS IN FRONTEND:", res.data.data.sections);
            setSections(res.data.data.sections || []);
          }
          if (res.data.data?.heroVideoUrl) {
            setHeroVideoUrl(res.data.data.heroVideoUrl);
          }
        }
      } catch (err) {
        console.error("Error fetching dynamic landing content:", err);
      }
    };
    fetchLandingData();
  }, []);

  // انیمیشن‌های اسکرول
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });

  const quote1X = useTransform(smoothProgress, [0, 0.45], [0, 90]);
  const quote1Y = useTransform(smoothProgress, [0, 0.45], [0, 180]);
  const quote1Rotate = useTransform(smoothProgress, [0, 0.45], [-6, 16]);

  const quote2X = useTransform(smoothProgress, [0, 0.45], [0, -90]);
  const quote2Y = useTransform(smoothProgress, [0, 0.45], [0, -140]);
  const quote2Rotate = useTransform(smoothProgress, [0, 0.45], [5, -18]);

  const dnaScale = useTransform(smoothProgress, [0, 0.4], [1, 0.88]);
  const dnaRotate = useTransform(smoothProgress, [0, 0.4], [0, -8]);
  const dnaY = useTransform(smoothProgress, [0, 0.4], [0, -80]);

  const quote3Y = useTransform(smoothProgress, [0.15, 0.6], [60, -40]);
  const quote3Opacity = useTransform(smoothProgress, [0.1, 0.25, 0.55, 0.7], [0, 1, 1, 0]);

  const glowY = useTransform(smoothProgress, [0, 1], [0, 600]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen text-slate-100 overflow-hidden font-sans selection:bg-amber-500 selection:text-black"
    >
      <motion.div
        style={{ y: glowY }}
        className="fixed -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-amber-500/20 via-indigo-600/15 to-transparent blur-[160px] pointer-events-none -z-10"
      />
      <div className="fixed top-[45%] -right-40 w-[450px] h-[450px] bg-purple-600/10 blur-[150px] pointer-events-none -z-10" />
      <div className="fixed bottom-10 -left-40 w-[450px] h-[450px] bg-amber-500/10 blur-[150px] pointer-events-none -z-10" />

      <div className="w-full xl:w-[85%] xl:mr-0 xl:ml-auto">

        {/* ===================== HERO SECTION ===================== */}
        <section className="relative mx-auto max-w-7xl px-6 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:col-span-7 text-center lg:text-right space-y-7 z-10"
            >
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-amber-500/30 bg-slate-900/80 backdrop-blur-xl shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
                </span>
                <span className="text-xs sm:text-sm font-semibold tracking-wide text-amber-300">
                  جشنواره سراسری برند شخصی دانشجویی
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.15]">
                هویت تو، <br />
                <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                  برند متمایز توست.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 font-light leading-relaxed max-w-2xl mx-auto lg:mx-0">
                «آنچه هستی را بشناس؛ آنچه می‌خواهی باشی را بساز.»
                <span className="block text-sm sm:text-base text-slate-400 mt-2 font-normal">
                  پلتفرمی بر پایه ارزیابی هوشمند، کشف ابعاد ناشناخته رفتار و ایجاد اعتبار پایدار در بازار کار و جامعه.
                </span>
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (Boolean(localStorage.getItem("token") || localStorage.getItem("auth_token"))) {
                      window.location.href = "/dashboard";
                    } else {
                      window.dispatchEvent(new CustomEvent("open-unified-register"));
                    }
                  }}
                  className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-slate-950 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 overflow-hidden shadow-[0_10px_35px_rgba(245,158,11,0.35)] hover:shadow-[0_15px_45px_rgba(245,158,11,0.5)] cursor-pointer"
                  style={{ backgroundColor: "var(--accent, #f59e0b)" }}
                >
                  <span>شروع مسیر ارزیابی</span>
                  <span className="transition-transform group-hover:translate-x-[-4px]">←</span>
                </button>
                
                <Link
                  to="/community"
                  className="px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 backdrop-blur-md font-medium transition-all duration-200 hover:border-slate-500 shadow-lg"
                >
                  اعضای جشنواره
                </Link>

                <Link
                  to="/showcase"
                  className="px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 backdrop-blur-md font-medium transition-all duration-200 hover:border-slate-500 shadow-lg"
                >
                  برترین‌های دوره
                </Link>
              </div>
            </motion.div>

            {/* بخش ویدیوی تیزر یا کارت هویت */}
            <div className="lg:col-span-5 relative flex items-center justify-center min-h-[440px]">
              {heroVideoUrl ? (
                <div className="w-full max-w-[580px] lg:max-w-[640px] rounded-3xl overflow-hidden border border-amber-500/40 bg-slate-900/90 shadow-[0_25px_60px_rgba(245,158,11,0.3)] backdrop-blur-2xl p-2.5 relative group z-20">
                  <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                    <video
                      id="hero-teaser-video"
                      src={heroVideoUrl.startsWith("http") ? heroVideoUrl : (heroVideoUrl.startsWith("/") ? heroVideoUrl : `/${heroVideoUrl}`)}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      className="w-full h-full object-cover rounded-2xl cursor-pointer"
                      onClick={(e) => {
                        const v = e.currentTarget;
                        v.muted = !v.muted;
                        const btn = document.getElementById('audio-badge-text');
                        if (btn) btn.innerText = v.muted ? "🔇 برای پخش صدا کلیک کنید" : "🔊 صدا وصل است";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const v = document.getElementById('hero-teaser-video') as HTMLVideoElement;
                        if (v) {
                          v.muted = !v.muted;
                          const btn = document.getElementById('audio-badge-text');
                          if (btn) btn.innerText = v.muted ? "🔇 برای پخش صدا کلیک کنید" : "🔊 صدا وصل است";
                        }
                      }}
                      className="absolute bottom-4 left-4 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-amber-500/50 text-amber-300 text-xs font-medium backdrop-blur-md shadow-lg transition"
                    >
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                      </span>
                      <span id="audio-badge-text">🔇 برای پخش صدا کلیک کنید</span>
                    </button>
                  </div>
                  <div className="p-3 text-center">
                    <span className="text-xs font-semibold text-amber-300 flex items-center justify-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                      تیزر رسمی جشنواره برند شخصی دانشجویی
                    </span>
                  </div>
                </div>
              ) : (
              <motion.div
                style={{
                  scale: dnaScale,
                  rotateZ: dnaRotate,
                  y: dnaY,
                }}
                className="relative w-full max-w-[360px] rounded-3xl bg-gradient-to-b from-slate-800/90 via-slate-900/95 to-slate-950/95 border border-slate-700/80 p-7 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] z-20"
              >
                <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-amber-400/80 to-transparent" />
                
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <span className="flex items-center gap-1.5 text-amber-400 font-mono text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    PERSONAL BRAND DNA
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">SCROLL TO EXPAND</span>
                </div>

                <div className="relative my-6 flex items-center justify-center">
                  <div className="absolute w-44 h-44 rounded-full border border-amber-500/20 border-dashed animate-[spin_25s_linear_infinite]" />
                  <div className="absolute w-32 h-32 rounded-full border border-indigo-500/30 animate-[spin_12s_linear_infinite_reverse]" />
                  
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 p-0.5 shadow-[0_0_35px_rgba(245,158,11,0.5)]">
                    <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                      <svg className="w-12 h-12 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 004 11m5.979-5.11a7.962 7.962 0 014.042-1.09" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 bg-slate-950/70 p-3 rounded-2xl border border-slate-800 text-center">
                  <div>
                    <div className="text-[10px] text-slate-400">سنجش شخصیتی</div>
                    <div className="text-sm font-bold text-white font-mono mt-0.5">۱۰۰ شاخصه</div>
                  </div>
                  <div className="border-r border-slate-800 pr-2">
                    <div className="text-[10px] text-slate-400">ماتریس رفتار</div>
                    <div className="text-sm font-bold text-amber-400 font-mono mt-0.5">۴ سناریو</div>
                  </div>
                </div>
              </motion.div>
              )}

              <motion.div
                style={{
                  x: quote1X,
                  y: quote1Y,
                  rotate: quote1Rotate,
                }}
                className="absolute -top-10 -right-4 sm:-right-10 max-w-[260px] bg-slate-900/95 border border-amber-500/40 rounded-2xl p-4 shadow-[0_15px_35px_rgba(0,0,0,0.6)] backdrop-blur-xl z-30 pointer-events-none"
              >
                <div className="flex items-center gap-2 mb-1.5 text-amber-400 text-xs font-bold">
                  <span>⚡</span>
                  <span>قانون اول برندینگ</span>
                </div>
                <p className="text-xs font-medium text-slate-200 leading-relaxed text-right">
                  «اگر خودت برندت را تعریف نکنی، بازار بر اساس قضاوت دیگران برایت تصمیم می‌گیرد.»
                </p>
              </motion.div>

              <motion.div
                style={{
                  x: quote2X,
                  y: quote2Y,
                  rotate: quote2Rotate,
                }}
                className="absolute -bottom-10 -left-4 sm:-left-10 max-w-[270px] bg-slate-900/95 border border-indigo-500/40 rounded-2xl p-4 shadow-[0_15px_35px_rgba(0,0,0,0.6)] backdrop-blur-xl z-30 pointer-events-none"
              >
                <div className="flex items-center gap-2 mb-1.5 text-indigo-400 text-xs font-bold">
                  <span>🎯</span>
                  <span>اثرگذاری واقعی</span>
                </div>
                <p className="text-xs font-medium text-slate-200 leading-relaxed text-right">
                  «تخصص بالا بدون ووضوح و اعتبار، فرصت شغلی و اثرگذاری خلق نمی‌کند.»
                </p>
              </motion.div>

            </div>

          </div>
        </section>

        {/* کارت نقل‌قول شناور */}
        <div className="max-w-4xl mx-auto px-6 mb-12">
          <motion.div
            style={{ y: quote3Y, opacity: quote3Opacity }}
            className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-slate-900/90 to-indigo-500/10 p-4 sm:p-5 backdrop-blur-xl text-center shadow-2xl"
          >
            <span className="text-amber-400 font-bold text-sm block mb-1">💡 ارزش پایدار برند شخصی</span>
            <p className="text-xs sm:text-sm text-slate-200 font-medium">
              «رزومه فقط می‌گوید در گذشته چه کرده‌اید؛ اما برند شخصی به جهان نشان می‌دهد در آینده قادر به خلق چه ارزش‌هایی هستید.»
            </p>
          </motion.div>
        </div>

        {/* ===================== بخش‌های داینامیک مدیریت‌شده از ادمین ===================== */}
        {sections.map((section, secIndex) => (
          <section key={section.id || secIndex} className="relative mx-auto max-w-6xl px-6 pb-24">
            <div className="text-center max-w-xl mx-auto mb-12">
              {section.badge && (
                <motion.h3
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-xs font-mono uppercase tracking-widest text-amber-400"
                >
                  {section.badge}
                </motion.h3>
              )}
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5"
              >
                {section.title}
              </motion.h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {section.items && section.items.map((card, idx) => (
                <motion.div
                  key={card.id || idx}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: (idx % 4) * 0.1, ease: "easeOut" }}
                  whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
                  className={`relative rounded-3xl bg-gradient-to-b ${GRADIENTS[idx % GRADIENTS.length]} to-slate-950/90 border border-slate-800/90 p-6 backdrop-blur-xl group hover:border-amber-500/40 transition-all shadow-xl flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl p-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/60 shadow-inner">
                        {card.icon || "✨"}
                      </span>
                      {card.stepNumber && (
                        <span className="font-mono text-xs font-bold text-amber-400/90 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                          {card.stepNumber}
                        </span>
                      )}
                      {card.badge && (
                        <span className="text-[11px] font-mono text-sky-400 px-2.5 py-1 rounded-full bg-sky-950/60 border border-sky-800/40">
                          {card.badge}
                        </span>
                      )}
                    </div>
                    <h4 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors mb-2">
                      {card.title}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ))}

        {/* ===================== حامیان عمودی ===================== */}
        {verticalSponsors.length > 0 && (
          <aside className="fixed left-4 bottom-8 z-40 hidden xl:flex flex-col gap-4 max-w-[200px]">
            {verticalSponsors.map((sp) => (
              <motion.div
                key={sp.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="group relative rounded-2xl border border-amber-500/30 bg-slate-900/90 p-3 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:border-amber-400/60 transition-all duration-300"
              >
                <div className="absolute -top-2.5 right-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-full shadow">
                  حامی رویداد
                </div>
                <a
                  href={sp.externalLinkUrl || `/sponsors/${sp.slug}`}
                  target={sp.externalLinkUrl ? "_blank" : "_self"}
                  rel="noreferrer"
                  onClick={() => {
                    try { apiClient.post(`/sponsors/${sp.id}/click`); } catch (e) {}
                  }}
                  className="block text-center"
                >
                  {sp.slideMediaUrl && (
                    <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-950/80 mb-2.5 border border-slate-800 flex items-center justify-center">
                      <img
                        src={sp.slideMediaUrl}
                        alt={sp.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="font-bold text-xs text-white group-hover:text-amber-300 transition-colors">
                    {sp.name}
                  </div>
                  {sp.tagline && (
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {sp.tagline}
                    </p>
                  )}
                  <span className="inline-block mt-2 text-[10px] text-amber-400 group-hover:underline">
                    {sp.externalLinkLabel || "مشاهده حامی ←"}
                  </span>
                </a>
              </motion.div>
            ))}
          </aside>
        )}

      </div>
    </div>
  );
}
export default LandingPage;
