/* eslint-disable @typescript-eslint/no-explicit-any */

import { getDeepgramAccessToken } from '@/edge/getDeepgramAccessToken';
import { MicrophoneEvents, MicrophoneState } from '@/features/voice/microphoneConstants';
import MicrophoneContextProvider from '@/features/voice/MicrophoneContextProvider';
import { useMicrophone } from '@/features/voice/useMicrophone';
import { AgentEvents, AgentLiveClient, createClient, DeepgramClient } from '@deepgram/sdk';
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DialogueContext, DialogueMessage } from '../types';
import { deepgramAgentConfig } from './deepgram-agent-config';
import { DialogueContextObject } from './dialogueContext';

interface DeepgramDialogueProviderProps {
  children: ReactNode;
  className?: string;
}

function DeepgramDialogueProviderInner({ children, className }: DeepgramDialogueProviderProps) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [messages, setMessages] = useState<DialogueMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<{ value: string }>({ value: 'disconnected' });
  const connectionRef = useRef<AgentLiveClient | null>(null);
  const deepgramRef = useRef<DeepgramClient | null>(null);
  const { microphone, microphoneState, startMicrophone, stopMicrophone, setupMicrophone, micFft } = useMicrophone();

  useEffect(() => {
    async function getToken() {
      console.log('getting token...');
      try {
        const token = await getDeepgramAccessToken();
        console.log('setting token...', token);
        setAccessToken(token);
      } catch (err) {
        console.error('Failed to fetch Deepgram token:', err);
        setError('Could not get Deepgram access token');
      }
    }
    getToken();
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    console.log('Initializing Deepgram client...');
    deepgramRef.current = createClient(accessToken);

    console.log('Creating agent connection...');
    connectionRef.current = deepgramRef.current.agent();

    // Set up event handlers
    connectionRef.current.on(AgentEvents.Welcome, () => {
      console.log('Welcome to the Deepgram Voice Agent!');

      // Configure the agent
      connectionRef.current.configure(deepgramAgentConfig);

      console.log('Deepgram agent configured!');
    });

    connectionRef.current.on(AgentEvents.Open, () => {
      console.log('Connection opened');
      setStatus({ value: 'connected' });
    });

    connectionRef.current.on(AgentEvents.Close, () => {
      console.log('Connection closed');
      setStatus({ value: 'disconnected' });
    });

    connectionRef.current.on(AgentEvents.ConversationText, (data: any) => {
      console.log('Conversation text:', data);

      // Add message to our messages array
      const newMessage: DialogueMessage = {
        id: `msg-${Date.now()}`,
        role: data.role === 'user' ? 'user' : 'assistant',
        content: data.content || '',
        timestamp: new Date(),
        emotions: undefined, // Deepgram doesn't provide emotion scores
      };

      setMessages((prev) => [...prev, newMessage]);
    });

    connectionRef.current.on(AgentEvents.Error, (err: any) => {
      console.error('Deepgram agent error:', err);
      setError(`Agent error: ${err.message || 'Unknown error'}`);
      setStatus({ value: 'error' });
    });

    // Set up keep-alive
    const keepAliveInterval = setInterval(() => {
      if (connectionRef.current && connectionRef.current.isConnected()) {
        console.log('Keep alive!');
        connectionRef.current.keepAlive();
      }
    }, 5000);

    // Cleanup
    return () => {
      clearInterval(keepAliveInterval);
      if (connectionRef.current) {
        connectionRef.current.disconnect();
      }
    };
  }, [accessToken]);

  useEffect(() => {
    if (!microphone || !connectionRef.current) return;

    const handleDataAvailable = (event: BlobEvent) => {
      if (event.data.size > 0 && connectionRef.current && connectionRef.current.isConnected()) {
        console.log('Sending audio chunk to Deepgram, size:', event.data.size);

        event.data
          .arrayBuffer()
          .then((buffer) => {
            connectionRef.current!.send(new Uint8Array(buffer));
          })
          .catch((err) => {
            console.error('Error converting audio blob to buffer:', err);
          });
      }
    };

    console.log('Setting up microphone data handler...');
    microphone.addEventListener(MicrophoneEvents.DataAvailable, handleDataAvailable);

    return () => {
      console.log('Cleaning up microphone data handler...');
      microphone.removeEventListener(MicrophoneEvents.DataAvailable, handleDataAvailable);
    };
  }, [microphone, connectionRef]);

  const isPaused = microphoneState === MicrophoneState.Paused || microphoneState === MicrophoneState.Pausing;

  const togglePause = useCallback(
    (state?: boolean) => {
      const targetState = state !== undefined ? state : !isPaused;

      if (targetState) {
        console.log('Pausing Deepgram agent');
        stopMicrophone();
      } else {
        console.log('Resuming Deepgram agent');
        startMicrophone();
      }

      return targetState;
    },
    [isPaused, stopMicrophone, startMicrophone],
  );

  const connect = useCallback(async () => {
    console.log('Connecting to Deepgram agent...');
    setStatus({ value: 'connecting' });

    // Set up microphone first
    if (microphoneState === MicrophoneState.NotSetup) {
      await setupMicrophone();
    }

    // Start microphone - the Deepgram connection is already established
    // when the agent is created in the useEffect
    startMicrophone();
  }, [microphoneState, setupMicrophone, startMicrophone]);

  const disconnect = useCallback(() => {
    console.log('Disconnecting from Deepgram agent');
    stopMicrophone();

    if (connectionRef.current && connectionRef.current.isConnected()) {
      connectionRef.current.disconnect();
    }

    setStatus({ value: 'disconnected' });
  }, [stopMicrophone]);

  // For now, mute == pause as per your goal
  const isMuted = isPaused;
  const mute = useCallback(() => togglePause(true), [togglePause]);
  const unmute = useCallback(() => togglePause(false), [togglePause]);

  const dialogueContext: DialogueContext = useMemo(
    () => ({
      messages,
      isPaused,
      togglePause,
      status,
      connect,
      disconnect,
      isMuted,
      mute,
      unmute,
      micFft,
    }),
    [messages, isPaused, togglePause, status, connect, disconnect, isMuted, mute, unmute, micFft],
  );

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  if (!accessToken) {
    return <div className="p-8">Loading voice connection...</div>;
  }

  return (
    <div className={className}>
      <DialogueContextObject.Provider value={dialogueContext}>{children}</DialogueContextObject.Provider>
    </div>
  );
}

// Wrapper to provide microphone context for the Deepgram dialogue provider
export function DeepgramDialogueProvider(props: DeepgramDialogueProviderProps) {
  return (
    <MicrophoneContextProvider>
      <DeepgramDialogueProviderInner {...props} />
    </MicrophoneContextProvider>
  );
}
