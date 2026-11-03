import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { apiClient } from "../../api/client";
import { motion, AnimatePresence } from "framer-motion";
import ChatWidget from "./ChatWidget";
import ChatUnreadBadge from "./ChatUnreadBadge";

export default function PageGuide() {
  const location = useLocation();
  const [guide, setGuide] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const currentPath = location.pathname;
  const isDashboard = currentPath.startsWith("/dashboard");

  useEffect(() => {
    async function fetchGuide() {
      try {
        const res = await apiClient.get(`/guides/by-path?path=${currentPath}`);
        if (res.data?.success && res.data.data?.isEnabled) setGuide(res.data.data);
        else setGuide(null);
      } catch (err) {}
    }
    fetchGuide();
  }, [currentPath]);

  const slides = guide?.slides ? [...guide.slides].sort((a: any, b: any) => a.order - b.order) : [];

  return (
    <>
      <AnimatePresence>{isChatOpen && <ChatWidget onClose={() => setIsChatOpen(false)} />}</AnimatePresence>
      
      <div className="fixed bottom-6 left-6 z-[9999] flex flex-col-reverse gap-3 items-center">
        <button onClick={() => setIsChatOpen(!isChatOpen)} className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-amber-500/40 bg-zinc-900/90 text-amber-400 shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:border-amber-400">
          <ChatUnreadBadge />
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          <span className="absolute bottom-full mb-2 hidden whitespace-nowrap rounded-full bg-zinc-900 px-3 py-1 text-[11px] font-medium text-zinc-200 border border-zinc-800 shadow-xl group-hover:block">چت و پشتیبانی</span>
        </button>

        {guide && (
          <button onClick={() => setIsOpen(true)} className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-amber-500 bg-amber-500 text-zinc-950 shadow-lg transition-all hover:scale-105 animate-bounce">
            <span className="text-lg font-black">؟</span>
            <span className="absolute bottom-full mb-2 hidden whitespace-nowrap rounded-full bg-zinc-900 px-3 py-1 text-[11px] font-bold text-amber-400 border border-zinc-800 shadow-xl group-hover:block">راهنمای صفحه</span>
          </button>
        )}

        {!isDashboard && (
          <Link to="/dashboard" className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-amber-500/40 bg-zinc-900/90 text-amber-400 shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:border-amber-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            <span className="absolute bottom-full mb-2 hidden whitespace-nowrap rounded-full bg-zinc-900 px-3 py-1 text-[11px] font-medium text-zinc-200 border border-zinc-800 shadow-xl group-hover:block">داشبورد</span>
          </Link>
        )}

        {currentPath !== "/" && (
          <Link to="/" className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/90 text-zinc-400 shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:border-zinc-500 hover:text-white">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            <span className="absolute bottom-full mb-2 hidden whitespace-nowrap rounded-full bg-zinc-900 px-3 py-1 text-[11px] font-medium text-zinc-200 border border-zinc-800 shadow-xl group-hover:block">خانه</span>
          </Link>
        )}
      </div>

      <AnimatePresence>
        {isOpen && guide && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md" onClick={() => setIsOpen(false)}>
            <motion.div onClick={e => e.stopPropagation()} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-lg rounded-2xl border border-amber-500/30 bg-zinc-900 p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
                <h3 className="text-lg font-bold text-amber-400">{guide.title}</h3>
                <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white text-2xl">×</button>
              </div>
              <div className="py-4 text-center">
                 {slides[currentSlideIndex]?.imageUrl && <img src={slides[currentSlideIndex].imageUrl} className="mx-auto mb-4 rounded-xl max-h-40 border border-zinc-800" />}
                 <h4 className="text-xl font-bold text-white mb-2">{slides[currentSlideIndex]?.title}</h4>
                 <p className="text-zinc-400 leading-relaxed">{slides[currentSlideIndex]?.description}</p>
              </div>
              <div className="flex justify-between items-center mt-6 border-t border-zinc-800 pt-4">
                <span className="text-xs text-zinc-500">{currentSlideIndex + 1} / {slides.length}</span>
                <div className="flex gap-2">
                  {currentSlideIndex > 0 && <button onClick={() => setCurrentSlideIndex(i => i - 1)} className="px-4 py-2 bg-zinc-800 rounded-lg text-sm">قبلی</button>}
                  <button onClick={() => currentSlideIndex < slides.length - 1 ? setCurrentSlideIndex(i => i + 1) : setIsOpen(false)} className="px-6 py-2 bg-amber-500 text-black font-bold rounded-lg text-sm">
                    {currentSlideIndex < slides.length - 1 ? "بعدی" : "متوجه شدم"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
