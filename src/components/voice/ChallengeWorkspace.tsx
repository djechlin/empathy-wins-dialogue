import ControlPanel from './ControlPanel';
import ConversationReport from './ConversationReport';
import ScoreCard from './ScoreCard';
import { useRef, useState, useEffect } from 'react';
import type { Challenge } from '@/types';
import { HumeVoiceProvider, useVoice } from './HumeVoiceProvider';
import { ConversationReport as ReportType } from '@/types/conversationReport';
import { Button } from '@/components/ui/button';
import { MessageCircle, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { expressionLabels } from '@/lib/expressionLabels';
import { generateRealtimeReport } from '@/lib/claudeReport';

interface ChallengeWorkspaceProps {
    challenge: Challenge;
    isMock?: boolean;
    mock?: boolean;
}

interface BehaviorCardConfig {
    id: string;
    icon: string;
    title: string;
    subtitle: string;
}

interface FeedbackItem {
    type: 'positive' | 'negative' | 'hint' | 'neutral';
    text: string;
    icon: string;
}

interface BehaviorCardData {
    status: 'to-do' | 'good' | 'great';
    examples: string[] | FeedbackItem[];
}

// The server now returns step-specific feedback based on current step
interface RealtimeFeedback {
    [key: string]: string; // e.g. { "askQuestions": "✓ Good job", "noLecturing": "! Too much info" }
}
interface StepConfig {
    id: string;
    title: string;
    duration: number; // in seconds
    icon: string;
    subtitle: string;
}

const stepConfigs: StepConfig[] = [
    { id: 'framing', title: 'Frame the issue', duration: 30, icon: 'Sun', subtitle: 'How will you frame the issue?' },
    { id: 'listening', title: 'Listen vulnerably', duration: 120, icon: 'Heart', subtitle: 'Can you dig deep as the voter opens up?' },
    { id: 'exploring', title: 'Explore together', duration: 120, icon: 'Book', subtitle: 'How can you lead the voter to a new perspective?' },
];

const behaviorCardConfigs: BehaviorCardConfig[] = stepConfigs;

function getCurrentStep(timeElapsed: number): { stepIndex: number; stepId: string; timeInStep: number; timeRemaining: number } {
    let totalTime = 0;

    for (let i = 0; i < stepConfigs.length; i++) {
        const step = stepConfigs[i];
        if (timeElapsed <= totalTime + step.duration) {
            return {
                stepIndex: i,
                stepId: step.id,
                timeInStep: timeElapsed - totalTime,
                timeRemaining: step.duration - (timeElapsed - totalTime)
            };
        }
        totalTime += step.duration;
    }

    // If past all steps, return the last step
    const lastStep = stepConfigs[stepConfigs.length - 1];
    return {
        stepIndex: stepConfigs.length - 1,
        stepId: lastStep.id,
        timeInStep: timeElapsed - (totalTime - lastStep.duration),
        timeRemaining: 0
    };
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
            <p className="text-sm">Roleplay not started yet</p>
            </div>
        );
    }

    return (
        <div className="p-4">
        <div
        ref={containerRef}
        className="space-y-3 max-h-64 overflow-y-auto"
        >
        {recentMessages.map((msg, index) => {
            // Only fade the most recent (bottom) message slightly
            const isOldestVisible = index === 0;
            const opacity = isOldestVisible ? 0.7 : 1;
            const speaker = msg.message.role === 'user' ? 'You' : 'Voter';

            // Get top 3 emotions for both user and assistant messages
            const getTopEmotions = () => {
                if (msg.models?.prosody?.scores) {
                    const scores = msg.models.prosody.scores;
                    return Object.entries(scores)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 3)
                        .map(([emotion]) => ({
                            label: expressionLabels[emotion] || emotion
                        }));
                }
                return [];
            };

            const topEmotions = getTopEmotions();

            return (
                <div
                key={index}
                className={cn(
                    'p-3 rounded-lg border transition-all duration-500 ease-in-out',
                    msg.type === 'user_message'
                    ? 'bg-blue-50 border-blue-200 mr-8'
                    : 'bg-gray-50 border-gray-200 ml-8'
                )}
                style={{ opacity }}
                >
                <div className="text-sm leading-relaxed">
                <span className="font-medium opacity-70">{speaker}: </span>
                <span className="font-mono tracking-tight">{msg.message.content}</span>
                </div>
                {topEmotions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                        {topEmotions.map((emotion, emotionIndex) => (
                            <span
                                key={emotionIndex}
                                className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full"
                            >
                                {emotion.label}
                            </span>
                        ))}
                    </div>
                )}
                </div>
            );
        })}
        </div>
        </div>
    );
}

