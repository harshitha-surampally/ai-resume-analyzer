-- CreateTable
CREATE TABLE "Analysis" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "resumeText" TEXT,
    "overallScore" DOUBLE PRECISION NOT NULL,
    "summary" TEXT NOT NULL,
    "strengths" JSONB NOT NULL,
    "weaknesses" JSONB NOT NULL,
    "suggestions" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jobMatchScore" DOUBLE PRECISION,
    "matchedSkills" JSONB,
    "missingSkills" JSONB,
    "atsScore" DOUBLE PRECISION,
    "atsIssues" JSONB,
    "sectionFeedback" JSONB,
    "recommendedKeywords" JSONB,
    "missingSections" JSONB,
    "priorityImprovements" JSONB,
    "achievementSuggestions" JSONB,

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResumeVersion" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "improvements" JSONB NOT NULL,
    "overallNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResumeVersion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ResumeVersion" ADD CONSTRAINT "ResumeVersion_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
