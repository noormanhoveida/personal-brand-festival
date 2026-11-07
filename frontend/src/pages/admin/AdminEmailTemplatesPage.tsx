import React, { useEffect, useState, useRef } from "react";
import { Mail, CheckCircle2, AlertCircle, Save, ToggleLeft, ToggleRight, Sparkles, Send, Clock } from "lucide-react";
import { apiClient } from "../../api/client";

interface EmailTemplate {
  id: string;
  key: string;
  title: string;
  subject: string;
  body: string;
  isActive: boolean;
  updatedAt: string;
}

const TEMPLATE_TAGS: Record<string, { label: string; tag: string }[]> = {
  NEW_FEEDBACK: [
    { label: "نام کاربر", tag: "{نام_کاربر}" },
    { label: "نام فرستنده", tag: "{نام_فرستنده}" },
    { label: "لینک سایت", tag: "{لینک_سایت}" },
  ],
  CHAT_DIGEST: [
    { label: "نام کاربر", tag: "{نام_کاربر}" },
    { label: "تعداد پیام‌ها", tag: "{تعداد_پیام}" },
    { label: "لینک چت", tag: "{لینک_چت}" },
    { label: "لینک سایت", tag: "{لینک_سایت}" },
  ],
  ANNOUNCEMENT: [
    { label: "نام کاربر", tag: "{نام_کاربر}" },
    { label: "عنوان اطلاعیه", tag: "{عنوان_اطلاعیه}" },
    { label: "متن پیام", tag: "{متن_پیام}" },
    { label: "لینک اقدام", tag: "{لینک_اقدام}" },
    { label: "لینک سایت", tag: "{لینک_سایت}" },
  ],
};