function BehaviorGrid({ mock = false, realtimeFeedback, timeElapsed = 0 }: { mock?: boolean; realtimeFeedback?: RealtimeFeedback | null; timeElapsed?: number }) {
    const currentStepInfo = getCurrentStep(timeElapsed);
    const mockData: Record<string, BehaviorCardData> = {
        'framing': {
            status: 'great',
            examples: ['Think about how much easier it would be for families like yours', 'Imagine if you didn\'t have to worry about these costs']
        },
        'listening': {
            status: 'good',
            examples: ['I remember when my grandmother needed healthcare and we struggled with the costs']
        },
        'exploring': {
            status: 'to-do',
            examples: []
        }
    };

    const defaultData: Record<string, BehaviorCardData> = {
        'framing': {
            status: 'to-do',
            examples: ['Try saying: I\'m <my name>, here to talk about an issue important to me...']
        },
        'listening': {
            status: 'to-do',
            examples: ['Try asking: How do you think this issue impacts your community? You can share a story about someone close to you impacted by the issue as well.']
        },
        'exploring': {
            status: 'to-do',
            examples: ['Try asking: After talking about people close to us, do you see things differently?']
        }
    };

    const [cardsData, setCardsData] = useState<Record<string, BehaviorCardData>>(
        mock ? mockData : defaultData
    );

    // Update cards based on realtime feedback (skip in mock mode)
    useEffect(() => {
        if (realtimeFeedback && !mock) {
            setCardsData(prev => {
                const newData = { ...prev };

                // Get current step to update the right card
                const currentStepId = getCurrentStep(timeElapsed).stepId;

                if (newData[currentStepId]) {
                    // Parse all feedback for the current step
                    const feedbackItems = Object.values(realtimeFeedback).map(text => {
                        if (text.startsWith('✓')) {
                            return {
                                type: 'positive' as const,
                                text: text.substring(1).trim(),
                                icon: '✓'
                            };
                        } else if (text.startsWith('!')) {
                            return {
                                type: 'negative' as const,
                                text: text.substring(1).trim(),
                                icon: '!'
                            };
                        } else if (text.startsWith('?')) {
                            return {
                                type: 'hint' as const,
                                text: text.substring(1).trim(),
                                icon: '?'
                            };
                        } else {
                            return {
                                type: 'neutral' as const,
                                text: text.trim(),
                                icon: ''
                            };
                        }
                    });

                    // Update status based on feedback
                    const hasPositiveFeedback = feedbackItems.some(f => f.type === 'positive');
                    const cardStatus = hasPositiveFeedback ? 'good' : newData[currentStepId].status;

                    // Update the current step's card with feedback
                    newData[currentStepId] = {
                        ...newData[currentStepId],
                        examples: feedbackItems,
                        status: cardStatus
                    };
                }

                return newData;
            });
        }
    }, [realtimeFeedback, timeElapsed, mock]);

    return (
        <div className="px-6 py-4">
        <div className="space-y-4">
        {/* All cards stacked vertically */}
        {behaviorCardConfigs.map((config, index) => (
            <ScoreCard
            key={config.id}
            config={config}
            data={cardsData[config.id]}
            stepNumber={index + 1}
            isCurrentStep={currentStepInfo.stepIndex === index}
            />
        ))}
        </div>
        </div>
    );
}

