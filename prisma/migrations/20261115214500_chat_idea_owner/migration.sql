-- Signed-in idea owner, kept internal; used to delete ideas on Clerk user.deleted.
ALTER TABLE "ChatIdea" ADD COLUMN IF NOT EXISTS "userId" TEXT;
CREATE INDEX IF NOT EXISTS "ChatIdea_userId_idx" ON "ChatIdea"("userId");
