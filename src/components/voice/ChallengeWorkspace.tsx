import ControlPanel from './ControlPanel';
import ConversationReport from './ConversationReport';
import ScoreCard from './ScoreCard';
import ExpandedScoreCard from './ExpandedScoreCard';
import { ComponentRef, useRef, useState, useEffect } from 'react';
import type { Challenge } from '@/types';
import { HumeVoiceProvider, useVoice } from './HumeVoiceProvider';
import { ConversationReport as ReportType } from '@/types/conversationReport';
import { Button } from '@/components/ui/button';
import { Clock, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VoiceContextType } from '@humeai/voice-react';
import React from 'react';

interface ChallengeWorkspaceProps {
    challenge: Challenge;
    isMock?: boolean;
}

interface BehaviorCardConfig {
    id: string;
    icon: string;
    title: string;
    subtitle: string;
    sense: 'do' | 'dont';
}

interface BehaviorCardData {
    status: 'to-do' | 'good' | 'great' | number;
    examples: string[];
}

const behaviorCardConfigs: BehaviorCardConfig[] = [
    { id: 'nice-things-framing', icon: 'Blocks', title: '"Nice things" framing', subtitle: 'Frame the issue about how life can get better', sense: 'do' },
    { id: 'share-story', icon: 'Book', title: 'Share your story', subtitle: 'Share who you care about, and get vulnerable.', sense: 'do' },
    { id: 'dig-deeper', icon: 'Search', title: 'Dig deeper', subtitle: 'Learn more about the voter\'s life and concerns', sense: 'do' },
    { id: 'explore-together', icon: 'Ear', title: 'Explore together', subtitle: 'Listen actively as the voter thinks things through.', sense: 'do' },
    { id: 'find-common-ground', icon: 'Handshake', title: 'Find Common Ground', subtitle: 'Look for shared values and experiences', sense: 'do' },
    { id: 'show-empathy', icon: 'Users', title: 'Show Empathy', subtitle: 'Acknowledge their perspective without judgment', sense: 'do' },
    { id: 'dont-persuade-informing', icon: 'MegaphoneOff', title: 'Don\'t persuade by informing', subtitle: 'Avoid giving political speeches', sense: 'dont' },
    { id: 'dont-correct-them', icon: 'ShieldOff', title: 'Don\'t correct them.', subtitle: 'Remember to stay vulnerable even when they get things wrong.', sense: 'dont' },
];

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

function BehaviorGrid() {
    const [cardsData, setCardsData] = useState<Record<string, BehaviorCardData>>(() => {
        const initialData: Record<string, BehaviorCardData> = {};
        behaviorCardConfigs.forEach(config => {
            // Mock data showing various states
            if (config.id === 'nice-things-framing') {
                initialData[config.id] = {
                    status: 'great',
                    examples: ['Think about how much easier it would be for families like yours', 'Imagine if you didn\'t have to worry about these costs']
                };
            } else if (config.id === 'dig-deeper') {
                initialData[config.id] = {
                    status: 'good', 
                    examples: ['Can you tell me more about that experience?']
                };
            } else if (config.id === 'share-story') {
                initialData[config.id] = {
                    status: 'good',
                    examples: ['I remember when my grandmother needed healthcare and we struggled with the costs']
                };
            } else if (config.id === 'explore-together') {
                initialData[config.id] = {
                    status: 'to-do',
                    examples: []
                };
            } else if (config.id === 'find-common-ground') {
                initialData[config.id] = {
                    status: 'to-do',
                    examples: []
                };
            } else if (config.id === 'show-empathy') {
                initialData[config.id] = {
                    status: 'great',
                    examples: ['That sounds really challenging for your family', 'I can understand why you would feel frustrated about that']
                };
            } else if (config.id === 'dont-persuade-informing') {
                initialData[config.id] = {
                    status: 1,
                    examples: ['The data clearly shows that universal healthcare is the only solution']
                };
            } else if (config.id === 'dont-correct-them') {
                initialData[config.id] = {
                    status: 0,
                    examples: []
                };
            } else {
                initialData[config.id] = {
                    status: config.sense === 'do' ? 'to-do' : 0,
                    examples: []
                };
            }
        });
        return initialData;
    });

    const [expandedCard, setExpandedCard] = useState<string | null>(null);

    // Handle ESC key to close expanded card
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && expandedCard) {
                setExpandedCard(null);
            }
        };

        document.addEventListener('keydown', handleEscKey);
        return () => document.removeEventListener('keydown', handleEscKey);
    }, [expandedCard]);

    const handleCardClick = (cardId: string) => {
        const config = behaviorCardConfigs.find(c => c.id === cardId);
        if (!config) return;

        if (config.sense === 'do') {
            setCardsData(prev => ({
                ...prev,
                [cardId]: {
                    ...prev[cardId],
                    status: prev[cardId].status === 'to-do' ? 'good' : 
                           prev[cardId].status === 'good' ? 'great' : 'great'
                }
            }));
        }
        
        // Expand the card regardless of sense
        setExpandedCard(cardId);
    };

    // Separate do and don't cards
    const doConfigs = behaviorCardConfigs.filter(config => config.sense === 'do');
    const dontConfigs = behaviorCardConfigs.filter(config => config.sense === 'dont');

    return (
        <>
            <div className="p-4">
                <div className="grid grid-cols-4 grid-rows-2 gap-3">
                    {/* First 3 do cards in top row */}
                    {doConfigs.slice(0, 3).map((config) => (
                        <ScoreCard
                            key={config.id}
                            config={config}
                            data={cardsData[config.id]}
                            onClick={() => handleCardClick(config.id)}
                        />
                    ))}
                    
                    {/* First don't card in top right */}
                    <ScoreCard
                        key={dontConfigs[0].id}
                        config={dontConfigs[0]}
                        data={cardsData[dontConfigs[0].id]}
                    />

                    {/* Last 3 do cards in bottom row */}
                    {doConfigs.slice(3, 6).map((config) => (
                        <ScoreCard
                            key={config.id}
                            config={config}
                            data={cardsData[config.id]}
                            onClick={() => handleCardClick(config.id)}
                        />
                    ))}

                    {/* Second don't card in bottom right */}
                    <ScoreCard
                        key={dontConfigs[1].id}
                        config={dontConfigs[1]}
                        data={cardsData[dontConfigs[1].id]}
                    />
                </div>
            </div>

            {/* Expanded Card Overlay */}
            {expandedCard && (
                <ExpandedScoreCard
                    config={behaviorCardConfigs.find(c => c.id === expandedCard)!}
                    data={cardsData[expandedCard]}
                    onClose={() => setExpandedCard(null)}
                />
            )}
        </>
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
            
            {/* Behavior Cards Grid */}
            <div className="flex-1 overflow-y-auto">
                <BehaviorGrid />
            </div>
            
            {/* Recent Messages at bottom */}
            <div className="border-t bg-white">
                <RecentMessages />
            </div>
            
            {/* Control Panel at bottom */}
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
