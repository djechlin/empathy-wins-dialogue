import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useStopwatch } from 'react-timer-hook';
import { DialogueContext, DialogueMessage } from '../types';
import { DialogueContextObject } from './DialogueContextObject';

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
  const { seconds: secondsElapsed, pause, start, isRunning } = useStopwatch({ autoStart: false });

  useEffect(() => {
    // Simulate connection after a short delay
    const timer = setTimeout(() => {
      setIsConnected(true);
      setMessages(initialMessages);
    }, 1000);

    return () => clearTimeout(timer);
  }, [initialMessages]);

  useEffect(() => {
    if (!isConnected || !isRunning || currentMessageIndex >= messages.length) return;

    const delay = 2000 / playbackSpeed; // Base delay of 2 seconds between messages
    const timer = setTimeout(() => {
      setCurrentMessageIndex((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [isConnected, isRunning, currentMessageIndex, messages.length, playbackSpeed]);

  const displayedMessages = messages.slice(0, currentMessageIndex + 1);

  const replayContext: DialogueContext = useMemo(
    () => ({
      messages: displayedMessages,
      isPaused: !isRunning,
      togglePause: (state?: boolean) => {
        const newState = state !== undefined ? state : isRunning;
        if (newState) {
          pause();
        } else {
          start();
        }
        return newState;
      },
      status: isConnected ? 'connected' : 'connecting',
      connect: async () => {
        setIsConnected(true);
        start();
      },
      disconnect: () => {
        setIsConnected(false);
        pause();
      },
      micFft: Array(32)
        .fill(0)
        .map(() => Math.random() * 0.5),
      timeElapsed: secondsElapsed,
    }),
    [displayedMessages, isConnected, isRunning, pause, start, secondsElapsed],
  );

  return (
    <div className={className}>
      <DialogueContextObject.Provider value={replayContext}>{children}</DialogueContextObject.Provider>
    </div>
  );
}
