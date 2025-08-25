-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "externalUrl" TEXT,
ADD COLUMN     "isExternal" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastSynced" TIMESTAMP(3),
ADD COLUMN     "sourceId" TEXT,
ADD COLUMN     "sourceType" TEXT;

-- CreateIndex
CREATE INDEX "Event_sourceType_sourceId_idx" ON "Event"("sourceType", "sourceId");
