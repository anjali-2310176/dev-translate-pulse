import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are DevTranslate Digest Generator. You create polished, business-friendly weekly status digests suitable for Slack or Microsoft Teams channels.

Format the digest as follows (use markdown):
1. **Weekly Status Brief** with the current date range
2. **Features Shipped**: 3-5 bullet points of what was completed, in plain business language
3. **Milestone Progress**: Brief update on key milestones
4. **Blockers & Risks**: Any active blockers with their business impact
5. **Next Week's Focus**: What the team will be working on

Rules:
- No technical jargon. Translate everything.
- Keep it concise. Stakeholders should read this in under 2 minutes.
- Do NOT use any emojis.
- Tone: professional, clear, action-oriented.
- End with a one-line "Bottom Line" summary.`;

export async function POST(req: NextRequest) {
  try {
    const { includeJira, includeGitHub } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return NextResponse.json({ error: "Gemini API key not configured. Please update .env.local" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    let context = `Sprint 14 highlights:\n`;
    
    if (includeGitHub) {
      context += `- Merged 23 PRs this week
- Fixed race condition in Redis cache hydration (PR #402)
- Completed JWT token rotation implementation
- Migrated 3 microservices to pgBouncer connection pooling
- CI/CD pipeline migrated from Jenkins to GitHub Actions\n`;
    }

    if (includeJira) {
      context += `Blockers:
- Stripe sandbox environment down for maintenance (est. 2 days)
- Push notification vendor changed their API spec
Team velocity: 45 story points (up from 38 last sprint)
Sprint goal completion: 78%`;
    }

    if (!includeGitHub && !includeJira) {
      context = "No data sources were selected for this digest.";
    }

    const result = await model.generateContent([
      { text: SYSTEM_PROMPT },
      { text: `Generate a weekly status digest based on the following engineering activity:\n\n${context}` },
    ]);

    const digest = result.response.text();

    return NextResponse.json({ digest });
  } catch (error: unknown) {
    console.error("Digest API error:", error);
    const message = error instanceof Error ? error.message : "Digest generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
