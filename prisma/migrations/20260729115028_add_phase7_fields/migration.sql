-- AlterTable
ALTER TABLE "Analysis" ADD COLUMN "achievementSuggestions" JSONB;
ALTER TABLE "Analysis" ADD COLUMN "atsIssues" JSONB;
ALTER TABLE "Analysis" ADD COLUMN "atsScore" REAL;
ALTER TABLE "Analysis" ADD COLUMN "missingSections" JSONB;
ALTER TABLE "Analysis" ADD COLUMN "priorityImprovements" JSONB;
ALTER TABLE "Analysis" ADD COLUMN "recommendedKeywords" JSONB;
ALTER TABLE "Analysis" ADD COLUMN "sectionFeedback" JSONB;
