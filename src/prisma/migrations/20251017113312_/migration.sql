/*
  Warnings:

  - The `otpType` column on the `Credential` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."otpType" AS ENUM ('emailVerification', 'passwordReset');

-- AlterTable
ALTER TABLE "public"."Credential" DROP COLUMN "otpType",
ADD COLUMN     "otpType" "public"."otpType";
