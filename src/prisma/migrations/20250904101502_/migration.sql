-- AlterTable
ALTER TABLE "public"."Credential" ADD COLUMN     "isVerify" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "otp" INTEGER,
ADD COLUMN     "otpExp" TIMESTAMP(3),
ADD COLUMN     "otpTime" TIMESTAMP(3),
ADD COLUMN     "randomPasswod" BOOLEAN;

-- AlterTable
ALTER TABLE "public"."Profile" ADD COLUMN     "activeDoner" BOOLEAN NOT NULL DEFAULT true;