function ChallengeWorkspaceContent({ challenge, mock = false }: ChallengeWorkspaceProps) {
    const [report, setReport] = useState<ReportType | null>(null);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [realtimeFeedback, setRealtimeFeedback] = useState<RealtimeFeedback | null>(null);
    const [receivedFeedbackKeys, setReceivedFeedbackKeys] = useState<Set<string>>(new Set());
    const { status, messages } = useVoice();
    const isTimerActive = status.value === 'connected';

    // Get current step info
    const currentStepInfo = getCurrentStep(timeElapsed);
    const currentStep = stepConfigs[currentStepInfo.stepIndex];

    // Track message count to trigger realtime feedback
    useEffect(() => {
        if (!mock && messages.length > 0 && isTimerActive) {
            // Only process when we have at least one exchange (2 messages)
            const conversationMessages = messages.filter(msg =>
                msg.type === 'user_message' || msg.type === 'assistant_message'
            );

            if (conversationMessages.length >= 2 && conversationMessages.length % 2 === 0) {
                // Generate transcript from messages
                const transcript = conversationMessages
                    .map(msg => {
                        const role = msg.message.role === 'user' ? 'Canvasser' : 'Voter';
                        return `${role}: ${msg.message.content}`;
                    })
                    .join('\n\n');

                // Call realtime feedback
                generateRealtimeReport(transcript, currentStepInfo.stepId)
                    .then(feedback => {
                        if (feedback) {
                            // Filter out feedback keys we've already received
                            const newFeedback: RealtimeFeedback = {};
                            const newKeys = new Set<string>();

                            Object.entries(feedback).forEach(([key, value]) => {
                                if (!receivedFeedbackKeys.has(key)) {
                                    newFeedback[key] = value;
                                    newKeys.add(key);
                                }
                            });

                            // Only update state if we have new feedback
                            if (Object.keys(newFeedback).length > 0) {
                                setRealtimeFeedback(newFeedback);
                                setReceivedFeedbackKeys(prev => new Set([...prev, ...newKeys]));
                            }
                        }
                    })
                    .catch(error => {
                        console.error('Error getting realtime feedback:', error);
                    });
            }
        }
    }, [messages, isTimerActive, mock, receivedFeedbackKeys, currentStepInfo.stepId]);

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
            {/* Scenario Description */}
            <div className="bg-blue-50 border border-blue-200 p-4 mx-6 mt-6 rounded-lg">
                <p className="text-sm text-gray-700">
                    <span className="font-semibold">Your scenario:</span> {challenge.voterAction}
                </p>
                <p className="text-sm text-gray-700 mt-2">
                    <span>Converse naturally with the voice assistant. Try to listen actively, and not overwhelm them with facts.</span>
                </p>
            </div>

            {/* Voter Card */}
            <div className="bg-gray-50 border border-gray-200 p-4 mx-6 mt-4 rounded-lg">
                <h3 className="font-semibold text-sm text-gray-800 mb-3 font-sans">Voter Card</h3>
                <div className="flex gap-4 items-start">
                    <div className="flex-1">
                        <div className="space-y-1 text-sm text-gray-700">
                            <p><span className="font-medium">Name:</span> Frank Hilltop, 52M</p>
                            <p><span className="font-medium">Address:</span> 123 Oak Ln, Suburbville</p>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">Voting record:</span>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1">
                                        <Check className="h-3 w-3 text-green-600" />
                                        <span className="text-xs">2016</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Check className="h-3 w-3 text-green-600" />
                                        <span className="text-xs">2020</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <X className="h-3 w-3 text-red-600" />
                                        <span className="text-xs">2024</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-80 flex-shrink-0 self-start">
                        <img 
                            src="/house-sketch.png" 
                            alt="House sketch" 
                            className="w-full rounded border"
                        />
                    </div>
                </div>
            </div>

            {/* Control Section - Only show when active */}
            {isTimerActive && (
                <div className="bg-white border-b p-4">
                    <div className="text-center space-y-1">
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-lg">
                                {currentStep.icon === 'Sun' ? '☀️' : currentStep.icon === 'Heart' ? '❤️' : '📖'}
                            </span>
                            <h3 className="font-medium text-dialogue-darkblue">
                                Step {currentStepInfo.stepIndex + 1}: {currentStep.title}
                            </h3>
                        </div>
                        <div className="mt-4">
                            <ControlPanel
                                onReportGenerated={setReport}
                                isTimerActive={isTimerActive}
                                timeElapsed={timeElapsed}
                                onTimeChange={setTimeElapsed}
                                currentStepInfo={currentStepInfo}
                                currentStep={currentStep}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Behavior Cards Grid */}
            <div className="flex-1 overflow-y-auto">
                <BehaviorGrid mock={mock} realtimeFeedback={realtimeFeedback} timeElapsed={timeElapsed} />
            </div>

            {/* Recent Messages */}
            <div className="border-t bg-white">
                <RecentMessages />
            </div>

            {/* Control Panel - Show when not active */}
            {!isTimerActive && (
                <div className="border-t bg-white p-4 text-center">
                    <ControlPanel
                        onReportGenerated={setReport}
                        isTimerActive={isTimerActive}
                        timeElapsed={timeElapsed}
                        onTimeChange={setTimeElapsed}
                        currentStepInfo={currentStepInfo}
                        currentStep={currentStep}
                    />
                </div>
            )}
        </div>
    );
}

export function ChallengeWorkspace({ challenge, isMock = false, mock = false }: ChallengeWorkspaceProps) {
    return (
        <HumeVoiceProvider
        configId={challenge.humePersona}
        onMessage={() => {}}
        className="flex flex-col w-full min-h-[800px] h-fit bg-white rounded-lg overflow-hidden"
        isMock={isMock}
        >
        <ChallengeWorkspaceContent challenge={challenge} mock={mock} />
        </HumeVoiceProvider>
    );
}
