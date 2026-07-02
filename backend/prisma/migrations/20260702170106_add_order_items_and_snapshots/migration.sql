/*
  Warnings:

  - Added the required column `customerSnapshotName` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "customerSnapshotBillingAddress" TEXT,
ADD COLUMN     "customerSnapshotGstNumber" TEXT,
ADD COLUMN     "customerSnapshotName" TEXT NOT NULL,
ADD COLUMN     "customerSnapshotShippingAddress" TEXT;

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" DECIMAL(15,2) NOT NULL,
    "unitPrice" DECIMAL(15,2) NOT NULL,
    "lineTotal" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "notes" TEXT,
    "productSnapshotId" TEXT NOT NULL,
    "productSnapshotCode" TEXT,
    "productSnapshotName" TEXT NOT NULL,
    "productSnapshotUnit" TEXT NOT NULL,
    "pricingSnapshotVersion" INTEGER NOT NULL,
    "pricingSnapshotEffectiveDate" TIMESTAMP(3) NOT NULL,
    "pricingSnapshotCurrency" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "order_items_orderId_idx" ON "order_items"("orderId");

-- CreateIndex
CREATE INDEX "order_items_productId_idx" ON "order_items"("productId");

-- CreateIndex
CREATE INDEX "order_items_deletedAt_idx" ON "order_items"("deletedAt");

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
