-- CreateTable
CREATE TABLE "ChatAnonLink" (
    "anonId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatAnonLink_pkey" PRIMARY KEY ("anonId","userId")
);

-- CreateIndex
CREATE INDEX "ChatAnonLink_userId_idx" ON "ChatAnonLink"("userId");
