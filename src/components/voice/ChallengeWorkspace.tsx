import ControlPanel from './ControlPanel';
import ConversationReport from './ConversationReport';
import ScoreCard from './ScoreCard';
import { useRef, useState, useEffect, useMemo } from 'react';
import type { ChallengeStep, FeedbackId } from '@/types';
import { HumeVoiceProvider, useVoice } from './HumeVoiceProvider';
import { ConversationReport as ReportType } from '@/types/conversationReport';
import { Button } from '@/components/ui/button';
import { MessageCircle, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { expressionLabels } from '@/lib/expressionLabels';
import { useRealtimeFeedback } from '@/lib/useRealtimeReport';
import { RealtimeFeedback, FeedbackItem } from '@/lib/generateRealtimeReport';

interface BehaviorCardConfig {
    id: string;
    icon: string;
    title: string;
    subtitle: string;
}

interface BehaviorCardData {
    status: 'to-do' | 'good' | 'great';
    examples: string[] | FeedbackItem[];
}
interface StepConfig {
    id: ChallengeStep;
    title: string;
    duration: number; // in seconds
    icon: string;
    subtitle: string;
    tip?: string;
}

const stepConfigs: StepConfig[] = [
    { id: 'framing', title: 'Frame the issue', duration: 60, icon: 'Sun', subtitle: 'How will you frame the issue?' },
    { id: 'listening', title: 'Listen vulnerably', duration: 180, icon: 'Heart', subtitle: 'Can you dig deep as the voter opens up?', tip: 'Getting the voter to open up can be challenging! You can say, "Can you give me a hint?" at any time.' },
    { id: 'exploring', title: 'Explore together', duration: 120, icon: 'Book', subtitle: 'How can you lead the voter to a new perspective?' },
    { id: 'calling', title: 'Call their representative', duration: 30, icon: 'Phone', subtitle: 'Ask them to take their phone right now and call their representative listed on the voter card' },
];

const behaviorCardConfigs: BehaviorCardConfig[] = stepConfigs;

function getCurrentStep(timeElapsed: number): { stepIndex: number; stepId: ChallengeStep; timeInStep: number; timeRemaining: number } {
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

function BehaviorGrid({realtimeFeedback, timeElapsed = 0, activatedFeedback = new Set(), allStepsFeedback = {}, isRoleplayEnded = false }: { realtimeFeedback?: RealtimeFeedback | null; timeElapsed?: number; activatedFeedback?: Set<FeedbackId>; allStepsFeedback?: Record<string, RealtimeFeedback>; isRoleplayEnded?: boolean }) {
    const currentStepInfo = getCurrentStep(timeElapsed);


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
        },
        'calling': {
            status: 'to-do',
            examples: []
        }
    };

    const [cardsData, setCardsData] = useState<Record<string, BehaviorCardData>>(defaultData);

    useEffect(() => {
        if (isRoleplayEnded) {
            // Show all collected feedback from all steps
            setCardsData(prev => {
                const newData = { ...prev };

                Object.entries(allStepsFeedback).forEach(([stepId, stepFeedback]) => {
                    if (newData[stepId] && stepFeedback) {
                        const feedbackItems = Object.values(stepFeedback);
                        
                        // Update status based on feedback
                        const hasPositiveFeedback = feedbackItems.some(f => f.type === 'positive');
                        const cardStatus = hasPositiveFeedback ? 'good' : newData[stepId].status;

                        newData[stepId] = {
                            ...newData[stepId],
                            examples: feedbackItems,
                            status: cardStatus
                        };
                    }
                });

                return newData;
            });
        } else if (realtimeFeedback) {
            // During roleplay, only show current step feedback
            setCardsData(prev => {
                const newData = { ...prev };

                const currentStepId = getCurrentStep(timeElapsed).stepId;

                if (newData[currentStepId]) {
                    const feedbackItems = Object.values(realtimeFeedback);

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
    }, [realtimeFeedback, timeElapsed, isRoleplayEnded, allStepsFeedback]);

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
            activatedFeedback={activatedFeedback}
            isRoleplayEnded={isRoleplayEnded}
            />
        ))}
        </div>
        </div>
    );
}

