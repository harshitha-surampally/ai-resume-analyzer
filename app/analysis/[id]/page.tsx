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
function isSectionFeedbackArray(
  value: unknown
): value is { section: string; score: number; feedback: string }[] {
  return (
    Array.isArray(value) &&
    value.every((item) => {
      if (typeof item !== "object" || item === null) return false;
      const obj = item as Record<string, unknown>;
      return (
        typeof obj.section === "string" &&
        typeof obj.score === "number" &&
        typeof obj.feedback === "string"
      );
    })
  );
}
function isResumeImprovementArray(
  value: unknown
): value is {
  section: string;
  original: string;
  improved: string;
  rationale?: string;
}[] {
  return (
    Array.isArray(value) &&
    value.every((item) => {
      if (typeof item !== "object" || item === null) return false;

      const obj = item as Record<string, unknown>;

      return (
        typeof obj.section === "string" &&
        typeof obj.original === "string" &&
        typeof obj.improved === "string" &&
        (obj.rationale === undefined || typeof obj.rationale === "string")
      );
    })
  );
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

  atsScore: number | null;
  atsIssues: unknown;
  sectionFeedback: unknown;
  recommendedKeywords: unknown;
  missingSections: unknown;
  priorityImprovements: unknown;
  achievementSuggestions: unknown;
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

    atsScore: record.atsScore ?? undefined,
atsIssues: isStringArray(record.atsIssues)
  ? record.atsIssues
  : undefined,
sectionFeedback: isSectionFeedbackArray(record.sectionFeedback)
  ? record.sectionFeedback
  : undefined,
recommendedKeywords: isStringArray(record.recommendedKeywords)
  ? record.recommendedKeywords
  : undefined,
missingSections: isStringArray(record.missingSections)
  ? record.missingSections
  : undefined,
priorityImprovements: isStringArray(record.priorityImprovements)
  ? record.priorityImprovements
  : undefined,
achievementSuggestions: isStringArray(record.achievementSuggestions)
  ? record.achievementSuggestions
  : undefined,
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
    include: {
    versions: true,
  },
  });

  if (!record) {
    notFound();
  }

  type SavedResumeVersion = {
  id: string;
  improvements: unknown;
  overallNotes: string | null;
  createdAt: Date;
};

  const analysis = toAnalysisResult(record);

  const savedVersions: SavedResumeVersion[] = record.versions.filter(
  (version) => isResumeImprovementArray(version.improvements)
);

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
      {savedVersions.length > 0 && (
  <div className="mt-10">
    <p className="font-mono text-xs text-mark">SAVED IMPROVEMENTS</p>

    <div className="mt-4 space-y-4">
      {savedVersions.map((version, index) => (
        <div
          key={version.id}
          className="rounded-xl border border-ink-line bg-ink/40 px-4 py-4"
        >
          <p className="font-display text-base font-semibold text-paper">
            Improvement Version {index + 1}
          </p>

          <p className="mt-1 text-xs text-ink-soft">
            Saved {formatDate(version.createdAt)}
          </p>

          {version.overallNotes && (
            <p className="mt-3 text-sm leading-6 text-ink-soft">
              {version.overallNotes}
            </p>
          )}

          <div className="mt-4 space-y-4">
            {isResumeImprovementArray(version.improvements) &&
              version.improvements.map((item, itemIndex) => (
                <div
                  key={`${item.section}-${itemIndex}`}
                  className="rounded-lg border border-ink-line px-4 py-4"
                >
                  <p className="font-display text-sm font-semibold text-paper">
                    {item.section}
                  </p>

                  <div className="mt-3">
                    <p className="font-mono text-xs text-ink-soft">
                      ORIGINAL
                    </p>
                    <p className="mt-1 text-sm leading-6 text-ink-soft">
                      {item.original}
                    </p>
                  </div>

                  <div className="mt-3">
                    <p className="font-mono text-xs text-mark">
                      IMPROVED
                    </p>
                    <p className="mt-1 text-sm leading-6 text-paper">
                      {item.improved}
                    </p>
                  </div>

                  {item.rationale && (
                    <div className="mt-3 border-t border-ink-line pt-3">
                      <p className="font-mono text-xs text-ink-soft">
                        WHY THIS IS BETTER
                      </p>
                      <p className="mt-1 text-sm leading-6 text-ink-soft">
                        {item.rationale}
                      </p>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  </div>
)}
    </div>
  );
}