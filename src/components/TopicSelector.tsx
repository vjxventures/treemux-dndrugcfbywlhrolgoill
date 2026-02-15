"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SUGGESTED_TOPICS = [
  "AI will create more jobs than it destroys",
  "Privacy is more important than security",
  "Remote work is better than office work",
  "Social media does more harm than good",
  "Universal basic income should be implemented globally",
  "Space exploration should be prioritized over ocean exploration",
];

interface TopicSelectorProps {
  onStartDebate: (topic: string) => void;
}

export function TopicSelector({ onStartDebate }: TopicSelectorProps) {
  const [customTopic, setCustomTopic] = useState("");

  const handleTopicSelect = (topic: string) => {
    if (topic.trim()) {
      onStartDebate(topic);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Choose a Debate Topic</CardTitle>
          <CardDescription className="text-purple-200">
            Select a suggested topic or create your own
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold mb-3 text-purple-200">
              Suggested Topics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SUGGESTED_TOPICS.map((topic) => (
                <Button
                  key={topic}
                  onClick={() => handleTopicSelect(topic)}
                  variant="outline"
                  className="h-auto py-4 px-4 text-left justify-start bg-white/5 hover:bg-white/15 border-white/30 text-white"
                >
                  <span className="line-clamp-2">{topic}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-white/20" />
              <span className="text-sm text-purple-200">OR</span>
              <div className="h-px flex-1 bg-white/20" />
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2 text-purple-200">
                Create Your Own Topic
              </h3>
              <Textarea
                placeholder="Enter a debate topic (e.g., 'Technology companies should be broken up')"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                className="bg-white/5 border-white/30 text-white placeholder:text-white/50 min-h-[100px]"
              />
              <Button
                onClick={() => handleTopicSelect(customTopic)}
                disabled={!customTopic.trim()}
                className="mt-3 w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                Start Debate
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-4 border-t border-white/20">
            <Badge variant="secondary" className="bg-white/10 text-white">
              Claude Sonnet 4.5
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-white">
              GPT-4
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-white">
              AI Judge
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
