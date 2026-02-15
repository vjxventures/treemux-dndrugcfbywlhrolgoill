'use client';

import { useState } from 'react';
import { TopicSelector } from '@/components/topic-selector';
import { DebateArena } from '@/components/debate-arena';

export default function Home() {
  const [debateState, setDebateState] = useState<{
    active: boolean;
    topic: string;
    userSide: 'for' | 'against';
  } | null>(null);

  const handleStartDebate = (topic: string, side: 'for' | 'against') => {
    setDebateState({ active: true, topic, userSide: side });
  };

  const handleEndDebate = () => {
    setDebateState(null);
  };

  if (debateState?.active) {
    return (
      <DebateArena
        topic={debateState.topic}
        userSide={debateState.userSide}
        onBack={handleEndDebate}
      />
    );
  }

  return <TopicSelector onStartDebate={handleStartDebate} />;
}
