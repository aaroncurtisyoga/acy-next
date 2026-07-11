-- DropIndex
DROP INDEX "NewsletterEmailEvent_newsletterId_emailId_type_key";

-- AlterTable
ALTER TABLE "NewsletterEmailEvent" ADD COLUMN     "link" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE INDEX "NewsletterEmailEvent_newsletterId_type_idx" ON "NewsletterEmailEvent"("newsletterId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterEmailEvent_newsletterId_emailId_type_link_key" ON "NewsletterEmailEvent"("newsletterId", "emailId", "type", "link");
