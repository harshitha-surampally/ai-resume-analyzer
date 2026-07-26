import { NextResponse } from "next/server";
import { analyzeResumeText } from "@/lib/ai/resumeAnalyzer";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const resumeText: unknown = body?.resumeText;
    const filename: unknown = body?.filename;
    const jobDescription: unknown = body?.jobDescription;

    if (jobDescription !== undefined && typeof jobDescription !== "string") {
  return NextResponse.json(
    {
      success: false,
      error: "jobDescription must be a string when provided.",
    },
    { status: 400 }
  );
}

    if (typeof resumeText !== "string" || resumeText.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "resumeText is required and must be a non-empty string.",
        },
        { status: 400 }
      );
    }

    if (typeof filename !== "string" || filename.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "filename is required and must be a non-empty string.",
        },
        { status: 400 }
      );
    }

    const result = await analyzeResumeText(
  resumeText,
  typeof jobDescription === "string"
    ? jobDescription
    : undefined
);

    const saved = await prisma.analysis.create({
      data: {
        filename,
        overallScore: result.overallScore,
        summary: result.summary,
        strengths: result.strengths,
        weaknesses: result.weaknesses,
        suggestions: result.suggestions,
        jobMatchScore: result.jobMatchScore,
        matchedSkills: result.matchedSkills,
        missingSkills: result.missingSkills,
      },
    });

    return NextResponse.json({
      success: true,
      result,
      id: saved.id,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}