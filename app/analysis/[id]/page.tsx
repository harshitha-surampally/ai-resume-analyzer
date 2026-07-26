import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AnalysisResult from "@/components/AnalysisResult";
import type { ResumeAnalysisResult } from "@/lib/ai/types";

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function toAnalysisResult(record: {
  overallScore: number;
  summary: string;
  strengths: unknown;
  weaknesses: unknown;
  suggestions: unknown;
  jobMatchScore: number | null;
  matchedSkills: unknown;
  missingSkills: unknown;
}): ResumeAnalysisResult | null {
  if (
    !isStringArray(record.strengths) ||
    !isStringArray(record.weaknesses) ||
    !isStringArray(record.suggestions)
  ) {
    return null;
  }

  return {
    overallScore: record.overallScore,
  summary: record.summary,
  strengths: record.strengths,
  weaknesses: record.weaknesses,
  suggestions: record.suggestions,

  jobMatchScore: record.jobMatchScore,
  matchedSkills: isStringArray(record.matchedSkills)
    ? record.matchedSkills
    : [],
  missingSkills: isStringArray(record.missingSkills)
    ? record.missingSkills
    : [],
  };
}

type AnalysisDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AnalysisDetailPage({
  params,
}: AnalysisDetailPageProps) {
  const { id } = await params;

  const record = await prisma.analysis.findUnique({
    where: { id },
  });

  if (!record) {
    notFound();
  }

  const analysis = toAnalysisResult(record);

  if (!analysis) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-xl px-6 py-16">
      <p className="font-mono text-xs text-mark">SAVED ANALYSIS</p>

      <h1 className="mt-2 truncate font-display text-3xl font-semibold text-paper">
        {record.filename}
      </h1>

      <p className="mt-1 text-sm text-ink-soft">
        Analyzed {formatDate(record.createdAt)}
      </p>

      <AnalysisResult analysis={analysis} />
    </div>
  );
}