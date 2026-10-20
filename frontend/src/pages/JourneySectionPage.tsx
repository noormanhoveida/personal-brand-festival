import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { JourneySectionDetail, getJourneySection } from "../api/journey";
import { ResponseWithVersions, listMyResponses } from "../api/responses";
import { QuestionBlock } from "../components/QuestionBlock";
import { LoadError, Spinner } from "../components/ui";

export function JourneySectionPage() {
  const { sectionId } = useParams<{ sectionId: string }>();
  const [section, setSection] = useState<JourneySectionDetail | null>(null);
  const [responses, setResponses] = useState<ResponseWithVersions[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const reload = () => {
    if (!sectionId) return;
    setLoadError(null);
    Promise.all([getJourneySection(sectionId), listMyResponses()])
      .then(([sectionData, responsesData]) => {
        setSection(sectionData);
        setResponses(responsesData);
        setLoading(false);
      })
      .catch(() => {
        setLoadError("بارگذاری این بخش با خطا مواجه شد.");
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionId]);

  if (loadError) return <LoadError message={loadError} onRetry={reload} />;

  if (loading || !section) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/dashboard/journey" className="text-sm opacity-70">
        ← بازگشت به مسیر برند من
      </Link>
      <h1 className="mt-2 text-2xl font-bold">{section.title}</h1>
      {section.description && <p className="mt-1 text-sm opacity-70">{section.description}</p>}

      {section.bootcamps.length > 0 && (
        <p className="mt-2 text-xs opacity-60">
          این بخش شامل سؤالات بوت‌کمپ‌های زیر هم می‌شود: {section.bootcamps.map((b) => b.title).join("، ")}
        </p>
      )}

      <div className="mt-6 space-y-4">
        {section.questions.length === 0 && (
          <p className="text-sm opacity-60">
            هنوز سؤالی برای این بخش تعریف نشده است — سؤالات از طریق «مدیریت بوت‌کمپ‌ها»
            در پنل ادمین تعریف می‌شوند و باید بوت‌کمپ به این بخش ژورنی متصل باشد.
          </p>
        )}
        {section.questions.map((q) => (
          <QuestionBlock
            key={q.id}
            question={q}
            existingResponse={responses.find((r) => r.questionId === q.id)}
            onSaved={reload}
          />
        ))}
      </div>
    </div>
  );
}
