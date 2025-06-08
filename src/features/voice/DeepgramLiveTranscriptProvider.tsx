'use client';

import { createClient, LiveClient, LiveSchema, LiveConnectionState, LiveTranscriptionEvents } from '@deepgram/sdk';

import { getDeepgramAccessToken } from '@/edge/getDeepgramAccessToken';

import { useState, ReactNode, FunctionComponent, useEffect } from 'react';

import { MicrophoneContextProvider } from './MicrophoneContextProvider';
import { useMicrophone } from './useMicrophone';
import { MicrophoneState, MicrophoneEvents } from './microphoneConstants';

import { useDeepgramLiveTranscript, DeepgramLiveTranscriptContext, type DeepgramLiveTranscriptType } from './useDeepgramLiveTranscript';

interface DeepgramLiveTranscriptContextProviderProps {
  children: ReactNode;
}

const getApiKey = async (): Promise<string> => {
  const r = await getDeepgramAccessToken();
  console.log('getdeepgramtoken r:', r);
  return r;
};

const DeepgramLiveTranscriptContextInner: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  const [connection, setConnection] = useState<LiveClient | null>(null);
  const [connectionState, setConnectionState] = useState<LiveConnectionState>(LiveConnectionState.CLOSED);
  const { microphone, startMicrophone, stopMicrophone, setupMicrophone, microphoneState } = useMicrophone();

  /**
   * Connects to the Deepgram speech recognition service and sets up a live transcription session.
   * First ensures microphone is ready, then establishes the connection.
   *
   * @param options - The configuration options for the live transcription session.
   * @param endpoint - The optional endpoint URL for the Deepgram service.
   * @returns A Promise that resolves when the connection is established.
   */
  const connect = async (options: LiveSchema, endpoint?: string) => {
    console.log('setting up microphone first...');
    await setupMicrophone();
    console.log('microphone ready, creating deepgram client');
    const key = await getApiKey();
    const deepgram = createClient(key);

    const conn = deepgram.listen.live(options, endpoint);

    conn.addListener(LiveTranscriptionEvents.Open, () => {
      setConnectionState(LiveConnectionState.OPEN);
    });

    conn.addListener(LiveTranscriptionEvents.Close, () => {
      setConnectionState(LiveConnectionState.CLOSED);
    });

    setConnection(conn);
  };

  const disconnect = async () => {
    if (connection) {
      connection.finish();
      setConnection(null);
    }
  };

  // Handle microphone-to-Deepgram piping
  useEffect(() => {
    if (!microphone || !connection || connectionState !== LiveConnectionState.OPEN) {
      return;
    }

    const onData = (e: BlobEvent) => {
      // iOS SAFARI FIX:
      // Prevent packetZero from being sent. If sent at size 0, the connection will close.
      if (e.data.size > 0) {
        connection?.send(e.data);
      }
    };

    microphone.addEventListener(MicrophoneEvents.DataAvailable, onData);
    startMicrophone();

    return () => {
      microphone.removeEventListener(MicrophoneEvents.DataAvailable, onData);
    };
  }, [microphone, connection, connectionState, startMicrophone]);

  return (
    <DeepgramLiveTranscriptContext.Provider
      value={{
        connection,
        connectToDeepgram: connect,
        disconnectFromDeepgram: disconnect,
        connectionState,
      }}
    >
      {children}
    </DeepgramLiveTranscriptContext.Provider>
  );
};

const DeepgramLiveTranscriptProvider: FunctionComponent<DeepgramLiveTranscriptContextProviderProps> = ({ children }) => {
  return (
    <MicrophoneContextProvider>
      <DeepgramLiveTranscriptContextInner>{children}</DeepgramLiveTranscriptContextInner>
    </MicrophoneContextProvider>
  );
};


export { DeepgramLiveTranscriptProvider };
