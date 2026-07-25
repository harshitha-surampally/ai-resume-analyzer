import { NextResponse } from "next/server";
import { analyzeResumeText } from "@/lib/ai/resumeAnalyzer";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const resumeText: unknown = body?.resumeText;
    const filename: unknown = body?.filename;

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

    const result = await analyzeResumeText(resumeText);

    const saved = await prisma.analysis.create({
      data: {
        filename,
        overallScore: result.overallScore,
        summary: result.summary,
        strengths: result.strengths,
        weaknesses: result.weaknesses,
        suggestions: result.suggestions,
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