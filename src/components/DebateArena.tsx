"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ThumbsUp, Brain, Loader2 } from "lucide-react";

interface DebateArenaProps {
  topic: string;
}

interface DebateMessage {
  speaker: "claude" | "gpt4";
  content: string;
  round: number;
}

interface VoteState {
  claude: number;
  gpt4: number;
}

export function DebateArena({ topic }: DebateArenaProps) {
  const [messages, setMessages] = useState<DebateMessage[]>([]);
  const [isDebating, setIsDebating] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [votes, setVotes] = useState<VoteState>({ claude: 0, gpt4: 0 });
  const [userVoted, setUserVoted] = useState<"claude" | "gpt4" | null>(null);
  const [judgeAnalysis, setJudgeAnalysis] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    startDebate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic]);

  const startDebate = async () => {
    setIsDebating(true);
    setMessages([]);
    setCurrentRound(0);
    setJudgeAnalysis("");

    try {
      // Run 3 rounds of debate
      for (let round = 1; round <= 3; round++) {
        setCurrentRound(round);

        // Claude's turn
        const claudeResponse = await fetch("/api/debate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic,
            round,
            model: "claude",
            previousMessages: messages,
          }),
        });

        if (!claudeResponse.ok) throw new Error("Claude debate failed");

        const claudeReader = claudeResponse.body?.getReader();
        const claudeDecoder = new TextDecoder();
        let claudeContent = "";

        if (claudeReader) {
          while (true) {
            const { done, value } = await claudeReader.read();
            if (done) break;
            const chunk = claudeDecoder.decode(value);
            claudeContent += chunk;
            setMessages((prev) => {
              const existing = prev.find(
                (m) => m.speaker === "claude" && m.round === round
              );
              if (existing) {
                return prev.map((m) =>
                  m.speaker === "claude" && m.round === round
                    ? { ...m, content: claudeContent }
                    : m
                );
              }
              return [
                ...prev,
                { speaker: "claude", content: claudeContent, round },
              ];
            });
          }
        }

        // Small delay between speakers
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // GPT-4's turn
        const gpt4Response = await fetch("/api/debate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic,
            round,
            model: "gpt4",
            previousMessages: [...messages, { speaker: "claude", content: claudeContent, round }],
          }),
        });

        if (!gpt4Response.ok) throw new Error("GPT-4 debate failed");

        const gpt4Reader = gpt4Response.body?.getReader();
        const gpt4Decoder = new TextDecoder();
        let gpt4Content = "";

        if (gpt4Reader) {
          while (true) {
            const { done, value } = await gpt4Reader.read();
            if (done) break;
            const chunk = gpt4Decoder.decode(value);
            gpt4Content += chunk;
            setMessages((prev) => {
              const existing = prev.find(
                (m) => m.speaker === "gpt4" && m.round === round
              );
              if (existing) {
                return prev.map((m) =>
                  m.speaker === "gpt4" && m.round === round
                    ? { ...m, content: gpt4Content }
                    : m
                );
              }
              return [
                ...prev,
                { speaker: "gpt4", content: gpt4Content, round },
              ];
            });
          }
        }

        // Delay before next round
        if (round < 3) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }

      // Get judge analysis after debate
      setIsAnalyzing(true);
      const judgeResponse = await fetch("/api/judge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, messages }),
      });

      if (judgeResponse.ok) {
        const judgeReader = judgeResponse.body?.getReader();
        const judgeDecoder = new TextDecoder();
        let analysis = "";

        if (judgeReader) {
          while (true) {
            const { done, value } = await judgeReader.read();
            if (done) break;
            const chunk = judgeDecoder.decode(value);
            analysis += chunk;
            setJudgeAnalysis(analysis);
          }
        }
      }
      setIsAnalyzing(false);
    } catch (error) {
      console.error("Debate error:", error);
    } finally {
      setIsDebating(false);
    }
  };

  const handleVote = (model: "claude" | "gpt4") => {
    if (userVoted) return;
    setUserVoted(model);
    setVotes((prev) => ({ ...prev, [model]: prev[model] + 1 }));
  };

  const totalVotes = votes.claude + votes.gpt4;
  const claudePercentage = totalVotes > 0 ? (votes.claude / totalVotes) * 100 : 50;
  const gpt4Percentage = totalVotes > 0 ? (votes.gpt4 / totalVotes) * 100 : 50;

  return (
    <div className="space-y-6">
      {/* Topic Display */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 border-none text-white">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Debate Topic: {topic}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Debate Progress */}
      <div className="text-center text-white">
        <p className="text-lg mb-2">
          {isDebating ? `Round ${currentRound} of 3` : "Debate Complete"}
        </p>
        <Progress value={(currentRound / 3) * 100} className="h-2" />
      </div>

      {/* Debate Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Claude Side */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-purple-600 text-white text-lg px-4 py-2">
              Claude Sonnet 4.5
            </Badge>
          </div>
          {[1, 2, 3].map((round) => {
            const msg = messages.find(
              (m) => m.speaker === "claude" && m.round === round
            );
            return (
              <Card
                key={round}
                className={`bg-white/10 backdrop-blur-md border-purple-400/50 ${
                  msg ? "opacity-100" : "opacity-30"
                }`}
              >
                <CardHeader>
                  <CardTitle className="text-purple-300 text-sm">
                    Round {round}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white whitespace-pre-wrap">
                    {msg?.content || (round === currentRound && isDebating ? "..." : "")}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* GPT-4 Side */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-blue-600 text-white text-lg px-4 py-2">
              GPT-4
            </Badge>
          </div>
          {[1, 2, 3].map((round) => {
            const msg = messages.find(
              (m) => m.speaker === "gpt4" && m.round === round
            );
            return (
              <Card
                key={round}
                className={`bg-white/10 backdrop-blur-md border-blue-400/50 ${
                  msg ? "opacity-100" : "opacity-30"
                }`}
              >
                <CardHeader>
                  <CardTitle className="text-blue-300 text-sm">
                    Round {round}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white whitespace-pre-wrap">
                    {msg?.content || (round === currentRound && isDebating ? "..." : "")}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Voting */}
      {!isDebating && messages.length > 0 && (
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-center">
              Who Won the Debate?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => handleVote("claude")}
                disabled={!!userVoted}
                className={`h-20 text-lg ${
                  userVoted === "claude"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-white/10 hover:bg-white/20"
                } text-white`}
              >
                <ThumbsUp className="mr-2" />
                Claude
              </Button>
              <Button
                onClick={() => handleVote("gpt4")}
                disabled={!!userVoted}
                className={`h-20 text-lg ${
                  userVoted === "gpt4"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-white/10 hover:bg-white/20"
                } text-white`}
              >
                <ThumbsUp className="mr-2" />
                GPT-4
              </Button>
            </div>

            {totalVotes > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-white text-sm">
                  <span>Claude: {claudePercentage.toFixed(1)}%</span>
                  <span>GPT-4: {gpt4Percentage.toFixed(1)}%</span>
                </div>
                <div className="relative h-4 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-purple-600 transition-all"
                    style={{ width: `${claudePercentage}%` }}
                  />
                  <div
                    className="absolute right-0 top-0 h-full bg-blue-600 transition-all"
                    style={{ width: `${gpt4Percentage}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Judge Analysis */}
      {(judgeAnalysis || isAnalyzing) && (
        <Card className="bg-gradient-to-r from-amber-600 to-orange-600 border-none text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-6 h-6" />
              AI Judge Analysis
              {isAnalyzing && <Loader2 className="w-4 h-4 animate-spin" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{judgeAnalysis}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
