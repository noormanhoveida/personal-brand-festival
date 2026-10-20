import { RefObject, useEffect, useState } from "react";

const EYE_MOVE_RADIUS = 6; // max px the pupil can shift inside its socket

interface EyeCenters {
  left: { cx: number; cy: number };
  right: { cx: number; cy: number };
}

/**
 * Tracks the cursor (or touch point) anywhere on the page and returns
 * how far each pupil should shift, clamped so it never leaves its
 * socket. `getEyeCenters` maps the two eye positions (in the SVG's
 * own viewBox units) to real screen coordinates on every move, since
 * the element can be scaled/positioned differently per variant.
 */
export function useEyeTracking(
  svgRef: RefObject<SVGSVGElement>,
  getEyeCenters: (rect: DOMRect) => EyeCenters
) {
  const [leftPupil, setLeftPupil] = useState({ x: 0, y: 0 });
  const [rightPupil, setRightPupil] = useState({ x: 0, y: 0 });
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    let raf = 0;

    const handleMove = (clientX: number, clientY: number) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const svg = svgRef.current;
        if (!svg) return;
        const rect = svg.getBoundingClientRect();
        const { left, right } = getEyeCenters(rect);
        const eyes = [
          { key: "left" as const, ...left },
          { key: "right" as const, ...right },
        ];
        const next: Record<"left" | "right", { x: number; y: number }> = {
          left: { x: 0, y: 0 },
          right: { x: 0, y: 0 },
        };
        for (const eye of eyes) {
          const dx = clientX - eye.cx;
          const dy = clientY - eye.cy;
          const dist = Math.hypot(dx, dy) || 1;
          const clamped = Math.min(dist, EYE_MOVE_RADIUS * 6) / (EYE_MOVE_RADIUS * 6);
          next[eye.key] = { x: (dx / dist) * clamped * EYE_MOVE_RADIUS, y: (dy / dist) * clamped * EYE_MOVE_RADIUS };
        }
        setLeftPupil(next.left);
        setRightPupil(next.right);
      });
    };

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) handleMove(t.clientX, t.clientY);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      cancelAnimationFrame(raf);
    };
  }, [svgRef, getEyeCenters]);

  // Idle blink — keeps the character feeling alive between pointer moves.
  useEffect(() => {
    const interval = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 150);
    }, 3200 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  return { leftPupil, rightPupil, blinking };
}

export { EYE_MOVE_RADIUS };
