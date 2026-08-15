import { NextResponse } from "next/server";
import { improveResumeText } from "@/lib/ai/resumeImprover";
import { prisma } from "@/lib/prisma";
import type { ResumeAnalysisResult } from "@/lib/ai/types";
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const resumeText: unknown = body?.resumeText;
    const analysis: unknown = body?.analysis;
    const analysisId: unknown = body?.analysisId;
    if (typeof resumeText !== "string" || resumeText.trim().length === 0) {
  return NextResponse.json(
    {
      success: false,
      error: "resumeText is required and must be a non-empty string.",
    },
    { status: 400 }
  );
}
if (typeof analysis !== "object" || analysis === null) {
  return NextResponse.json(
    {
      success: false,
      error: "analysis is required and must be a valid object.",
    },
    { status: 400 }
  );
}
if (typeof analysis !== "object" || analysis === null) {
  return NextResponse.json(
    {
      success: false,
      error: "analysis is required and must be a valid object.",
    },
    { status: 400 }
  );
}
if (typeof analysisId !== "string" || analysisId.trim().length === 0) {
  return NextResponse.json(
    {
      success: false,
      error: "analysisId is required and must be a valid string.",
    },
    { status: 400 }
  );
}
const result = await improveResumeText(
  resumeText,
  analysis as ResumeAnalysisResult
);
await prisma.resumeVersion.create({
  data: {
    analysisId,
    improvements: JSON.parse(JSON.stringify(result.improvements)),
    overallNotes: result.overallNotes,
  },
});
return NextResponse.json({
  success: true,
  result,
});
  } catch (error) {
    console.error("Resume improvement failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to improve resume. Please try again.",
      },
      { status: 500 }
    );
  }
}