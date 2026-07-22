import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

const SYSTEM_PROMPT = `You are DevTranslate Q&A Bot — a friendly, knowledgeable assistant that helps non-technical business stakeholders understand what the engineering team is doing.

You have access to the following project context:
- Project: "Apex Commerce Platform" — a next-generation e-commerce platform
- Current Sprint: Sprint 14 — "Payment & Security Hardening"
- Active team: 6 engineers, 1 tech lead, 1 DevOps engineer
- Recent work: migrating user auth to JWT, upgrading payment gateway to Stripe v3, database migration to PostgreSQL 16, implementing real-time inventory tracking
- Upcoming: Mobile app beta launch (target: 3 weeks), Analytics dashboard v2
- Blockers: Payment gateway sandbox downtime (3rd party), push notification vendor API change
- Tech stack: Next.js, Node.js, PostgreSQL, Redis, AWS, Docker

Rules:
- Always answer in plain, empathetic business language.
- Never use raw technical jargon — translate everything.
- When explaining delays, be honest but frame them positively (what it protects, why it matters).
- Keep answers concise (2-4 paragraphs max).
- Use analogies when helpful.
- If you don't know something, say so honestly.`;

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ sessions: [] });
    }

    const sessions = await prisma.chatSession.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      take: 10,
    });

    return NextResponse.json({ sessions });
  } catch (error: unknown) {
    console.error("Chat GET error:", error);
    return NextResponse.json({ error: "Failed to fetch chat sessions" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { message, history, sessionId } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Please provide a message." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return NextResponse.json(
        { error: "Gemini API key not configured. Please add your key to .env.local" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const embedModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const chatModel = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

    // === TRUE RAG PIPELINE: Vector Similarity Search ===
    let ragContext = "";
    try {
      // 1. Generate an embedding of the user's question
      const embedResult = await embedModel.embedContent(message);
      const queryEmbedding = embedResult.embedding.values;

      // 2. Perform Cosine Similarity Search (<=>) against pgvector database
      // We retrieve the top 3 most mathematically relevant GitHub PRs
      const relevantChunks = await prisma.$queryRaw<any[]>`
        SELECT "prTitle", "author", "content", 1 - (embedding <=> ${queryEmbedding}::vector) as similarity
        FROM "KnowledgeChunk"
        WHERE 1 - (embedding <=> ${queryEmbedding}::vector) > 0.5
        ORDER BY similarity DESC
        LIMIT 3
      `;

      if (relevantChunks && relevantChunks.length > 0) {
        ragContext = "\\n\\n### Retrieved Real-Time Database Context:\\n";
        relevantChunks.forEach((chunk, index) => {
          ragContext += `[PR ${index + 1} by ${chunk.author}]: ${chunk.content}\\n`;
        });
      } else {
        ragContext = "\\n\\n### Retrieved Real-Time Database Context:\\n(No directly matching GitHub Pull Requests found in the vector database).";
      }
    } catch (ragError) {
      console.error("RAG Pipeline failed, falling back to standard prompt:", ragError);
    }
    // =================================================

    const chatHistory = (history || []).map((msg: { role: string; text: string }) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    const chat = chatModel.startChat({
      history: [
        { role: "user", parts: [{ text: "System instructions: " + SYSTEM_PROMPT + ragContext }] },
        { role: "model", parts: [{ text: "Understood! I'm ready to help explain your project's engineering work in clear, business-friendly language based on the mathematical vector context provided. Ask me anything!" }] },
        ...chatHistory,
      ],
    });

    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    // Persist to Supabase if the user is authenticated
    const authSession = await getServerSession(authOptions);
    let finalSessionId = sessionId;
    
    if (authSession?.user?.id) {
      const updatedHistory = [...(history || []), { role: "user", text: message }, { role: "model", text: reply }];
      
      if (sessionId) {
        // Update existing session
        await prisma.chatSession.update({
          where: { id: sessionId },
          data: { history: JSON.stringify(updatedHistory) },
        });
      } else {
        // Create new session
        const title = message.length > 30 ? message.substring(0, 30) + "..." : message;
        const newSession = await prisma.chatSession.create({
          data: {
            userId: authSession.user.id,
            title,
            history: JSON.stringify(updatedHistory),
          },
        });
        finalSessionId = newSession.id;
      }
    }

    return NextResponse.json({ reply, sessionId: finalSessionId });
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    const message = error instanceof Error ? error.message : "Chat failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
