/*
  Warnings:

  - You are about to drop the column `productSnapshotId` on the `order_items` table. All the data in the column will be lost.
  - The `customerSnapshotBillingAddress` column on the `orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `customerSnapshotShippingAddress` column on the `orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "productSnapshotId";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "customerSnapshotBillingAddress",
ADD COLUMN     "customerSnapshotBillingAddress" JSONB,
DROP COLUMN "customerSnapshotShippingAddress",
ADD COLUMN     "customerSnapshotShippingAddress" JSONB;