export const AdminEmailTemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedKey, setSelectedKey] = useState<string>("NEW_FEEDBACK");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [triggering, setTriggering] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [activeTemplate, setActiveTemplate] = useState<{
    title: string;
    subject: string;
    body: string;
    isActive: boolean;
  }>({
    title: "",
    subject: "",
    body: "",
    isActive: true,
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get<{ success: boolean; data: EmailTemplate[] }>("/admin/email-templates");
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      setTemplates(list);
      const current = list.find((t) => t.key === selectedKey) || list[0];
      if (current) {
        setSelectedKey(current.key);
        setActiveTemplate({
          title: current.title || "",
          subject: current.subject || "",
          body: current.body || "",
          isActive: Boolean(current.isActive),
        });
      }
    } catch (err: any) {
      showToast("خطا در بارگذاری قالب‌ها", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleSelectTab = (key: string) => {
    setSelectedKey(key);
    const item = templates.find((t) => t.key === key);
    if (item) {
      setActiveTemplate({
        title: item.title || "",
        subject: item.subject || "",
        body: item.body || "",
        isActive: Boolean(item.isActive),
      });
    }
  };

  const handleInsertTag = (tag: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setActiveTemplate((prev) => ({ ...prev, body: prev.body + tag }));
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const oldText = activeTemplate.body;
    const newText = oldText.substring(0, start) + tag + oldText.substring(end);

    setActiveTemplate((prev) => ({ ...prev, body: newText }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tag.length, start + tag.length);
    }, 50);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await apiClient.put(`/admin/email-templates/${selectedKey}`, activeTemplate);
      const updatedData = res.data?.data || res.data || activeTemplate;

      setTemplates((prev) =>
        prev.map((t) =>
          t.key === selectedKey
            ? {
                ...t,
                title: activeTemplate.title,
                subject: activeTemplate.subject,
                body: activeTemplate.body,
                isActive: activeTemplate.isActive,
                ...updatedData,
              }
            : t
        )
      );

      showToast("قالب با موفقیت ذخیره شد.");
    } catch (err) {
      showToast("خطا در ذخیره‌سازی قالب", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleTriggerChatDigest = async () => {
    try {
      setTriggering(true);
      const res = await apiClient.post("/admin/email-templates/trigger-chat-digest");
      const sentCount = res.data?.sent ?? 0;
      showToast(`عملیات با موفقیت انجام شد. تعداد ایمیل‌های ارسال شده: ${sentCount}`);
    } catch (err) {
      showToast("خطا در اجرای ارسال چت دایجست", "error");
    } finally {
      setTriggering(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 text-slate-100" dir="rtl">
      {toast && (
        <div
          className={`fixed bottom-6 left-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl transition-all ${
            toast.type === "success"
              ? "bg-emerald-600/95 text-white border border-emerald-400/40"
              : "bg-rose-600/95 text-white border border-rose-400/40"
          }`}
        >
          {toast.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">مدیریت قالب‌های ایمیل</h1>
            <p className="text-sm text-slate-400">تنظیم محتوا و هوک‌های بازگشت کاربر (User Retention)</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {selectedKey === "CHAT_DIGEST" && (
            <button
              onClick={handleTriggerChatDigest}
              disabled={triggering || loading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-medium text-sm transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {triggering ? "در حال ارسال..." : "ارسال تست چت دایجست"}
            </button>
          )}

          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-semibold shadow-lg shadow-orange-500/20 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900/60 border border-slate-800/80 rounded-2xl">
        {[
          { key: "NEW_FEEDBACK", label: "بازخورد جدید (فوری)" },
          { key: "CHAT_DIGEST", label: "پیام‌های ناخوانده چت (روزانه)" },
          { key: "ANNOUNCEMENT", label: "ایمیل قلاب بازگشت / اطلاعیه" },
        ].map((tab) => {
          const isSelected = selectedKey === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => handleSelectTab(tab.key)}
              className={`flex-1 min-w-[200px] py-3 px-4 rounded-xl text-sm font-medium transition-all text-center ${
                isSelected
                  ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="py-24 text-center text-slate-400">در حال دریافت اطلاعات قالب‌ها...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <label className="text-sm font-semibold text-slate-300">وضعیت فعال بودن ارسال خودکار</label>
              <button
                type="button"
                onClick={() => setActiveTemplate((prev) => ({ ...prev, isActive: !prev.isActive }))}
                className="flex items-center gap-2 text-sm font-medium focus:outline-none"
              >
                {activeTemplate.isActive ? (
                  <>
                    <span className="text-emerald-400">فعال</span>
                    <ToggleRight className="w-8 h-8 text-emerald-400" />
                  </>
                ) : (
                  <>
                    <span className="text-slate-500">غیرفعال</span>
                    <ToggleLeft className="w-8 h-8 text-slate-500" />
                  </>
                )}
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">عنوان نمایشی قالب</label>
              <input
                type="text"
                value={activeTemplate.title}
                onChange={(e) => setActiveTemplate((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500/60"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">موضوع ایمیل (Subject)</label>
              <input
                type="text"
                value={activeTemplate.subject}
                onChange={(e) => setActiveTemplate((prev) => ({ ...prev, subject: e.target.value }))}
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500/60"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-300">متن قالب ایمیل (HTML / ساده)</label>
                <span className="text-xs text-slate-500">تگ‌های متغیر زیر را می‌توانید در متن قرار دهید</span>
              </div>
              <textarea
                ref={textareaRef}
                rows={12}
                value={activeTemplate.body}
                onChange={(e) => setActiveTemplate((prev) => ({ ...prev, body: e.target.value }))}
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 font-mono focus:outline-none focus:border-amber-500/60 leading-relaxed"
                dir="auto"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-amber-400 font-semibold mb-3">
                <Sparkles className="w-4 h-4" />
                <span>تگ‌های متغیر (کلیک برای درج)</span>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                با کلیک روی هر گزینه، متغیر در موقعیت نشانگر متن درج خواهد شد و موقع ارسال با اطلاعات واقعی جایگزین می‌شود.
              </p>

              <div className="flex flex-wrap gap-2">
                {(TEMPLATE_TAGS[selectedKey] || []).map((item) => (
                  <button
                    key={item.tag}
                    type="button"
                    onClick={() => handleInsertTag(item.tag)}
                    className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 hover:border-amber-500/40 text-amber-300 text-xs font-medium transition-all active:scale-95"
                    title={`درج ${item.tag}`}
                  >
                    <span>{item.label}</span>
                    <code className="text-[10px] text-amber-400/70 bg-amber-500/10 px-1 py-0.5 rounded font-mono group-hover:text-amber-300">
                      {item.tag}
                    </code>
                  </button>
                ))}
              </div>
            </div>

            {selectedKey === "CHAT_DIGEST" && (
              <div className="bg-slate-900/40 border border-amber-500/30 rounded-2xl p-5 backdrop-blur-sm space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-semibold">
                  <Clock className="w-4 h-4" />
                  <span>زمان‌بندی ارسال خودکار</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  سیستم کران‌جاب هر روز رأس ساعت <strong className="text-amber-300 font-bold">۲۰:۰۰ به وقت ایران</strong> پیام‌های ناخوانده را بررسی و خلاصه آن را برای کاربرانی که آنلاین نبوده‌اند ارسال می‌کند.
                </p>
                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={handleTriggerChatDigest}
                    disabled={triggering}
                    className="w-full py-2 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {triggering ? "در حال اجرای ارسال..." : "ارسال تست همین حالا"}
                  </button>
                </div>
              </div>
            )}

            <div className="bg-slate-900/20 border border-slate-800/50 rounded-2xl p-4 text-xs text-slate-400 space-y-2">
              <p className="font-semibold text-slate-300">نکات تکمیلی:</p>
              <p>• در صورت غیرفعال کردن قالب، سرویس ارسال خودکار آن متوقف خواهد ماند.</p>
              <p>• کاربرانی که وارد نشده باشند با کلیک روی لینک ایمیل، پس از ورود به سامانه مستقیماً به همان صفحه هدایت خواهند شد.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEmailTemplatesPage;
