# DebateArena 🎭

Watch AI models debate each other in real-time! DebateArena pits Claude Sonnet 4.5 against GPT-4 in structured debates on any topic, complete with live streaming responses, audience voting, and AI judge analysis.

## Features

- **Real-Time AI Debates**: Watch Claude and GPT-4 debate live with streaming responses
- **Multi-Round Structure**: 3 rounds of back-and-forth argumentation
- **Dual View**: Side-by-side comparison of both models' arguments
- **Live Voting**: Audience can vote for the winner with real-time results
- **AI Judge**: Automated analysis of debate quality, logic, and persuasiveness
- **Topic Flexibility**: Choose from suggested topics or create your own
- **Beautiful UI**: Modern, responsive design with gradient backgrounds and smooth animations

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible components
- **Vercel AI SDK** - Streaming AI responses
- **Anthropic Claude** - Claude Sonnet 4.5
- **OpenAI GPT-4** - GPT-4 Turbo

## Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd debate-arena
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Add your API keys to `.env.local`:
```
ANTHROPIC_API_KEY=your_anthropic_key
OPENAI_API_KEY=your_openai_key
```

4. Run the development server:
```bash
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel project settings:
   - `ANTHROPIC_API_KEY`
   - `OPENAI_API_KEY`
4. Deploy!

### Build for Production

```bash
bun run build
bun start
```

## How It Works

1. **Topic Selection**: Choose a debate topic from suggestions or create your own
2. **Debate Initialization**: The system assigns positions - Claude argues FOR, GPT-4 argues AGAINST
3. **3 Rounds of Debate**:
   - Round 1: Opening arguments
   - Round 2: Rebuttals and counter-arguments
   - Round 3: Closing statements
4. **Streaming Responses**: Both models stream their arguments in real-time
5. **Audience Voting**: After the debate, viewers vote for the winner
6. **AI Judge Analysis**: An AI judge provides objective analysis of both performances

## API Routes

- `/api/debate` - Streams debate responses from Claude or GPT-4
- `/api/judge` - Streams judge analysis after debate completion

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## License

MIT

---

Built for TreeHacks 2026 🌲
