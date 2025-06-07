/* eslint-disable @typescript-eslint/no-explicit-any */

import { ToolCallHandler, VoiceProvider } from '@humeai/voice-react';
import { ReactNode, useEffect, useState } from 'react';
import { getDeepgramAccessToken } from '@/edge/getDeepgramAccessToken';

interface DeepgramDialogueProviderProps {
    configId?: string;
    children: ReactNode;
    onMessage?: (message: any) => void;
    className?: string;
    onToolCall?: ToolCallHandler;
    [key: string]: any; // Allow other VoiceProvider props to pass through
}

export function DeepgramDialogueProvider({
    children,
    configId,
    onMessage,
    className,
    onToolCall,
    ...otherProps
}: DeepgramDialogueProviderProps) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

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

    if (error) {
        return <div className="p-8 text-red-500">Error: {error || 'Failed to load voice connection'}</div>;
    }

    if (accessToken === null) {
        return <div className="p-8">Loading voice connection...</div>;
    }

    return (
        <div className={className}>
        <VoiceProvider onToolCall={onToolCall}
        auth={{ type: 'accessToken', value: accessToken }}
        configId={configId}
        onMessage={onMessage}
        {...otherProps}
        >
        {children}
        </VoiceProvider>
        </div>
    );
}