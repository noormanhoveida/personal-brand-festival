ALTER TABLE "Form"
  ADD COLUMN "bootcampId" TEXT,
  ADD COLUMN "bootcampStatusTrigger" "BootcampStatus";

ALTER TABLE "Form"
  ADD CONSTRAINT "Form_bootcampId_fkey"
  FOREIGN KEY ("bootcampId") REFERENCES "Bootcamp"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
