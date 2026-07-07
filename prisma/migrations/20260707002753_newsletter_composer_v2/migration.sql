-- AlterTable
ALTER TABLE "Newsletter" ADD COLUMN     "bouncedCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "clickedCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "deliveredCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "includeClasses" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "includeDescriptions" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "includeUpcoming" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "openedCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "NewsletterEmailEvent" (
    "id" TEXT NOT NULL,
    "newsletterId" TEXT NOT NULL,
    "emailId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsletterEmailEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterEmailEvent_newsletterId_emailId_type_key" ON "NewsletterEmailEvent"("newsletterId", "emailId", "type");

-- CreateIndex
CREATE INDEX "Newsletter_resendBroadcastId_idx" ON "Newsletter"("resendBroadcastId");

-- AddForeignKey
ALTER TABLE "NewsletterEmailEvent" ADD CONSTRAINT "NewsletterEmailEvent_newsletterId_fkey" FOREIGN KEY ("newsletterId") REFERENCES "Newsletter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
