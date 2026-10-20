# پلتفرم فستیوال برند شخصی — Personal Branding Festival Platform

پلتفرم کامل full-stack برای فستیوال و بوت‌کمپ برند شخصی: مسیر تحول شرکت‌کننده از خودشناسی
تا هویت حرفه‌ای نهایی، با ورژنینگ کامل پاسخ‌ها (هیچ پاسخی هرگز بازنویسی نمی‌شود)، سیستم
بازخورد «آینه من»، موتور ارزیابی وزن‌دار، صفحه‌ی عمومی هر شرکت‌کننده و ویترین فستیوال.

## ۱. معماری

```
project-root/
├── frontend/     React + Vite + TypeScript + Tailwind + Redux Toolkit
├── backend/      Node.js + Express + TypeScript + PostgreSQL + Prisma
├── docker-compose.yml
└── README.md   (همین فایل)
```

جزئیات کامل ساختار پوشه‌ها و اصول معماری در `ARCHITECTURE.md`.

## ۲. استک فناوری

**Frontend:** React, Vite, TypeScript, Tailwind CSS, React Router, Redux Toolkit,
React Hook Form, Zod, Framer Motion, Recharts, Axios.

**Backend:** Node.js, Express, TypeScript, PostgreSQL, Prisma ORM, JWT (access +
refresh با چرخش)، RBAC، معماری ماژولار (controller → service → repository).

## ۳. نصب

پیش‌نیاز: Node.js ≥ 20، Docker (برای PostgreSQL محلی؛ اختیاری اگر PostgreSQL جدا دارید).

```bash
git clone <repo-url>
cd project-root
```

### ۳.۱ متغیرهای محیطی

```bash
cp backend/.env.example backend/.env
# مقادیر JWT_ACCESS_SECRET و JWT_REFRESH_SECRET را برای production حتماً عوض کنید
```

فرانت‌اند برای آدرس API از متغیر `VITE_API_BASE_URL` استفاده می‌کند (پیش‌فرض:
`http://localhost:4000`)؛ در صورت نیاز یک `frontend/.env` با همین کلید بسازید.

### ۳.۲ دیتابیس و Prisma

```bash
docker compose up -d postgres
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
```

### ۳.۳ داده‌ی نمونه (Seed)

```bash
npm run prisma:seed
```

این دستور ۵ منطقه، ۸ بخش ژورنی، ۶ بوت‌کمپ (با سؤالات قبل/بعد)، ۶ معیار ارزیابی، و ۵
شرکت‌کننده‌ی نمونه (با پاسخ اولیه و یک بازخورد «آینه من») می‌سازد. رمز عبور همه‌ی
کاربران seed‌شده: `Passw0rd!`. برای رسیدن به ۲۰ شرکت‌کننده مطابق سند، آرایه‌ی
`participantsData` در `prisma/seed.ts` را با همان الگو گسترش دهید.

### ۳.۴ اجرای بک‌اند

```bash
cd backend
npm run dev        # http://localhost:4000
```

### ۳.۵ اجرای فرانت‌اند

```bash
cd frontend
npm install
npm run dev         # http://localhost:5173
```

### ۳.۶ اجرا با Docker (هر دو سرویس + دیتابیس)

```bash
docker compose up --build
```

## ۴. تست

```bash
cd backend
npm test
```

- `tests/slugify.test.ts` — تست واحد خالص (بدون نیاز به دیتابیس) روی منطق تولید
  اسلاگ صفحه‌ی عمومی.
- `tests/auth.test.ts`, `tests/rbac.test.ts` — تست‌های یکپارچگی (integration) واقعی
  علیه یک instance فعال PostgreSQL؛ قبل از اجرا حتماً
  `docker compose up -d postgres && npx prisma migrate dev` را اجرا کنید.

## ۵. مستندات API

مسیر پایه‌ی همه‌ی روت‌ها نسبت به `http://localhost:4000` است.

