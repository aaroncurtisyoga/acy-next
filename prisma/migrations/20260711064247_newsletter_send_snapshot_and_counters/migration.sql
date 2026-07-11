-- AlterTable
ALTER TABLE "Newsletter" ADD COLUMN     "complainedCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "recipientCount" INTEGER,
ADD COLUMN     "sentHtml" TEXT;
