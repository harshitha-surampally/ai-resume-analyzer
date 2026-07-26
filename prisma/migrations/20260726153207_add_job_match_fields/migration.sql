-- AlterTable
ALTER TABLE "Analysis" ADD COLUMN "jobMatchScore" REAL;
ALTER TABLE "Analysis" ADD COLUMN "matchedSkills" JSONB;
ALTER TABLE "Analysis" ADD COLUMN "missingSkills" JSONB;
