/*
  Warnings:

  - You are about to drop the column `bloodRequestId` on the `BloodRequestReservation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[donationId]` on the table `BloodRequestReservation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `donationId` to the `BloodRequestReservation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."BloodRequestReservation" DROP CONSTRAINT "BloodRequestReservation_bloodRequestId_fkey";

-- AlterTable
ALTER TABLE "public"."BloodRequestReservation" DROP COLUMN "bloodRequestId",
ADD COLUMN     "donationId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BloodRequestReservation_donationId_key" ON "public"."BloodRequestReservation"("donationId");

-- AddForeignKey
ALTER TABLE "public"."BloodRequestReservation" ADD CONSTRAINT "BloodRequestReservation_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "public"."Donation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
