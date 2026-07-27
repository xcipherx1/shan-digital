-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fullName" TEXT,
    "businessName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "city" TEXT,
    "selectedOffer" TEXT,
    "answers" JSONB NOT NULL DEFAULT '{}',
    "painPoint" TEXT,
    "meetingBooked" BOOLEAN NOT NULL DEFAULT false,
    "meetingTime" TIMESTAMP(3),
    "meetingRef" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "utmContent" TEXT,
    "utmTerm" TEXT,
    "fbclid" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");
