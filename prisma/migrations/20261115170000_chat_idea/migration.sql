-- ChatIdea: visitor ideas and feedback (preview). Signed-out rows follow 12-month retention.
CREATE TABLE "ChatIdea" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "threadId" TEXT,
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatIdea_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ChatIdea_createdAt_idx" ON "ChatIdea"("createdAt");
CREATE INDEX "ChatIdea_source_idx" ON "ChatIdea"("source");
