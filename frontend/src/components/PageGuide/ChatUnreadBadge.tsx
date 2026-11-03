import { useEffect, useState } from "react";
import { apiClient } from "../../api/client";

export default function ChatUnreadBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let stopped = false;
    let running = false;
    let unauthorized = false;

    const refresh = async () => {
      if (running) return;
      running = true;
      try {
        const response = await apiClient.get("/chat/unread-count");
        unauthorized = false;
        if (!stopped) setCount(Number(response.data?.data?.count ?? 0));
      } catch (error: unknown) {
        const status = (error as { response?: { status?: number } })?.response?.status;
        if (status === 401) {
          unauthorized = true;
          if (!stopped) setCount(0);
        } else {
          console.error("Error loading unread chat count:", error);
        }
      } finally {
        running = false;
      }
    };

    void refresh();
    const timer = window.setInterval(() => {
      if (!unauthorized && document.visibilityState === "visible") void refresh();
    }, 5000);
    window.addEventListener("chat:read", refresh);
    window.addEventListener("focus", refresh);

    return () => {
      stopped = true;
      window.clearInterval(timer);
      window.removeEventListener("chat:read", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  if (count < 1) return null;

  return (
    <span
      role="status"
      aria-label={`${count} پیام خوانده‌نشده`}
      className="absolute -right-1 -top-1 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white"
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
