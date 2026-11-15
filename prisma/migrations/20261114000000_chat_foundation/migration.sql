-- AlterTable
ALTER TABLE "ChatThread" ADD COLUMN     "anonOwnerId" TEXT,
ADD COLUMN     "claimedAt" TIMESTAMP(3),
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "ChatMessage" ADD COLUMN     "questionLogId" TEXT;

-- CreateTable
CREATE TABLE "SavedItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "anonOwnerId" TEXT,
    "kind" TEXT NOT NULL,
    "threadId" TEXT,
    "messageId" TEXT,
    "dealSlug" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatUserPref" (
    "userId" TEXT NOT NULL,
    "trainOptIn" BOOLEAN NOT NULL DEFAULT false,
    "trainOptInAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatUserPref_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE INDEX "SavedItem_userId_idx" ON "SavedItem"("userId");

-- CreateIndex
CREATE INDEX "SavedItem_anonOwnerId_idx" ON "SavedItem"("anonOwnerId");

-- CreateIndex
CREATE INDEX "SavedItem_threadId_idx" ON "SavedItem"("threadId");

-- CreateIndex
CREATE INDEX "ChatThread_userId_idx" ON "ChatThread"("userId");

-- CreateIndex
CREATE INDEX "ChatThread_anonOwnerId_idx" ON "ChatThread"("anonOwnerId");

-- AddForeignKey
ALTER TABLE "SavedItem" ADD CONSTRAINT "SavedItem_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "ChatThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedItem" ADD CONSTRAINT "SavedItem_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "ChatMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

