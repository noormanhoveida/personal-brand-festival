import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { JourneySection, listJourneySections } from "../api/journey";
import { ResponseWithVersions, listMyResponses } from "../api/responses";
import { Spinner, LoadError } from "../components/ui";

/**
 * A section counts as "lit" once the participant has provided at
 * least one real answer (text, link, or photo) to something in it —
 * matching the "provide inputs to light up this point" idea directly:
 * finishing all nodes means every aspect of the brand has been
 * considered at least once.
 */
function isSectionComplete(sectionId: string, responses: ResponseWithVersions[]) {
  return responses.some(
    (r) => r.question.journeySectionId === sectionId && r.versions.length > 0
  );
}

export function JourneyListPage() {
  const [sections, setSections] = useState<JourneySection[] | null>(null);
  const [responses, setResponses] = useState<ResponseWithVersions[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  const reload = () => {
    setLoadError(null);
    Promise.all([listJourneySections(), listMyResponses()])
      .then(([s, r]) => {
        setSections(s);
        setResponses(r);
      })
      .catch(() => setLoadError("بارگذاری مسیر برند با خطا مواجه شد."));
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

  const completedCount = sections.filter((s) => isSectionComplete(s.id, responses)).length;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">مسیر برند من</h1>
      <p className="mt-1 text-sm opacity-70">
        هر نقطه یک گام از صفر تا صد برند شخصی است. با پاسخ‌دادن به سؤالات هر بخش، آن
        نقطه روشن می‌شود. وقتی همه‌ی نقاط روشن شدند، یعنی تمام جنبه‌های برندسازی
        شخصی‌ات را در نظر گرفته‌ای.
      </p>

      {/* Overall progress */}
      <div className="mt-4 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ backgroundColor: "var(--surface)" }}>
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${(completedCount / sections.length) * 100}%`,
              backgroundColor: "var(--accent)",
            }}
          />
        </div>
        <span className="text-xs opacity-60 whitespace-nowrap">
          {completedCount} از {sections.length}
        </span>
      </div>

      {/* Roadmap: vertical timeline of lit/unlit nodes */}
      <div className="relative mt-8">
        <div
          className="absolute right-[19px] top-2 bottom-2 w-0.5"
          style={{ backgroundColor: "var(--surface)" }}
        />
        <div className="space-y-4">
          {sections.map((s, i) => {
            const complete = isSectionComplete(s.id, responses);
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
              >
                <Link to={`/dashboard/journey/${s.id}`} className="flex items-center gap-4">
                  <span
                    className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors"
                    style={
                      complete
                        ? { backgroundColor: "var(--accent)", color: "var(--bg)" }
                        : { backgroundColor: "var(--surface)", color: "var(--text)", opacity: 0.6 }
                    }
                  >
                    {complete ? "✓" : i + 1}
                  </span>
                  <div
                    className="flex-1 rounded-xl border px-4 py-3 transition-opacity hover:opacity-80"
                    style={{
                      backgroundColor: "var(--bg-secondary)",
                      borderColor: complete ? "var(--accent)" : "var(--surface)",
                    }}
                  >
                    <div className="text-sm font-semibold">{s.title}</div>
                    {s.description && <p className="mt-0.5 text-xs opacity-60">{s.description}</p>}
                    <div className="mt-1 text-xs" style={{ color: complete ? "var(--accent)" : undefined, opacity: complete ? 1 : 0.5 }}>
                      {complete ? "روشن شد ✓" : "هنوز شروع نشده"}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
