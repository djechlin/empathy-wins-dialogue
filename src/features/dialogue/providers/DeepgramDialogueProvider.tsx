/* eslint-disable @typescript-eslint/no-explicit-any */

import { ReactNode, useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { createClient, AgentEvents, DeepgramClient, AgentLiveClient } from '@deepgram/sdk';
import { getDeepgramAccessToken } from '@/edge/getDeepgramAccessToken';
import { useMicrophone, MicrophoneEvents, MicrophoneState } from '@/features/voice/MicrophoneContextProvider';
import { deepgramAgentConfig } from './deepgram-agent-config';
import { DialogueContext, DialogueMessage } from '../types';
import { DialogueContextObject } from './dialogueContext';

interface DeepgramDialogueProviderProps {
    children: ReactNode;
    className?: string;
}

export function DeepgramDialogueProvider({
    children,
    className,
}: DeepgramDialogueProviderProps) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [messages, setMessages] = useState<DialogueMessage[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<{ value: string }>({ value: 'connecting' });
    const connectionRef = useRef<AgentLiveClient | null>(null);
    const deepgramRef = useRef<DeepgramClient | null>(null);
    const { microphone, microphoneState, startMicrophone, stopMicrophone } = useMicrophone();

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
            console.log("Welcome to the Deepgram Voice Agent!");

            // Configure the agent
            connectionRef.current.configure(deepgramAgentConfig);

            console.log("Deepgram agent configured!");
        });

        connectionRef.current.on(AgentEvents.Open, () => {
            console.log("Connection opened");
        });

        connectionRef.current.on(AgentEvents.Close, () => {
            console.log("Connection closed");
        });

        connectionRef.current.on(AgentEvents.ConversationText, (data: any) => {
            console.log("Conversation text:", data);

            // Add message to our messages array
            const newMessage: DialogueMessage = {
                id: `msg-${Date.now()}`,
                role: data.role === 'user' ? 'user' : 'assistant',
                content: data.content || '',
                timestamp: new Date(),
                emotions: undefined // Deepgram doesn't provide emotion scores
            };

            setMessages(prev => [...prev, newMessage]);
        });

        connectionRef.current.on(AgentEvents.Error, (err: any) => {
            console.error("Deepgram agent error:", err);
            setError(`Agent error: ${err.message || 'Unknown error'}`);
            setStatus({ value: 'error' });
        });

        // Set up keep-alive
        const keepAliveInterval = setInterval(() => {
            if (connectionRef.current && connectionRef.current.isConnected()) {
                console.log("Keep alive!");
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

                event.data.arrayBuffer().then((buffer) => {
                    connectionRef.current!.send(new Uint8Array(buffer));
                }).catch((err) => {
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

    const togglePause = useCallback((state?: boolean) => {
        const targetState = state !== undefined ? state : !isPaused;
        
        if (targetState) {
            console.log('Pausing Deepgram agent');
            stopMicrophone();
        } else {
            console.log('Resuming Deepgram agent');
            startMicrophone();
        }
        
        return targetState;
    }, [isPaused, stopMicrophone, startMicrophone]);

    const dialogueContext: DialogueContext = useMemo(() => ({
        messages,
        isPaused,
        togglePause,
        status
    }), [messages, isPaused, togglePause, status]);

    if (error) {
        return <div className="p-8 text-red-500">Error: {error}</div>;
    }

    if (!accessToken) {
        return <div className="p-8">Loading voice connection...</div>;
    }

    return (
        <div className={className}>
            <DialogueContextObject.Provider value={dialogueContext}>
                {children}
            </DialogueContextObject.Provider>
        </div>
    );
}