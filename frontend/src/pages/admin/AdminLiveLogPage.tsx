import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAdminLog, LiveMessage, LivePresence } from "../../api/liveSession";
import { Button, Card, Input, LoadError, Spinner } from "../../components/ui";

/**
 * §Phase 5 of the live group-work spec: the manager/admin's full
 * access to every conversation, file, and presence log for a session,
 * filterable by group, participant, or time range.
 */
export function AdminLiveLogPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [presences, setPresences] = useState<LivePresence[] | null>(null);
  const [messages, setMessages] = useState<LiveMessage[] | null>(null);
  const [groupId, setGroupId] = useState("");
  const [participantId, setParticipantId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    if (!sessionId) return;
    setError(null);
    getAdminLog(sessionId, {
      groupId: groupId || undefined,
      participantId: participantId || undefined,
      from: from || undefined,
      to: to || undefined,
    })
      .then((res) => {
        setPresences(res.presences);
        setMessages(res.messages);
      })
      .catch(() => setError("بارگذاری لاگ با خطا مواجه شد."));
  };

  useEffect(load, [sessionId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) return <LoadError message={error} onRetry={load} />;
  if (!presences || !messages) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-xl font-bold">لاگ کامل جلسه‌ی زنده</h1>

      <Card className="mt-4">
        <h2 className="mb-2 text-sm font-semibold">فیلترها</h2>
        <div className="flex flex-wrap gap-2">
          <Input placeholder="شناسه گروه" value={groupId} onChange={(e) => setGroupId(e.target.value)} className="max-w-[220px]" />
          <Input placeholder="شناسه شرکت‌کننده" value={participantId} onChange={(e) => setParticipantId(e.target.value)} className="max-w-[220px]" />
          <Input type="datetime-local" value={from} onChange={(e) => setFrom(e.target.value)} className="max-w-[200px]" />
          <Input type="datetime-local" value={to} onChange={(e) => setTo(e.target.value)} className="max-w-[200px]" />
          <Button onClick={load}>اعمال فیلتر</Button>
        </div>
      </Card>

      <Card className="mt-4">
        <h2 className="mb-2 text-sm font-semibold">حضور ({presences.length})</h2>
        <div className="max-h-48 space-y-1 overflow-y-auto">
          {presences.map((p) => (
            <div key={p.id} className="rounded-lg px-2 py-1 text-xs" style={{ backgroundColor: "var(--surface)" }}>
              {p.participant.firstName} {p.participant.lastName} —{" "}
              {p.online ? "آنلاین" : "آفلاین"} {p.group && `— گروه: ${p.group.name}`}
            </div>
          ))}
          {presences.length === 0 && <p className="text-xs opacity-60">موردی یافت نشد.</p>}
        </div>
      </Card>

      <Card className="mt-4">
        <h2 className="mb-2 text-sm font-semibold">پیام‌ها ({messages.length})</h2>
        <div className="max-h-96 space-y-1 overflow-y-auto">
          {messages.map((m) => (
            <div key={m.id} className="rounded-lg px-2 py-1 text-xs" style={{ backgroundColor: "var(--surface)" }}>
              <span className="font-medium">{m.sender.firstName} {m.sender.lastName}</span>
              {m.receiverId ? " (شخصی)" : m.groupId ? " (گروهی)" : ""}
              <span className="mr-2 opacity-70">{m.content}</span>
              {m.fileUrl && (
                <a href={m.fileUrl} target="_blank" rel="noreferrer" className="mr-2 underline">
                  فایل پیوست
                </a>
              )}
              <span className="mr-2 opacity-50">{new Date(m.createdAt).toLocaleString("fa-IR")}</span>
            </div>
          ))}
          {messages.length === 0 && <p className="text-xs opacity-60">موردی یافت نشد.</p>}
        </div>
      </Card>
    </div>
  );
}
