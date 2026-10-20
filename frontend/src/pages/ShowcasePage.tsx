import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ShowcaseCard, getPublicShowcase } from "../api/showcase";
import { Leaderboard, listPublishedLeaderboards, getPublicLeaderboardRanking, RankedEntry } from "../api/leaderboard";
import { BrandMascot } from "../components/BrandMascot";
import { Avatar } from "../components/Avatar";
import { useAsync } from "../hooks/useAsync";
import { Card, LoadError, Spinner } from "../components/ui";

function ShowcaseGrid({ cards }: { cards: ShowcaseCard[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => (
        <Link key={c.slug} to={`/p/${c.slug}`}>
          <Card className="glass h-full transition-transform hover:-translate-y-1">
            {c.coverImage ? (
              <img src={c.coverImage} alt="" className="mb-3 h-32 w-full rounded-lg object-cover" />
            ) : (
              <div className="mb-3 flex h-32 w-full items-center justify-center rounded-lg" style={{ backgroundColor: "var(--surface)" }}>
                <div className="w-14">
                  <BrandMascot />
                </div>
              </div>
            )}
            <div className="font-semibold">{c.fullName}</div>
            <div className="mt-1 text-xs opacity-60">
              {c.city}
              {c.professionalField && ` · ${c.professionalField}`}
            </div>
            {c.tagline && <p className="mt-2 text-sm opacity-80">{c.tagline}</p>}
          </Card>
        </Link>
      ))}
    </div>
  );
}

export function ShowcasePage() {
  const { data, error, loading, reload } = useAsync(() => getPublicShowcase());
  const [boards, setBoards] = useState<Leaderboard[]>([]);
  const [rankings, setRankings] = useState<Record<string, RankedEntry[]>>({});

  useEffect(() => {
    listPublishedLeaderboards()
      .then(async (published) => {
        setBoards(published);
        const entries = await Promise.all(
          published.map((b) => getPublicLeaderboardRanking(b.id).catch(() => null))
        );
        const map: Record<string, RankedEntry[]> = {};
        entries.forEach((e, i) => {
          if (e) map[published[i].id] = e.ranking.slice(0, 5);
        });
        setRankings(map);
      })
      .catch(() => {
        // published boards are a bonus section — a failure here shouldn't block the rest of the showcase
      });
  }, []);

  if (error) return <LoadError message={error} onRetry={reload} />;

  if (loading || !data) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  const winnerCategories = Object.entries(data?.winners || {});

  return (
    <div className="hero-glow mx-auto max-w-5xl px-6 py-16 md:px-12">
      <h1 className="text-3xl font-bold" style={{ color: "var(--accent)" }}>
        ویترین فستیوال
      </h1>
      <p className="mt-2 opacity-70">
        این صفحه، معرفی عمومی بهترین و برجسته‌ترین داستان‌های تحول برند شخصی در بین
        شرکت‌کنندگان فستیوال است. مدیر فستیوال شرکت‌کنندگان را در سه دسته انتخاب می‌کند:
        «برجسته» (کارهای قابل‌توجه)، «فینالیست» (نامزدهای نهایی)، و «برنده» هر دسته
        (مثلاً «بیشترین تحول» یا «قوی‌ترین هویت شخصی»). روی هر کارت کلیک کنید تا صفحه‌ی
        کامل آن شرکت‌کننده را ببینید.
      </p>

      {boards.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold" style={{ color: "var(--accent)" }}>
            تابلوهای امتیاز
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {boards.map((b) => (
              <Card key={b.id} className="glass">
                <p className="font-semibold">{b.title}</p>
                {b.description && <p className="mt-1 text-xs opacity-60">{b.description}</p>}
                <div className="mt-2 space-y-1">
                  {(rankings[b.id] ?? []).map((r, i) => (
                    <div key={r.participantId} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        {i + 1}.
                        <Avatar url={r.avatarUrl} firstName={r.firstName} lastName={r.lastName} size={20} />
                        {r.firstName} {r.lastName}
                      </span>
                      <span className="opacity-60">{r.score}</span>
                    </div>
                  ))}
                  {(rankings[b.id]?.length ?? 0) === 0 && (
                    <p className="text-xs opacity-50">هنوز امتیازی ثبت نشده.</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {winnerCategories.map(([category, cards]) => (
        <section key={category} className="mt-10">
          <h2 className="text-lg font-semibold" style={{ color: "var(--accent)" }}>
            {category}
          </h2>
          <div className="mt-4">
            <ShowcaseGrid cards={cards} />
          </div>
        </section>
      ))}

      {(data?.featured?.length || 0) > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold">برجسته‌ها</h2>
          <div className="mt-4">
            <ShowcaseGrid cards={data?.featured || []} />
          </div>
        </section>
      )}

      {(data?.finalists?.length || 0) > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold">فینالیست‌ها</h2>
          <div className="mt-4">
            <ShowcaseGrid cards={data.finalists} />
          </div>
        </section>
      )}

      {winnerCategories.length === 0 && (data?.featured?.length || 0) === 0 && (data?.finalists?.length || 0) === 0 && (
        <p className="mt-10 text-sm opacity-60">
          هنوز کسی در ویترین قرار نگرفته است. اگر ادمین هستید، از مسیر «داشبورد ← ویترین
          فستیوال» می‌توانید شرکت‌کنندگان را برجسته، فینالیست یا برنده کنید (فقط
          شرکت‌کنندگانی که صفحه‌ی عمومی‌شان را منتشر کرده‌اند این‌جا نمایش داده می‌شوند).
        </p>
      )}
    </div>
  );
}
