import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getSocket } from "../../lib/socket";
import { confirmGrouping, LiveSession, startLiveSession } from "../../api/liveSession";
import { Button, Card, ErrorText, LoadError, Spinner, Textarea } from "../../components/ui";
import { Avatar } from "../../components/Avatar";

interface OnlineEntry {
  participantId: string;
  name: string;
  avatarUrl?: string | null;
  online: boolean;
  joinedAt: string;
  groupId: string | null;
  groupName?: string | null;
}

interface DraftGroup {
  name: string;
  participantIds: string[];
}

/**
 * §Phase 1–2 of the live group-work spec, manager side. Grouping here
 * is selection-based (check people, click "make a group") rather than
 * drag-and-drop — the spec allows either, and this keeps the
 * interaction simple and keyboard-friendly while covering the same
 * outcome: the manager picks who goes in which group, then confirms.
 */
export function ManagerLiveSessionPage() {
  const { bootcampId } = useParams<{ bootcampId: string }>();
  const [session, setSession] = useState<LiveSession | null>(null);
  const [online, setOnline] = useState<Map<string, OnlineEntry>>(new Map());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [draftGroups, setDraftGroups] = useState<DraftGroup[]>([]);
  const [taskBrief, setTaskBrief] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!bootcampId) return;
    startLiveSession(bootcampId)
      .then((s) => setSession(s))
      .catch(() => setLoadError("شروع جلسه با خطا مواجه شد."));
  }, [bootcampId]);

  useEffect(() => {
    if (!session) return;
    const socket = getSocket();
    socket.emit("session:admin-subscribe", { sessionId: session.id });

    const onSnapshot = (payload: { presences: OnlineEntry[] }) => {
      setOnline(new Map(payload.presences.map((p) => [p.participantId, p])));
    };
    const onUpdate = (payload: Partial<OnlineEntry> & { participantId: string }) => {
      setOnline((prev) => {
        const next = new Map(prev);
        const existing = next.get(payload.participantId);
        next.set(payload.participantId, { ...(existing as OnlineEntry), ...payload } as OnlineEntry);
        return next;
      });
    };

    socket.on("presence:snapshot", onSnapshot);
    socket.on("presence:update", onUpdate);
    return () => {
      socket.off("presence:snapshot", onSnapshot);
      socket.off("presence:update", onUpdate);
    };
  }, [session]);

  const toggleSelect = (participantId: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(participantId)) next.delete(participantId);
      else next.add(participantId);
      return next;
    });
  };

  const makeGroupFromSelection = () => {
    if (selected.size === 0) return;
    setDraftGroups((prev) => [
      ...prev,
      { name: `گروه ${prev.length + 1}`, participantIds: Array.from(selected) },
    ]);
    setSelected(new Set());
  };

  const removeGroup = (index: number) => {
    setDraftGroups((prev) => prev.filter((_, i) => i !== index));
  };

  const assignedIds = new Set(draftGroups.flatMap((g) => g.participantIds));

  const handleConfirm = async () => {
    if (!session || draftGroups.length === 0) return;
    setConfirming(true);
    setError(null);
    try {
      await confirmGrouping(session.id, { taskBrief: taskBrief.trim() || undefined, groups: draftGroups });
      setConfirmed(true);
    } catch {
      setError("تأیید گروه‌بندی با خطا مواجه شد.");
    } finally {
      setConfirming(false);
    }
  };

  if (loadError) return <LoadError message={loadError} />;
  if (!session) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  const onlineList = Array.from(online.values()).filter((p) => p.online);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-xl font-bold">جلسه‌ی زنده — {session.bootcamp?.title}</h1>
      <Link to={`/dashboard/admin/live-sessions/${session.id}/log`} className="text-xs" style={{ color: "var(--accent)" }}>
        مشاهده‌ی لاگ کامل این جلسه ←
      </Link>
      <p className="mt-1 text-sm opacity-70">
        {onlineList.length} نفر در حال حاضر آنلاین هستند. افراد مورد نظر را انتخاب کنید و یک
        گروه بسازید؛ بعد از ساخت همه‌ی گروه‌ها، «تأیید و شروع» را بزنید تا صفحه‌ی همه‌ی
        شرکت‌کننده‌ها هم‌زمان به گروهشان تغییر کند.
      </p>

      {confirmed && (
        <Card className="mt-4" >
          <p className="text-sm" style={{ color: "var(--accent)" }}>
            گروه‌بندی تأیید و برای همه‌ی اعضا ارسال شد ✓
          </p>
        </Card>
      )}

      <Card className="mt-4">
        <h2 className="mb-2 text-sm font-semibold">افراد آنلاین</h2>
        <div className="max-h-64 space-y-1 overflow-y-auto">
          {onlineList.map((p) => (
            <label
              key={p.participantId}
              className="flex items-center gap-2 rounded-lg px-2 py-1 text-sm"
              style={{ backgroundColor: "var(--surface)" }}
            >
              <input
                type="checkbox"
                disabled={assignedIds.has(p.participantId)}
                checked={selected.has(p.participantId)}
                onChange={() => toggleSelect(p.participantId)}
              />
              <Avatar
                url={p.avatarUrl}
                firstName={p.name.split(" ")[0] ?? ""}
                lastName={p.name.split(" ")[1] ?? ""}
                size={24}
              />
              <span>{p.name}</span>
              {assignedIds.has(p.participantId) && (
                <span className="mr-auto text-xs opacity-60">
                  در {draftGroups.find((g) => g.participantIds.includes(p.participantId))?.name}
                </span>
              )}
            </label>
          ))}
          {onlineList.length === 0 && <p className="text-xs opacity-60">هنوز کسی وارد نشده است.</p>}
        </div>
        <Button className="mt-3" onClick={makeGroupFromSelection} disabled={selected.size === 0}>
          ساخت گروه از {selected.size} نفر انتخاب‌شده
        </Button>
      </Card>

      <Card className="mt-4">
        <h2 className="mb-2 text-sm font-semibold">گروه‌های ساخته‌شده ({draftGroups.length})</h2>
        {draftGroups.map((g, i) => (
          <div key={i} className="mb-2 rounded-lg p-2 text-sm" style={{ backgroundColor: "var(--surface)" }}>
            <div className="flex items-center justify-between">
              <b>{g.name}</b>
              <button className="text-xs opacity-60 hover:opacity-100" onClick={() => removeGroup(i)}>
                حذف
              </button>
            </div>
            <p className="mt-1 text-xs opacity-70">
              {g.participantIds.map((id) => online.get(id)?.name ?? id).join("، ")}
            </p>
          </div>
        ))}
        {draftGroups.length === 0 && <p className="text-xs opacity-60">هنوز گروهی ساخته نشده.</p>}

        <div className="mt-3">
          <Textarea
            rows={2}
            placeholder="توضیحات کار گروهی (نمایش داده می‌شود به همه‌ی اعضا)"
            value={taskBrief}
            onChange={(e) => setTaskBrief(e.target.value)}
          />
        </div>
        <Button className="mt-3" onClick={handleConfirm} disabled={confirming || draftGroups.length === 0}>
          {confirming ? "در حال ارسال..." : "تأیید و شروع گروه‌بندی"}
        </Button>
        <ErrorText>{error}</ErrorText>
      </Card>
    </div>
  );
}
