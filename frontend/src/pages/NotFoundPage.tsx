import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-bold" style={{ color: "var(--accent)" }}>
        ۴۰۴
      </h1>
      <p className="opacity-70">این صفحه یافت نشد.</p>
      <Link to="/" style={{ color: "var(--accent)" }}>
        بازگشت به صفحه اصلی
      </Link>
    </div>
  );
}
