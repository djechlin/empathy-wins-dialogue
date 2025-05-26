import MessageList from '../MessageList';
import ControlPanel from './ControlPanel';
import ScriptBar from './ScriptBar';
import { ComponentRef, useRef } from 'react';
import { HUME_PERSONAS, ScenarioId } from '@/lib/scriptData';
import { AuthenticatingVoiceProvider } from './AuthenticatingVoiceProvider';

interface CallWorkspaceProps {
    callId: ScenarioId;
    configId?: string;
}

export function CallWorkspace({ callId }: CallWorkspaceProps) {
    const ref = useRef<ComponentRef<typeof MessageList> | null>(null);

    return (
        <AuthenticatingVoiceProvider
            configId={HUME_PERSONAS[callId]}
            onMessage={() => {}}
            className="flex flex-row w-full min-h-[800px] h-fit"
        >
            <div className="w-1/2 h-full flex-shrink-0">
                <ScriptBar callId={callId} />
            </div>
            <div className="w-1/2 flex flex-col min-w-0">
                <MessageList ref={ref} />
                <ControlPanel />
            </div>
        </AuthenticatingVoiceProvider>
    );
}