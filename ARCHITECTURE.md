# پلتفرم فستیوال برند شخصی — معماری کلی پروژه (فاز ۱)

## ساختار پروژه

```
project-root/
├── frontend/                       # React + Vite + TypeScript
│   └── src/
│       ├── api/                    # کلاینت Axios، اینترسپتورها، ری‌فرش توکن
│       ├── assets/
│       ├── components/             # کامپوننت‌های عمومی (Button, Card, Modal...)
│       ├── features/                # هر ماژول دامنه: auth, journey, bootcamp,
│       │                            #   feedback, evaluation, publicPage, admin
│       │   └── <feature>/
│       │       ├── api.ts
│       │       ├── slice.ts        # Redux Toolkit slice
│       │       ├── components/
│       │       └── hooks.ts
│       ├── hooks/
│       ├── layouts/                # DashboardLayout, PublicLayout, AuthLayout
│       ├── pages/                  # مسیرهای اصلی روتر
│       ├── routes/                 # تعریف React Router + Guardهای نقش‌محور
│       ├── store/                  # پیکربندی Redux store
│       ├── types/
│       ├── utils/
│       └── constants/
│
├── backend/                        # Node.js + Express + TypeScript
│   └── src/
│       ├── config/                 # env, db, cors, storage
│       ├── modules/                # هر دامنه یک ماژول مستقل
│       │   └── <module>/
│       │       ├── <module>.controller.ts
│       │       ├── <module>.service.ts
│       │       ├── <module>.repository.ts
│       │       ├── <module>.routes.ts
│       │       └── <module>.validator.ts
│       ├── middleware/             # auth, rbac, errorHandler, upload
│       ├── utils/
│       └── types/
│   └── prisma/
│       ├── schema.prisma
│       └── seed.ts
│
├── docker-compose.yml
└── README.md
```

## اصول معماری

- **جداسازی کامل frontend/backend** — دو اپلیکیشن مستقل، ارتباط فقط از طریق REST API.
- **معماری ماژولار در بک‌اند** — هر دامنه (auth, journey, bootcamp, feedback,
  evaluation, publicPage, admin) یک ماژول مستقل با لایه‌های
  controller → service → repository است. منطق تجاری هرگز در کنترلر یا فرانت نیست.
- **عدم بازنویسی داده تاریخی** — پاسخ‌ها (`Response`) هرگز ادیت نمی‌شوند؛ هر
  تغییر یک رکورد جدید در `ResponseVersion` ایجاد می‌کند.
- **RBAC در سطح میدل‌ور** — نقش از JWT استخراج و روی هر روت با
  `requireRole([...])` اعمال می‌شود؛ فرانت فقط UI را بر اساس نقش مخفی/نمایش می‌کند
  و هرگز مرجع امنیتی نیست.
- **Versioned visibility** — هر رکورد قابل‌نمایش (`Response`, `Feedback`, بخش‌های
  `PersonalPage`) یک فیلد `visibility` دارد: PRIVATE / EVALUATOR_ONLY /
  PARTICIPANTS_ONLY / PUBLIC.

## جریان کاری کلی (اسکلت پیاده‌سازی)

فاز‌بندی طبق ترتیب پیشنهادی خودت:
1. راه‌اندازی مونوریپو (frontend/backend/docker-compose)
2. اسکیمای Prisma + مایگریشن اول (پیوست شده — schema.prisma)
3. Auth + RBAC (JWT access + refresh + rotate)
4. Onboarding و پروفایل شرکت‌کننده
5. بوت‌کمپ و ژورنی (journey sections)
6. ورژنینگ پاسخ‌ها (Response/ResponseVersion)
7. سیستم بازخورد («آینه من»)
8. موتور ارزیابی (Evaluation + weighted scoring)
9. صفحه عمومی (`/p/:slug`)
10. داشبوردهای ادمین/ارزیاب
11. آنالیتیکس
12. ویترین فستیوال (Showcase)
13. بهینه‌سازی ریسپانسیو
14. تست و مستندسازی
