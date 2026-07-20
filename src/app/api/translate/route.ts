import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

const SYSTEM_PROMPT = `You are DevTranslate, an expert at converting highly technical software engineering jargon into clear, business-friendly language that non-technical executives can understand.

Rules:
- Convert the technical input into a concise, plain-language bullet point (1-3 sentences).
- Start with a bold category label (e.g., "Core Web App Update:", "Performance Boost:", "Security Enhancement:").
- Do NOT use any emojis in the output.
- Explain the BUSINESS IMPACT: what does this mean for customers, revenue, or operations?
- Never use technical terms like "Redis", "JWT", "CI/CD", "middleware", "refactor", "API", "SDK" etc. in your output.
- Tone: confident, clear, optimistic.
- If the input is not technical, politely state that it does not appear to be a technical update.`;

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ history: [] }); // Unauthenticated users get empty history
    }

    const history = await prisma.translation.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ history });
  } catch (error: unknown) {
    console.error("Translation GET error:", error);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { technicalText } = await req.json();

    if (!technicalText?.trim()) {
      return NextResponse.json(
        { error: "Please provide technical text to translate." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return NextResponse.json(
        { error: "Gemini API key not configured. Please add your key to .env.local" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

    const result = await model.generateContent([
      { text: SYSTEM_PROMPT },
      { text: `Translate this technical update to business-friendly language:\n\n"${technicalText}"` },
    ]);

    const translationText = result.response.text();

    // Persist to Supabase if the user is authenticated
    const session = await getServerSession(authOptions);
    let savedRecord = null;
    if (session?.user?.id) {
      savedRecord = await prisma.translation.create({
        data: {
          userId: session.user.id,
          originalText: technicalText,
          translatedText: translationText,
        },
      });
    }

    return NextResponse.json({ 
      translation: translationText,
      id: savedRecord?.id 
    });
  } catch (error: unknown) {
    console.error("Translation API error:", error);
    const message = error instanceof Error ? error.message : "Translation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
