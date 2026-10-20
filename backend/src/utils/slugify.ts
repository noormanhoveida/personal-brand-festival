export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export function slugifyBase(
  firstName = "",
  lastName = ""
): string {
  const combined = [firstName, lastName]
    .filter(Boolean)
    .join("-");

  return slugify(combined) || "user";
}

export function randomHandle(base = "user"): string {
  const normalized = slugify(base) || "user";
  const suffix = Math.random().toString(36).slice(2, 8);

  return `${normalized}-${suffix}`;
}
