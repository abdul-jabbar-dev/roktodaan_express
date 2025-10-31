-- CreateTable
CREATE TABLE "public"."BlacklistToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "reason" TEXT,
    "userEmail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlacklistToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlacklistToken_token_key" ON "public"."BlacklistToken"("token");

-- CreateIndex
CREATE INDEX "BlacklistToken_expiresAt_idx" ON "public"."BlacklistToken"("expiresAt");
