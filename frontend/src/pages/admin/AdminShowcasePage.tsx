import { useState } from "react";
import {
  AdminShowcaseParticipant,
  getAdminShowcaseList,
  renameCategory,
  setFeatured,
  setFinalist,
  setWinner,
} from "../../api/showcase";
import { useAsync } from "../../hooks/useAsync";
import { Button, Card, Input, LoadError, Spinner } from "../../components/ui";

export function AdminShowcasePage() {
  const { data, error, loading, reload } = useAsync(getAdminShowcaseList);
  const [searchTerm, setSearchTerm] = useState("");
  const [winnerDrafts, setWinnerDrafts] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);

  // وضعیت ویرایش یکپارچه نام دسته
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryBusy, setCategoryBusy] = useState(false);

  const participants = data?.participants ?? [];
  const categories = data?.categories ?? [];

  const handleToggleFeatured = async (p: AdminShowcaseParticipant) => {
    setBusyId(`featured-${p.id}`);
    try {
      await setFeatured(p.id, !p.featured);
      await reload();
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleFinalist = async (p: AdminShowcaseParticipant) => {
    setBusyId(`finalist-${p.id}`);
    try {
      await setFinalist(p.id, !p.finalist);
      await reload();
    } finally {
      setBusyId(null);
    }
  };

  const handleSaveWinner = async (p: AdminShowcaseParticipant) => {
    const raw = winnerDrafts[p.id];
    const category = raw !== undefined ? raw.trim() : (p.winnerCategory ?? "").trim();
    if (!category) return;
    setBusyId(`winner-${p.id}`);
    try {
      await setWinner(p.id, category);
      await reload();
    } finally {
      setBusyId(null);
    }
  };

  const handleClearWinner = async (p: AdminShowcaseParticipant) => {
    setBusyId(`winner-${p.id}`);
    try {
      await setWinner(p.id, null);
      setWinnerDrafts((d) => ({ ...d, [p.id]: "" }));
      await reload();
    } finally {
      setBusyId(null);
    }
  };

  const handleRenameCategorySubmit = async (oldName: string) => {
    if (!newCategoryName.trim() || newCategoryName.trim() === oldName) {
      setEditingCategory(null);
      return;
    }
    setCategoryBusy(true);
    try {
      await renameCategory(oldName, newCategoryName.trim());
      setEditingCategory(null);
      setNewCategoryName("");
      await reload();
    } finally {
      setCategoryBusy(false);
    }
  };

  const handleDeleteCategory = async (catName: string) => {
    if (!window.confirm(`آیا دسته‌ی «${catName}» از تمام شرکت‌کنندگان حذف شود؟`)) return;
    setCategoryBusy(true);
    try {
      await renameCategory(catName, null);
      await reload();
    } finally {
      setCategoryBusy(false);
    }
  };

  if (error) return <LoadError message={error} onRetry={reload} />;

  if (loading || !data) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  const filteredParticipants = participants.filter((p) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.fullName.toLowerCase().includes(term) ||
      (p.city && p.city.toLowerCase().includes(term)) ||
      (p.winnerCategory && p.winnerCategory.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">مدیریت ویترین و فینالیست‌های فستیوال</h1>
        <p className="mt-1 text-sm opacity-70">
          وضعیت حضور شرکت‌کنندگان در بخش‌های مختلف ویترین عمومی را تعیین کنید. صفحاتی که منتشر شده باشند در ویترین نمایش داده می‌شوند.
        </p>
      </div>

      {/* بخش دسته‌بندی‌های موجود */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">دسته‌های برندگان ثبت‌شده ({categories.length})</h2>
          <span className="text-xs opacity-60">تغییر نام دسته روی تمام شرکت‌کنندگان همان دسته اثر می‌گذارد</span>
        </div>

        {categories.length === 0 ? (
          <p className="text-xs opacity-50">هنوز هیچ دسته‌ای ثبت نشده است. با ثبت برنده در لیست زیر دسته‌ها ساخته می‌شوند.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((c) => (
              <div
                key={c.name}
                className="flex items-center justify-between gap-2 p-2.5 rounded-xl border text-xs"
                style={{ backgroundColor: "var(--surface)", borderColor: "var(--surface)" }}
              >
                {editingCategory === c.name ? (
                  <div className="flex items-center gap-1 w-full">
                    <Input
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="py-1 px-2 text-xs flex-1"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      disabled={categoryBusy}
                      onClick={() => handleRenameCategorySubmit(c.name)}
                    >
                      ذخیره
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingCategory(null)}
                    >
                      لغو
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="truncate">
                      <span className="font-semibold">{c.name}</span>
                      <span className="mr-1.5 opacity-60 text-[11px]">({c.count} نفر)</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingCategory(c.name);
                          setNewCategoryName(c.name);
                        }}
                      >
                        ویرایش
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={categoryBusy}
                        onClick={() => handleDeleteCategory(c.name)}
                      >
                        حذف
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* جستجو و لیست شرکت‌کنندگان */}
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="جستجو با نام، شهر یا دسته‌بندی..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <div className="text-xs opacity-60">
          تعداد: {filteredParticipants.length} نفر
        </div>
      </div>

      <div className="space-y-3">
        {filteredParticipants.map((p) => {
          const currentDraft = winnerDrafts[p.id] ?? (p.winnerCategory || "");
          const isWinnerChanged = currentDraft.trim() !== (p.winnerCategory || "").trim();

          return (
            <Card key={p.id} className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {p.avatarUrl ? (
                  <img
                    src={p.avatarUrl}
                    alt={p.fullName}
                    className="h-10 w-10 rounded-full object-cover border"
                    style={{ borderColor: "var(--surface)" }}
                  />
                ) : (
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: "var(--surface)" }}
                  >
                    {p.fullName.slice(0, 1)}
                  </div>
                )}
                <div>
                  <div className="text-sm font-semibold flex items-center gap-2">
                    {p.fullName}
                    <span className="text-xs opacity-50 font-normal">{p.city || "نامشخص"}</span>
                    {p.isPublished ? (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400">
                        منتشرشده
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-yellow-500/20 text-yellow-400">
                        پیش‌نویس
                      </span>
                    )}
                  </div>
                  <div className="text-xs opacity-60 mt-0.5">
                    اسلاگ: <span className="font-mono">{p.slug || "ندارد"}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* دکمه وضعیت برجسته */}
                <Button
                  size="sm"
                  variant={p.featured ? "primary" : "ghost"}
                  onClick={() => handleToggleFeatured(p)}
                  disabled={busyId === `featured-${p.id}`}
                >
                  {p.featured ? "✓ برجسته" : "+ برجسته"}
                </Button>

                {/* دکمه وضعیت فینالیست */}
                <Button
                  size="sm"
                  variant={p.finalist ? "primary" : "ghost"}
                  onClick={() => handleToggleFinalist(p)}
                  disabled={busyId === `finalist-${p.id}`}
                >
                  {p.finalist ? "✓ فینالیست" : "+ فینالیست"}
                </Button>

                {/* انتخاب یا تایپ دسته */}
                <div className="flex items-center gap-1.5">
                  <Input
                    placeholder="دسته برنده..."
                    list={`cat-list-${p.id}`}
                    className="w-36 text-xs py-1.5"
                    value={currentDraft}
                    onChange={(e) => setWinnerDrafts((d) => ({ ...d, [p.id]: e.target.value }))}
                  />
                  <datalist id={`cat-list-${p.id}`}>
                    {categories.map((c) => (
                      <option key={c.name} value={c.name} />
                    ))}
                  </datalist>

                  <Button
                    size="sm"
                    variant={p.winnerCategory ? "primary" : "ghost"}
                    onClick={() => handleSaveWinner(p)}
                    disabled={busyId === `winner-${p.id}` || (!currentDraft.trim() && !isWinnerChanged)}
                  >
                    {p.winnerCategory ? "ویرایش دسته" : "ثبت برنده"}
                  </Button>

                  {p.winnerCategory && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleClearWinner(p)}
                      disabled={busyId === `winner-${p.id}`}
                    >
                      حذف برنده
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
