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

      {analysis.atsScore !== undefined && (
        <p className="mt-5 text-sm text-paper">
          <span className="font-semibold">ATS Compatibility Score:</span>{" "}
          {analysis.atsScore}/100
        </p>
      )}

      {analysis.atsIssues && analysis.atsIssues.length > 0 && (
        <>
          <h4 className="mt-5 font-semibold text-paper">ATS Issues</h4>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-soft">
            {analysis.atsIssues.map((issue, index) => (
              <li key={index}>{issue}</li>
            ))}
          </ul>
        </>
      )}

      {analysis.sectionFeedback && analysis.sectionFeedback.length > 0 && (
        <>
          <h4 className="mt-5 font-semibold text-paper">
            Section Feedback
          </h4>

          <div className="mt-2 space-y-3">
            {analysis.sectionFeedback.map((section, index) => (
              <div
                key={index}
                className="rounded-lg border border-ink-line bg-ink/30 p-3"
              >
                <p className="font-medium text-paper">
                  {section.section} ({section.score}/10)
                </p>

                <p className="mt-1 text-sm text-ink-soft">
                  {section.feedback}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {analysis.recommendedKeywords &&
        analysis.recommendedKeywords.length > 0 && (
          <>
            <h4 className="mt-5 font-semibold text-paper">
              Recommended Keywords
            </h4>

            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-soft">
              {analysis.recommendedKeywords.map((keyword, index) => (
                <li key={index}>{keyword}</li>
              ))}
            </ul>
          </>
        )}

      {analysis.missingSections &&
        analysis.missingSections.length > 0 && (
          <>
            <h4 className="mt-5 font-semibold text-paper">
              Missing Sections
            </h4>

            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-soft">
              {analysis.missingSections.map((section, index) => (
                <li key={index}>{section}</li>
              ))}
            </ul>
          </>
        )}

      {analysis.priorityImprovements &&
        analysis.priorityImprovements.length > 0 && (
          <>
            <h4 className="mt-5 font-semibold text-paper">
              Priority Improvements
            </h4>

            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-soft">
              {analysis.priorityImprovements.map((improvement, index) => (
                <li key={index}>{improvement}</li>
              ))}
            </ul>
          </>
        )}


      {analysis.achievementSuggestions &&
        analysis.achievementSuggestions.length > 0 && (
          <>
            <h4 className="mt-5 font-semibold text-paper">
              Achievement Suggestions
            </h4>

            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-soft">
              {analysis.achievementSuggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </>
        )}
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

      {analysis.jobMatchScore != null && (
        <>
          <p className="mt-5 text-sm text-paper">
            <span className="font-semibold">Job Match Score:</span>{" "}
            {analysis.jobMatchScore}/100
          </p>

          <h4 className="mt-5 font-semibold text-paper">Matched Skills</h4>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-soft">
            {analysis.matchedSkills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>

          <h4 className="mt-5 font-semibold text-paper">Missing Skills</h4>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-soft">
            {analysis.missingSkills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}