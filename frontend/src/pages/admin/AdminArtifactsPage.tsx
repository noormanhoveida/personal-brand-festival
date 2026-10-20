import React, { useEffect, useState } from "react";
import * as artifactApi from "../../api/artifact";

export const AdminArtifactsPage: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>("ALL");
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res: any = await (artifactApi as any).getAdminArtifacts();
      const list = Array.isArray(res) ? res : (res?.data || res?.items || []);
      const safeList = Array.isArray(list) ? list : ((list as any)?.items || (list as any)?.data || []);
      setItems(safeList);
    } catch (err) {
      console.error("Failed to load artifacts", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleReview = async (id: string, status: string) => {
    try {
      setActionLoading(id);
      await (artifactApi as any).reviewArtifact(id, status, adminNotes[id]);
      await fetchItems();
    } catch (err: any) {
      alert("خطا در ثبت وضعیت: " + (err?.response?.data?.message || err?.message || "خطای ناشناخته"));
    } finally {
      setActionLoading(null);
    }
  };

  const safeItems = Array.isArray(items) ? items : [];
  const filtered = filter === "ALL" ? safeItems : safeItems.filter((x: any) => x?.status === filter);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 text-slate-100" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-amber-400">مدیریت و داوری آثار جشنواره</h1>
          <p className="text-xs text-slate-400 mt-1">بررسی، تایید یا رد آثار ثبت‌شده توسط شرکت‌کنندگان</p>
        </div>
        <div className="flex gap-2">
          {["ALL", "PENDING", "APPROVED", "REJECTED"].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === st ? "bg-amber-500 text-slate-950 shadow-md" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {st === "ALL" ? "همه" : st === "PENDING" ? "در انتظار" : st === "APPROVED" ? "تایید شده" : "رد شده"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">در حال دریافت لیست آثار...</div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400">
          هیچ اثری در این وضعیت یافت نشد.
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((item: any) => {
            const author = item?.participant || item?.participantProfile || item?.user || item?.profile || {};
            const fullName = (author.firstName || author.lastName)
              ? `${author.firstName || ""} ${author.lastName || ""}`.trim()
              : (author.fullName || "نامشخص");
            const slug = author.slug || "";
            const currentFeedback = item?.adminFeedback || item?.adminNote || "";

            return (
              <div key={item?.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs rounded-full bg-amber-500/10 text-amber-400 px-2.5 py-1 border border-amber-500/20 font-bold">
                      {item?.axis || "محور"}
                    </span>
                    <h3 className="font-bold text-base text-slate-100">{item?.title}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      item?.status === "APPROVED" ? "bg-emerald-500/20 text-emerald-400" :
                      item?.status === "REJECTED" ? "bg-rose-500/20 text-rose-400" : "bg-amber-500/20 text-amber-400"
                    }`}>
                      {item?.status}
                    </span>
                  </div>
                  {item?.mediaUrl && (
                    <a
                      href={item.mediaUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-amber-400 hover:text-amber-300 underline font-semibold"
                    >
                      مشاهده رسانه / اثر ↗
                    </a>
                  )}
                </div>

                <div className="text-xs text-slate-400 mt-2 flex flex-wrap gap-4">
                  <span>قالب: <b className="text-slate-200">{item?.templateTitle || "—"}</b></span>
                  <span>ارسال‌کننده: <b className="text-slate-200">{fullName}</b></span>
                  {slug && <span>نام کاربری: <b className="text-slate-200">/{slug}</b></span>}
                  <span>امتیاز: <b className="text-amber-400">⭐ {item?.averageRating ?? 0}</b> ({item?.ratingsCount ?? 0} رأی)</span>
                </div>

                {item?.description && (
                  <p className="text-xs text-slate-300 mt-3 bg-slate-800/50 p-3 rounded-lg leading-relaxed">
                    {item.description}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-3 pt-3 border-t border-slate-800/60">
                  <input
                    type="text"
                    value={adminNotes[item?.id] ?? currentFeedback}
                    placeholder="یادداشت مدیر / نکته داوری (اختیاری)"
                    onChange={(e) => setAdminNotes({ ...adminNotes, [item.id]: e.target.value })}
                    className="flex-1 min-w-[220px] rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    disabled={actionLoading === item?.id}
                    onClick={() => handleReview(item.id, "APPROVED")}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                  >
                    {actionLoading === item?.id ? "..." : "تایید اثر ✓"}
                  </button>
                  <button
                    disabled={actionLoading === item?.id}
                    onClick={() => handleReview(item.id, "REJECTED")}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                  >
                    {actionLoading === item?.id ? "..." : "رد اثر ✕"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminArtifactsPage;
