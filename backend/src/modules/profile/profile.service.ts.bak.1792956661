import { prisma } from "../../config/db";
import { AppError } from "../../utils/errors";
import { randomHandle, slugifyBase } from "../../utils/slugify";
import { ProfileInput, ProfileUpdateInput } from "./profile.validator";

export class ProfileError extends AppError {}

export async function getOwnProfile(userId: string) {
  const profile = await prisma.participantProfile.findUnique({
    where: { userId },
    include: { media: true, region: true },
  });
  return profile; // null is a valid state: onboarding not completed yet
}

async function generateUniqueSlug(firstName: string, lastName: string) {
  const base = slugifyBase(firstName, lastName) || randomHandle();
  let candidate = base;
  let suffix = 1;

  while (await prisma.participantProfile.findUnique({ where: { slug: candidate } })) {
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }

  return candidate;
}

async function resolveRegion(regionId: string) {
  const region = await prisma.region.findUnique({ where: { id: regionId } });
  if (!region) {
    throw new ProfileError("منطقه انتخاب‌شده معتبر نیست.", 400);
  }
  return region;
}

/**
 * First-time onboarding. Requires the full required field set (validated
 * by profileInputSchema at the route level) and fails if a profile
 * already exists for this user — use updateProfile for subsequent edits.
 */
export async function createProfile(userId: string, input: ProfileInput) {
  const existing = await prisma.participantProfile.findUnique({
    where: { userId },
  });
  if (existing) {
    throw new ProfileError("پروفایل شما قبلاً تکمیل شده است.", 409);
  }

  const region = await resolveRegion(input.regionId);
  const slug = await generateUniqueSlug(input.firstName, input.lastName);

  return prisma.participantProfile.create({
    data: {
      userId,
      firstName: input.firstName,
      lastName: input.lastName,
      mobile: input.mobile,

      // Backward compatibility:
      // keep province filled (many places may still display it)
      province: region.name,

      city: input.city,
      educationLevel: input.educationLevel,
      fieldOfStudy: input.fieldOfStudy,
      professionalField: input.professionalField,
      occupation: input.occupation,
      bio: input.bio,
      interests: input.interests ?? [],
      slug,

      regionId: input.regionId,
    },
    include: { media: true, region: true },
  });
}

/**
 * Partial update to an existing profile. Does NOT change the slug even
 * if the name changes — the public URL must stay stable once published.
 */
export async function updateProfile(userId: string, input: ProfileUpdateInput) {
  const existing = await prisma.participantProfile.findUnique({
    where: { userId },
  });
  if (!existing) {
    throw new ProfileError(
      "ابتدا باید فرآیند تکمیل پروفایل (onboarding) را انجام دهید.",
      404
    );
  }

  let regionUpdate: { regionId?: string; province?: string } = {};
  if (input.regionId !== undefined) {
    const region = await resolveRegion(input.regionId);
    regionUpdate = { regionId: input.regionId, province: region.name };
  }

  return prisma.participantProfile.update({
    where: { userId },
    data: {
      ...(input.firstName !== undefined && { firstName: input.firstName }),
      ...(input.lastName !== undefined && { lastName: input.lastName }),
      ...(input.mobile !== undefined && { mobile: input.mobile }),
      ...(input.city !== undefined && { city: input.city }),
      ...(input.educationLevel !== undefined && { educationLevel: input.educationLevel }),
      ...(input.fieldOfStudy !== undefined && { fieldOfStudy: input.fieldOfStudy }),
      ...(input.professionalField !== undefined && { professionalField: input.professionalField }),
      ...(input.occupation !== undefined && { occupation: input.occupation }),
      ...(input.bio !== undefined && { bio: input.bio }),
      ...(input.interests !== undefined && { interests: input.interests }),

      ...regionUpdate,
    },
    include: { media: true, region: true },
  });
}
