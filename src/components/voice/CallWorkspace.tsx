import MessageList from '../MessageList';
import ControlPanel from './ControlPanel';
import ScriptBar from './ScriptBar';
import { ComponentRef, useRef } from 'react';
import { HUME_PERSONAS, ScenarioId } from '@/lib/scriptData';
import { HumeVoiceProvider } from './HumeVoiceProvider';

interface CallWorkspaceProps {
    scenarioId: ScenarioId;
    configId?: string;
}

export function CallWorkspace({ scenarioId }: CallWorkspaceProps) {
    const ref = useRef<ComponentRef<typeof MessageList> | null>(null);

    return (
        <HumeVoiceProvider
            configId={HUME_PERSONAS[scenarioId]}
            onMessage={() => {}}
            className="flex flex-row w-full min-h-[800px] h-fit"
        >
            <div className="w-1/2 h-full flex-shrink-0">
                <ScriptBar callId={scenarioId} />
            </div>
            <div className="w-1/2 flex flex-col min-w-0">
                <MessageList ref={ref} />
                <ControlPanel />
            </div>
        </HumeVoiceProvider>
    );
}