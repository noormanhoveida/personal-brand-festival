import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { setTheme, ThemeName } from "./themeSlice";

const OPTIONS: { value: ThemeName; label: string }[] = [
  { value: "midnight", label: "تاریک" },
  { value: "obsidian", label: "روشن" },
];

export function ThemeSwitcher() {
  const dispatch = useAppDispatch();
  const current = useAppSelector((s) => s.theme.current);

  return (
    <div
      className="inline-flex items-center gap-1 rounded-full p-1"
      style={{ backgroundColor: "var(--surface)" }}
      role="radiogroup"
      aria-label="انتخاب تم"
    >
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          role="radio"
          aria-checked={current === opt.value}
          onClick={() => dispatch(setTheme(opt.value))}
          className="rounded-full px-3 py-1.5 text-xs transition-colors focus-visible:outline focus-visible:outline-2"
          style={{
            backgroundColor: current === opt.value ? "var(--accent)" : "transparent",
            color: current === opt.value ? "var(--bg)" : "var(--text)",
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
