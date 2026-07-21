import { NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/ai/client";

export async function GET() {
  try {
    const text = await generateAIResponse(
      "Reply with exactly one sentence confirming you received this test message."
    );

    return NextResponse.json({ success: true, text });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}