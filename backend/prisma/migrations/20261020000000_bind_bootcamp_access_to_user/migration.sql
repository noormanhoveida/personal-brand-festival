-- 1) add userId nullable first
ALTER TABLE "BootcampAccess" ADD COLUMN "userId" TEXT;

-- 2) backfill userId from ParticipantProfile.userId for existing 17 records
UPDATE "BootcampAccess" a
SET "userId" = p."userId"
FROM "ParticipantProfile" p
WHERE p."id" = a."participantId";

-- 3) make userId NOT NULL
ALTER TABLE "BootcampAccess" ALTER COLUMN "userId" SET NOT NULL;

-- 4) drop old unique constraint and create new one
ALTER TABLE "BootcampAccess" DROP CONSTRAINT IF EXISTS "BootcampAccess_bootcampId_participantId_key";
ALTER TABLE "BootcampAccess" ADD CONSTRAINT "BootcampAccess_bootcampId_userId_key" UNIQUE ("bootcampId","userId");

-- 5) drop old FK and add new FK to User
ALTER TABLE "BootcampAccess" DROP CONSTRAINT IF EXISTS "BootcampAccess_participantId_fkey";
ALTER TABLE "BootcampAccess"
  ADD CONSTRAINT "BootcampAccess_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- 6) finally drop participantId column
ALTER TABLE "BootcampAccess" DROP COLUMN IF EXISTS "participantId";
