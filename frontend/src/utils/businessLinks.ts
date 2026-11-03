export function normalizeWebsite(value: string | null | undefined): string | null {
  const raw = value?.trim();
  if (!raw || /\s/.test(raw) || raw.startsWith("//")) return null;
  if (/^(?!https?:\/\/)[a-z][a-z0-9+.-]*:/i.test(raw)) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      !/^(?:[a-z0-9-]+\.)+[a-z0-9-]+$/i.test(url.hostname)
    ) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function normalizeSocial(
  value: string | null | undefined,
  kind: "instagram" | "telegram",
): string | null {
  let raw = value?.trim();
  if (!raw || /\s/.test(raw)) return null;

  if (
    /^https?:\/\//i.test(raw) ||
    /^(?:www\.)?(?:instagram\.com|t\.me|telegram\.me)\//i.test(raw)
  ) {
    try {
      const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
      const host = url.hostname.toLowerCase().replace(/^www\./, "");
      if (
        !["http:", "https:"].includes(url.protocol) ||
        url.username || url.password || url.port ||
        (kind === "instagram"
          ? host !== "instagram.com"
          : !["t.me", "telegram.me"].includes(host))
      ) return null;

      const parts = url.pathname.split("/").filter(Boolean);
      if (parts.length !== 1) return null;
      raw = parts[0];
    } catch {
      return null;
    }
  } else {
    raw = raw.replace(/^@/, "");
  }

  if (kind === "instagram") {
    if (
      !/^[a-z0-9._]{1,30}$/i.test(raw) ||
      /^(?:p|reel|reels|stories|explore|accounts|direct)$/i.test(raw)
    ) return null;
    return `https://www.instagram.com/${raw}/`;
  }

  if (!/^(?:[a-z][a-z0-9_]{4,31}|\+[a-z0-9_-]{5,})$/i.test(raw)) return null;
  return `https://t.me/${raw}`;
}

export function normalizeInstagram(value: string | null | undefined): string | null {
  return normalizeSocial(value, "instagram");
}

export function normalizeTelegram(value: string | null | undefined): string | null {
  return normalizeSocial(value, "telegram");
}
