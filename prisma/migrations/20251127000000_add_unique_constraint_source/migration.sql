-- DropIndex (replacing with unique constraint)
DROP INDEX "Event_sourceType_sourceId_idx";

-- CreateIndex (unique constraint - NULL values are treated as distinct in Postgres)
CREATE UNIQUE INDEX "Event_sourceType_sourceId_key" ON "Event"("sourceType", "sourceId");
