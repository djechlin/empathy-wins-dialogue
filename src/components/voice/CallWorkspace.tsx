import MessageList from '../MessageList';
import ControlPanel from './ControlPanel';
import ScriptBar from './ScriptBar';
import ConversationReport from './ConversationReport';
import { ComponentRef, useRef, useState } from 'react';
import { HUME_PERSONAS, ScenarioId } from '@/lib/scriptData';
import { HumeVoiceProvider } from './HumeVoiceProvider';
import { generateReport } from '@/lib/claudeReport';
import { ConversationReport as ReportType } from '@/types/conversationReport';
import { useVoice } from '@humeai/voice-react';
import { Button } from '@/components/ui/button';

interface CallWorkspaceProps {
    scenarioId: ScenarioId;
    configId?: string;
}

function CallWorkspaceContent({ scenarioId }: CallWorkspaceProps) {
    const ref = useRef<ComponentRef<typeof MessageList> | null>(null);
    const [report, setReport] = useState<ReportType | null>(null);

    if (report) {
        return (
            <div className="w-full h-full flex flex-col">
                <div className="p-4 border-b bg-white sticky top-0 z-10">
                    <Button
                        onClick={() => setReport(null)}
                        variant="outline"
                        className="mb-2"
                    >
                        ← Back to Call
                    </Button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    <ConversationReport report={report} />
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="w-1/2 h-full flex-shrink-0">
                <ScriptBar callId={scenarioId} />
            </div>
            <div className="w-1/2 flex flex-col min-w-0">
                <MessageList ref={ref} />
                <ControlPanel onReportGenerated={setReport} />
            </div>
        </>
    );
}

export function CallWorkspace({ scenarioId }: CallWorkspaceProps) {
    return (
        <HumeVoiceProvider
            configId={HUME_PERSONAS[scenarioId]}
            onMessage={() => {}}
            className="flex flex-row w-full min-h-[800px] h-fit"
        >
            <CallWorkspaceContent scenarioId={scenarioId} />
        </HumeVoiceProvider>
    );
}