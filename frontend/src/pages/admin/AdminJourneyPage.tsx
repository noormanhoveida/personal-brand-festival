import { FormattedContent } from "../../components/FormattedContent";
import { useEffect, useState } from "react";
import {
  JourneySection,
  JourneySectionDetail,
  attachQuestionToSection,
  createJourneySection,
  createSectionQuestion,
  deleteJourneySection,
  getJourneySection,
  listJourneySections,
} from "../../api/journey";
import { Situation, listSituations } from "../../api/situations";
import { listParticipants } from "../../api/admin";
import { listParticipantResponses } from "../../api/responses";
import { OptionsEditor } from "../../components/OptionsEditor";
import { QuestionBankPicker } from "../../components/QuestionBankPicker";
import { Button, Card, Input, LoadError, Spinner } from "../../components/ui";

type QInputType = "TEXT" | "LINK" | "PHOTO" | "TRAIT_TAG" | "SINGLE_CHOICE" | "MULTI_CHOICE";
type StageType = "BEFORE" | "AFTER";

const INPUT_TYPE_LABEL: Record<string, string> = {
  TEXT: "متن",
  LINK: "لینک",
  PHOTO: "عکس",
  TRAIT_TAG: "برچسب صفت",
  SINGLE_CHOICE: "تک‌انتخابی",
  MULTI_CHOICE: "چندانتخابی",
};

async function apiPatchOrDelete(url: string, method: "PATCH" | "DELETE", body?: any) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`/api${url}`, {
    method,
    headers,
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "خطای سرور");
  }
  return res.json().catch(() => ({}));
}

