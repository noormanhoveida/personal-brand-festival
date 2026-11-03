import React, { useEffect, useState } from "react";
import { 
  Plus, Eye, MousePointerClick, ExternalLink, 
  Trash2, Edit, CheckCircle, XCircle, Globe, 
  Send, RefreshCw
} from "lucide-react";
import { apiClient } from "../../../api/client";

interface Sponsor {
  id: string;
  slug: string;
  name: string;
  tagline?: string | null;
  slideType: "IMAGE" | "YOUTUBE";
  slideMediaUrl: string;
  placement: "DASHBOARD" | "LANDING_HERO" | "LANDING_VERTICAL";
  order: number;
  isActive: boolean;
  viewCount: number;
  clickCount: number;
  externalLinkLabel?: string | null;
  externalLinkUrl?: string | null;
  coverImageUrl?: string | null;
  fullDescription?: string | null;
  websiteUrl?: string | null;
  instagramUrl?: string | null;
  linkedinUrl?: string | null;
  telegramUrl?: string | null;
}

const emptyForm: Partial<Sponsor> = {
  name: "",
  slug: "",
  tagline: "",
  placement: "DASHBOARD",
  slideType: "IMAGE",
  slideMediaUrl: "",
  order: 0,
  isActive: true,
  externalLinkLabel: "",
  externalLinkUrl: "",
  coverImageUrl: "",
  fullDescription: "",
  websiteUrl: "",
  instagramUrl: "",
  linkedinUrl: "",
  telegramUrl: "",
};

export const AdminSponsorsPage: React.FC = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Sponsor>>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchSponsors = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<{ success: boolean; data: Sponsor[] }>("/sponsors/admin");
      if (res.data.success) {
        setSponsors(res.data.data);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("خطا در بارگذاری فهرست حامیان مالی");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setErrorMsg(null);
    setModalOpen(true);
  };

  const openEditModal = (item: Sponsor) => {
    setEditingId(item.id);
    setFormData(item);
    setErrorMsg(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);

    const payload = {
      ...formData,
      tagline: formData.tagline?.trim() || null,
      externalLinkLabel: formData.externalLinkLabel?.trim() || null,
      externalLinkUrl: formData.externalLinkUrl?.trim() || null,
      coverImageUrl: formData.coverImageUrl?.trim() || null,
      fullDescription: formData.fullDescription?.trim() || null,
      websiteUrl: formData.websiteUrl?.trim() || null,
      instagramUrl: formData.instagramUrl?.trim() || null,
      linkedinUrl: formData.linkedinUrl?.trim() || null,
      telegramUrl: formData.telegramUrl?.trim() || null,
      order: Number(formData.order) || 0,
    };

    try {
      if (editingId) {
        await apiClient.put(`/sponsors/admin/${editingId}`, payload);
      } else {
        await apiClient.post("/sponsors/admin", payload);
      }
      setModalOpen(false);
      fetchSponsors();
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || "خطا در ذخیره اطلاعات حامی مالی");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`آیا از حذف حامی مالی "${name}" اطمینان دارید؟`)) return;
    try {
      await apiClient.delete(`/sponsors/admin/${id}`);
      fetchSponsors();
    } catch (err) {
      alert("خطا در حذف حامی مالی");
    }
  };

  const toggleStatus = async (item: Sponsor) => {
    try {
      await apiClient.put(`/sponsors/admin/${item.id}`, { isActive: !item.isActive });
      setSponsors(prev => prev.map(s => s.id === item.id ? { ...s, isActive: !s.isActive } : s));
    } catch (err) {
      alert("خطا در تغییر وضعیت");
    }
  };

  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("type", "GALLERY");
      const res = await apiClient.post("/media", fd);
      const url = res.data?.media?.url || res.data?.url || (res.data?.media?.filename ? `/uploads/${res.data.media.filename}` : null);
      return url;
    } catch (err: any) {
      alert("خطا در آپلود تصویر: " + (err.response?.data?.message || err.message));
      return null;
    }
  };

  const ImageUploadField = ({ label, value, fieldId, onChange }: { label: string; value: string; fieldId: string; onChange: (url: string) => void }) => (
    <div>
      <label className="block text-xs font-medium text-gray-300 mb-1">{label}</label>
      <div className="flex items-center gap-3">
        <label className="cursor-pointer px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white transition-colors">
          {uploadingField === fieldId ? "در حال آپلود..." : "انتخاب و آپلود تصویر"}
          <input
            type="file"
            accept="image/*"
            disabled={uploadingField === fieldId}
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setUploadingField(fieldId);
              try {
                const url = await uploadImage(file);
                if (url) onChange(url);
              } finally {
                setUploadingField(null);
                e.target.value = "";
              }
            }}
          />
        </label>
        {value ? (
          <div className="flex items-center gap-2">
            <img src={value} alt="preview" className="h-10 w-20 object-cover rounded-lg border border-gray-700 bg-gray-900" />
            <span className="text-[11px] text-emerald-400 font-mono">آپلود شد ✓</span>
          </div>
        ) : (
          <span className="text-xs text-gray-500">عکسی انتخاب نشده</span>
        )}
      </div>
    </div>
  );
