import { Link } from "react-router-dom";
import { listAssigned } from "../../api/evaluation";
import { useAsync } from "../../hooks/useAsync";
import { Card, LoadError, Spinner } from "../../components/ui";

export function EvaluatorAssignedPage() {
  const { data: assignments, error, loading, reload } = useAsync(() => listAssigned());

  if (error) return <LoadError message={error} onRetry={reload} />;

  if (loading || !assignments) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">شرکت‌کنندگان من</h1>
      <div className="mt-6 space-y-2">
        {assignments.map((a) => (
          <Link key={a.id} to={`/dashboard/evaluator/${a.participant.id}`}>
            <Card className="flex items-center justify-between transition-opacity hover:opacity-80">
              <div>
                <div className="text-sm font-medium">
                  {a.participant.firstName} {a.participant.lastName}
                </div>
                <div className="text-xs opacity-60">{a.participant.city}</div>
              </div>
              <span className="text-xs opacity-60">مشاهده و ارزیابی ←</span>
            </Card>
          </Link>
        ))}
        {assignments.length === 0 && (
          <p className="text-sm opacity-60">هنوز شرکت‌کننده‌ای به شما تخصیص داده نشده است.</p>
        )}
      </div>
    </div>
  );
}