function SectionPanel({ section, situations }: { section: JourneySection; situations: Situation[] }) {
  const [detail, setDetail] = useState<JourneySectionDetail | null>(null);
  const [text, setText] = useState("");
  const [inputType, setInputType] = useState<QInputType>("TEXT");
  const [stage, setStage] = useState<StageType>("BEFORE");
  const [situationId, setSituationId] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [saving, setSaving] = useState(false);
  const [added, setAdded] = useState(false);

  // ویرایش درون‌خطی سوال
  const [editingQId, setEditingQId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editStage, setEditStage] = useState<StageType>("BEFORE");
  const [savingEdit, setSavingEdit] = useState(false);

  const isChoice = inputType === "SINGLE_CHOICE" || inputType === "MULTI_CHOICE";
  const validOptions = options.map((o) => o.trim()).filter(Boolean);

  const reload = () => {
    getJourneySection(section.id).then((d: any) => setDetail(d));
  };

  useEffect(reload, [section.id]);

  const submit = async () => {
    if (!text.trim()) return;
    if (inputType === "TRAIT_TAG" && !situationId) return;
    if (isChoice && validOptions.length < 2) return;
    setSaving(true);
    try {
      await createSectionQuestion(section.id, {
        text: text.trim(),
        inputType,
        situationId: inputType === "TRAIT_TAG" ? situationId : undefined,
        options: isChoice ? validOptions : undefined,
        stage,
      } as any);
      setText("");
      setOptions(["", ""]);
      setAdded(true);
      reload();
      setTimeout(() => setAdded(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEdit = async (qId: string) => {
    if (!editText.trim()) return;
    setSavingEdit(true);
    try {
      await apiPatchOrDelete(`/journey/questions/${qId}`, "PATCH", {
        text: editText.trim(),
        stage: editStage,
      });
      setEditingQId(null);
      reload();
    } catch (err: any) {
      alert(err.message || "خطا در ویرایش سوال");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteQ = async (qId: string) => {
    if (!confirm("آیا از حذف این سوال اطمینان دارید؟")) return;
    try {
      await apiPatchOrDelete(`/journey/questions/${qId}`, "DELETE");
      reload();
    } catch (err: any) {
      alert(err.message || "خطا در حذف سوال");
    }
  };

  return (
    <Card>
      <div className="font-semibold">{section.title}</div>
      {section.description && <p className="mt-1 text-xs opacity-60">{section.description}</p>}

      {detail && detail.questions && detail.questions.length > 0 && (
        <div className="mt-3 space-y-1 border-t pt-3" style={{ borderColor: "var(--surface)" }}>
          {detail.questions.map((q: any) => (
            <div
              key={q.id}
              className="rounded-lg px-3 py-2 text-sm"
              style={{ backgroundColor: "var(--surface)" }}
            >
              {editingQId === q.id ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold">ویرایش سوال</span>
                    <button onClick={() => setEditingQId(null)} className="opacity-60 hover:opacity-100">
                      انصراف
                    </button>
                  </div>
                  <Input
                    className="w-full"
                    value={editText}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditText(e.target.value)}
                  />
                  <div className="flex items-center gap-3 text-xs">
                    <span className="opacity-70">مرحله:</span>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        checked={editStage === "BEFORE"}
                        onChange={() => setEditStage("BEFORE")}
                      />
                      <span>قبل</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        checked={editStage === "AFTER"}
                        onChange={() => setEditStage("AFTER")}
                      />
                      <span>بعد</span>
                    </label>
                    <Button onClick={() => handleSaveEdit(q.id)} disabled={savingEdit}>
                      {savingEdit ? "در حال ثبت..." : "ذخیره"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded opacity-80" style={{ backgroundColor: "var(--bg)" }}>
                      {q.stage === "AFTER" ? "بعد (After)" : "قبل (Before)"}
                    </span>
                    <span className="ml-2 text-xs opacity-60">[{INPUT_TYPE_LABEL[q.inputType] || q.inputType}]</span>
                    <FormattedContent content={q.text} className="inline-block" />
                    {q.options && q.options.length > 0 && (
                      <div className="mt-1 text-xs opacity-60">گزینه‌ها: {q.options.join("، ")}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      onClick={() => {
                        setEditingQId(q.id);
                        setEditText(q.text);
                        setEditStage(q.stage || "BEFORE");
                      }}
                      className="opacity-70 hover:opacity-100 hover:underline"
                    >
                      ویرایش
                    </button>
                    <button
                      onClick={() => handleDeleteQ(q.id)}
                      className="text-red-400 hover:text-red-600 opacity-80 hover:opacity-100"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2 border-t pt-3" style={{ borderColor: "var(--surface)" }}>
        <select
          className="rounded-lg border px-2 py-1.5 text-xs"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--surface)", color: "var(--text)" }}
          value={inputType}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setInputType(e.target.value as QInputType)}
        >
          <option value="TEXT">متن</option>
          <option value="LINK">لینک</option>
          <option value="PHOTO">عکس</option>
          <option value="TRAIT_TAG">برچسب صفت (موقعیتی)</option>
          <option value="SINGLE_CHOICE">تستی — تک‌انتخابی</option>
          <option value="MULTI_CHOICE">تستی — چندانتخابی</option>
        </select>

        {/* سوییچ مرحله قبل و بعد */}
        <div
          className="flex items-center gap-2 rounded-lg border px-2 py-1 text-xs"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--surface)", color: "var(--text)" }}
        >
          <span className="opacity-70">مرحله:</span>
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              checked={stage === "BEFORE"}
              onChange={() => setStage("BEFORE")}
            />
            <span>قبل</span>
          </label>
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              checked={stage === "AFTER"}
              onChange={() => setStage("AFTER")}
            />
            <span>بعد</span>
          </label>
        </div>

        {inputType === "TRAIT_TAG" && (
          <select
            className="rounded-lg border px-2 py-1.5 text-xs"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--surface)", color: "var(--text)" }}
            value={situationId}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSituationId(e.target.value)}
          >
            <option value="">— انتخاب موقعیت —</option>
            {situations.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        )}
        <Input
          className="flex-1"
          placeholder="متن سؤال یا درخواست..."
          value={text}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
        />
        {isChoice && <OptionsEditor options={options} onChange={setOptions} />}
        <Button
          onClick={submit}
          disabled={
            saving ||
            !text.trim() ||
            (inputType === "TRAIT_TAG" && !situationId) ||
            (isChoice && validOptions.length < 2)
          }
        >
          {added ? "افزوده شد ✓" : "افزودن"}
        </Button>
      </div>

      <div className="mt-2">
        <QuestionBankPicker onAttach={(questionId) => attachQuestionToSection(section.id, questionId).then(reload)} />
      </div>
    </Card>
  );
}

function SectionsManager({
  sections,
  onChanged,
}: {
  sections: JourneySection[];
  onChanged: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [key, setKey] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!title.trim()) return;
    const autoKey = (key.trim() || title.trim().toLowerCase().replace(/\s+/g, "-")) || `sec-${Date.now()}`;
    setSaving(true);
    try {
      await createJourneySection({
        key: autoKey,
        title: title.trim(),
        description: description.trim() || undefined,
        order: sections.length + 1,
      } as any);
      setTitle("");
      setDescription("");
      setKey("");
      onChanged();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (s: JourneySection) => {
    if (!confirm(`آیا از حذف بخش «${s.title}» مطمئن هستید؟ همه سؤالات آن از بخش خارج می‌شوند.`)) {
      return;
    }
    await deleteJourneySection(s.id);
    onChanged();
  };

  return (
    <Card>
      <div className="text-sm font-semibold">افزودن بخش جدید به مسیر</div>
      <div className="mt-3 grid gap-2 sm:grid-cols-4">
        <Input
          placeholder="عنوان بخش (مثلاً خودآگاهی)"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
        />
        <Input
          placeholder="کلید انگلیسی یکتا (اختیاری)"
          value={key}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKey(e.target.value)}
        />
        <Input
          placeholder="توضیح کوتاه (اختیاری)"
          value={description}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
        />
        <Button onClick={submit} disabled={saving || !title.trim()}>
          {saving ? "در حال افزودن..." : "افزودن بخش"}
        </Button>
      </div>

      {sections.length > 0 && (
        <div className="mt-4 border-t pt-3" style={{ borderColor: "var(--surface)" }}>
          <div className="text-xs opacity-60">بخش‌های موجود (ترتیب از بالا به پایین):</div>
          <div className="mt-2 space-y-1">
            {sections.map((s, idx) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded px-2 py-1 text-xs"
                style={{ backgroundColor: "var(--surface)" }}
              >
                <span>
                  {idx + 1}. {s.title}
                </span>
                <button
                  type="button"
                  onClick={() => remove(s)}
                  className="text-red-400 hover:underline"
                >
                  حذف
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

function ParticipantAnswersViewer({ sections }: { sections: JourneySection[] }) {
  const [participants, setParticipants] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [loadingParticipants, setLoadingParticipants] = useState(true);
  const [loadingResponses, setLoadingResponses] = useState(false);
  const [responses, setResponses] = useState<any[]>([]);
  const [activeSectionId, setActiveSectionId] = useState<string>("ALL");

  useEffect(() => {
    (listParticipants as any)({})
      .then((data: any) => {
        const list = Array.isArray(data) ? data : data?.participants || [];
        setParticipants(list);
        if (list.length > 0) {
          setSelectedUserId(list[0].id || list[0].userId || "");
        }
      })
      .catch(() => {
        (listParticipants as any)()
          .then((data: any) => {
            const list = Array.isArray(data) ? data : data?.participants || [];
            setParticipants(list);
            if (list.length > 0) {
              setSelectedUserId(list[0].id || list[0].userId || "");
            }
          })
          .catch(() => setParticipants([]));
      })
      .finally(() => setLoadingParticipants(false));
  }, []);

  useEffect(() => {
    if (!selectedUserId) {
      setResponses([]);
      return;
    }
    setLoadingResponses(true);
    listParticipantResponses(selectedUserId)
      .then((data: any) => {
        setResponses(Array.isArray(data) ? data : data?.responses || []);
      })
      .catch(() => setResponses([]))
      .finally(() => setLoadingResponses(false));
  }, [selectedUserId]);

  const selectedParticipant = participants.find((p) => (p.id || p.userId) === selectedUserId);

  const filteredResponses =
    activeSectionId === "ALL"
      ? responses
      : responses.filter(
          (r: any) =>
            r.question?.journeySectionId === activeSectionId ||
            r.question?.sectionId === activeSectionId
        );

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-semibold">انتخاب شرکت‌کننده</div>
            <div className="text-xs opacity-60">مشاهده سیر تکامل پاسخ‌ها و نسخه‌های ثبت‌شده</div>
          </div>
          {loadingParticipants ? (
            <Spinner />
          ) : participants.length === 0 ? (
            <span className="text-xs opacity-60">هیچ شرکت‌کننده‌ای یافت نشد.</span>
          ) : (
            <select
              className="rounded-lg border px-3 py-1.5 text-xs"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--surface)",
                color: "var(--text)",
              }}
              value={selectedUserId}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedUserId(e.target.value)}
            >
              {participants.map((p: any) => {
                const id = p.id || p.userId;
                const name = p.name || p.user?.name || "بدون نام";
                const email = p.email || p.user?.email || "";
                const stdId = p.studentId || p.studentNumber || p.user?.studentId || "-";
                return (
                  <option key={id} value={id}>
                    {name} ({email}) — کد: {stdId}
                  </option>
                );
              })}
            </select>
          )}
        </div>

        {selectedParticipant && (
          <div className="mt-3 flex flex-wrap gap-4 border-t pt-3 text-xs opacity-80" style={{ borderColor: "var(--surface)" }}>
            <div>
              <span className="opacity-60">نام: </span>
              {selectedParticipant.name || selectedParticipant.user?.name || "-"}
            </div>
            <div>
              <span className="opacity-60">ایمیل: </span>
              {selectedParticipant.email || selectedParticipant.user?.email || "-"}
            </div>
            <div>
              <span className="opacity-60">شماره دانشجویی: </span>
              {selectedParticipant.studentId || selectedParticipant.studentNumber || selectedParticipant.user?.studentId || "-"}
            </div>
            <div>
              <span className="opacity-60">دانشگاه: </span>
              {selectedParticipant.university || selectedParticipant.user?.university || "-"}
            </div>
          </div>
        )}
      </Card>

      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => setActiveSectionId("ALL")}
          className={`rounded-lg px-3 py-1 text-xs transition-all ${
            activeSectionId === "ALL"
              ? "bg-[var(--accent)] text-white font-semibold"
              : "opacity-60 hover:opacity-100"
          }`}
          style={{ backgroundColor: activeSectionId === "ALL" ? undefined : "var(--surface)" }}
        >
          همه بخش‌ها ({responses.length})
        </button>
        {sections.map((sec) => {
          const count = responses.filter(
            (r: any) =>
              r.question?.journeySectionId === sec.id ||
              r.question?.sectionId === sec.id
          ).length;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSectionId(sec.id)}
              className={`rounded-lg px-3 py-1 text-xs transition-all ${
                activeSectionId === sec.id
                  ? "bg-[var(--accent)] text-white font-semibold"
                  : "opacity-60 hover:opacity-100"
              }`}
              style={{ backgroundColor: activeSectionId === sec.id ? undefined : "var(--surface)" }}
            >
              {sec.title} ({count})
            </button>
          );
        })}
      </div>

      {loadingResponses ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : filteredResponses.length === 0 ? (
        <Card>
          <div className="py-8 text-center text-xs opacity-60">
            {selectedUserId
              ? "هنوز هیچ پاسخی برای این شرکت‌کننده ثبت نشده است."
              : "لطفاً ابتدا یک شرکت‌کننده را انتخاب کنید."}
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredResponses.map((item: any) => {
            const versions: any[] = item.versions || [];
            const firstVer = item.firstVersion || versions[0] || {};
            const latestVer = item.latestVersion || versions[versions.length - 1] || firstVer;

            return (
              <Card key={item.id}>
                <div className="flex items-start justify-between gap-2 border-b pb-2" style={{ borderColor: "var(--surface)" }}>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="text-xs font-semibold"><FormattedContent content={item.question?.text || "سوال"} /></div>
                      {item.question?.inputType && (
                        <span className="text-[10px] opacity-60">
                          [{INPUT_TYPE_LABEL[item.question.inputType] || item.question.inputType}]
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-[10px] opacity-60">
                    تعداد ویرایش‌ها: {versions.length}
                  </div>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div
                    className="rounded-lg p-3 text-xs"
                    style={{
                      backgroundColor: "var(--surface)",
                      border: "1px solid #e0a63f40",
                    }}
                  >
                    <div className="flex items-center justify-between text-amber-500 font-semibold">
                      <span>پاسخ اولیه (نسخه {firstVer.versionNumber || 1})</span>
                      {firstVer.createdAt && (
                        <span className="text-[10px] opacity-70">
                          {new Date(firstVer.createdAt).toLocaleDateString("fa-IR")}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 leading-relaxed opacity-90 whitespace-pre-wrap">
                      {firstVer.content || "(پاسخ خالی)"}
                    </p>
                  </div>

                  <div
                    className="rounded-lg p-3 text-xs"
                    style={{
                      backgroundColor: "var(--surface)",
                      border: "1px solid #22c55e40",
                    }}
                  >
                    <div className="flex items-center justify-between text-emerald-500 font-semibold">
                      <span>آخرین نسخه (نسخه {latestVer.versionNumber || versions.length || 1})</span>
                      {latestVer.createdAt && (
                        <span className="text-[10px] opacity-70">
                          {new Date(latestVer.createdAt).toLocaleDateString("fa-IR")}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 leading-relaxed opacity-90 whitespace-pre-wrap">
                      {latestVer.content || "(پاسخ خالی)"}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function AdminJourneyPage() {
  const [activeTab, setActiveTab] = useState<"ANSWERS" | "STRUCTURE">("ANSWERS");
  const [sections, setSections] = useState<JourneySection[] | null>(null);
  const [situations, setSituations] = useState<Situation[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  const reload = () => {
    setLoadError(null);
    listJourneySections()
      .then((data: any) => setSections(Array.isArray(data) ? data : data?.sections || []))
      .catch(() => setLoadError("بارگذاری بخش‌های مسیر برند با خطا مواجه شد."));
    listSituations().then((data: any) => setSituations(Array.isArray(data) ? data : data?.situations || [])).catch(() => {});
  };

  useEffect(reload, []);

  if (loadError) return <LoadError message={loadError} onRetry={reload} />;

  if (!sections) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">مدیریت و پایش مسیر برند</h1>
          <p className="mt-1 text-sm opacity-70">
            مشاهده پاسخ‌ها و نسخه‌های ثبت‌شده شرکت‌کنندگان یا ویرایش ساختار سوالات مسیر
          </p>
        </div>
      </div>

      <div className="mt-6 flex border-b" style={{ borderColor: "var(--surface)" }}>
        <button
          onClick={() => setActiveTab("ANSWERS")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "ANSWERS"
              ? "border-[var(--accent)] text-[var(--accent)]"
              : "border-transparent opacity-60 hover:opacity-100"
          }`}
        >
          🔍 پاسخ‌های شرکت‌کنندگان و تاریخچه نسخه‌ها
        </button>
        <button
          onClick={() => setActiveTab("STRUCTURE")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "STRUCTURE"
              ? "border-[var(--accent)] text-[var(--accent)]"
              : "border-transparent opacity-60 hover:opacity-100"
          }`}
        >
          ⚙️ طراحی و ویرایش ساختار مسیر برند
        </button>
      </div>

      {activeTab === "ANSWERS" ? (
        <ParticipantAnswersViewer sections={sections} />
      ) : (
        <div className="mt-4 space-y-4">
          {situations.length === 0 && (
            <p className="mb-3 text-xs" style={{ color: "#e0a63f" }}>
              هنوز هیچ موقعیتی تعریف نشده — برای استفاده از «برچسب صفت»، اول از صفحه‌ی
              «موقعیت‌ها و صفات» حداقل یک موقعیت و چند صفت بسازید.
            </p>
          )}

          <SectionsManager sections={sections} onChanged={reload} />

          <div className="mt-6 space-y-4">
            {sections.map((s) => (
              <SectionPanel key={s.id} section={s} situations={situations} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminJourneyPage;
