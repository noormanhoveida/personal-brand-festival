interface AvatarProps {
  url?: string | null;
  firstName: string;
  lastName: string;
  size?: number;
}

export function Avatar({ url, firstName, lastName, size = 28 }: AvatarProps) {
  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`;
  const style = { width: size, height: size, minWidth: size };

  if (url) {
    return (
      <img
        src={url}
        alt={`${firstName} ${lastName}`}
        className="rounded-full object-cover"
        style={style}
      />
    );
  }

  return (
    <div
      className="flex items-center justify-center rounded-full font-medium"
      style={{ ...style, backgroundColor: "var(--accent)", color: "var(--bg)", fontSize: size * 0.4 }}
    >
      {initials}
    </div>
  );
}
