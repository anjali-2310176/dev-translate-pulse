import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

const SYSTEM_PROMPT = `You are DevTranslate Q&A Bot — an elite AI assistant that helps non-technical business stakeholders understand what the engineering team is doing.

You are currently analyzing the live Next.js repository using real-time GitHub data provided in your context window.

Rules:
- Always answer based ONLY on the Retrieved Real-Time Database Context provided below.
- If the context mentions Pull Requests or commits, explain them in plain, empathetic business language.
- Never use raw technical jargon — translate everything.
- Keep answers concise (2-4 paragraphs max).
- If the retrieved context does not contain the answer, say "I don't have that specific information in my current live context." DO NOT make up an answer.`;

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
    const embedModel = genAI.getGenerativeModel({ model: "gemini-embedding-2" });
    const chatModel = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

    // === TRUE RAG PIPELINE: Vector Similarity Search ===
    let ragContext = "";
    try {
      // 1. Generate an embedding of the user's question
      const embedResult = await embedModel.embedContent(message);
      const queryEmbeddingStr = JSON.stringify(embedResult.embedding.values);

      // 2. Perform Cosine Similarity Search (<=>) against pgvector database
      // We retrieve the top 3 most mathematically relevant GitHub PRs
      const relevantChunks = await prisma.$queryRaw<any[]>`
        SELECT "prTitle", "author", "content", 1 - (embedding <=> ${queryEmbeddingStr}::vector) as similarity
        FROM "KnowledgeVector"
        WHERE 1 - (embedding <=> ${queryEmbeddingStr}::vector) > 0.2
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
