// The 8 built-in boards — the 7 the user asked for, plus one more
// (live_group_participation) that fits the same "who's most engaged"
// spirit and is easy to compute now that the live-session module
// exists. Each `key` is a stable identifier: leaderboard.service.ts
// switches on it to run the matching aggregation query, and the
// matching Leaderboard row (kind=SYSTEM) is upserted by this key so
// re-running ensureSystemBoards() is always safe.
export const SYSTEM_BOARDS = [
  {
    key: "site_activity",
    title: "بیشترین فعالیت در سایت",
    description:
      "مجموع پاسخ‌های ثبت‌شده، تکالیف ارسالی، چالش‌های هفتگی، پیام‌های کار گروهی و رسانه‌های آپلودشده.",
  },
  {
    key: "pre_assessment_score",
    title: "بیشترین امتیاز در پیش‌ارزیابی",
    description: "میانگین «وضعیت فعلی» در ۶ محور خودارزیابی فرم پیش‌ارزیابی (از ۱۰۰).",
  },
  {
    key: "final_evaluation_score",
    title: "بیشترین امتیاز در ارزیابی نهایی",
    description: "امتیاز نهایی آخرین ارزیابی ثبت‌شده (finalScore) توسط ارزیاب.",
  },
  {
    key: "transformation_progress",
    title: "بیشترین پیشرفت از قبل تا بعد جشنواره",
    description: "امتیاز پیشرفت (transformationScore) ثبت‌شده توسط ارزیاب در آخرین ارزیابی.",
  },
  {
    key: "feedback_received",
    title: "بیشترین تعداد دریافت بازخورد",
    description: "تعداد پاسخ‌های دریافتی روی لینک‌های «آینه من».",
  },
  {
    key: "skill_endorsements",
    title: "بیشترین دریافت تاییدیه مهارت‌ها",
    description: "تعداد تأییدهای (نه ردها) دریافتی روی مهارت‌های ثبت‌شده.",
  },
  {
    key: "task_scores",
    title: "بیشترین امتیاز دریافتی در تکالیف",
    description: "مجموع امتیاز تکالیف تأییدشده‌ی بوت‌کمپ‌ها و وبینارها.",
  },
  {
    key: "live_group_participation",
    title: "بیشترین مشارکت در کار گروهی زنده",
    description: "تعداد پیام‌های ارسالی در چت گروهی جلسات زنده‌ی بوت‌کمپ.",
  },
] as const;

export type SystemBoardKey = (typeof SYSTEM_BOARDS)[number]["key"];
