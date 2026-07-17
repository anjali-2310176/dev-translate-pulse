import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are DevTranslate Flowchart Synthesizer. Your job is to read technical infrastructure files (like docker-compose.yml, Kubernetes manifests, AWS CloudFormation, Terraform configs, or any architecture description) and generate a HIGH-LEVEL BUSINESS JOURNEY MAP using Mermaid.js syntax.

Rules:
- Output ONLY valid Mermaid.js diagram code. No markdown fences, no explanations.
- Use "graph TD" (top-down) or "graph LR" (left-right) layout.
- Translate technical service names into business-friendly labels:
  - "nginx" to "Web Gateway"
  - "redis" to "Speed Cache"  
  - "postgres/mysql" to "Customer Database"
  - "rabbitmq/kafka" to "Message Delivery"
  - "api-server" to "Core Business Logic"
  - etc.
- Use clear, descriptive edge labels showing data flow in plain language.
- Add styling classes for visual distinction (use subgraphs for logical grouping like "Customer-Facing", "Internal Operations", "Data Layer").
- Keep it to 6-15 nodes maximum for readability.
- Do NOT use any emojis in the labels.

Example output format:
graph TD
    A["Customer Website"] --> B["Security Gateway"]
    B --> C["Core Business Logic"]
    C --> D["Customer Database"]
    C --> E["Speed Cache"]
    C --> F["Notification Service"]`;

export async function POST(req: NextRequest) {
  try {
    const { configText } = await req.json();

    if (!configText?.trim()) {
      return NextResponse.json({ error: "Please provide a configuration file to synthesize." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return NextResponse.json({ error: "Gemini API key not configured." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const result = await model.generateContent([
      { text: SYSTEM_PROMPT },
      { text: `Convert this technical infrastructure configuration into a business-friendly Mermaid.js flowchart:\n\n${configText}` },
    ]);

    let mermaidCode = result.response.text().trim();
    // Strip markdown fences if Gemini wraps it
    mermaidCode = mermaidCode.replace(/^```mermaid\n?/i, "").replace(/^```\n?/i, "").replace(/\n?```$/i, "");

    return NextResponse.json({ mermaidCode });
  } catch (error: unknown) {
    console.error("Synthesize API error:", error);
    const message = error instanceof Error ? error.message : "Synthesis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
