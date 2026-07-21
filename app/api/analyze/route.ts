import { NextResponse } from "next/server";
import { analyzeResumeText } from "@/lib/ai/resumeAnalyzer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const resumeText: unknown = body?.resumeText;

    if (typeof resumeText !== "string" || resumeText.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "resumeText is required and must be a non-empty string.",
        },
        { status: 400 }
      );
    }

    const result = await analyzeResumeText(resumeText);

    return NextResponse.json({
      success: true,
      result,
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