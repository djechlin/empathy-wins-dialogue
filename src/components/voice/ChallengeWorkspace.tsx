import ControlPanel from './ControlPanel';
import ScriptBar from './ScriptBar';
import ConversationReport from './ConversationReport';
import DeepCanvassingChecklist from './DeepCanvassingChecklist';
import { ComponentRef, useRef, useState, useEffect } from 'react';
import type { Challenge } from '@/types';
import { HumeVoiceProvider, useVoice } from './HumeVoiceProvider';
import { ConversationReport as ReportType } from '@/types/conversationReport';
import { Button } from '@/components/ui/button';
import { Clock, MessageCircle, CheckSquare, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VoiceContextType } from '@humeai/voice-react';

interface ChallengeWorkspaceProps {
    challenge: Challenge;
    isMock?: boolean;
}

function Timer() {
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const { status } = useVoice();

    useEffect(() => {
        setIsActive(status.value === 'connected');
        if (status.value !== 'connected') {
            setTimeElapsed(0);
        }
    }, [status.value]);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isActive && timeElapsed < 300) { // 5 minutes = 300 seconds
            interval = setInterval(() => {
                setTimeElapsed(time => time + 1);
            }, 1000);
        } else if (timeElapsed >= 300) {
            setIsActive(false);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeElapsed]);

    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    const progress = (timeElapsed / 300) * 100;

    return (
        <div className="flex items-center gap-3 p-4 bg-white border-b">
            <Clock className="size-5 text-gray-500" />
            <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">
                        {minutes}:{seconds.toString().padStart(2, '0')} / 5:00
                    </span>
                    <span className="text-sm text-gray-500">
                        {timeElapsed >= 300 ? 'Time Complete!' : 'Time Remaining'}
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                        className={cn(
                            "h-2 rounded-full transition-all duration-1000",
                            timeElapsed >= 300 ? "bg-green-500" : "bg-blue-500"
                        )}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

function RecentMessages() {
    const { messages } = useVoice();
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Get last 6 messages (3 exchanges)
    const recentMessages = messages
        .filter(msg => msg.type === 'user_message' || msg.type === 'assistant_message')
        .slice(-6);

    if (recentMessages.length === 0) {
        return (
            <div className="p-6 text-center text-gray-500">
                <MessageCircle className="size-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Start the conversation to see recent messages</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div 
                ref={containerRef}
                className="space-y-3 max-h-32 overflow-y-auto"
            >
                {recentMessages.map((msg, index) => {
                    // Calculate opacity based on position from bottom (0 = bottom, higher = further up)
                    const positionFromBottom = recentMessages.length - index - 1;
                    const opacity = Math.max(0.3, 1 - positionFromBottom * 0.15);
                    const speaker = msg.message.role === 'user' ? 'You' : 'Voter';
                    
                    return (
                        <div
                            key={index}
                            className={cn(
                                'p-3 rounded-lg border transition-all duration-500 ease-in-out',
                                msg.type === 'user_message' 
                                    ? 'bg-blue-50 border-blue-200 ml-8' 
                                    : 'bg-gray-50 border-gray-200 mr-8'
                            )}
                            style={{ opacity }}
                        >
                            <div className="text-sm">
                                <span className="font-medium opacity-70">{speaker}: </span>
                                {msg.message.content}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function ChallengeWorkspaceContent({ challenge }: ChallengeWorkspaceProps) {
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
                        ← Back to Challenge
                    </Button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    <ConversationReport report={report} />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <Timer />
            <div className="flex flex-1 min-h-0">
                {/* Left Side: Script - Takes up 60% of width */}
                <div className="w-3/5 border-r">
                    <ScriptBar script={challenge.script} />
                </div>
                
                {/* Right Side: Checklist - Takes up 40% of width */}
                <div className="w-2/5 flex flex-col">
                    <div className="flex-1 overflow-y-auto">
                        <DeepCanvassingChecklist />
                    </div>
                </div>
            </div>
            
            {/* Recent Messages at bottom - full width */}
            <div className="border-t bg-white">
                <RecentMessages />
            </div>
            
            {/* Control Panel at bottom - full width */}
            <div className="border-t bg-gray-50">
                <ControlPanel onReportGenerated={setReport} />
            </div>
        </div>
    );
}

export function ChallengeWorkspace({ challenge, isMock = false }: ChallengeWorkspaceProps) {
    return (
        <HumeVoiceProvider
            configId={challenge.humePersona}
            onMessage={() => {}}
            className="flex flex-col w-full min-h-[800px] h-fit bg-white rounded-lg overflow-hidden"
            isMock={isMock}
        >
            <ChallengeWorkspaceContent challenge={challenge} />
        </HumeVoiceProvider>
    );
}
