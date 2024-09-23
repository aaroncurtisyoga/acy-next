/*
  Warnings:

  - Added the required column `type` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('EVENT', 'PRIVATE_SESSION');

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_eventId_fkey";

-- AlterTable
ALTER TABLE "Order"
    ADD COLUMN "type" "OrderType",  -- Add the column without NOT NULL constraint
    ALTER COLUMN "eventId" DROP NOT NULL;

-- Update existing rows to set a default value for the `type` column
UPDATE "Order"
SET "type" = 'EVENT'
WHERE "type" IS NULL;

-- Alter the column to enforce the NOT NULL constraint
ALTER TABLE "Order"
    ALTER COLUMN "type" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
