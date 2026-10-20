/**
 * Starter seed data. Covers every model with realistic Persian content
 * so the app is demoable end-to-end immediately after `prisma migrate
 * dev`. This is a representative subset (5 participants, not the full
 * 20 from the spec) — extend the `participantsData` array below using
 * the same shape to reach full scale; the loop logic doesn't change.
 */
import { PrismaClient, Role, ResponseStage, FeedbackVisibility } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding...");

  // ---- Regions ----
  const regions = await Promise.all(
    ["تهران", "اصفهان", "شیراز", "مشهد", "تبریز"].map((name) =>
      prisma.region.upsert({ where: { id: name }, update: {}, create: { id: name, name } })
    )
  );

  // ---- Journey sections (spec §11) ----
  const sectionDefs = [
    { key: "identity", title: "هویت و خودشناسی" },
    { key: "strengths", title: "نقاط قوت و توانمندی‌ها" },
    { key: "perceived-image", title: "تصویر من در ذهن دیگران" },
    { key: "differentiation", title: "مزیت رقابتی و تمایز" },
    { key: "professional-intro", title: "معرفی حرفه‌ای" },
    { key: "digital-presence", title: "حضور دیجیتال" },
    { key: "networking", title: "ارتباطات من" },
    { key: "future-roadmap", title: "نقشه آینده حرفه‌ای" },
  ];
  const sections = [];
  for (let i = 0; i < sectionDefs.length; i++) {
    const s = await prisma.journeySection.upsert({
      where: { key: sectionDefs[i].key },
      update: {},
      create: { ...sectionDefs[i], order: i },
    });
    sections.push(s);
  }

  // ---- Evaluation criteria (spec §21, weights sum to 1.0) ----
  const criteriaDefs = [
    { key: "self-knowledge", title: "خودشناسی", weight: 0.2 },
    { key: "strength-awareness", title: "آگاهی از نقاط قوت", weight: 0.15 },
    { key: "professional-identity", title: "وضوح هویت حرفه‌ای", weight: 0.2 },
    { key: "competitive-advantage", title: "مزیت رقابتی", weight: 0.15 },
    { key: "professional-intro", title: "معرفی حرفه‌ای", weight: 0.15 },
    { key: "future-plan", title: "برنامه اقدام آینده", weight: 0.15 },
  ];
  for (const c of criteriaDefs) {
    await prisma.evaluationCriterion.upsert({
      where: { key: c.key },
      update: { weight: c.weight },
      create: c,
    });
  }

  // ---- Bootcamps (6, tied to journey sections) ----
  const bootcampDefs = [
    { title: "کارگاه خودشناسی", section: 0 },
    { title: "کارگاه شناخت نقاط قوت", section: 1 },
    { title: "کارگاه تمایز و مزیت رقابتی", section: 3 },
    { title: "کارگاه معرفی حرفه‌ای", section: 4 },
    { title: "کارگاه حضور دیجیتال", section: 5 },
    { title: "کارگاه شبکه‌سازی", section: 6 },
  ];
  const bootcamps = [];
  for (let i = 0; i < bootcampDefs.length; i++) {
    const def = bootcampDefs[i];
    const date = new Date(Date.now() + i * 7 * 24 * 60 * 60 * 1000);
    const bootcamp = await prisma.bootcamp.create({
      data: {
        title: def.title,
        description: `کارگاه عملی «${def.title}» در راستای مسیر برند شخصی.`,
        instructor: "مربی فستیوال",
        date,
        startTime: date,
        endTime: new Date(date.getTime() + 3 * 60 * 60 * 1000),
        journeySectionId: sections[def.section].id,
        status: "COMING_SOON",
      },
    });
    bootcamps.push(bootcamp);

    await prisma.question.create({
      data: {
        text: "من خودم را در چهار کلمه چگونه توصیف می‌کنم؟",
        stage: ResponseStage.BEFORE,
        bootcampId: bootcamp.id,
        journeySectionId: sections[def.section].id,
        order: 0,
      },
    });
    await prisma.question.create({
      data: {
        text: "بعد از این کارگاه، خودم را در چهار کلمه چگونه توصیف می‌کنم؟",
        stage: ResponseStage.AFTER,
        bootcampId: bootcamp.id,
        journeySectionId: sections[def.section].id,
        order: 1,
      },
    });
  }

  // ---- Participants ----
  const participantsData = [
    { first: "سارا", last: "احمدی", city: "تهران", region: 0 },
    { first: "علی", last: "محمدی", city: "اصفهان", region: 1 },
    { first: "مریم", last: "کریمی", city: "شیراز", region: 2 },
    { first: "رضا", last: "حسینی", city: "مشهد", region: 3 },
    { first: "نگار", last: "رضایی", city: "تبریز", region: 4 },
  ];

  const passwordHash = await bcrypt.hash("Passw0rd!", 12);

  for (const p of participantsData) {
    const email = `${p.first}.${p.last}@example.com`.toLowerCase();
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, passwordHash, role: Role.PARTICIPANT },
    });

    const slug = `${p.first}-${p.last}`.toLowerCase();
    const profile = await prisma.participantProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        firstName: p.first,
        lastName: p.last,
        mobile: "09120000000",
        province: p.city,
        city: p.city,
        professionalField: "توسعه‌ی نرم‌افزار",
        occupation: "برنامه‌نویس",
        bio: `${p.first} یکی از شرکت‌کنندگان فستیوال برند شخصی است.`,
        interests: ["طراحی", "فناوری", "رشد فردی"],
        regionId: regions[p.region].id,
        slug,
      },
    });

    const firstQuestion = await prisma.question.findFirst({
      where: { bootcampId: bootcamps[0].id, stage: ResponseStage.BEFORE },
    });
    if (firstQuestion) {
      await prisma.response.create({
        data: {
          participantId: profile.id,
          questionId: firstQuestion.id,
          versions: {
            create: {
              versionNumber: 1,
              content: "خلاق، مهربان، مسئولیت‌پذیر، اجتماعی",
              stage: ResponseStage.BEFORE,
              bootcampId: bootcamps[0].id,
              createdBy: user.id,
            },
          },
        },
      });
    }

    const request = await prisma.feedbackRequest.create({
      data: {
        requesterId: profile.id,
        linkToken: `${slug}-${Math.random().toString(36).slice(2, 8)}`,
      },
    });
    await prisma.feedbackResponse.create({
      data: {
        requestId: request.id,
        authorName: "همکار",
        answers: {
          q1: "حل‌کننده مسئله، مدیر پروژه، خلاق، ارتباط‌گر حرفه‌ای",
          q2: "توانایی حل مسئله در شرایط پیچیده",
          q3: "نگاه سیستمی به مشکلات",
          q4: "فردی قابل‌اعتماد و متخصص در حوزه‌اش",
          q5: "مدیریت پروژه‌های فنی",
          q6: "رهبری فنی",
        },
        visibility: FeedbackVisibility.PRIVATE,
      },
    });
  }

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
