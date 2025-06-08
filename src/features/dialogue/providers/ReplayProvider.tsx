import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { DialogueContextObject } from './dialogueContext';
import { DialogueContext, DialogueMessage } from '../types';

interface ReplayProviderProps {
  children: ReactNode;
  className?: string;
  messages?: DialogueMessage[];
  playbackSpeed?: number;
}

export function ReplayProvider({ children, className, messages: initialMessages = [], playbackSpeed = 1 }: ReplayProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<DialogueMessage[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Simulate connection after a short delay
    const timer = setTimeout(() => {
      setIsConnected(true);
      setMessages(initialMessages);
    }, 1000);

    return () => clearTimeout(timer);
  }, [initialMessages]);

  useEffect(() => {
    if (!isConnected || isPaused || currentMessageIndex >= messages.length) return;

    const delay = 2000 / playbackSpeed; // Base delay of 2 seconds between messages
    const timer = setTimeout(() => {
      setCurrentMessageIndex((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [isConnected, isPaused, currentMessageIndex, messages.length, playbackSpeed]);

  const displayedMessages = messages.slice(0, currentMessageIndex + 1);

  const replayContext: DialogueContext = useMemo(
    () => ({
      messages: displayedMessages,
      isPaused,
      togglePause: (state?: boolean) => {
        const newState = state !== undefined ? state : !isPaused;
        setIsPaused(newState);
        return newState;
      },
      status: {
        value: isConnected ? 'connected' : 'connecting',
      },
      connect: async () => {
        setIsConnected(true);
      },
      disconnect: () => {
        setIsConnected(false);
      },
      isMuted,
      mute: () => setIsMuted(true),
      unmute: () => setIsMuted(false),
      micFft: Array(32)
        .fill(0)
        .map(() => Math.random() * 0.5),
    }),
    [displayedMessages, isConnected, isPaused, isMuted],
  );

  return (
    <div className={className}>
      <DialogueContextObject.Provider value={replayContext}>{children}</DialogueContextObject.Provider>
    </div>
  );
}
