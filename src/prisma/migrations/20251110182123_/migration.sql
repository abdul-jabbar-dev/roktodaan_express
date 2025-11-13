-- CreateTable
CREATE TABLE "public"."BloodRequestReservation" (
    "id" SERIAL NOT NULL,
    "bloodRequestId" INTEGER NOT NULL,
    "donorId" TEXT,
    "otherName" TEXT,
    "otherPhoneNumber" TEXT,
    "otherAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BloodRequestReservation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."BloodRequestReservation" ADD CONSTRAINT "BloodRequestReservation_bloodRequestId_fkey" FOREIGN KEY ("bloodRequestId") REFERENCES "public"."BloodRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BloodRequestReservation" ADD CONSTRAINT "BloodRequestReservation_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
