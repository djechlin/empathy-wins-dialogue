import ControlPanel from './ControlPanel';
import ConversationReport from './ConversationReport';
import { ComponentRef, useRef, useState, useEffect } from 'react';
import type { Challenge } from '@/types';
import { HumeVoiceProvider, useVoice } from './HumeVoiceProvider';
import { ConversationReport as ReportType } from '@/types/conversationReport';
import { Button } from '@/components/ui/button';
import { Clock, MessageCircle, CheckSquare, FileText, Check, X, Heart, Ear, Book, Search, Users, Handshake } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VoiceContextType } from '@humeai/voice-react';
import { Badge } from '@/components/ui/badge';

interface ChallengeWorkspaceProps {
    challenge: Challenge;
    isMock?: boolean;
}

interface BehaviorCard {
    id: string;
    title: string;
    description: string;
    type: 'do' | 'dont';
    status: 'none' | 'good' | 'great';
    icon?: string;
}

const behaviorCards: BehaviorCard[] = [
    { id: 'ask-feelings', title: 'Ask How They Feel', description: 'Show genuine interest in their emotions', type: 'do', status: 'none', icon: 'Heart' },
    { id: 'dig-deeper', title: 'Dig Deeper', description: 'Ask follow-up questions to understand better', type: 'do', status: 'none', icon: 'Search' },
    { id: 'share-story', title: 'Share Your Story', description: 'Be vulnerable and authentic', type: 'do', status: 'none', icon: 'Book' },
    { id: 'listen-actively', title: 'Listen Actively', description: 'Focus on understanding, not responding', type: 'do', status: 'none', icon: 'Ear' },
    { id: 'find-common-ground', title: 'Find Common Ground', description: 'Look for shared values and experiences', type: 'do', status: 'none', icon: 'Handshake' },
    { id: 'show-empathy', title: 'Show Empathy', description: 'Acknowledge their perspective without judgment', type: 'do', status: 'none', icon: 'Users' },
    { id: 'lecture-politics', title: 'Lecture on Politics', description: 'Avoid giving political speeches', type: 'dont', status: 'none' },
    { id: 'get-defensive', title: 'Get Defensive', description: 'Don\'t take disagreement personally', type: 'dont', status: 'none' },
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
    const [cards, setCards] = useState<BehaviorCard[]>(behaviorCards);

    const handleCardClick = (cardId: string) => {
        setCards(prev => prev.map(card => {
            if (card.id === cardId && card.type === 'do') {
                // Cycle through: none -> good -> great
                const newStatus = card.status === 'none' ? 'good' : 
                                card.status === 'good' ? 'great' : 'great';
                return { ...card, status: newStatus };
            }
            return card;
        }));
    };

    const getIconComponent = (iconName: string) => {
        const iconMap: Record<string, any> = {
            Heart,
            Search,
            Book,
            Ear,
            Handshake,
            Users
        };
        return iconMap[iconName];
    };

    const getIconBgColor = (iconName: string) => {
        const colorMap: Record<string, string> = {
            Heart: 'bg-magenta-100',
            Search: 'bg-blue-100',
            Book: 'bg-green-100',
            Ear: 'bg-purple-100',
            Handshake: 'bg-orange-100',
            Users: 'bg-indigo-100'
        };
        return colorMap[iconName] || 'bg-gray-100';
    };

    const getIconColor = (iconName: string, status: string) => {
        if (status === 'none') {
            const colorMap: Record<string, string> = {
                Heart: 'text-magenta-600',
                Search: 'text-blue-600',
                Book: 'text-green-600',
                Ear: 'text-purple-600',
                Handshake: 'text-orange-600',
                Users: 'text-indigo-600'
            };
            return colorMap[iconName] || 'text-gray-600';
        }
        return 'text-dialogue-purple';
    };

    // Separate do and don't cards
    const doCards = cards.filter(card => card.type === 'do');
    const dontCards = cards.filter(card => card.type === 'dont');

    return (
        <div className="p-4">
            <div className="grid grid-cols-4 grid-rows-2 gap-3">
                {/* First 3 do cards in top row */}
                {doCards.slice(0, 3).map((card) => {
                    const IconComponent = getIconComponent(card.icon || 'Check');
                    return (
                        <div
                            key={card.id}
                            onClick={() => handleCardClick(card.id)}
                            className={cn(
                                "aspect-square p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between relative",
                                card.status === 'none' 
                                    ? "bg-white border-gray-200 hover:bg-gray-50"
                                    : "bg-dialogue-neutral border-dialogue-purple"
                            )}
                        >
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                    <div className={cn(
                                        "p-3 rounded-full flex-shrink-0",
                                        card.status !== 'none' ? "bg-dialogue-purple" : getIconBgColor(card.icon || '')
                                    )}>
                                        {IconComponent && <IconComponent className={cn(
                                            "h-5 w-5",
                                            card.status !== 'none' ? "text-white" : getIconColor(card.icon || '', card.status)
                                        )} />}
                                    </div>
                                    <Badge 
                                        variant="secondary" 
                                        className={cn(
                                            "text-xs",
                                            card.status === 'none' ? "bg-white text-dialogue-purple border border-dialogue-purple" :
                                            card.status === 'good' ? "bg-dialogue-purple text-white" : 
                                            "bg-dialogue-purple text-white"
                                        )}
                                    >
                                        {card.status === 'none' ? 'To-do' : card.status}
                                    </Badge>
                                </div>
                                <h4 className="font-medium text-sm mb-1 text-gray-800">
                                    {card.title}
                                </h4>
                                <p className="text-xs leading-tight text-gray-600">
                                    {card.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
                
                {/* First don't card in top right */}
                <div
                    key={dontCards[0].id}
                    className="aspect-square p-4 rounded-lg border-2 transition-all duration-200 flex flex-col justify-between relative bg-amber-50 border-amber-200 hover:bg-amber-100"
                >
                    <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                            <div className="p-3 rounded-full flex-shrink-0 bg-red-100">
                                <X className="h-5 w-5 text-red-600" />
                            </div>
                        </div>
                        <h4 className="font-medium text-sm mb-1 text-amber-800">
                            {dontCards[0].title}
                        </h4>
                        <p className="text-xs leading-tight text-amber-700">
                            {dontCards[0].description}
                        </p>
                    </div>
                </div>

                {/* Last 3 do cards in bottom row */}
                {doCards.slice(3, 6).map((card) => {
                    const IconComponent = getIconComponent(card.icon || 'Check');
                    return (
                        <div
                            key={card.id}
                            onClick={() => handleCardClick(card.id)}
                            className={cn(
                                "aspect-square p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between relative",
                                card.status === 'none' 
                                    ? "bg-white border-gray-200 hover:bg-gray-50"
                                    : "bg-dialogue-neutral border-dialogue-purple"
                            )}
                        >
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                    <div className={cn(
                                        "p-3 rounded-full flex-shrink-0",
                                        card.status !== 'none' ? "bg-dialogue-purple" : getIconBgColor(card.icon || '')
                                    )}>
                                        {IconComponent && <IconComponent className={cn(
                                            "h-5 w-5",
                                            card.status !== 'none' ? "text-white" : getIconColor(card.icon || '', card.status)
                                        )} />}
                                    </div>
                                    <Badge 
                                        variant="secondary" 
                                        className={cn(
                                            "text-xs",
                                            card.status === 'none' ? "bg-white text-dialogue-purple border border-dialogue-purple" :
                                            card.status === 'good' ? "bg-dialogue-purple text-white" : 
                                            "bg-dialogue-purple text-white"
                                        )}
                                    >
                                        {card.status === 'none' ? 'To-do' : card.status}
                                    </Badge>
                                </div>
                                <h4 className="font-medium text-sm mb-1 text-gray-800">
                                    {card.title}
                                </h4>
                                <p className="text-xs leading-tight text-gray-600">
                                    {card.description}
                                </p>
                            </div>
                        </div>
                    );
                })}

                {/* Second don't card in bottom right */}
                <div
                    key={dontCards[1].id}
                    className="aspect-square p-4 rounded-lg border-2 transition-all duration-200 flex flex-col justify-between relative bg-amber-50 border-amber-200 hover:bg-amber-100"
                >
                    <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                            <div className="p-3 rounded-full flex-shrink-0 bg-red-100">
                                <X className="h-5 w-5 text-red-600" />
                            </div>
                        </div>
                        <h4 className="font-medium text-sm mb-1 text-amber-800">
                            {dontCards[1].title}
                        </h4>
                        <p className="text-xs leading-tight text-amber-700">
                            {dontCards[1].description}
                        </p>
                    </div>
                </div>
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
