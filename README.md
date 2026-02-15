# DebateGPT

An AI-powered debate training platform where users practice debating against intelligent AI opponents and receive real-time feedback on their arguments.

## Features

- **AI Opponent**: Debate against Claude (Anthropic) which argues the opposing position with evidence-based reasoning
- **Real-time Judge**: GPT-4 analyzes each of your arguments, providing scores, strengths, weaknesses, and actionable tips
- **Performance Tracking**: View average scores and detailed analysis for all your arguments
- **Multiple Topics**: Choose from suggested debate topics or create your own
- **Streaming Responses**: Real-time streaming for natural conversation flow

## Tech Stack

- **Next.js 16** with App Router and Turbopack
- **AI SDK v6** (@ai-sdk/react) for streaming AI responses
- **Anthropic Claude 3.5 Sonnet** as debate opponent
- **OpenAI GPT-4o** as argument judge
- **shadcn/ui** for beautiful, accessible UI components
- **Tailwind CSS** for styling
- **TypeScript** for type safety

## Getting Started

1. Clone and install dependencies:
```bash
bun install
```

2. Set up environment variables:
Create a `.env.local` file with your API keys:
```bash
ANTHROPIC_API_KEY=your_anthropic_key
OPENAI_API_KEY=your_openai_key
```

3. Run the development server:
```bash
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## How It Works

1. **Choose a Topic**: Select from suggested topics or enter your own
2. **Pick Your Side**: Decide whether to argue FOR or AGAINST the topic
3. **Start Debating**: Make your arguments and receive:
   - AI opponent responses (Claude argues the opposite side)
   - Judge analysis (GPT-4 evaluates your argument quality)
4. **Track Progress**: View your average score and detailed feedback for each argument

## Architecture

- **Frontend**: React components using AI SDK's `useChat` hook for streaming
- **API Route**: Edge runtime endpoint handling dual AI model streaming
- **Multi-AI System**:
  - Claude 3.5 Sonnet: Generates opposing arguments
  - GPT-4o: Analyzes argument quality with structured feedback

## Built For TreeHacks 2026

Created to demonstrate:
- Advanced AI integration with multiple models
- Real-time streaming user interfaces
- Practical educational application of LLMs
- Type-safe full-stack TypeScript development
