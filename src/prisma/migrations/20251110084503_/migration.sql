/*
  Warnings:

  - You are about to drop the column `district` on the `Donation` table. All the data in the column will be lost.
  - You are about to drop the column `division` on the `Donation` table. All the data in the column will be lost.
  - You are about to drop the column `upazila` on the `Donation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Donation" DROP COLUMN "district",
DROP COLUMN "division",
DROP COLUMN "upazila";
