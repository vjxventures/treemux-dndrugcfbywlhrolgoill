import { streamText, convertToModelMessages, UIMessage } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages, topic, userSide, mode } = await req.json();

  if (mode === 'opponent') {
    // AI opponent responds to user's argument
    const opponentSide = userSide === 'for' ? 'against' : 'for';

    const result = streamText({
      model: anthropic('claude-3-5-sonnet-20241022'),
      system: `You are a skilled debater arguing ${opponentSide} the topic: "${topic}".

Your role:
- Present strong, logical arguments ${opponentSide} the topic
- Use evidence, examples, and reasoning
- Directly address and counter your opponent's points
- Be respectful but assertive
- Keep responses concise (2-4 paragraphs)
- Don't repeat yourself - build on previous arguments

Remember: You are in a real-time debate. Make your points count!`,
      messages: await convertToModelMessages(messages as UIMessage[]),
      temperature: 0.8,
    });

    return result.toUIMessageStreamResponse();
  } else if (mode === 'judge') {
    // AI judge analyzes the latest user argument
    const result = streamText({
      model: openai('gpt-4o'),
      system: `You are an expert debate judge analyzing arguments in a debate about: "${topic}".

For each argument, provide:
1. **Strength Score** (1-10): Overall argument quality
2. **Key Strengths**: What worked well (1-2 points)
3. **Weaknesses**: Areas for improvement (1-2 points)
4. **Logical Fallacies**: Any detected (if present)
5. **Tip**: One actionable suggestion

Be constructive, specific, and concise. Format your response in clear sections.`,
      messages: await convertToModelMessages(messages as UIMessage[]),
      temperature: 0.3,
    });

    return result.toTextStreamResponse();
  }

  return new Response('Invalid mode', { status: 400 });
}
