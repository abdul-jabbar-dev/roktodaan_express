/*
  Warnings:

  - The primary key for the `BlacklistToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `BloodRequest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `BloodRequestReservation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Donation` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."BloodRequestReservation" DROP CONSTRAINT "BloodRequestReservation_bloodRequestId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Donation" DROP CONSTRAINT "Donation_bloodRequestId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- AlterTable
ALTER TABLE "public"."BlacklistToken" DROP CONSTRAINT "BlacklistToken_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "BlacklistToken_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "BlacklistToken_id_seq";

-- AlterTable
ALTER TABLE "public"."BloodRequest" DROP CONSTRAINT "BloodRequest_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "BloodRequest_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "BloodRequest_id_seq";

-- AlterTable
ALTER TABLE "public"."BloodRequestReservation" DROP CONSTRAINT "BloodRequestReservation_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "bloodRequestId" SET DATA TYPE TEXT,
ADD CONSTRAINT "BloodRequestReservation_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "BloodRequestReservation_id_seq";

-- AlterTable
ALTER TABLE "public"."Donation" DROP CONSTRAINT "Donation_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "bloodRequestId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Donation_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Donation_id_seq";

-- AddForeignKey
ALTER TABLE "public"."Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BloodRequestReservation" ADD CONSTRAINT "BloodRequestReservation_bloodRequestId_fkey" FOREIGN KEY ("bloodRequestId") REFERENCES "public"."BloodRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Donation" ADD CONSTRAINT "Donation_bloodRequestId_fkey" FOREIGN KEY ("bloodRequestId") REFERENCES "public"."BloodRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
