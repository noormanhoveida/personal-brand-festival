import { useEffect, useState } from "react";
import { listAllTags } from "../api/skills";

/**
 * The whole point: a reviewer may not think of a trait unprompted, but
 * recognizes it instantly in a list — and may see something the
 * person doesn't see in themselves. Selected tags become skill
 * endorsements on the reviewed person's profile, even for skills they
 * never listed for themselves.
 */
export function TagPicker({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (tags: string[]) => void;
}) {
  const [allTags, setAllTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");

  useEffect(() => {
    listAllTags().then(setAllTags);
  }, []);

  const toggle = (tag: string) => {
    onChange(selected.includes(tag) ? selected.filter((t) => t !== tag) : [...selected, tag]);
  };

  const addCustom = () => {
    const trimmed = customTag.trim();
    if (!trimmed || selected.includes(trimmed)) return;
    onChange([...selected, trimmed]);
    setCustomTag("");
  };

  // Tags not yet in the global pool but already picked (e.g. a custom
  // one just added) should still render as selected chips.
  const displayTags = [...new Set([...allTags, ...selected])];

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {displayTags.map((tag) => {
          const isSelected = selected.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggle(tag)}
              className="rounded-full border px-3 py-1 text-xs transition-colors"
              style={
                isSelected
                  ? { backgroundColor: "var(--accent)", color: "var(--bg)", borderColor: "var(--accent)" }
                  : { backgroundColor: "var(--surface)", color: "var(--text)", borderColor: "var(--surface)" }
              }
            >
              {tag}
            </button>
          );
        })}
        {displayTags.length === 0 && (
          <span className="text-xs opacity-50">هنوز هیچ برچسبی در پلتفرم ثبت نشده است.</span>
        )}
      </div>

      <div className="mt-2 flex gap-2">
        <input
          value={customTag}
          onChange={(e) => setCustomTag(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCustom();
            }
          }}
          placeholder="برچسب جدید..."
          className="flex-1 rounded-lg border px-2 py-1 text-xs"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--surface)", color: "var(--text)" }}
        />
        <button
          type="button"
          onClick={addCustom}
          className="rounded-lg px-3 py-1 text-xs"
          style={{ backgroundColor: "var(--surface)" }}
        >
          افزودن
        </button>
      </div>
    </div>
  );
}