return (
    <div className="space-y-6 text-gray-100 p-2 md:p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-900/60 p-5 rounded-2xl border border-gray-800 shadow-lg">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <span>مدیریت اسپانسرها و اسلایدرها</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            تنظیم محتوای اسلایدر داشبورد و لندینگ، نظارت بر تعداد ویو، کلیک و مدیریت صفحات اختصاصی.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchSponsors}
            className="p-2.5 rounded-xl border border-gray-700 bg-gray-800 hover:bg-gray-700 transition"
            title="تازه‌سازی"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>افزودن اسپانسر جدید</span>
          </button>
        </div>
      </div>

      <div className="bg-gray-900/60 rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-gray-950/60 text-gray-400 border-b border-gray-800 text-xs">
              <tr>
                <th className="py-4 px-4">رسانه اسلاید</th>
                <th className="py-4 px-4">نام اسپانسر و اسلاگ</th>
                <th className="py-4 px-4">جایگاه</th>
                <th className="py-4 px-4 text-center">آمار بازدید (View)</th>
                <th className="py-4 px-4 text-center">آمار کلیک (Click)</th>
                <th className="py-4 px-4 text-center">نرخ تعامل (CTR)</th>
                <th className="py-4 px-4 text-center">وضعیت</th>
                <th className="py-4 px-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400">
                    در حال بارگذاری اطلاعات اسپانسرها...
                  </td>
                </tr>
              ) : sponsors.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400">
                    هیچ حامی مالی ثبت نشده است. از دکمه «افزودن اسپانسر جدید» استفاده کنید.
                  </td>
                </tr>
              ) : (
                sponsors.map((s) => {
                  const ctr = s.viewCount > 0 ? ((s.clickCount / s.viewCount) * 100).toFixed(1) : "0.0";
                  return (
                    <tr key={s.id} className="hover:bg-gray-800/40 transition">
                      <td className="py-3 px-4">
                        <div className="w-20 h-12 rounded-lg bg-gray-800 overflow-hidden border border-gray-700 flex items-center justify-center">
                          {s.slideMediaUrl ? (
                            <img src={s.slideMediaUrl} alt={s.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs text-gray-500">بدون مدیا</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{s.name}</div>
                        <div className="text-xs text-gray-400 font-mono mt-0.5">/{s.slug}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-1 text-xs rounded-full border ${
                          s.placement === "DASHBOARD" 
                            ? "bg-purple-950/40 text-purple-300 border-purple-800/60"
                            : "bg-blue-950/40 text-blue-300 border-blue-800/60"
                        }`}>
                          {s.placement === "DASHBOARD" ? "داشبورد (افقی)" : s.placement === "LANDING_HERO" ? "لندینگ (Hero)" : "لندینگ (عمودی)"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-800 border border-gray-700 font-mono text-cyan-400">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{s.viewCount.toLocaleString("fa-IR")}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-800 border border-gray-700 font-mono text-emerald-400">
                          <MousePointerClick className="w-3.5 h-3.5" />
                          <span>{s.clickCount.toLocaleString("fa-IR")}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-amber-300 text-xs">
                        %{ctr}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleStatus(s)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer"
                        >
                          {s.isActive ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" /> فعال
                            </span>
                          ) : (
                            <span className="text-gray-500 flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5" /> غیرفعال
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <a
                            href={`/sponsors/${s.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-gray-400 hover:text-indigo-300 hover:bg-gray-800 rounded-lg transition"
                            title="مشاهده صفحه داخلی"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => openEditModal(s)}
                            className="p-1.5 text-gray-400 hover:text-amber-300 hover:bg-gray-800 rounded-lg transition"
                            title="ویرایش"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(s.id, s.name)}
                            className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-gray-800 rounded-lg transition"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 border-b border-gray-800 pb-3">
              {editingId ? "ویرایش اسپانسر" : "افزودن حامی مالی و اسلایدر جدید"}
            </h2>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">نام حامی مالی *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-indigo-500"
                    placeholder="مثال: دیجی‌کالا"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">اسلاگ یکتا (Slug برای URL) *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug || ""}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-100 font-mono text-left focus:outline-none focus:border-indigo-500"
                    placeholder="digikala"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">جایگاه اسلایدر</label>
                  <select
                    value={formData.placement || "DASHBOARD"}
                    onChange={(e) => setFormData({ ...formData, placement: e.target.value as any })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="DASHBOARD">داشبورد کاربران (افقی)</option>
                    <option value="LANDING_VERTICAL">صفحه اصلی سایت (عمودی)</option>
                    <option value="LANDING_HERO">بنر اصلی لندینگ (Hero)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">ترتیب نمایش (Order)</label>
                  <input
                    type="number"
                    value={formData.order || 0}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <ImageUploadField
                      label="تصویر اسلاید (آپلود عکس) *" fieldId="slide" value={formData.slideMediaUrl || ""}
                      onChange={(url) => setFormData({ ...formData, slideMediaUrl: url })}
                    />
                    </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-300 mb-1">شعار یا توضیح کوتاه (Tagline)</label>
                  <input
                    type="text"
                    value={formData.tagline || ""}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-indigo-500"
                    placeholder="بزرگترین فروشگاه اینترنتی ایران"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-800">
                <h3 className="text-sm font-semibold text-indigo-400 mb-3">محتوای صفحه اختصاصی حامی (/sponsors/:slug)</h3>
                
                <div className="space-y-3">
                  <div>
                    <ImageUploadField
                      label="تصویر کاور بالای صفحه اختصاصی (اختیاری)" fieldId="cover" value={formData.coverImageUrl || ""}
                      onChange={(url) => setFormData({ ...formData, coverImageUrl: url })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">متن کامل معرفی و توضیحات</label>
                    <textarea
                      rows={4}
                      value={formData.fullDescription || ""}
                      onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-indigo-500 leading-relaxed"
                      placeholder="درباره خدمات حامی، پیشنهادها و جوایز این دوره از جشنواره..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-gray-400" /> آدرس وب‌سایت
                      </label>
                      <input
                        type="url"
                        value={formData.websiteUrl || ""}
                        onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                        className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-100 font-mono text-left focus:outline-none focus:border-indigo-500"
                        placeholder="https://company.com"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1 flex items-center gap-1.5">
                        <span className="text-pink-400 font-bold text-xs">IG</span> اینستاگرام
                      </label>
                      <input
                        type="text"
                        value={formData.instagramUrl || ""}
                        onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                        className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-100 font-mono text-left focus:outline-none focus:border-indigo-500"
                        placeholder="https://instagram.com/brand یا brand_id"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1 flex items-center gap-1.5">
                        <span className="text-sky-400 font-bold text-xs">IN</span> لینکدین
                      </label>
                      <input
                        type="text"
                        value={formData.linkedinUrl || ""}
                        onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                        className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-100 font-mono text-left focus:outline-none focus:border-indigo-500"
                        placeholder="https://linkedin.com/company/brand"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1 flex items-center gap-1.5">
                        <Send className="w-3.5 h-3.5 text-blue-400" /> تلگرام
                      </label>
                      <input
                        type="text"
                        value={formData.telegramUrl || ""}
                        onChange={(e) => setFormData({ ...formData, telegramUrl: e.target.value })}
                        className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-100 font-mono text-left focus:outline-none focus:border-indigo-500"
                        placeholder="https://t.me/brand یا @channel"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-5 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm transition"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-indigo-600/20"
                >
                  {saving ? "در حال ذخیره..." : editingId ? "ثبت تغییرات" : "افزودن حامی"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSponsorsPage;
