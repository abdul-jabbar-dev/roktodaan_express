-- CreateEnum
CREATE TYPE "public"."RequestStatus" AS ENUM ('VeryUrgent', 'Urgent', 'Needed');

-- CreateEnum
CREATE TYPE "public"."DonationStatus" AS ENUM ('Done', 'NoNeed', 'Reserved', 'Upcomming');

-- CreateEnum
CREATE TYPE "public"."DonationType" AS ENUM ('WholeBlood', 'Plasma', 'Platelets', 'RedBloodCells');

-- CreateTable
CREATE TABLE "public"."BloodRequest" (
    "id" SERIAL NOT NULL,
    "patientName" TEXT NOT NULL,
    "bloodGroup" "public"."BloodGroup" NOT NULL,
    "hospital" TEXT,
    "urgency" "public"."RequestStatus" NOT NULL,
    "postedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contact" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "attendantName" TEXT NOT NULL,
    "donorMessage" TEXT,
    "division" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "upazila" TEXT NOT NULL,

    CONSTRAINT "BloodRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Donation" (
    "id" SERIAL NOT NULL,
    "bloodRequestId" INTEGER NOT NULL,
    "bloodType" "public"."DonationType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "place" TEXT NOT NULL,
    "status" "public"."DonationStatus" NOT NULL,
    "division" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "upazila" TEXT NOT NULL,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Donation" ADD CONSTRAINT "Donation_bloodRequestId_fkey" FOREIGN KEY ("bloodRequestId") REFERENCES "public"."BloodRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
