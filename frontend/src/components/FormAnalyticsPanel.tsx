import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell,
} from "recharts";
import { Card } from "./ui";
import type { FormAnalytics } from "../api/forms";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4", "#a855f7", "#84cc16", "#f97316"];

function parseVal(v: any): string {
  if (v == null) return "";
  if (typeof v === "string") {
    try { return parseVal(JSON.parse(v)); } catch { return v; }
  }
  if (Array.isArray(v)) return v.map(parseVal).filter(Boolean).join("، ");
  if (typeof v === "object") return parseVal((v as any).value ?? (v as any).text ?? "");
  return String(v);
}

const CHOICE_TYPES = ["SINGLE_CHOICE", "MULTI_CHOICE", "TRAIT_TAG"];

export function FormAnalyticsPanel({ analytics }: { analytics: FormAnalytics }) {
  const questions = analytics.questions || [];

  return (
    <div className="space-y-4">
      <Card className="flex flex-wrap items-center gap-6">
        <div>
          <div className="text-xs opacity-60">تعداد کل پاسخ‌های ثبت‌شده</div>
          <div className="text-3xl font-bold" style={{ color: "var(--accent)" }}>
            {analytics.totalSubmissions}
          </div>
        </div>
        <div>
          <div className="text-xs opacity-60">تعداد سوال‌ها</div>
          <div className="text-3xl font-bold">{questions.length}</div>
        </div>
      </Card>

      {questions.map((q, idx: number) => {
        const isChoice = CHOICE_TYPES.includes(q.inputType);
        const dist = Object.entries(q.distribution || {})
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);
        const textAnswers: string[] = (q.recentAnswers || q.sampleAnswers || []).map(parseVal).filter(Boolean);

        return (
          <Card key={q.questionId} className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="font-bold text-sm">
                <span className="opacity-40 ml-1">#{idx + 1}</span> {q.label}
              </div>
              <span className="text-xs opacity-50 shrink-0">
                {q.totalAnswers ?? textAnswers.length} پاسخ از {analytics.totalSubmissions}
              </span>
            </div>

            {isChoice && dist.length > 0 && (
              <div dir="ltr" className="pt-2">
                <ResponsiveContainer width="100%" height={Math.max(200, dist.length * 48 + 60)}>
                  <BarChart data={dist} layout="vertical" margin={{ right: 30, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis type="category" dataKey="name" width={180} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v: any) => [`${v} پاسخ`, "تعداد"]} />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                      {dist.map((_, i: number) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2 pt-1" dir="rtl">
                  {dist.map((d, i: number) => (
                    <span key={i} className="text-xs rounded-full px-2.5 py-0.5"
                      style={{ backgroundColor: "var(--surface)" }}>
                      {d.name}: {d.count} ({analytics.totalSubmissions > 0 ? Math.round((d.count / analytics.totalSubmissions) * 100) : 0}%)
                    </span>
                  ))}
                </div>
              </div>
            )}

            {isChoice && dist.length === 0 && (
              <p className="text-xs opacity-50">هنوز پاسخی برای این سوال ثبت نشده است.</p>
            )}

            {!isChoice && (
              textAnswers.length > 0 ? (
                <ul className="space-y-2 pt-1">
                  {textAnswers.map((a: string, i: number) => (
                    <li key={i} className="text-sm rounded-lg px-3 py-2 leading-6"
                      style={{ backgroundColor: "var(--surface)" }}>
                      {a}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs opacity-50">هنوز پاسخی برای این سوال ثبت نشده است.</p>
              )
            )}
          </Card>
        );
      })}
    </div>
  );
}
