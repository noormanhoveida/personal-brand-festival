import React, { useEffect, useState } from "react";
import axios from "axios";

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

interface CMSData {
  sections: SectionItem[];
}

const initialFallback: CMSData = {
  sections: [
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
  ]
};

export const AdminLandingPage: React.FC = () => {
  const [data, setData] = useState<CMSData>(initialFallback);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // وضعیت ویرایش کارت در مدال
  const [editingCard, setEditingCard] = useState<{ sectionId: string; card: CardItem; isNew: boolean } | null>(null);

  useEffect(() => {
    axios.get("/api/landing")
      .then(res => {
        if (res.data?.success && res.data.data?.sections?.length) {
          setData(res.data.data);
        }
      })
      .catch(() => {
        // از fallback استفاده می‌شود
      })
      .finally(() => setLoading(false));
  }, []);

  const saveAll = async (updatedData = data) => {
    setSaving(true);
    setToast(null);
    try {
      const token = typeof window !== "undefined" ? (window.localStorage.getItem("token") || window.localStorage.getItem("auth_token") || "") : "";
      const headers: Record<string, string> = {
        "Content-Type": "application/json"
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // ابتدا روت مستقیم /api/landing تست می‌شود
      const res = await axios.put("/api/landing", updatedData, { headers });
      if (res.data && res.data.success) {
        setToast({ type: "success", text: "تغییرات با موفقیت در دیتابیس ذخیره شد." });
      } else {
        setToast({ type: "error", text: res.data?.message || "خطا در پاسخ سرور." });
      }
    } catch (err: any) {
      console.error("Save error details:", err);
      const errMsg = err.response?.data?.message || err.message || "خطا در ذخیره‌سازی اطلاعات.";
      setToast({ type: "error", text: `خطا در ذخیره‌سازی: ${errMsg}` });
    } finally {
      setSaving(false);
    }
  };

  // افزودن دسته جدید
  const handleAddSection = () => {
    const newSec: SectionItem = {
      id: "sec-" + Date.now(),
      title: "عنوان بخش جدید",
      badge: "برچسب بخش",
      items: []
    };
    const next = { ...data, sections: [...data.sections, newSec] };
    setData(next);
  };

  // حذف دسته
  const handleDeleteSection = (secId: string) => {
    if (!confirm("آیا از حذف این بخش و تمام کارت‌های آن اطمینان دارید؟")) return;
    const next = { ...data, sections: data.sections.filter(s => s.id !== secId) };
    setData(next);
  };

  // تغییر عنوان یا برچسب دسته
  const handleUpdateSectionHeader = (secId: string, field: "title" | "badge", val: string) => {
    const next = {
      ...data,
      sections: data.sections.map(s => s.id === secId ? { ...s, [field]: val } : s)
    };
    setData(next);
  };

  // باز کردن فرم ویرایش/افزودن کارت
  const openCardEditor = (sectionId: string, card?: CardItem) => {
    if (card) {
      setEditingCard({ sectionId, card: { ...card }, isNew: false });
    } else {
      setEditingCard({
        sectionId,
        card: {
          id: "card-" + Date.now(),
          icon: "✨",
          title: "",
          desc: "",
          stepNumber: "",
          badge: ""
        },
        isNew: true
      });
    }
  };

  // تایید و ذخیره کارت ادیت‌شده در حافظه استیت
  const handleSaveCardModal = () => {
    if (!editingCard) return;
    const { sectionId, card, isNew } = editingCard;

    const nextSections = data.sections.map(sec => {
      if (sec.id !== sectionId) return sec;
      let nextItems = [...sec.items];
      if (isNew) {
        nextItems.push(card);
      } else {
        nextItems = nextItems.map(c => c.id === card.id ? card : c);
      }
      return { ...sec, items: nextItems };
    });

    const next = { ...data, sections: nextSections };
    setData(next);
    setEditingCard(null);
  };

  // حذف کارت
  const handleDeleteCard = (secId: string, cardId: string) => {
    if (!confirm("این کارت حذف شود؟")) return;
    const next = {
      ...data,
      sections: data.sections.map(s => {
        if (s.id !== secId) return s;
        return { ...s, items: s.items.filter(c => c.id !== cardId) };
      })
    };
    setData(next);
  };

  if (loading) return <div className="p-8 text-center text-gray-400">در حال بارگذاری...</div>;

  return (
    <div className="mx-auto max-w-6xl p-6" dir="rtl">
      {/* هدر صفحه */}
      <div className="sticky top-0 z-20 mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-800 bg-gray-900/90 p-4 shadow-xl backdrop-blur">
        <div>
          <h1 className="text-xl font-black text-white">مدیریت محتوای کارت‌ها و بخش‌های صفحه اصلی</h1>
          <p className="text-xs text-gray-400">امکان تغییر، ویرایش کارت‌ها و تعریف دسته‌بندی با تیتر دلخواه</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleAddSection}
            className="rounded-xl border border-dashed border-sky-500/50 bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-400 transition hover:bg-sky-500/20"
          >
            + ایجاد بخش (دسته) جدید
          </button>
          <button
            type="button"
            onClick={() => saveAll()}
            disabled={saving}
            className="rounded-xl bg-emerald-600 px-6 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-900/30 transition hover:bg-emerald-500 disabled:opacity-50"
          >
            {saving ? "در حال ذخیره..." : "💾 ذخیره نهایی تغییرات"}
          </button>
        </div>
      </div>

      {toast && (
        <div className={`mb-6 rounded-xl p-3 text-sm font-medium ${toast.type === "success" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-rose-500/20 text-rose-300 border border-rose-500/30"}`}>
          {toast.text}
        </div>
      )}

      {/* لیست بخش‌ها */}
      <div className="space-y-8">
        {data.sections.map((section, secIdx) => (
          <div key={section.id} className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 shadow-sm">
            {/* تیتر و برچسب دسته */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-4">
              <div className="flex flex-1 flex-wrap items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-800 text-xs font-bold text-gray-400">
                  {secIdx + 1}
                </span>
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => handleUpdateSectionHeader(section.id, "title", e.target.value)}
                  placeholder="عنوان این بخش..."
                  className="min-w-[240px] flex-1 rounded-lg border border-gray-700 bg-gray-950 px-3 py-1.5 text-base font-bold text-white focus:border-amber-400 focus:outline-none"
                />
                <input
                  type="text"
                  value={section.badge || ""}
                  onChange={(e) => handleUpdateSectionHeader(section.id, "badge", e.target.value)}
                  placeholder="برچسب کوچک (اختیاری)"
                  className="w-44 rounded-lg border border-gray-700 bg-gray-950 px-3 py-1.5 text-xs text-amber-300 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openCardEditor(section.id)}
                  className="rounded-lg bg-indigo-600/20 px-3 py-1.5 text-xs font-bold text-indigo-300 transition hover:bg-indigo-600/30"
                >
                  + افزودن کارت به این بخش
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteSection(section.id)}
                  className="rounded-lg bg-rose-600/10 px-3 py-1.5 text-xs text-rose-400 transition hover:bg-rose-600/20"
                >
                  حذف بخش
                </button>
              </div>
            </div>

            {/* کارت‌های داخل این بخش */}
            {section.items.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-800 p-8 text-center text-sm text-gray-500">
                هیچ کارتی در این بخش وجود ندارد. با دکمه «افزودن کارت» ایجاد کنید.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {section.items.map((card) => (
                  <div
                    key={card.id}
                    className="group relative flex flex-col justify-between rounded-xl border border-gray-800 bg-gray-950/80 p-5 transition hover:border-gray-700 hover:shadow-lg"
                  >
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-2xl">{card.icon || "📌"}</span>
                        {card.stepNumber && (
                          <span className="rounded bg-gray-800 px-2 py-0.5 text-xs font-bold text-amber-400">
                            {card.stepNumber}
                          </span>
                        )}
                        {card.badge && (
                          <span className="rounded bg-sky-950/60 px-2 py-0.5 text-xs text-sky-400">
                            {card.badge}
                          </span>
                        )}
                      </div>
                      <h4 className="mb-2 text-sm font-bold text-gray-100">{card.title || "بدون عنوان"}</h4>
                      <p className="text-xs leading-relaxed text-gray-400 line-clamp-3">{card.desc || "بدون توضیحات"}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-2 border-t border-gray-800/80 pt-3">
                      <button
                        type="button"
                        onClick={() => openCardEditor(section.id, card)}
                        className="rounded px-2.5 py-1 text-xs font-medium text-amber-400 hover:bg-amber-400/10"
                      >
                        ✏️ ویرایش
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCard(section.id, card.id)}
                        className="rounded px-2.5 py-1 text-xs font-medium text-rose-400 hover:bg-rose-400/10"
                      >
                        🗑️ حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* مدال ویرایش و افزودن کارت */}
      {editingCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-gray-700 bg-gray-900 p-6 shadow-2xl">
            <h3 className="mb-4 text-lg font-bold text-white">
              {editingCard.isNew ? "افزودن کارت جدید" : "ویرایش کارت"}
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-gray-400">آیکون (اموجی)</label>
                  <input
                    type="text"
                    value={editingCard.card.icon}
                    onChange={(e) => setEditingCard({ ...editingCard, card: { ...editingCard.card, icon: e.target.value } })}
                    className="w-full rounded-lg border border-gray-700 bg-gray-950 p-2 text-center text-xl text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-400">شماره مرحله (اختیاری)</label>
                  <input
                    type="text"
                    placeholder="۰۱"
                    value={editingCard.card.stepNumber || ""}
                    onChange={(e) => setEditingCard({ ...editingCard, card: { ...editingCard.card, stepNumber: e.target.value } })}
                    className="w-full rounded-lg border border-gray-700 bg-gray-950 p-2 text-center text-sm text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-400">بج/برچسب (اختیاری)</label>
                  <input
                    type="text"
                    placeholder="ماتریس"
                    value={editingCard.card.badge || ""}
                    onChange={(e) => setEditingCard({ ...editingCard, card: { ...editingCard.card, badge: e.target.value } })}
                    className="w-full rounded-lg border border-gray-700 bg-gray-950 p-2 text-center text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs text-gray-400">عنوان کارت</label>
                <input
                  type="text"
                  value={editingCard.card.title}
                  onChange={(e) => setEditingCard({ ...editingCard, card: { ...editingCard.card, title: e.target.value } })}
                  className="w-full rounded-lg border border-gray-700 bg-gray-950 p-2 text-sm text-white"
                  placeholder="مثال: هویت و خودشناسی"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-gray-400">توضیحات کارت</label>
                <textarea
                  rows={3}
                  value={editingCard.card.desc}
                  onChange={(e) => setEditingCard({ ...editingCard, card: { ...editingCard.card, desc: e.target.value } })}
                  className="w-full rounded-lg border border-gray-700 bg-gray-950 p-2 text-sm text-white leading-relaxed"
                  placeholder="متن توضیحی کارت..."
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-gray-800 pt-4">
              <button
                type="button"
                onClick={() => setEditingCard(null)}
                className="rounded-lg px-4 py-2 text-xs font-semibold text-gray-400 hover:bg-gray-800"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleSaveCardModal}
                className="rounded-lg bg-emerald-600 px-5 py-2 text-xs font-bold text-white transition hover:bg-emerald-500"
              >
                ثبت در لیست
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminLandingPage;