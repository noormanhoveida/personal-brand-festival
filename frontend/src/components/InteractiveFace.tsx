import { useRef } from "react";
import { useEyeTracking } from "./useEyeTracking";

type Variant = "girl" | "boy";

// مختصات بر اساس سیستم مختصات برداری ۲۴۰×۲۴۰
const EYE_COORDS: Record<Variant, { left: { cx: number; cy: number }; right: { cx: number; cy: number }; radius: number }> = {
  girl: {
    left: { cx: 114, cy: 82 },
    right: { cx: 144, cy: 80 },
    radius: 5.5,
  },
  boy: {
    left: { cx: 117, cy: 84 },
    right: { cx: 146, cy: 82 },
    radius: 4.5,
  },
};

const AVATAR_SRC: Record<Variant, string> = {
  girl: "/avatars/girl.webp",
  boy: "/avatars/boy.webp",
};

export function InteractiveFace({ variant, className = "" }: { variant: Variant; className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const config = EYE_COORDS[variant];

  // محاسبه حرکت چشم بدون وابستگی به اندازه صفحه
  const { leftPupil, rightPupil, blinking } = useEyeTracking(svgRef, (rect) => {
    const scaleX = rect.width / 240;
    const scaleY = rect.height / 240;
    return {
      left: { cx: rect.left + config.left.cx * scaleX, cy: rect.top + config.left.cy * scaleY },
      right: { cx: rect.left + config.right.cx * scaleX, cy: rect.top + config.right.cy * scaleY },
    };
  });

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 240 240"
      className={`select-none aspect-square w-[240px] max-w-full drop-shadow-lg ${className}`}
      role="img"
      aria-label={variant === "girl" ? "دختر مسابقه" : "پسر مسابقه"}
    >
      <defs>
        {/* برش دایره‌ای یکپارچه برای هم تصویر و هم مردمک */}
        <clipPath id={`avatar-clip-${variant}`}>
          <circle cx="120" cy="120" r="115" />
        </clipPath>
      </defs>

      <g clipPath={`url(#avatar-clip-${variant})`}>
        {/* عکس به عنوان پس‌زمینه در سیستم مختصات وکتوری */}
        <image
          href={AVATAR_SRC[variant]}
          x="0"
          y="0"
          width="240"
          height="240"
          preserveAspectRatio="xMidYMid slice"
        />

        {/* مردمک چپ */}
        <circle
          cx={config.left.cx + leftPupil.x}
          cy={config.left.cy + leftPupil.y}
          r={config.radius}
          fill="#1c1917"
        />
        {/* برق چشم چپ */}
        <circle
          cx={config.left.cx + leftPupil.x - 1.5}
          cy={config.left.cy + leftPupil.y - 1.5}
          r={config.radius * 0.35}
          fill="#ffffff"
          opacity={0.9}
        />

        {/* مردمک راست */}
        <circle
          cx={config.right.cx + rightPupil.x}
          cy={config.right.cy + rightPupil.y}
          r={config.radius}
          fill="#1c1917"
        />
        {/* برق چشم راست */}
        <circle
          cx={config.right.cx + rightPupil.x - 1.5}
          cy={config.right.cy + rightPupil.y - 1.5}
          r={config.radius * 0.35}
          fill="#ffffff"
          opacity={0.9}
        />

        {/* پلک زدن */}
        {blinking && (
          <g>
            <ellipse
              cx={config.left.cx}
              cy={config.left.cy}
              rx={config.radius * 2}
              ry={config.radius * 1.5}
              fill="#262626"
              opacity={0.8}
            />
            <ellipse
              cx={config.right.cx}
              cy={config.right.cy}
              rx={config.radius * 2}
              ry={config.radius * 1.5}
              fill="#262626"
              opacity={0.8}
            />
          </g>
        )}
      </g>
    </svg>
  );
}
