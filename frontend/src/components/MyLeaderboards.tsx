import { useEffect, useState } from "react";
import { getMyLeaderboardSummary, MyBoardSummary } from "../api/leaderboard";
import { Card, Spinner } from "./ui";

/** Every board the user's score counts toward, per their own request that this live on their profile. */
export function MyLeaderboards() {
  const [boards, setBoards] = useState<MyBoardSummary[] | null>(null);

  useEffect(() => {
    getMyLeaderboardSummary()
      .then(setBoards)
      .catch(() => setBoards([]));
  }, []);

  if (boards === null) {
    return (
      <div className="mt-6 flex justify-center">
        <Spinner />
      </div>
    );
  }
  if (boards.length === 0) return null;

  return (
    <Card className="mt-6">
      <h2 className="mb-3 text-sm font-semibold">تابلوهای امتیاز من</h2>
      <div className="space-y-2">
        {boards.map((b) => (
          <div
            key={b.leaderboardId}
            className="flex items-center justify-between rounded-lg px-3 py-2 text-sm"
            style={{ backgroundColor: "var(--surface)" }}
          >
            <span>
              {b.title}
              {b.published && (
                <span className="mr-2 text-xs" style={{ color: "var(--accent)" }}>
                  (عمومی)
                </span>
              )}
            </span>
            <span className="text-xs opacity-70">
              امتیاز: {b.score} {b.rank && `— رتبه ${b.rank} از ${b.totalParticipants}`}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
