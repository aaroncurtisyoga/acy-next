/*
  Warnings:

  - A unique constraint covering the columns `[placeId]` on the table `Location` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Location_placeId_key" ON "Location"("placeId");
