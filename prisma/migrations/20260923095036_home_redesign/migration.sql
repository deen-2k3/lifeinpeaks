-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "heroAside" TEXT NOT NULL DEFAULT 'Good Views, Brighter Days',
ADD COLUMN     "heroEyebrow" TEXT NOT NULL DEFAULT 'Collecting moments,',
ADD COLUMN     "heroText" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "heroTitle" TEXT NOT NULL DEFAULT 'Chasing Mountains.',
ADD COLUMN     "pinterestUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "quote" TEXT NOT NULL DEFAULT 'Not all classrooms have four walls.',
ADD COLUMN     "quoteImageId" TEXT,
ADD COLUMN     "twitterUrl" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "Subscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subscriber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_email_key" ON "Subscriber"("email");