const ScenarioCard = () => {
    return (      <div className="bg-blue-50 border border-blue-200 p-4 mx-6 mt-6 rounded-lg">
        <p className="text-sm text-gray-700">
        <span className="font-semibold">Your scenario: Your home state might cut parental leave benefits. Persuade the voter to call their representative to oppose the cuts.</span>
        </p>
        <p className="text-sm text-gray-700 mt-2">
        <span>Converse naturally with the voice assistant. Try to listen actively, and not overwhelm them with facts.</span>
        </p>
        </div>);
    }

    const VoterCard = () => {
        return (<div className="bg-gray-50 border border-gray-200 p-4 mx-6 mt-4 rounded-lg">
            <h3 className="font-semibold text-sm text-gray-800 mb-3 font-sans">Voter Card</h3>
            <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-[1.2] min-w-0 md:min-w-80">
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm text-gray-700">
            <span className="font-medium">Name:</span>
            <span>Frank Hamster</span>

            <span className="font-medium">Demographic:</span>
            <span>49 year old man</span>

            <span className="font-medium">Voter registration:</span>
            <span>Registered Independent</span>

            <span className="font-medium">State representative:</span>
            <span>Peter Gerbil, phone: 555-4567</span>

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
            <div className="w-full md:w-72 flex-shrink-0">
            <img
            src="/house-sketch.png"
            alt="House sketch"
            className="w-full h-auto"
            />
            </div>
            </div>
            </div>);
        }

        function ChallengeWorkspaceContent() {
            const [report, setReport] = useState<ReportType | null>(null);
            const [timeElapsed, setTimeElapsed] = useState(0);
            const [receivedFeedbackKeys, setReceivedFeedbackKeys] = useState<Set<string>>(new Set());
            const [activatedFeedback, setActivatedFeedback] = useState<Set<import('@/types').FeedbackId>>(new Set());
            const [allStepsFeedback, setAllStepsFeedback] = useState<Record<string, RealtimeFeedback>>({});
            const [isRoleplayEnded, setIsRoleplayEnded] = useState(false);
            const { status } = useVoice();
            const isTimerActive = status.value === 'connected';

            const currentStepInfo = useMemo(() => getCurrentStep(timeElapsed), [timeElapsed]);
            const currentStep = stepConfigs[currentStepInfo.stepIndex];

            const realtimeFeedback = useRealtimeFeedback(currentStepInfo.stepId);

            // Track when roleplay ends
            useEffect(() => {
                if (status.value === 'disconnected' && timeElapsed > 0) {
                    setIsRoleplayEnded(true);
                }
                
                // Reset when starting a new roleplay
                if (status.value === 'connected') {
                    setIsRoleplayEnded(false);
                }
            }, [status.value, timeElapsed]);

            // Collect feedback for current step
            useEffect(() => {
                if (realtimeFeedback && !isRoleplayEnded) {
                    setAllStepsFeedback(prev => ({
                        ...prev,
                        [currentStepInfo.stepId]: realtimeFeedback
                    }));
                }
            }, [realtimeFeedback, currentStepInfo.stepId, isRoleplayEnded]);

            useEffect(() => {
                if (!realtimeFeedback) {
                    return;
                }
                
                const newFeedback: RealtimeFeedback = {};
                const newKeys = new Set<string>();

                Object.entries(realtimeFeedback).forEach(([key, value]) => {
                    if (!receivedFeedbackKeys.has(key) && value.type !== 'hint') {
                        newFeedback[key] = value;
                        newKeys.add(key);
                    }
                });

                if (Object.keys(newFeedback).length > 0) {
                    setReceivedFeedbackKeys(prev => new Set([...prev, ...newKeys]));

                    const newActivatedFeedback = new Set<import('@/types').FeedbackId>();
                    Object.entries(realtimeFeedback).forEach(([key, value]) => {
                        if (value.type === 'positive') {
                            newActivatedFeedback.add(key as import('@/types').FeedbackId);
                        }
                    });

                    if (newActivatedFeedback.size > 0) {
                        setActivatedFeedback(prev => {
                            const updated = new Set([...prev, ...newActivatedFeedback]);
                            return updated;
                        });
                    }
                }
            }, [realtimeFeedback, receivedFeedbackKeys]);

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


                <ScenarioCard />
                <VoterCard />

                {isTimerActive && (
                    <div className="bg-white border-b p-4">
                    <div className="text-center space-y-1">
                    <div className="flex items-center justify-center gap-2">
                    <span className="text-lg">
                    {currentStep.icon === 'Sun' ? '☀️' : currentStep.icon === 'Heart' ? '❤️' : currentStep.icon === 'Book' ? '📖' : '📞'}
                    </span>
                    <h3 className="font-medium text-dialogue-darkblue font-sans">
                    Step {currentStepInfo.stepIndex + 1}: {currentStep.title}
                    </h3>
                    </div>
                    </div>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto">
                <BehaviorGrid 
                    realtimeFeedback={realtimeFeedback} 
                    timeElapsed={timeElapsed} 
                    activatedFeedback={activatedFeedback}
                    allStepsFeedback={allStepsFeedback}
                    isRoleplayEnded={isRoleplayEnded}
                />
                </div>

                <div className="border-t bg-white">
                <RecentMessages />
                </div>

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
                </div>
            );
        }

        export function ChallengeWorkspace() {
            return (
                <HumeVoiceProvider
                configId="3f136570-42d4-4afd-b319-866e2fd76474"
                onMessage={() => {}}
                className="flex flex-col w-full min-h-[800px] h-fit bg-white rounded-lg overflow-hidden"
                >
                <ChallengeWorkspaceContent />
                </HumeVoiceProvider>
            );
        }

