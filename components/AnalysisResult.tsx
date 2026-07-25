import type { ResumeAnalysisResult } from "@/lib/ai/types";

type AnalysisResultProps = {
  analysis: ResumeAnalysisResult;
};

export default function AnalysisResult({ analysis }: AnalysisResultProps) {
  return (
    <div className="mt-6 rounded-xl border border-ink-line bg-ink/40 px-5 py-5">
      <h3 className="font-display text-xl font-semibold text-paper">
        Resume Analysis
      </h3>

      <p className="mt-3 text-sm text-paper">
        <span className="font-semibold">Score:</span>{" "}
        {analysis.overallScore}/100
      </p>

      <p className="mt-3 text-sm text-ink-soft">{analysis.summary}</p>

      <h4 className="mt-5 font-semibold text-paper">Strengths</h4>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-soft">
        {analysis.strengths.map((strength, index) => (
          <li key={index}>{strength}</li>
        ))}
      </ul>

      <h4 className="mt-5 font-semibold text-paper">Weaknesses</h4>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-soft">
        {analysis.weaknesses.map((weakness, index) => (
          <li key={index}>{weakness}</li>
        ))}
      </ul>

      <h4 className="mt-5 font-semibold text-paper">Suggestions</h4>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-soft">
        {analysis.suggestions.map((suggestion, index) => (
          <li key={index}>{suggestion}</li>
        ))}
      </ul>
    </div>
  );
}