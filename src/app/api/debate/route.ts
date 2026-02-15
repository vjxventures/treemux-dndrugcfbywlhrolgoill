import { NextRequest } from "next/server";
import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";

export const runtime = "edge";

interface DebateMessage {
  speaker: "claude" | "gpt4";
  content: string;
  round: number;
}

export async function POST(req: NextRequest) {
  try {
    const { topic, round, model, previousMessages } = await req.json();

    // Build context from previous messages
    const previousDebateContext = (previousMessages as DebateMessage[])
      .map((msg) => {
        const speaker = msg.speaker === "claude" ? "Claude" : "GPT-4";
        return `${speaker} (Round ${msg.round}):\n${msg.content}`;
      })
      .join("\n\n");

    const systemPrompt =
      model === "claude"
        ? `You are Claude Sonnet 4.5, participating in a formal debate. You are arguing FOR the position: "${topic}".

Your role:
- Present clear, logical arguments supporting your position
- Use evidence, examples, and reasoning
- Address counterarguments proactively
- Be persuasive but respectful
- Keep responses concise (2-3 paragraphs max per round)
- This is round ${round} of 3

${previousDebateContext ? `Previous debate:\n${previousDebateContext}\n\nNow respond with your argument for round ${round}.` : `Start the debate with a strong opening argument.`}`
        : `You are GPT-4, participating in a formal debate. You are arguing AGAINST the position: "${topic}".

Your role:
- Present clear, logical arguments opposing the stated position
- Use evidence, examples, and reasoning
- Address counterarguments proactively
- Be persuasive but respectful
- Keep responses concise (2-3 paragraphs max per round)
- This is round ${round} of 3

${previousDebateContext ? `Previous debate:\n${previousDebateContext}\n\nNow respond with your argument for round ${round}.` : `Start the debate with a strong opening argument.`}`;

    const selectedModel = model === "claude"
      ? anthropic("claude-sonnet-4-5-20250929")
      : openai("gpt-4o");

    const result = streamText({
      model: selectedModel,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Present your argument for round ${round}.`,
        },
      ],
      temperature: 0.8,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Debate API error:", error);
    return new Response("Debate failed", { status: 500 });
  }
}
