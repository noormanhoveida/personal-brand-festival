import { EvaluationStatus, ResponseStage } from "@prisma/client";
import { prisma } from "../../config/db";

/**
 * All analytics here are computed by aggregating the rows a festival of
 * realistic size (tens to a few hundred participants) already fits in
 * memory for — deliberately simple JS-side aggregation over a handful
 * of targeted queries rather than exotic SQL, so the logic stays easy
 * to audit and extend as new questions come up.
 */

export async function getOverview() {
  const [totalParticipants, completedOnboarding, submittedEvaluations, totalBootcamps] =
    await Promise.all([
      prisma.user.count({ where: { role: "PARTICIPANT" } }),
      prisma.participantProfile.count(),
      prisma.evaluation.count({ where: { status: EvaluationStatus.SUBMITTED } }),
      prisma.bootcamp.count(),
    ]);

  return {
    totalParticipants,
    onboardingCompletionRate:
      totalParticipants > 0 ? completedOnboarding / totalParticipants : 0,
    submittedEvaluations,
    totalBootcamps,
  };
}

/**
 * "Most effective bootcamp" (spec §30): for each bootcamp, the share of
 * participants who had a BEFORE-stage answer tied to it who went on to
 * also submit an AFTER-stage answer — i.e. actual follow-through, not
 * just attendance.
 */
export async function getBootcampEffectiveness() {
  const bootcamps = await prisma.bootcamp.findMany({
    select: { id: true, title: true },
  });

  const versions = await prisma.responseVersion.findMany({
    where: { bootcampId: { not: null } },
    select: { bootcampId: true, stage: true, response: { select: { participantId: true } } },
  });

  return bootcamps.map((bootcamp) => {
    const forThisBootcamp = versions.filter((v) => v.bootcampId === bootcamp.id);
    const before = new Set(
      forThisBootcamp
        .filter((v) => v.stage === ResponseStage.BEFORE)
        .map((v) => v.response.participantId)
    );
    const after = new Set(
      forThisBootcamp
        .filter((v) => v.stage === ResponseStage.AFTER)
        .map((v) => v.response.participantId)
    );
    const followThrough = [...after].filter((id) => before.has(id));

    return {
      bootcampId: bootcamp.id,
      title: bootcamp.title,
      beforeCount: before.size,
      afterCount: after.size,
      followThroughRate: before.size > 0 ? followThrough.length / before.size : 0,
    };
  });
}

/**
 * "Most improved / weakest category" (spec §30): average score per
 * evaluation criterion across all SUBMITTED evaluations, sorted so the
 * caller can read off the strongest and weakest directly.
 */
export async function getCriteriaBreakdown() {
  const scores = await prisma.evaluationScore.findMany({
    where: { evaluation: { status: EvaluationStatus.SUBMITTED } },
    include: { criterion: true },
  });

  const byCriterion = new Map<
    string,
    { title: string; total: number; count: number }
  >();

  for (const s of scores) {
    const entry = byCriterion.get(s.criterionId) ?? {
      title: s.criterion.title,
      total: 0,
      count: 0,
    };
    entry.total += s.score;
    entry.count += 1;
    byCriterion.set(s.criterionId, entry);
  }

  return [...byCriterion.entries()]
    .map(([criterionId, v]) => ({
      criterionId,
      title: v.title,
      averageScore: v.total / v.count,
      sampleSize: v.count,
    }))
    .sort((a, b) => b.averageScore - a.averageScore);
}

/** Regional participation and average final score, for the regional map/chart. */
export async function getRegionalBreakdown() {
  const regions = await prisma.region.findMany({
    include: {
      participants: {
        include: {
          evaluations: {
            where: { status: EvaluationStatus.SUBMITTED },
            select: { finalScore: true },
          },
        },
      },
    },
  });

  return regions.map((region) => {
    const scores = region.participants
      .flatMap((p) => p.evaluations.map((e) => e.finalScore))
      .filter((s): s is number => s !== null);

    return {
      regionId: region.id,
      name: region.name,
      participantCount: region.participants.length,
      averageFinalScore:
        scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : null,
    };
  });
}

/**
 * Simplified "self-image vs perceived-image" gap (spec §18/§30). Full
 * NLP-based semantic comparison is out of scope here; as a first,
 * honest approximation this measures literal word overlap between the
 * participant's own four identity words and the words others used to
 * describe them in "آینه من" feedback (question q1). A low overlap is
 * a legitimate analytics signal even without deeper NLP.
 */
export async function getIdentityGap() {
  const pages = await prisma.personalPage.findMany({
    where: { identityWords: { isEmpty: false } },
    select: { participantId: true, identityWords: true },
  });

  const results = [];
  for (const page of pages) {
    const feedback = await prisma.feedbackResponse.findMany({
      where: { request: { requesterId: page.participantId } },
      select: { answers: true },
    });

    const selfWords = new Set(page.identityWords.map((w) => w.trim().toLowerCase()));
    const perceivedWords = new Set<string>();
    for (const f of feedback) {
      const q1 = (f.answers as Record<string, string>)?.q1;
      if (q1) {
        q1.split(/[\s,،]+/).forEach((w) => {
          if (w) perceivedWords.add(w.trim().toLowerCase());
        });
      }
    }

    const overlap = [...selfWords].filter((w) => perceivedWords.has(w));

    results.push({
      participantId: page.participantId,
      selfWordCount: selfWords.size,
      perceivedWordCount: perceivedWords.size,
      overlapCount: overlap.length,
      overlapRatio: selfWords.size > 0 ? overlap.length / selfWords.size : 0,
    });
  }

  const averageOverlapRatio =
    results.length > 0
      ? results.reduce((sum, r) => sum + r.overlapRatio, 0) / results.length
      : null;

  return { perParticipant: results, averageOverlapRatio };
}
