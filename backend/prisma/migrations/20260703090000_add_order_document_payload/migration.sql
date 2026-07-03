-- Add complete immutable Order business document payload.
-- Operational/search fields remain relational.
ALTER TABLE "orders"
ADD COLUMN "orderDocumentPayload" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN "snapshotSchemaVersion" INTEGER NOT NULL DEFAULT 1;
