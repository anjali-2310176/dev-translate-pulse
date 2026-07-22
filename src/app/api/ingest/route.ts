import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-embedding-2" });

const REPO_OWNER = 'vercel';
const REPO_NAME = 'next.js';

export async function POST(req: Request) {
  try {
    const token = process.env.GITHUB_PAT;
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'DevTranslate-RAG'
    };

    if (token) {
      headers['Authorization'] = `token ${token}`;
    }

    // 1. Fetch recent PRs from GitHub
    console.log(`Fetching PRs from ${REPO_OWNER}/${REPO_NAME}...`);
    const prRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/pulls?state=closed&per_page=50`, { headers });
    
    if (!prRes.ok) {
      throw new Error(`GitHub API Error: ${await prRes.text()}`);
    }

    const prs = await prRes.json();
    
    // Clear old knowledge base for demo simplicity
    await prisma.$executeRaw`TRUNCATE TABLE "KnowledgeVector"`;

    let ingestedCount = 0;

    // 2. Generate Embeddings & Store in pgvector
    for (const pr of prs) {
      const bodyText = pr.body ? pr.body.substring(0, 3000) : "No description provided.";
      const content = `Title: ${pr.title}\n\nDescription: ${bodyText}`;
      
      try {
        // Generate Vector Embedding
        const result = await model.embedContent(content);
        const vectorString = JSON.stringify(result.embedding.values);
        const id = Math.random().toString(36).substring(7);

        // Prisma parameter binding needs the array as a string for pgvector
        await prisma.$executeRaw`
          INSERT INTO "KnowledgeVector" ("id", "createdAt", "prNumber", "prTitle", "prUrl", "author", "content", "embedding")
          VALUES (
            ${id}, 
            NOW(), 
            ${pr.number}, 
            ${pr.title}, 
            ${pr.html_url}, 
            ${pr.user?.login || 'unknown'}, 
            ${content}, 
            ${vectorString}::vector
          )
        `;
        ingestedCount++;
      } catch (embedError: any) {
        console.error(`Failed to embed PR #${pr.number}:`, embedError);
        throw embedError; // Throw so we can see the exact error in the curl response!
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully generated and ingested ${ingestedCount} Pull Request embeddings into the Vector Database.`
    });

  } catch (error: any) {
    console.error("Ingestion Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