| ماژول | متد | مسیر | دسترسی |
|---|---|---|---|
| Auth | POST | `/auth/register` | عمومی |
| Auth | POST | `/auth/login` | عمومی |
| Auth | POST | `/auth/refresh` | کوکی رفرش |
| Auth | POST | `/auth/logout` | کوکی رفرش |
| Profile | GET/PUT | `/profile` | لاگین‌شده |
| Profile | POST | `/profile/onboarding` | لاگین‌شده (یک‌بار) |
| Journey | GET | `/journey`, `/journey/:sectionId` | لاگین‌شده |
| Bootcamp | GET | `/bootcamps`, `/bootcamps/:id` | لاگین‌شده |
| Bootcamp | POST/PUT/PATCH | `/bootcamps`, `/bootcamps/:id`, `/bootcamps/:id/status` | BOOTCAMP_MANAGER, ADMIN |
| Response | GET/POST | `/responses` | لاگین‌شده (شرکت‌کننده) |
| Response | PUT | `/responses/:id` (ثبت نسخه‌ی جدید، append-only) | لاگین‌شده (شرکت‌کننده) |
| Feedback | POST | `/feedback/submit` | **عمومی** (بدون نیاز به حساب) |
| Feedback | POST/GET | `/feedback/request`, `/feedback` | لاگین‌شده (شرکت‌کننده) |
| Evaluation | GET/POST/PUT | `/evaluations/criteria` | خواندن: همه؛ نوشتن: ADMIN |
| Evaluation | POST | `/evaluations/assignments` | ADMIN |
| Evaluation | GET | `/evaluations/assigned`, `/evaluations/review/:participantId` | EVALUATOR, ADMIN |
| Evaluation | POST/PUT/POST | `/evaluations`, `/evaluations/:id`, `/evaluations/:id/submit` | EVALUATOR, ADMIN |
| Personal Page | GET/PUT/POST | `/personal-page`, `/personal-page/publish`, `/personal-page/unpublish` | لاگین‌شده (شرکت‌کننده) |
| Public | GET | `/public/:slug` | **عمومی** |
| Admin | GET | `/admin/overview`, `/admin/users`, `/admin/regions`, `/admin/participants` | ADMIN |
| Admin | PUT/POST | `/admin/users/:id/role`, `/admin/regions` | ADMIN |
| Analytics | GET | `/analytics/*` | EVALUATOR, ADMIN |
| Showcase | GET | `/showcase` | **عمومی** |
| Showcase | POST | `/showcase/:participantId/{featured,finalist,winner}` | ADMIN |

جزئیات کامل بدنه‌ی هر درخواست در Zod validator همان ماژول (`*.validator.ts`) مستند است.

## ۶. اصول کلیدی پیاده‌سازی

- **بدون بازنویسی تاریخچه:** پاسخ‌ها append-only هستند؛ `PUT /responses/:id` نسخه‌ی
  جدید اضافه می‌کند، نسخه‌های قبلی هرگز حذف/ویرایش نمی‌شوند.
- **RBAC سمت سرور:** فرانت فقط UI را بر اساس نقش نمایش/مخفی می‌کند؛ مرجع واقعی مجوز
  همیشه میدل‌ورهای `requireAuth`/`requireRole` در بک‌اند است.
- **حریم خصوصی صفحه‌ی عمومی:** `/public/:slug` برای هر دو حالت «اسلاگ وجود ندارد» و
  «صفحه منتشر نشده» یک ۴۰۴ یکسان می‌دهد تا وجود/عدم‌وجود یک پروفایل خصوصی لو نرود.
- **Refresh token امن:** فقط هش (SHA-256) در دیتابیس ذخیره می‌شود، در کوکی
  httpOnly/secure/sameSite=strict نگه‌داری می‌شود، و در هر استفاده چرخش (rotate) پیدا
  می‌کند.

## ۷. عیب‌یابی (Troubleshooting)

