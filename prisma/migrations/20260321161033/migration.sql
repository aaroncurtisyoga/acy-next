-- CreateIndex
CREATE INDEX "Event_categoryId_idx" ON "Event"("categoryId");

-- CreateIndex
CREATE INDEX "Event_locationId_idx" ON "Event"("locationId");

-- CreateIndex
CREATE INDEX "Event_startDateTime_idx" ON "Event"("startDateTime");

-- CreateIndex
CREATE INDEX "Event_isActive_startDateTime_idx" ON "Event"("isActive", "startDateTime");

-- CreateIndex
CREATE INDEX "Order_buyerId_idx" ON "Order"("buyerId");
