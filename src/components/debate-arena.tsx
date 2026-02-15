'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send, Zap, Brain, Trophy } from 'lucide-react';

interface DebateArenaProps {
  topic: string;
  userSide: 'for' | 'against';
  onBack: () => void;
}

interface Analysis {
  score?: number;
  content: string;
}

export function DebateArena({ topic, userSide, onBack }: DebateArenaProps) {
  const [userInput, setUserInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<Analysis | null>(null);
  const [allAnalyses, setAllAnalyses] = useState<Analysis[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/debate',
      body: { topic, userSide, mode: 'opponent' },
    }),
  });

  const isLoading = status === 'streaming' || status === 'submitted';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentAnalysis]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const userMessage = userInput;
    setUserInput('');

    // Add user message to debate
    await sendMessage({ text: userMessage });

    // Analyze user's argument
    setIsAnalyzing(true);
    setCurrentAnalysis(null);

    try {
      const response = await fetch('/api/debate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          userSide,
          mode: 'judge',
          messages: [
            {
              role: 'user',
              content: `Analyze this argument:\n\n${userMessage}`,
            },
          ],
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let analysisText = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('0:')) {
              const content = line.slice(2).replace(/^"(.*)"$/, '$1');
              analysisText += content;

              // Extract score if present
              const scoreMatch = analysisText.match(/(?:Strength Score|Score)[:\s]*(\d+)\/10/i);
              const score = scoreMatch ? parseInt(scoreMatch[1]) : undefined;

              setCurrentAnalysis({
                content: analysisText,
                score,
              });
            }
          }
        }
      }

      // Save completed analysis
      if (analysisText) {
        const scoreMatch = analysisText.match(/(?:Strength Score|Score)[:\s]*(\d+)\/10/i);
        const score = scoreMatch ? parseInt(scoreMatch[1]) : undefined;
        const analysis = { content: analysisText, score };
        setAllAnalyses((prev) => [...prev, analysis]);
      }
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const opponentMessages = messages.filter((m) => m.role === 'assistant');
  const userMessages = messages.filter((m) => m.role === 'user');

  const averageScore =
    allAnalyses.length > 0
      ? (
          allAnalyses.reduce((sum, a) => sum + (a.score || 0), 0) / allAnalyses.length
        ).toFixed(1)
      : null;

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{topic}</h2>
            <p className="text-sm text-muted-foreground">
              You are arguing <Badge variant={userSide === 'for' ? 'default' : 'destructive'}>{userSide}</Badge>
            </p>
          </div>
          <div className="flex items-center gap-4">
            {averageScore && (
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="text-2xl font-bold">{averageScore}</span>
                <span className="text-sm text-muted-foreground">/10 avg</span>
              </div>
            )}
            <Button variant="outline" onClick={onBack}>
              End Debate
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="debate" className="h-full flex flex-col">
          <TabsList className="mx-auto mt-2">
            <TabsTrigger value="debate">
              <Zap className="h-4 w-4 mr-2" />
              Live Debate
            </TabsTrigger>
            <TabsTrigger value="analysis">
              <Brain className="h-4 w-4 mr-2" />
              Analysis ({allAnalyses.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="debate" className="flex-1 overflow-hidden mt-4">
            <div className="max-w-7xl mx-auto h-full flex flex-col px-4 pb-4">
              <ScrollArea ref={scrollRef} className="flex-1 pr-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <Card className="max-w-md">
                      <CardHeader>
                        <CardTitle>Ready to Debate?</CardTitle>
                        <CardDescription>
                          Make your opening argument below. The AI opponent will respond, and a judge will analyze your performance.
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div key={index}>
                        <Card className={message.role === 'user' ? 'border-primary' : 'border-muted'}>
                          <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                              {message.role === 'user' ? (
                                <>
                                  <Badge variant="default">You</Badge>
                                  <span className="text-xs text-muted-foreground">
                                    Arguing {userSide}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Badge variant="secondary">AI Opponent</Badge>
                                  <span className="text-xs text-muted-foreground">
                                    Arguing {userSide === 'for' ? 'against' : 'for'}
                                  </span>
                                </>
                              )}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="whitespace-pre-wrap">
                              {message.parts.map((part, partIndex) =>
                                part.type === 'text' ? (
                                  <span key={partIndex}>{part.text}</span>
                                ) : null
                              )}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Show analysis after user message */}
                        {message.role === 'user' && index === messages.length - 1 && (currentAnalysis || isAnalyzing) && (
                          <Card className="mt-2 border-blue-500/50 bg-blue-500/5">
                            <CardHeader>
                              <CardTitle className="text-sm flex items-center gap-2">
                                <Brain className="h-4 w-4" />
                                Judge Analysis
                                {currentAnalysis?.score && (
                                  <Badge variant="outline">{currentAnalysis.score}/10</Badge>
                                )}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              {isAnalyzing && !currentAnalysis ? (
                                <p className="text-sm text-muted-foreground">Analyzing your argument...</p>
                              ) : (
                                <div className="text-sm whitespace-pre-wrap">{currentAnalysis?.content}</div>
                              )}
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="mt-4">
                <div className="flex gap-2">
                  <Textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type your argument here..."
                    className="min-h-[100px]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey) {
                        handleSubmit(e);
                      }
                    }}
                    disabled={isLoading || isAnalyzing}
                  />
                  <Button
                    type="submit"
                    size="lg"
                    disabled={!userInput.trim() || isLoading || isAnalyzing}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Press Ctrl+Enter to send
                </p>
              </form>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="flex-1 overflow-hidden mt-4">
            <div className="max-w-4xl mx-auto h-full px-4 pb-4">
              <ScrollArea className="h-full pr-4">
                {allAnalyses.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <Card className="max-w-md">
                      <CardHeader>
                        <CardTitle>No Analyses Yet</CardTitle>
                        <CardDescription>
                          Make arguments in the debate tab to see detailed performance analysis here.
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allAnalyses.map((analysis, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            Argument #{index + 1}
                            {analysis.score && (
                              <Badge variant={analysis.score >= 7 ? 'default' : 'secondary'}>
                                {analysis.score}/10
                              </Badge>
                            )}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm whitespace-pre-wrap">{analysis.content}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
