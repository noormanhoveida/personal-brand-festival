import { useEffect, useState } from "react";
import {
  createCustomLeaderboard,
  deleteLeaderboard,
  getLeaderboardRanking,
  Leaderboard,
  listAllLeaderboards,
  listParticipantsForScoring,
  RankedEntry,
  ScorableParticipant,
  setLeaderboardEntryScore,
  setLeaderboardPublished,
} from "../../api/leaderboard";
import { Button, Card, ErrorText, Input, LoadError, Spinner, Textarea } from "../../components/ui";
import { Avatar } from "../../components/Avatar";

function BoardPanel({ board, onChanged }: { board: Leaderboard; onChanged: () => void }) {
  const [open, setOpen] = useState(false);
  const [ranking, setRanking] = useState<RankedEntry[] | null>(null);
  const [participants, setParticipants] = useState<ScorableParticipant[] | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState("");
  const [scoreInput, setScoreInput] = useState("");
  const [noteInput, setNoteInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loadRanking = () => {
    getLeaderboardRanking(board.id)
      .then((res) => setRanking(res.ranking))
      .catch(() => setError("بارگذاری رتبه‌بندی با خطا مواجه شد."));
  };

  const toggleOpen = () => {
    setOpen((o) => !o);
    if (!ranking) loadRanking();
    if (board.kind === "CUSTOM" && !participants) {
      listParticipantsForScoring().then(setParticipants).catch(() => setParticipants([]));
    }
  };

  const togglePublish = async () => {
    setError(null);
    try {
      await setLeaderboardPublished(board.id, !board.published);
      onChanged();
    } catch {
      setError("تغییر وضعیت انتشار با خطا مواجه شد.");
    }
  };

  const remove = async () => {
    if (!confirm(`تابلوی «${board.title}» حذف شود؟`)) return;
    try {
      await deleteLeaderboard(board.id);
      onChanged();
    } catch {
      setError("حذف تابلو با خطا مواجه شد.");
    }
  };

  const submitScore = async () => {
    if (!selectedParticipant || !scoreInput) return;
    setError(null);
    try {
      await setLeaderboardEntryScore(board.id, {
        participantId: selectedParticipant,
        score: Number(scoreInput),
        note: noteInput || undefined,
      });
      setScoreInput("");
      setNoteInput("");
      loadRanking();
    } catch {
      setError("ثبت امتیاز با خطا مواجه شد.");
    }
  };

  return (
    <Card className="mt-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">
            {board.title} <span className="text-xs opacity-50">({board.kind === "SYSTEM" ? "سیستمی" : "سفارشی"})</span>
          </p>
          {board.description && <p className="text-xs opacity-60">{board.description}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <label className="flex items-center gap-1 text-xs">
            <input type="checkbox" checked={board.published} onChange={togglePublish} />
            انتشار در ویترین
          </label>
          {board.kind === "CUSTOM" && (
            <button className="text-xs opacity-70 hover:opacity-100" onClick={remove}>
              حذف
            </button>
          )}
          <button className="text-xs opacity-70 hover:opacity-100" onClick={toggleOpen}>
            {open ? "بستن" : "مشاهده"}
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-3 border-t pt-3" style={{ borderColor: "var(--surface)" }}>
          {!ranking ? (
            <Spinner />
          ) : (
            <div className="space-y-1">
              {ranking.slice(0, 20).map((r, i) => (
                <div
                  key={r.participantId}
                  className="flex items-center justify-between rounded-lg px-2 py-1 text-xs"
                  style={{ backgroundColor: "var(--surface)" }}
                >
                  <span className="flex items-center gap-2">
                    {i + 1}.
                    <Avatar url={r.avatarUrl} firstName={r.firstName} lastName={r.lastName} size={20} />
                    {r.firstName} {r.lastName}
                  </span>
                  <span>{r.score}</span>
                </div>
              ))}
              {ranking.length === 0 && <p className="text-xs opacity-60">هنوز امتیازی ثبت نشده.</p>}
            </div>
          )}

          {board.kind === "CUSTOM" && (
            <div className="mt-3 space-y-2 rounded-lg p-2" style={{ backgroundColor: "var(--surface)" }}>
              <p className="text-xs font-medium">امتیازدهی دستی</p>
              <select
                value={selectedParticipant}
                onChange={(e) => setSelectedParticipant(e.target.value)}
                className="w-full rounded-md border bg-transparent p-2 text-xs"
                style={{ borderColor: "var(--surface)" }}
              >
                <option value="">— انتخاب شرکت‌کننده —</option>
                {participants?.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="امتیاز"
                  value={scoreInput}
                  onChange={(e) => setScoreInput(e.target.value)}
                  className="max-w-[100px]"
                />
                <Input
                  placeholder="یادداشت (اختیاری)"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                />
                <Button onClick={submitScore} disabled={!selectedParticipant || !scoreInput}>
                  ثبت
                </Button>
              </div>
            </div>
          )}
          <ErrorText>{error}</ErrorText>
        </div>
      )}
    </Card>
  );
}

export function LeaderboardsPage() {
  const [boards, setBoards] = useState<Leaderboard[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const load = () => {
    setError(null);
    listAllLeaderboards()
      .then(setBoards)
      .catch(() => setError("بارگذاری تابلوهای امتیاز با خطا مواجه شد."));
  };

  useEffect(load, []);

  const createBoard = async () => {
    if (!newTitle.trim()) return;
    try {
      await createCustomLeaderboard({ title: newTitle.trim(), description: newDescription.trim() || undefined });
      setNewTitle("");
      setNewDescription("");
      setCreating(false);
      load();
    } catch {
      setError("ساخت تابلوی جدید با خطا مواجه شد.");
    }
  };

  if (error) return <LoadError message={error} onRetry={load} />;
  if (!boards) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">تابلوهای امتیاز</h1>
      <p className="mt-1 text-sm opacity-70">
        تابلوهای سیستمی خودکار محاسبه می‌شوند؛ تابلوهای سفارشی را خودتان تعریف و امتیازدهی می‌کنید. هر
        تابلو را هر وقت خواستید می‌توانید در ویترین فستیوال منتشر یا از آن برداشته کنید.
      </p>

      {boards.map((b) => (
        <BoardPanel key={b.id} board={b} onChanged={load} />
      ))}

      {creating ? (
        <Card className="mt-4 space-y-2">
          <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="عنوان تابلو" />
          <Textarea
            rows={2}
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="توضیح (اختیاری)"
          />
          <div className="flex gap-2">
            <Button onClick={createBoard}>ساخت</Button>
            <Button variant="ghost" onClick={() => setCreating(false)}>
              انصراف
            </Button>
          </div>
        </Card>
      ) : (
        <Button className="mt-4" variant="ghost" onClick={() => setCreating(true)}>
          + تابلوی سفارشی جدید
        </Button>
      )}
    </div>
  );
}
