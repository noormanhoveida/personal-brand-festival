import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getSocket } from "../lib/socket";
import { getLiveSession, LiveGroup, LiveMessage, listGroupMessages } from "../api/liveSession";
import { Button, Card, LoadError, Spinner, Textarea } from "../components/ui";
import { Avatar } from "../components/Avatar";

/**
 * §Phase 1–3 of the live group-work spec, participant side. The three
 * states (checking in / grouped / chatting) all live on one page since
 * the transition between them happens live, mid-session, via the
 * `grouping:done` / `group:assigned` socket events — there's no reload
 * for the participant when the manager confirms groups.
 */
export function BootcampLivePage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [loadError, setLoadError] = useState<string | null>(null);
  const [status, setStatus] = useState<"OPEN" | "GROUPED" | "CLOSED" | null>(null);
  const [group, setGroup] = useState<LiveGroup | null>(null);
  const [taskBrief, setTaskBrief] = useState<string | null>(null);
  const [messages, setMessages] = useState<LiveMessage[]>([]);
  const [draft, setDraft] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sessionId) return;
    const socket = getSocket();

    getLiveSession(sessionId)
      .then((session) => setTaskBrief(session.taskBrief ?? null))
      .catch(() => setLoadError("بارگذاری جلسه با خطا مواجه شد."));

    socket.emit("session:join", { sessionId });

    const onState = (payload: { status: "OPEN" | "GROUPED"; group: LiveGroup | null }) => {
      setStatus(payload.status);
      if (payload.group) {
        setGroup(payload.group);
        listGroupMessages(sessionId, payload.group.id).then(setMessages);
      }
    };
    const onGroupAssigned = (payload: { groupId: string; groupName: string; taskBrief?: string }) => {
      setStatus("GROUPED");
      setGroup({ id: payload.groupId, name: payload.groupName, members: [] });
      setTaskBrief(payload.taskBrief ?? taskBrief);
      listGroupMessages(sessionId, payload.groupId).then(setMessages);
    };
    const onGroupMessage = (msg: LiveMessage & { groupId: string; senderName: string }) => {
      setMessages((prev) => [...prev, { ...msg, sender: { id: msg.senderId, firstName: msg.senderName, lastName: "" } }]);
    };
    const onClosed = () => setStatus("CLOSED");
    const onError = (payload: { message: string }) => setLoadError(payload.message);

    socket.on("session:state", onState);
    socket.on("group:assigned", onGroupAssigned);
    socket.on("group:message", onGroupMessage);
    socket.on("session:closed", onClosed);
    socket.on("session:error", onError);

    return () => {
      socket.off("session:state", onState);
      socket.off("group:assigned", onGroupAssigned);
      socket.off("group:message", onGroupMessage);
      socket.off("session:closed", onClosed);
      socket.off("session:error", onError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!draft.trim() || !group || !sessionId) return;
    getSocket().emit("group:message", { sessionId, groupId: group.id, content: draft.trim() });
    setDraft("");
  };

  if (loadError) return <LoadError message={loadError} />;
  if (!status) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (status === "CLOSED") {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <p className="text-sm opacity-70">این جلسه‌ی زنده به پایان رسیده است.</p>
      </div>
    );
  }

  if (status === "OPEN" || !group) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <Card>
          <h1 className="text-lg font-semibold">در حال ورود به جلسه...</h1>
          <p className="mt-2 text-sm opacity-70">
            وضعیت حضور شما ثبت شد. به‌محض اینکه مسئول برگزاری گروه‌بندی را تأیید کند،
            این صفحه به‌صورت خودکار گروه شما را نشان می‌دهد.
          </p>
          <div className="mt-4 flex justify-center">
            <Spinner />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-xl font-bold">گروه: {group.name}</h1>
      {taskBrief && (
        <Card className="mt-3">
          <h2 className="mb-1 text-sm font-semibold">توضیحات کار گروهی</h2>
          <p className="text-sm opacity-80">{taskBrief}</p>
        </Card>
      )}
      {group.members.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-3">
          {group.members.map((m) => (
            <div key={m.participant.id} className="flex items-center gap-1.5 text-xs opacity-80">
              <Avatar url={m.participant.media?.[0]?.url} firstName={m.participant.firstName} lastName={m.participant.lastName} size={22} />
              {m.participant.firstName} {m.participant.lastName}
            </div>
          ))}
        </div>
      )}

      <Card className="mt-4 flex h-[420px] flex-col">
        <div className="flex-1 space-y-2 overflow-y-auto p-1">
          {messages.map((m) => (
            <div key={m.id} className="rounded-lg px-3 py-2 text-sm" style={{ backgroundColor: "var(--surface)" }}>
              <span className="font-medium">{m.sender.firstName} {m.sender.lastName}</span>
              <span className="mr-2 opacity-80">{m.content}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="mt-3 flex gap-2">
          <Textarea
            rows={1}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="پیام خود را بنویسید..."
            className="flex-1"
          />
          <Button onClick={sendMessage} disabled={!draft.trim()}>
            ارسال
          </Button>
        </div>
      </Card>
    </div>
  );
}
