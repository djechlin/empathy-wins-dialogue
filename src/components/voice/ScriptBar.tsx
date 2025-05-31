
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { SCRIPTS, ScenarioId } from '@/lib/scriptData';
import { useVoice, VoiceContextType } from '@humeai/voice-react';

export default function ScriptBar({
  callId,
}: {
  callId: ScenarioId;
}) {

    const { messages }: VoiceContextType = useVoice();

  const [expandedHints, setExpandedHints] = useState<Set<string>>(new Set());

  const toggleHint = (hintId: string) => {
    const newExpanded = new Set(expandedHints);
    if (newExpanded.has(hintId)) {
      newExpanded.delete(hintId);
    } else {
      newExpanded.add(hintId);
    }
    setExpandedHints(newExpanded);
  };


  const [triggeredSteps, triggeredItems] = useMemo(() => {
    const userMessages = messages?.filter((msg) => msg.type === 'user_message');
    if (userMessages.length === 0) return [new Set(), new Set()];
    const lastUserMessage = userMessages[userMessages.length - 1];
    const triggeredSteps = new Set<number>();
    const triggeredDescriptions = new Set<string>();
    SCRIPTS[callId]?.forEach((step, stepIndex) => {
      step.description.forEach((description, descriptionIndex) => {
        if (
          description.triggers?.some((trigger) =>
            (lastUserMessage as any).message?.content?.toLowerCase()?.includes(trigger)
          )
        ) {
          triggeredSteps.add(stepIndex);
          triggeredDescriptions.add(`${stepIndex}-${descriptionIndex}`);
        }
      });
    });

    return [triggeredSteps, triggeredDescriptions];
  }, [messages, callId]);

  const callSteps = SCRIPTS[callId] || [];

  return (
    <div className="min-h-[800px] h-fit w-full bg-card border-r border-border">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Script</h2>
        <div className="space-y-6">
          {callSteps.map((step, stepIndex) => (
            <div
              key={stepIndex}
              className={cn(
                'p-3 rounded-lg border transition-colors duration-300',
                triggeredSteps.has(stepIndex)
                  ? 'bg-green-100 dark:bg-green-900/20 border-green-500'
                  : 'bg-muted/50 border-border'
              )}
            >
              <h3 className="text-md font-medium mb-2 text-primary">{step.name}</h3>
              <div className="space-y-2 text-sm">
                {step.description.map((item, itemIndex) => (
                  <div key={itemIndex}>
                    <p
                      className={cn(
                        item.isScript
                          ? 'p-2 rounded border transition-colors duration-300'
                          : 'italic text-xs mt-1',
                        triggeredItems.has(`${stepIndex}-${itemIndex}`)
                          ? 'bg-green-100 dark:bg-green-900/30 border-green-500 dark:border-green-500/50'
                          : item.isScript
                            ? 'bg-background border-border'
                            : ''
                      )}
                    >
                      {item.text}
                    </p>
                    {item.hint && (
                      <>
                        <button
                          onClick={() => toggleHint(`${stepIndex}-${itemIndex}`)}
                          className="flex items-center gap-1 text-xs mt-2 text-primary hover:text-primary/80 transition-colors"
                        >
                          {expandedHints.has(`${stepIndex}-${itemIndex}`) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          <span>{expandedHints.has(`${stepIndex}-${itemIndex}`) ? 'Hide hint' : 'Show hint'}</span>
                        </button>

                        {expandedHints.has(`${stepIndex}-${itemIndex}`) && (
                          <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded text-xs">
                            <p className="text-blue-800 dark:text-blue-300 whitespace-pre-wrap">
                              {item.hint}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}


                {stepIndex === 1 && callId === 'deep-canvassing' && (
                  <>
                    <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded text-xs">
                      <h4 className="font-medium mb-1 text-blue-800 dark:text-blue-300">
                        Story Checklist:
                      </h4>
                      <ul className="list-none space-y-1.5">
                        <li className="flex items-start gap-1.5">
                          <div className="min-w-4 h-4 mt-0.5 border border-blue-400 dark:border-blue-600 rounded flex items-center justify-center bg-blue-100 dark:bg-blue-900/30">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-blue-500 dark:text-blue-400"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          <span>Say you love them and use their name</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <div className="min-w-4 h-4 mt-0.5 border border-blue-400 dark:border-blue-600 rounded flex items-center justify-center bg-blue-100 dark:bg-blue-900/30">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-blue-500 dark:text-blue-400"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          <span>Don&apos;t mention issues, voting or politics</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <div className="min-w-4 h-4 mt-0.5 border border-blue-400 dark:border-blue-600 rounded flex items-center justify-center bg-blue-100 dark:bg-blue-900/30">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-blue-500 dark:text-blue-400"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          <span>Tell a memorable moment in time they were there for you</span>
                        </li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
