import { NextResponse } from "next/server";
import { analyzeResumeText } from "@/lib/ai/resumeAnalyzer";

const SAMPLE_RESUME_TEXT = `
Jane Doe
Software Engineer with 4 years of experience building web applications using React, Node.js, and PostgreSQL.
Led migration of a legacy monolith to microservices, reducing deployment time by 40%.
B.S. Computer Science, State University.
`;

export async function GET() {
  try {
    const result = await analyzeResumeText(SAMPLE_RESUME_TEXT);

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