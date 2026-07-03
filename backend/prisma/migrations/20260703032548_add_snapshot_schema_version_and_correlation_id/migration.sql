-- AlterTable
ALTER TABLE "invoice_items" ADD COLUMN     "correlationId" TEXT;

-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "snapshotSchemaVersion" INTEGER NOT NULL DEFAULT 1;
