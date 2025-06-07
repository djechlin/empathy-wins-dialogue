/* eslint-disable @typescript-eslint/no-explicit-any */

import { ReactNode, useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { createClient, AgentEvents, DeepgramClient, AgentLiveClient } from '@deepgram/sdk';
import { getDeepgramAccessToken } from '@/edge/getDeepgramAccessToken';
import { useMicrophone, MicrophoneEvents } from '@/features/voice/MicrophoneContextProvider';
import { deepgramAgentConfig } from './deepgram-agent-config';
import { DialogueContext, DialogueMessage } from '../types';
import { DialogueContextObject } from './dialogueContext';

type DeepgramMessage = {
    id: string;
    type: 'user_message' | 'assistant_message';
    message: { content: string };
    receivedAt: Date;
};

interface DeepgramDialogueProviderProps {
    children: ReactNode;
    onMessage?: (message: any) => void;
    className?: string;
}

export function DeepgramDialogueProvider({
    children,
    onMessage,
    className,
}: DeepgramDialogueProviderProps) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const connectionRef = useRef<AgentLiveClient | null>(null);
    const deepgramRef = useRef<DeepgramClient | null>(null);
    const messagesRef = useRef<DeepgramMessage[]>([]);
    const errorRef = useRef<string | null>(null);
    const { microphone } = useMicrophone();

    useEffect(() => {
        async function getToken() {
            console.log('getting token...');
            try {
                const token = await getDeepgramAccessToken();
                console.log('setting token...', token);
                setAccessToken(token);
            } catch (err) {
                console.error('Failed to fetch Deepgram token:', err);
                errorRef.current = 'Could not get Deepgram access token';
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
            forceUpdate();
        });

        connectionRef.current.on(AgentEvents.Close, () => {
            console.log("Connection closed");
            forceUpdate();
        });

        connectionRef.current.on(AgentEvents.ConversationText, (data: any) => {
            console.log("Conversation text:", data);

            // Add message to our messages array
            const newMessage: DeepgramMessage = {
                id: `msg-${Date.now()}`,
                type: data.role === 'user' ? 'user_message' : 'assistant_message',
                message: { content: data.content || '' },
                receivedAt: new Date()
            };

            setMessages(prev => [...prev, newMessage]);

            if (onMessage) {
                onMessage(data);
            }
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
    }, [accessToken, onMessage]);

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

    const transformedMessages: DialogueMessage[] = useMemo(() =>
        messages.map((msg, index) => transformDeepgramMessage(msg, index)),
        [messages]
    );

    const togglePause = useCallback((state?: boolean) => {
        const targetState = state !== undefined ? state : !isPaused;
        setIsPaused(targetState);
        setIsMuted(targetState);
        
        if (targetState && connectionRef.current) {
            // Pause the connection if possible
            console.log('Pausing Deepgram agent');
        } else if (connectionRef.current) {
            // Resume the connection if possible
            console.log('Resuming Deepgram agent');
        }
        
        return targetState;
    }, [isPaused]);

    const dialogueContext: DialogueContext = useMemo(() => ({
        messages: transformedMessages,
        isPaused,
        togglePause,
        status
    }), [transformedMessages, isPaused, togglePause, status]);

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

// Transform Deepgram message to app message
function transformDeepgramMessage(deepgramMessage: DeepgramMessage, index: number): DialogueMessage {
    return {
        id: deepgramMessage.id || `msg-${index}`,
        role: deepgramMessage.type === 'user_message' ? 'user' : 'assistant',
        content: deepgramMessage.message.content || '',
        timestamp: deepgramMessage.receivedAt,
        emotions: undefined // Deepgram doesn't provide emotion scores in this implementation
    };
}