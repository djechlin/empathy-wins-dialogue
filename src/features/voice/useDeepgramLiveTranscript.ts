import { useContext, createContext } from 'react';
import { LiveClient, LiveSchema, LiveConnectionState } from '@deepgram/sdk';

interface DeepgramLiveTranscriptType {
  connection: LiveClient | null;
  connectToDeepgram: (options: LiveSchema, endpoint?: string) => Promise<void>;
  disconnectFromDeepgram: () => void;
  connectionState: LiveConnectionState;
}

const DeepgramLiveTranscriptContext = createContext<DeepgramLiveTranscriptType | undefined>(undefined);

function useDeepgramLiveTranscript(): DeepgramLiveTranscriptType {
  return useContext(DeepgramLiveTranscriptContext);
}

export { useDeepgramLiveTranscript, DeepgramLiveTranscriptContext, type DeepgramLiveTranscriptType };