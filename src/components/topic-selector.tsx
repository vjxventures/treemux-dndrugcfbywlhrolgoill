'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

interface TopicSelectorProps {
  onStartDebate: (topic: string, side: 'for' | 'against') => void;
}

const SUGGESTED_TOPICS = [
  'Artificial intelligence will create more jobs than it destroys',
  'Social media has a net negative impact on society',
  'Remote work should be the default for all office jobs',
  'Nuclear energy is essential for fighting climate change',
  'Universal basic income should be implemented globally',
  'Space exploration funding should be redirected to Earth problems',
];

export function TopicSelector({ onStartDebate }: TopicSelectorProps) {
  const [customTopic, setCustomTopic] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedSide, setSelectedSide] = useState<'for' | 'against' | null>(null);

  const handleStart = () => {
    const topic = selectedTopic || customTopic;
    if (topic && selectedSide) {
      onStartDebate(topic, selectedSide);
    }
  };

  const currentTopic = selectedTopic || customTopic;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <Card className="w-full max-w-3xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <CardTitle className="text-4xl">DebateGPT</CardTitle>
          </div>
          <CardDescription className="text-lg">
            Practice debating against AI opponents and get real-time feedback on your arguments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Choose Topic */}
          <div>
            <h3 className="text-lg font-semibold mb-3">1. Choose a Topic</h3>
            <div className="space-y-3">
              <Input
                placeholder="Enter your own topic..."
                value={customTopic}
                onChange={(e) => {
                  setCustomTopic(e.target.value);
                  setSelectedTopic(null);
                }}
                className="text-base"
              />
              <div className="text-sm text-muted-foreground text-center">or choose a suggested topic</div>
              <div className="grid gap-2">
                {SUGGESTED_TOPICS.map((topic) => (
                  <Button
                    key={topic}
                    variant={selectedTopic === topic ? 'default' : 'outline'}
                    className="h-auto py-3 px-4 text-left justify-start whitespace-normal"
                    onClick={() => {
                      setSelectedTopic(topic);
                      setCustomTopic('');
                    }}
                  >
                    {topic}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 2: Choose Side */}
          {currentTopic && (
            <div className="animate-in slide-in-from-bottom-4">
              <h3 className="text-lg font-semibold mb-3">2. Choose Your Side</h3>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={selectedSide === 'for' ? 'default' : 'outline'}
                  size="lg"
                  className="h-24 text-lg"
                  onClick={() => setSelectedSide('for')}
                >
                  <div className="text-center">
                    <div className="font-bold mb-1">Argue FOR</div>
                    <div className="text-xs opacity-80">Support this position</div>
                  </div>
                </Button>
                <Button
                  variant={selectedSide === 'against' ? 'default' : 'outline'}
                  size="lg"
                  className="h-24 text-lg"
                  onClick={() => setSelectedSide('against')}
                >
                  <div className="text-center">
                    <div className="font-bold mb-1">Argue AGAINST</div>
                    <div className="text-xs opacity-80">Oppose this position</div>
                  </div>
                </Button>
              </div>
            </div>
          )}

          {/* Start Button */}
          {currentTopic && selectedSide && (
            <div className="animate-in slide-in-from-bottom-4">
              <Button
                size="lg"
                className="w-full text-lg h-14"
                onClick={handleStart}
              >
                Start Debate
              </Button>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="text-sm font-medium mb-2">Your debate:</div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Topic:</span> {currentTopic}
                </div>
                <div className="text-sm mt-1">
                  <span className="text-muted-foreground">Position:</span>{' '}
                  <Badge variant={selectedSide === 'for' ? 'default' : 'destructive'}>
                    {selectedSide}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Features */}
          <div className="pt-6 border-t">
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <div className="font-semibold">AI Opponent</div>
                <div className="text-muted-foreground">Argues against you</div>
              </div>
              <div>
                <div className="font-semibold">Real-time Feedback</div>
                <div className="text-muted-foreground">Judge analyzes arguments</div>
              </div>
              <div>
                <div className="font-semibold">Improve Skills</div>
                <div className="text-muted-foreground">Track performance</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
