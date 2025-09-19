-- AlterTable
ALTER TABLE "public"."Event" ADD COLUMN     "googleEventId" TEXT,
ADD COLUMN     "googleEventLink" TEXT;

-- CreateIndex
CREATE INDEX "Event_googleEventId_idx" ON "public"."Event"("googleEventId");
