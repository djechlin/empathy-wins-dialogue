import { VoiceProvider } from '@humeai/voice-react';
import MessageList from '../MessageList';
import ControlPanel from './ControlPanel';
import ScriptBar from './ScriptBar';
import { ComponentRef, useEffect, useRef, useState } from 'react';
import { getHumeAccessToken } from '@/lib/getHumeAccessToken';
import { HUME_PERSONAS, ScenarioId } from '@/lib/scriptData';

interface CallWorkspaceProps {
    callId: ScenarioId;
    configId?: string;
}

export function CallWorkspace({ callId }: CallWorkspaceProps) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const ref = useRef<ComponentRef<typeof MessageList> | null>(null);

    useEffect(() => {
        async function getToken() {
            console.log('getting token...');
            try {
                const token = await getHumeAccessToken();
                console.log('setting token...', token);
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
        auth={{ type: 'accessToken', value: accessToken }}
        configId={HUME_PERSONAS[callId]}
        onMessage={() => {
        }}
        >
        <div className="flex flex-row w-full min-h-[800px] h-fit">
        <div className="w-80 h-full flex-shrink-0">
        <ScriptBar callId={callId} />
        </div>
        <div className="flex-1 flex flex-col min-w-0">
        <MessageList ref={ref} />
        <ControlPanel />
        </div>
        </div>
        </VoiceProvider>
    );
}