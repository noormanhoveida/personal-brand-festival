import { Button, Input } from "./ui";

/**
 * A small add/remove list of text options — used when defining a
 * SINGLE_CHOICE or MULTI_CHOICE question, Google-Forms style.
 */
export function OptionsEditor({
  options,
  onChange,
}: {
  options: string[];
  onChange: (options: string[]) => void;
}) {
  const updateAt = (i: number, value: string) => {
    const next = [...options];
    next[i] = value;
    onChange(next);
  };

  const removeAt = (i: number) => {
    onChange(options.filter((_, idx) => idx !== i));
  };

  const add = () => onChange([...options, ""]);

  return (
    <div className="w-full space-y-1.5">
      {options.map((opt, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <Input
            value={opt}
            onChange={(e) => updateAt(i, e.target.value)}
            placeholder={`گزینه ${i + 1}`}
            className="flex-1"
          />
          <button
            type="button"
            onClick={() => removeAt(i)}
            className="rounded-lg px-2 py-1 text-xs opacity-60 hover:opacity-100"
            style={{ backgroundColor: "var(--surface)" }}
          >
            حذف
          </button>
        </div>
      ))}
      <Button variant="ghost" onClick={add} className="text-xs">
        + افزودن گزینه
      </Button>
      {options.length < 2 && (
        <p className="text-xs" style={{ color: "#e0a63f" }}>
          حداقل دو گزینه لازم است.
        </p>
      )}
    </div>
  );
}
