-- CreateEnum
CREATE TYPE "public"."GENDER" AS ENUM ('Male', 'Female');

-- CreateEnum
CREATE TYPE "public"."BloodGroup" AS ENUM ('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Profile" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "weight" INTEGER NOT NULL,
    "img" TEXT,
    "bod" TEXT,
    "occupation" TEXT,
    "gender" "public"."GENDER" NOT NULL,
    "bloodGroup" "public"."BloodGroup" NOT NULL,
    "activeDoner" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Credential" (
    "id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "randomPasswod" BOOLEAN,
    "isVerify" BOOLEAN NOT NULL DEFAULT false,
    "otp" INTEGER,
    "otpTime" TIMESTAMP(3),
    "otpExp" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "Credential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Address" (
    "id" TEXT NOT NULL,
    "area" TEXT,
    "division" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "upazila" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DonationExperience" (
    "id" TEXT NOT NULL,
    "lastDonationDate" TEXT NOT NULL,
    "lastDonationLocation" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "DonationExperience_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_email_key" ON "public"."Profile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "public"."Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Credential_userId_key" ON "public"."Credential"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Address_userId_key" ON "public"."Address"("userId");

-- AddForeignKey
ALTER TABLE "public"."Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Credential" ADD CONSTRAINT "Credential_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DonationExperience" ADD CONSTRAINT "DonationExperience_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
