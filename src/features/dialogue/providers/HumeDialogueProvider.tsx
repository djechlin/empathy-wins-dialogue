import { getHumeAccessToken } from '@/edge/getHumeAccessToken';
import { ToolCallHandler, useVoice as useHumeVoice, VoiceContextType, VoiceProvider } from '@humeai/voice-react';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { DialogueContext, DialogueMessage } from '../types';
import { DialogueContextObject } from './dialogueContext';

interface HumeDialogueProviderProps {
  children: ReactNode;
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

// Requires a Hume VoiceProvider to be set up, which is why we need 2 layers
function InnerDialogueProvider({ children }: { children: ReactNode }) {
  const humeVoice = useHumeVoice();

  const messages: DialogueMessage[] = useMemo(
    () => humeVoice.messages.map((msg, index) => transformHumeMessage(msg, index)).filter((msg): msg is DialogueMessage => msg !== null),
    [humeVoice.messages],
  );

  const togglePause = useCallback(
    (state?: boolean) => {
      const targetState = state !== undefined ? state : !humeVoice.isPaused;
      if (targetState) {
        humeVoice.pauseAssistant();
        humeVoice.mute();
      } else {
        humeVoice.resumeAssistant();
        humeVoice.unmute();
      }
      return targetState;
    },
    [humeVoice],
  );

  const dialogueContext: DialogueContext = useMemo(
    () => ({
      messages,
      connect: humeVoice.connect,
      disconnect: humeVoice.disconnect,
      isMuted: humeVoice.isMuted,
      micFft: humeVoice.micFft,
      isPaused: humeVoice.isPaused,
      togglePause,
      status: humeVoice.status,
    }),
    [
      messages,
      humeVoice.connect,
      humeVoice.disconnect,
      humeVoice.micFft,
      humeVoice.isMuted,
      humeVoice.isPaused,
      togglePause,
      humeVoice.status,
    ],
  );

  return <DialogueContextObject.Provider value={dialogueContext}>{children}</DialogueContextObject.Provider>;
}

export function HumeDialogueProvider({ children, onToolCall, ...otherProps }: HumeDialogueProviderProps) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const configId = '3f136570-42d4-4afd-b319-866e2fd76474';

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
