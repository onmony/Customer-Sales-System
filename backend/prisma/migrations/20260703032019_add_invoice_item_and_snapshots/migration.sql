/*
  Warnings:

  - Added the required column `customerSnapshotName` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderSnapshotCurrency` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderSnapshotNumber` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderSnapshotOrderDate` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderSnapshotTotalAmount` to the `invoices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "customerSnapshotBillingAddress" JSONB,
ADD COLUMN     "customerSnapshotGstNumber" TEXT,
ADD COLUMN     "customerSnapshotName" TEXT NOT NULL,
ADD COLUMN     "customerSnapshotShippingAddress" JSONB,
ADD COLUMN     "discountAmount" DECIMAL(15,2),
ADD COLUMN     "orderSnapshotCurrency" TEXT NOT NULL,
ADD COLUMN     "orderSnapshotNumber" TEXT NOT NULL,
ADD COLUMN     "orderSnapshotOrderDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "orderSnapshotTotalAmount" DECIMAL(15,2) NOT NULL,
ADD COLUMN     "taxAmount" DECIMAL(15,2);

-- CreateTable
CREATE TABLE "invoice_items" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" DECIMAL(15,2) NOT NULL,
    "unitPrice" DECIMAL(15,2) NOT NULL,
    "lineTotal" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "notes" TEXT,
    "taxRate" DECIMAL(5,2),
    "taxAmount" DECIMAL(15,2),
    "hsnSac" TEXT,
    "productSnapshotCode" TEXT NOT NULL,
    "productSnapshotName" TEXT NOT NULL,
    "productSnapshotUnit" TEXT NOT NULL,
    "pricingSnapshotVersion" INTEGER NOT NULL,
    "pricingSnapshotEffectiveDate" TIMESTAMP(3) NOT NULL,
    "pricingSnapshotCurrency" TEXT NOT NULL,
    "pricingSnapshotSource" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "invoice_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "invoice_items_invoiceId_idx" ON "invoice_items"("invoiceId");

-- CreateIndex
CREATE INDEX "invoice_items_productId_idx" ON "invoice_items"("productId");

-- CreateIndex
CREATE INDEX "invoice_items_deletedAt_idx" ON "invoice_items"("deletedAt");

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;
