import { getHumeAccessToken } from '@/edge/getHumeAccessToken';
import { ToolCallHandler, useVoice as useHumeVoice, VoiceContextType, VoiceProvider } from '@humeai/voice-react';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useStopwatch } from 'react-timer-hook';
import useWakeLock from 'react-use-wake-lock';
import { DialogueContext, DialogueMessage } from '../types';
import { DialogueContextObject } from './DialogueContextObject';

interface HumeDialogueProviderProps {
  children: ReactNode;
  configId: string;
  onToolCall?: ToolCallHandler;
}

// Transform Hume emotion scores to Record<string, number>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformEmotions(emotionScores: any): Record<string, number> | undefined {
  if (!emotionScores) return undefined;

  const result: Record<string, number> = {};
  for (const [key, value] of Object.entries(emotionScores)) {
    if (typeof value === 'number') {
      result[key] = value;
    }
  }
  return Object.keys(result).length > 0 ? result : undefined;
}

// Transform Hume message to app message
function transformHumeMessage(humeMessage: VoiceContextType['messages'][number], index: number): DialogueMessage | null {
  if (humeMessage.type !== 'user_message' && humeMessage.type !== 'assistant_message') {
    return null;
  }

  const emotions =
    'models' in humeMessage && humeMessage.models?.prosody?.scores ? transformEmotions(humeMessage.models.prosody.scores) : undefined;

  return {
    id: 'id' in humeMessage ? humeMessage.id || `msg-${index}` : `msg-${index}`,
    role: humeMessage.type === 'user_message' ? 'user' : 'assistant',
    content: humeMessage.message.content || '',
    timestamp: 'receivedAt' in humeMessage ? humeMessage.receivedAt : new Date(),
    emotions,
  };
}

// Remove VoiceStatus import and define locally
// type VoiceStatus from @humeai/voice-react
type VoiceStatus = { value: 'disconnected' | 'connecting' | 'connected'; reason?: never } | { value: 'error'; reason: string };

// Map Hume VoiceStatus to app DialogueContext status
function fromHumeStatus(status: VoiceStatus): 'connected' | 'connecting' | 'not-started' | 'ended' | 'paused' {
  if (!status || !status.value) return 'not-started';
  switch (status.value) {
    case 'connected':
      return 'connected';
    case 'connecting':
      return 'connecting';
    case 'disconnected':
      return 'ended';
    case 'error':
      return 'ended';
    default:
      return 'not-started';
  }
}

// Requires a Hume VoiceProvider to be set up, which is why we need 2 layers
function InnerDialogueProvider({ children }: { children: ReactNode }) {
  const humeVoice = useHumeVoice();
  const { seconds: secondsElapsed, pause, start, isRunning } = useStopwatch({ autoStart: false });
  const { request: requestWakeLock, release: releaseWakeLock } = useWakeLock();

  const connect = useCallback(async () => {
    await humeVoice.connect();
    start();
    try {
      requestWakeLock();
    } catch (error) {
      console.error('Wake lock not supported or failed:', error);
    }
  }, [humeVoice, start, requestWakeLock]);

  const disconnect = useCallback(() => {
    humeVoice.disconnect();
    pause();
    try {
      releaseWakeLock();
    } catch (error) {
      console.error('Failed to release wake lock:', error);
    }
  }, [humeVoice, pause, releaseWakeLock]);

  const messages: DialogueMessage[] = useMemo(
    () => humeVoice.messages.map((msg, index) => transformHumeMessage(msg, index)).filter((msg): msg is DialogueMessage => msg !== null),
    [humeVoice.messages],
  );

  const togglePause = useCallback(
    (state?: boolean) => {
      const targetState = state !== undefined ? state : isRunning;
      if (targetState) {
        humeVoice.pauseAssistant();
        humeVoice.mute();
        pause();
      } else {
        humeVoice.resumeAssistant();
        humeVoice.unmute();
        start();
      }
      return targetState;
    },
    [humeVoice, isRunning, pause, start],
  );

  // Cleanup wake lock on unmount
  useEffect(() => {
    return () => {
      try {
        releaseWakeLock();
      } catch (error) {
        console.error('Failed to release wake lock on unmount:', error);
      }
    };
  }, [releaseWakeLock]);

  const dialogueContext: DialogueContext = useMemo(
    () => ({
      messages,
      connect,
      disconnect,
      micFft: humeVoice.micFft,
      isPaused: !isRunning,
      togglePause,
      status: fromHumeStatus(humeVoice.status),
      timeElapsed: secondsElapsed,
    }),
    [messages, connect, disconnect, humeVoice.micFft, isRunning, togglePause, humeVoice.status, secondsElapsed],
  );

  return <DialogueContextObject.Provider value={dialogueContext}>{children}</DialogueContextObject.Provider>;
}

export function HumeDialogueProvider({ children, configId, onToolCall, ...otherProps }: HumeDialogueProviderProps) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getToken() {
      try {
        const token = await getHumeAccessToken();
        setAccessToken(token);
      } catch (err) {
        console.error('Failed to fetch Hume token:', err);
        setError('Could not get Hume access token');
      }
    }
    getToken();
  }, []);

  if (error) {
    return <div className="p-8 text-red-500">Error: {error || 'Failed to load voice connection'}</div>;
  }

  if (accessToken === null) {
    return <div className="p-8">Loading voice connection...</div>;
  }

  return (
    <VoiceProvider
      onToolCall={onToolCall}
      auth={{ type: 'accessToken', value: accessToken }}
      configId={configId}
      debug={true}
      {...otherProps}
    >
      <InnerDialogueProvider>{children}</InnerDialogueProvider>
    </VoiceProvider>
  );
}
