"use client";

import { useState } from "react";
import { DebateArena } from "@/components/DebateArena";
import { TopicSelector } from "@/components/TopicSelector";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function Home() {
  const [topic, setTopic] = useState<string>("");
  const [debateStarted, setDebateStarted] = useState(false);

  const handleStartDebate = (selectedTopic: string) => {
    setTopic(selectedTopic);
    setDebateStarted(true);
  };

  const handleReset = () => {
    setDebateStarted(false);
    setTopic("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-purple-400" />
            <h1 className="text-5xl font-bold text-white">DebateArena</h1>
            <Sparkles className="w-10 h-10 text-purple-400" />
          </div>
          <p className="text-xl text-purple-200">
            Watch AI models debate each other in real-time
          </p>
        </header>

        {!debateStarted ? (
          <TopicSelector onStartDebate={handleStartDebate} />
        ) : (
          <div>
            <div className="mb-6 text-center">
              <Button
                onClick={handleReset}
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-white/30"
              >
                ← New Debate
              </Button>
            </div>
            <DebateArena topic={topic} />
          </div>
        )}
      </div>
    </main>
  );
}