**بعد از دریافت فایل‌های جدید، مربوط به «نحوه بیان» صفات یا سؤالات موقعیتی خودکار:**
مدل داده گسترش پیدا کرده (هر نحوه بیان حالا متن + وزن نامتناسب هم دارد، و سؤالات به
یک صفت مشخص وصل می‌شوند). باید دوباره migrate کنید:
```bash
docker compose exec backend npx prisma generate
docker compose exec backend npx prisma migrate dev --name trait_expressions
docker compose restart backend frontend
```
فرمت اکسل هم عوض شده — به صفحه‌ی «موقعیت‌ها و صفات» در پنل ادمین مراجعه کنید،
توضیح کامل ستون‌های جدید همان‌جا هست.

**داشبورد یا صفحات ادمین روی چرخش (spinner) گیر می‌کنند و هیچ‌وقت چیزی نشان نمی‌دهند:**
این معمولاً یعنی یکی از چند درخواست همزمان صفحه با خطا مواجه شده و صفحه منتظر تکمیل
همه‌ی درخواست‌ها مانده. صفحات اصلی (داشبورد، موقعیت‌ها و صفات) اکنون هرکدام را جدا
مدیریت می‌کنند و پیام خطای مشخص نشان می‌دهند به‌جای گیر کردن، ولی اگر باز هم دیدید،
احتمالاً migration را کامل نزده‌اید (به بند بعدی نگاه کنید).

**بعد از دریافت فایل‌های جدید، خطای مربوط به سؤالات تستی (تک‌انتخابی/چندانتخابی):**
فیلد `options` به مدل Question اضافه شده. باید دوباره migrate کنید:
```bash
docker compose exec backend npx prisma generate
docker compose exec backend npx prisma migrate dev --name choice_questions
docker compose restart backend frontend
```

**بعد از دریافت فایل‌های جدید، خطای مربوط به `prisma.trait` / `prisma.situation` / `prisma.approvalStatus`:**
این فیچر (سؤالات موقعیتی + صفات با وزن + سیستم امتیاز مشروط به تأیید ارزیاب) مدل‌های
جدیدی به schema اضافه کرده. باید دوباره generate و migrate کنید:
```bash
docker compose exec backend npx prisma generate
docker compose exec backend npx prisma migrate dev --name situational_traits
docker compose restart backend frontend
```
اگر بعد از این هم خطای `Cannot read properties of undefined` دیدید، مطمئن شوید که
فایل `backend/prisma/schema.prisma` روی سیستم شما واقعاً همان نسخه‌ی جدید است (نه یک
نسخه‌ی قدیمی که این مدل‌ها را ندارد) — این رایج‌ترین علت این خطای خاص بوده است.

**بعد از دریافت فایل‌های جدید، ویژگی‌ای مثل مهارت‌ها/عکس/تکلیف کار نمی‌کند یا خطای عجیب می‌دهد:**
هر بار که `backend/prisma/schema.prisma` تغییر می‌کند (مثلاً مدل‌های جدید مثل `Skill`،
`Media`، `Task` اضافه می‌شوند)، باید دوباره migration اجرا کنید — در غیر این صورت آن
جدول‌ها روی دیتابیس واقعی شما وجود ندارند و درخواست‌های مربوط به آن‌ها با خطای سرور
شکست می‌خورند (که گاهی در پیام خطای فرانت به‌اشتباه شبیه یک خطای دیگر به نظر می‌رسد،
مثلاً «قبلاً ثبت شده»). بعد از هر بار دریافت کد جدید:
```bash
docker compose exec backend npx prisma migrate dev --name update
```

