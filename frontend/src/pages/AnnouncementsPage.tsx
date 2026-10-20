import { useEffect, useState } from "react";
import { announcementsApi, Announcement } from "../api/announcements";
import { useAppSelector } from "../store/hooks";

export const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<"INFO" | "WARNING" | "SUCCESS" | "CRITICAL">("INFO");
  const [error, setError] = useState("");

  const role = useAppSelector((state) => state.auth.role);
  const isAdmin = role === "ADMIN";

  const fetchAnnouncements = async () => {
    try {
      const data = await announcementsApi.getAnnouncements();
      setAnnouncements(data);
    } catch (err: any) {
      console.error("Failed to load announcements", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    try {
      setError("");
      await announcementsApi.createAnnouncement({ title, content, type });
      setTitle("");
      setContent("");
      fetchAnnouncements();
    } catch (err: any) {
      setError(err.response?.data?.message || "خطا در ایجاد اطلاعیه");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این اطلاعیه مطمئن هستید؟")) return;
    try {
      await announcementsApi.deleteAnnouncement(id);
      fetchAnnouncements();
    } catch (err: any) {
      alert(err.response?.data?.message || "خطا در حذف اطلاعیه");
    }
  };

  const getTypeBadge = (t: string) => {
    switch (t) {
      case "CRITICAL": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "WARNING": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "SUCCESS": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      default: return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">اطلاعیه‌ها و اخبار سیستم</h1>
          <p className="text-sm text-muted-foreground mt-1">آخرین اخبار، اطلاعیه‌ها و رویدادهای فستیوال</p>
        </div>
      </div>

      {isAdmin && (
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">انتشار اطلاعیه جدید</h3>
          {error && <div className="mb-4 p-3 bg-red-500/10 text-red-500 text-sm rounded-lg border border-red-500/20">{error}</div>}
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">عنوان</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="عنوان اطلاعیه..."
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">نوع اطلاعیه</label>
                <select
                  value={type}
                  onChange={(e: any) => setType(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="INFO">اطلاع‌رسانی (INFO)</option>
                  <option value="SUCCESS">موفقیت / رویداد (SUCCESS)</option>
                  <option value="WARNING">هشدار (WARNING)</option>
                  <option value="CRITICAL">بحرانی / مهم (CRITICAL)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">متن پیام</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="متن کامل اطلاعیه..."
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg text-sm hover:bg-primary/90 transition-colors"
              >
                انتشار اطلاعیه
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">در حال بارگذاری اطلاعیه‌ها...</div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-12 bg-card border rounded-xl text-muted-foreground">هیچ اطلاعیه‌ای وجود ندارد.</div>
        ) : (
          announcements.map((item) => (
            <div key={item.id} className="bg-card border rounded-xl p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getTypeBadge(item.type)}`}>
                    {item.type}
                  </span>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString("fa-IR")}
                  </span>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium"
                    >
                      حذف
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-line">{item.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
