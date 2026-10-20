import { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes, forwardRef } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border p-5 ${className}`}
      style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--surface)" }}
    >
      {children}
    </div>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "secondary" | "destructive";
  size?: "sm" | "md";
}) {
  const base = "rounded-full font-medium transition-opacity disabled:opacity-50";
  const sizeClass = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";

  const style =
    variant === "primary"
      ? { backgroundColor: "var(--accent)", color: "var(--bg)" }
      : variant === "destructive"
      ? { backgroundColor: "#e0705f", color: "#fff" }
      : { backgroundColor: "var(--surface)", color: "var(--text)" };

  return <button className={`${base} ${sizeClass} ${className}`} style={style} {...props} />;
}

// forwardRef is required here: react-hook-form's register() attaches a
// ref to read the DOM input's value directly (uncontrolled mode). Without
// forwarding it, RHF never sees what the user typed and reports the
// field as empty/required even when it visibly has a value.
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input(props, ref) {
    return (
      <input
        {...props}
        ref={ref}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:opacity-100 ${props.className ?? ""}`}
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--surface)", color: "var(--text)" }}
      />
    );
  }
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea(props, ref) {
    return (
      <textarea
        {...props}
        ref={ref}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none whitespace-pre-wrap leading-relaxed ${props.className ?? ""}`}
        style={{ 
          backgroundColor: "var(--surface)", 
          borderColor: "var(--surface)", 
          color: "var(--text)",
          textAlign: "inherit"
        }}
      />
    );
  }
);

export function Label({ children }: { children: ReactNode }) {
  return <label className="mb-1 block text-xs opacity-70">{children}</label>;
}

export function ErrorText({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return <p className="mt-1 text-xs" style={{ color: "#e0705f" }}>{children}</p>;
}

export function Spinner() {
  return (
    <div
      className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"
      style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}
    />
  );
}

/** Paired with the useAsync hook — shown instead of an eternal spinner
 * when a page's data failed to load. */
export function LoadError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <p className="text-sm" style={{ color: "#e0705f" }}>{message}</p>
      {onRetry && (
        <Button variant="ghost" onClick={onRetry}>
          تلاش دوباره
        </Button>
      )}
    </div>
  );
}