**خطای Prisma engine روی Mac با تراشه‌ی Apple Silicon (M1/M2/M3):**
اگر روی Docker با پیام `libssl.so.1.1: No such file or directory` یا
`Prisma Client could not locate the Query Engine` مواجه شدید، علتش ناسازگاری
شناخته‌شده‌ی Prisma با ایمیج‌های Alpine روی معماری ARM64 است. `backend/Dockerfile`
از قبل روی `node:20-bookworm-slim` (Debian) تنظیم شده تا این مشکل کلاً پیش نیاد؛
اگر باز هم دیدید، مطمئن شوید نسخه‌ی به‌روز همین فایل رو دارید و با
`docker compose build --no-cache backend` دوباره بسازید.

**بعد از تغییر Dockerfile، خطای `bcrypt` یا فایل‌های `.so` نامرتبط با پلتفرم:**
اگر بعد از تغییر ایمیج پایه (مثلاً از Alpine به Debian) باز هم خطای native
module (مثل `libc.musl-aarch64.so.1: cannot open shared object file`) دیدید، علتش
volume‌ی قدیمی `node_modules` است که در `docker-compose.yml` تعریف شده
(`/app/node_modules` به‌صورت anonymous volume) و بین بیلدها باقی می‌ماند. برای
پاک کردنش:
```bash
docker compose down -v   # حواستان باشد: دیتای دیتابیس هم پاک می‌شود
docker compose build --no-cache backend
docker compose up
npx prisma migrate dev --name init   # داخل کانتینر backend، دوباره
npm run prisma:seed                   # داخل کانتینر backend، دوباره
```

**اعداد فارسی در فرم‌ها (مثلاً شماره موبایل) رد می‌شوند:**
کیبورد فارسی معمولاً اعداد رو به‌صورت ۰۹۱۲۳۴۵۶۷۸۹ (ارقام فارسی) وارد می‌کند، نه
لاتین. `normalizeDigits` (در `backend/src/utils/digits.ts` و
`frontend/src/utils/digits.ts`) هر دو نوع ارقام فارسی و عربی رو قبل از
اعتبارسنجی به ASCII تبدیل می‌کند — این منطق از قبل روی فیلد موبایل اعمال شده؛
اگر فیلد جدیدی با ورودی عددی اضافه کردید، همین تابع رو رویش صدا بزنید.

**فرم‌ها می‌گویند «الزامی است» با اینکه فیلد را پر کرده‌اید:**
این به زبان فارسی یا انگلیسی ربطی ندارد — علتش این بود که کامپوننت‌های
`Input`/`Textarea` (در `frontend/src/components/ui.tsx`) به‌درستی `ref` را به
عنصر واقعی `<input>` منتقل نمی‌کردند، و چون `react-hook-form` برای خواندن مقدار
فیلد به همین `ref` وابسته است، فرم همیشه فیلد را «خالی» می‌دید. این با
`React.forwardRef` روی هر دو کامپوننت رفع شده است؛ اگر کامپوننت ورودی سفارشی
جدیدی برای فرم‌ها ساختید، حتماً `forwardRef` را رعایت کنید.

**بعد از دریافت آخرین تغییرات، اسکیمای Prisma عوض شده (مدل‌های Skill جدید):**
```bash
docker compose exec backend npx prisma migrate dev --name add_skills
```

## ۸. وضعیت فعلی پروژه

فازهای ۱ تا ۱۲ (معماری، اسکیمای Prisma، Auth/RBAC، Onboarding، بوت‌کمپ/ژورنی،
ورژنینگ پاسخ، بازخورد، موتور ارزیابی، صفحه عمومی، داشبورد ادمین/ارزیاب، آنالیتیکس،
ویترین فستیوال) در بک‌اند **کامل و type-checked** هستند. اسکلت فرانت‌اند (Vite + React
+ Redux Toolkit + Tailwind با هر دو تم تیره و پشتیبانی کامل RTL/فارسی) آماده است؛
پیاده‌سازی کامل صفحات UI برای هر ماژول بک‌اند (ژورنی، بوت‌کمپ، ارزیابی، آنالیتیکس،
ویترین) هنوز باقی مانده و گام منطقی بعدی است.
