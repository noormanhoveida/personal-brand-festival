import { Link, Outlet } from "react-router-dom";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function PublicLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const hasToken = Boolean(localStorage.getItem("token") || localStorage.getItem("auth_token"));

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-[90] bg-black/50 md:hidden"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed inset-y-0 right-0 z-[100] flex w-[85vw] max-w-[320px] flex-col gap-3 overflow-y-auto px-4 py-6 md:hidden shadow-2xl"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              <button onClick={() => setDrawerOpen(false)} className="mb-2 self-start text-sm opacity-70">
                ✕ بستن
              </button>
              <Link onClick={() => setDrawerOpen(false)} to="/" className="py-2 opacity-80 hover:opacity-100">صفحه اصلی</Link>
              <Link onClick={() => setDrawerOpen(false)} to="/community" className="py-2 opacity-80 hover:opacity-100">شرکت کنندگان</Link>
              <Link onClick={() => setDrawerOpen(false)} to="/network" className="py-2 opacity-80 hover:opacity-100 font-bold" style={{ color: "var(--accent)" }}>شبکه ارتباطی</Link>
              <Link onClick={() => setDrawerOpen(false)} to="/showcase" className="py-2 opacity-80 hover:opacity-100">برترین های جشنواره</Link>
              <Link onClick={() => setDrawerOpen(false)} to="/dashboard/bootcamps" className="py-2 opacity-80 hover:opacity-100">بوت‌کمپ‌ها / آکادمی</Link>

              <div className="mt-4 border-t pt-4" style={{ borderColor: "var(--surface)" }}>
                {hasToken ? (
                  <Link
                    onClick={() => setDrawerOpen(false)}
                    to="/dashboard"
                    className="inline-flex w-full items-center justify-center rounded-full px-4 py-2 font-medium transition hover:opacity-90"
                    style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
                  >
                    پروفایل من
                  </Link>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link onClick={() => setDrawerOpen(false)} to="/login" className="py-2 text-center opacity-80">ورود</Link>
                    <Link
                      onClick={() => setDrawerOpen(false)}
                      to="/register"
                      className="inline-flex w-full items-center justify-center rounded-full px-4 py-2 font-medium transition hover:opacity-90 text-center"
                      style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
                    >
                      ثبت‌نام
                    </Link>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <header className="flex items-center justify-between gap-3 px-4 py-3 md:px-12 md:py-4 border-b" style={{ borderColor: "var(--surface)" }}>
        <Link to="/" className="text-lg font-bold shrink-0" style={{ color: "var(--accent)" }}>
          برند شخصی
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link to="/community" className="opacity-80 hover:opacity-100">شرکت کنندگان</Link>
          <Link to="/network" className="opacity-80 hover:opacity-100">شبکه ارتباطی</Link>
          <Link to="/showcase" className="opacity-80 hover:opacity-100">برترین های جشنواره</Link>
          <Link to="/dashboard/bootcamps" className="opacity-80 hover:opacity-100">بوت‌کمپ‌ها / آکادمی</Link>
          {hasToken ? (
            <Link
              to="/dashboard"
              className="rounded-full px-4 py-2 font-medium transition hover:opacity-90"
              style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
            >
              پروفایل من
            </Link>
          ) : (
            <>
              <Link to="/login" className="opacity-80 hover:opacity-100">ورود</Link>
              <Link
                to="/register"
                className="rounded-full px-4 py-2 font-medium transition hover:opacity-90"
                style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
              >
                ثبت‌نام
              </Link>
            </>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="md:hidden text-sm opacity-90 p-1"
          aria-label="باز کردن منو"
        >
          ☰ منو
        </button>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="px-6 py-8 text-center text-xs md:px-12" style={{ color: "var(--text)", opacity: 0.6 }}>
        جشنواره بار دانش با محوریت برند سازی شخصی
      </footer>
    </div>
  );
}
