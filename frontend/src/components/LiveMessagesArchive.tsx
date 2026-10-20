import { useEffect, useState } from "react";
import {
  LiveGroupArchiveEntry,
  LiveMessage,
  listMyGroupArchive,
  listMyReceivedMessages,
} from "../api/liveSession";
import { Card, Spinner } from "./ui";

/**
 * §Phase 4 of the live group-work spec: on the participant's own
 * profile, (a) personal messages they received during group work, and
 * (b) a full archive of every group-work thread they took part in.
 */
export function LiveMessagesArchive() {
  const [personal, setPersonal] = useState<LiveMessage[] | null>(null);
  const [groups, setGroups] = useState<LiveGroupArchiveEntry[] | null>(null);

  useEffect(() => {
    listMyReceivedMessages().then(setPersonal).catch(() => setPersonal([]));
    listMyGroupArchive().then(setGroups).catch(() => setGroups([]));
  }, []);

  if (personal === null || groups === null) {
    return (
      <div className="mt-6 flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (personal.length === 0 && groups.length === 0) {
    return null; // nothing to show — this participant hasn't been in a live session yet
  }

  return (
    <div className="mt-6 space-y-4">
      {personal.length > 0 && (
        <Card>
          <h2 className="mb-2 text-sm font-semibold">پیام‌های شخصی دریافتی در کارهای گروهی</h2>
          <div className="space-y-1">
            {personal.map((m) => (
              <div key={m.id} className="rounded-lg px-2 py-1 text-xs" style={{ backgroundColor: "var(--surface)" }}>
                <span className="font-medium">{m.sender.firstName} {m.sender.lastName}</span>
                <span className="mr-2 opacity-70">{m.content}</span>
                <span className="mr-2 opacity-50">{new Date(m.createdAt).toLocaleString("fa-IR")}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {groups.length > 0 && (
        <Card>
          <h2 className="mb-2 text-sm font-semibold">آرشیو مباحث گروهی</h2>
          <div className="space-y-3">
            {groups.map((g) => (
              <div key={g.id} className="rounded-lg p-2" style={{ backgroundColor: "var(--surface)" }}>
                <div className="text-sm font-medium">
                  {g.name} — {g.session.bootcamp.title}
                </div>
                <div className="mt-1 max-h-32 space-y-1 overflow-y-auto text-xs opacity-70">
                  {g.messages.map((m) => (
                    <div key={m.id}>
                      <b>{m.sender.firstName}:</b> {m.content}
                    </div>
                  ))}
                  {g.messages.length === 0 && <p>پیامی ثبت نشده.</p>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
