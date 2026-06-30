/*
  Warnings:

  - You are about to drop the column `proofOfDelivery` on the `deliveries` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethod` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `referenceNumber` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `carrier` on the `shipments` table. All the data in the column will be lost.
  - You are about to drop the column `trackingNumber` on the `shipments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "deliveries" DROP COLUMN "proofOfDelivery";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "paymentMethod",
DROP COLUMN "referenceNumber";

-- AlterTable
ALTER TABLE "shipments" DROP COLUMN "carrier",
DROP COLUMN "trackingNumber";
