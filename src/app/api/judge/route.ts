import { NextRequest } from "next/server";
import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

export const runtime = "edge";

interface DebateMessage {
  speaker: "claude" | "gpt4";
  content: string;
  round: number;
}

export async function POST(req: NextRequest) {
  try {
    const { topic, messages } = await req.json();

    const debateTranscript = (messages as DebateMessage[])
      .map((msg) => {
        const speaker = msg.speaker === "claude" ? "Claude Sonnet 4.5" : "GPT-4";
        return `${speaker} (Round ${msg.round}):\n${msg.content}`;
      })
      .join("\n\n---\n\n");

    const systemPrompt = `You are an expert debate judge. Analyze the following debate objectively and provide:

1. Overall winner and why (be decisive but fair)
2. Key strengths of each debater
3. Quality of arguments and evidence
4. Persuasiveness and rhetorical skill
5. How well each addressed counterarguments

Be analytical, specific, and cite examples from the debate. Keep your analysis concise but insightful.

Topic: "${topic}"

Debate Transcript:
${debateTranscript}`;

    const result = streamText({
      model: anthropic("claude-sonnet-4-5-20250929"),
      messages: [
        {
          role: "user",
          content: systemPrompt,
        },
      ],
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Judge API error:", error);
    return new Response("Judge analysis failed", { status: 500 });
  }
}
