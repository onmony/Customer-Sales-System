/*
  Warnings:

  - You are about to drop the column `customerSnapshotBillingAddress` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `customerSnapshotGstNumber` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `customerSnapshotName` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `customerSnapshotShippingAddress` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `orderSnapshotCurrency` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `orderSnapshotNumber` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `orderSnapshotOrderDate` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `orderSnapshotTotalAmount` on the `invoices` table. All the data in the column will be lost.
  - Added the required column `documentSnapshot` to the `invoices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "customerSnapshotBillingAddress",
DROP COLUMN "customerSnapshotGstNumber",
DROP COLUMN "customerSnapshotName",
DROP COLUMN "customerSnapshotShippingAddress",
DROP COLUMN "orderSnapshotCurrency",
DROP COLUMN "orderSnapshotNumber",
DROP COLUMN "orderSnapshotOrderDate",
DROP COLUMN "orderSnapshotTotalAmount",
ADD COLUMN     "documentSnapshot" JSONB NOT NULL;
