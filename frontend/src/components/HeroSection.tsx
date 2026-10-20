import React from "react";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-16 px-4">
      {/* هاله‌های نوری سه‌بعدی پس‌زمینه (Glow Orbs) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-amber-500/20 via-indigo-600/25 to-purple-600/20 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-[90px] pointer-events-none -z-10" />

      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* ستون متن و دکمه‌های اقدام (CTA) */}
        <div className="lg:col-span-7 text-right space-y-6 z-10">
          
          {/* نشان وضعیت هوشمند */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 backdrop-blur-md text-amber-300 text-xs sm:text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            جشنواره سراسری برند شخصی دانشجویی
          </div>

          {/* تیتر اصلی با گرادیانت چشم‌نواز */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
            روایت منحصر‌به‌فرد <br />
            <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              هویت و تخصص
            </span>{" "}
            خودت را بساز
          </h1>

          {/* متن توضیح */}
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl font-light">
            از سنجش ۱۰۰ بُعد شخصیتی و رفتاری تا حضور در بوت‌کمپ‌ها، وبینارهای تخصصی و رقابت در جشنواره؛ مسیر حرفه‌ای دیده شدن استعدادت همین‌جا آغاز می‌شود.
          </p>

          {/* دکمه‌های اکشن */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a
              href="#assessment"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-base shadow-[0_0_30px_rgba(245,158,11,0.35)] hover:shadow-[0_0_40px_rgba(245,158,11,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 text-center"
            >
              شروع ارزیابی و آزمون خودشناسی
            </a>
            <a
              href="#festival-info"
              className="px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 backdrop-blur-sm font-medium text-base transition-all duration-200 text-center hover:border-slate-600"
            >
              راهنمای شرکت در رویداد
            </a>
          </div>

          {/* المان‌های خط مسیر (Roadmap Pills) */}
          <div className="pt-8 border-t border-slate-800/80">
            <p className="text-xs text-slate-400 mb-3 font-medium">۴ گام تحول برند شخصی شما:</p>
            <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
              {[
                { title: "۱. هویت", desc: "شناخت فردی" },
                { title: "۲. کشف", desc: "تحلیل رفتار" },
                { title: "۳. تحول", desc: "آموزش و رشد" },
                { title: "۴. فرصت", desc: "شبکه‌سازی" },
              ].map((step, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800 hover:border-amber-500/40 transition-colors">
                  <div className="text-xs sm:text-sm font-bold text-amber-400">{step.title}</div>
                  <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5">{step.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ستون ویژوال: المان‌های مدرن سه‌بعدی و کارت‌های Glassmorphic */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          
          {/* کارت مرکزی سه‌بعدی اثر انگشت برندینگ */}
          <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-square rounded-3xl bg-gradient-to-b from-slate-800/80 via-slate-900/90 to-slate-950/95 border border-slate-700/60 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl p-6 flex flex-col items-center justify-between group overflow-hidden">
            
            {/* انعکاس نور بالای کارت */}
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
            
            {/* هدر کارت */}
            <div className="w-full flex items-center justify-between text-xs text-slate-400 pb-4 border-b border-slate-800/80">
              <span className="flex items-center gap-1.5 text-amber-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                PB-CORE 2026
              </span>
              <span>Personal DNA Radar</span>
            </div>

            {/* نشان مرکزی سه‌بعدی (3D Core Icon) */}
            <div className="relative my-4 flex items-center justify-center">
              {/* حلقه‌های چرخان انرژی */}
              <div className="absolute w-44 h-44 rounded-full border border-dashed border-amber-500/30 animate-[spin_20s_linear_infinite]" />
              <div className="absolute w-36 h-36 rounded-full border border-indigo-500/30 animate-[spin_12s_linear_infinite_reverse]" />
              
              {/* آیکون لایه دار هویت */}
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 shadow-[0_0_35px_rgba(245,158,11,0.5)] flex items-center justify-center transform group-hover:scale-105 group-hover:rotate-3 transition-transform duration-500">
                <svg className="w-14 h-14 text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 004 11m5.979-5.11a7.962 7.962 0 014.042-1.09" />
                </svg>
              </div>
            </div>

            {/* نشانگرهای آماری کارت */}
            <div className="w-full grid grid-cols-2 gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              <div className="text-right">
                <div className="text-[10px] text-slate-400">تعداد ابعاد ارزیابی</div>
                <div className="text-sm font-bold text-white font-mono">100 شاخص رفتاری</div>
              </div>
              <div className="text-left border-r border-slate-800 pr-2">
                <div className="text-[10px] text-slate-400">موقعیت‌های سناریو</div>
                <div className="text-sm font-bold text-amber-400 font-mono">۴ محیط کلیدی</div>
              </div>
            </div>
          </div>

          {/* المان شناور اول: کارت تست مصاحبه (بالا سمت راست) */}
          <div className="absolute -top-4 -right-4 sm:-right-8 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 shadow-xl backdrop-blur-md flex items-center gap-3 animate-bounce [animation-duration:6s]">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              💼
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-white">تحلیل در مصاحبه شغلی</div>
              <div className="text-[10px] text-slate-400">سنجش پرزنت و اعتماد‌به‌نفس</div>
            </div>
          </div>

          {/* المان شناور دوم: کارت شبکه ارتباطی (پایین سمت چپ) */}
          <div className="absolute -bottom-4 -left-4 sm:-left-8 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 shadow-xl backdrop-blur-md flex items-center gap-3 animate-bounce [animation-duration:5s]">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              ⚡
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-white">شبکه‌سازی حرفه‌ای</div>
              <div className="text-[10px] text-slate-400">ارتباط با منتورها و کارفرمایان</div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
