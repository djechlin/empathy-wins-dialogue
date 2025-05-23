import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { SCRIPTS, SCRIPT_TITLES, ScenarioId } from '@/lib/scriptData';
import { useVoice, VoiceContextType } from '@humeai/voice-react';

export type Message = {
  type: string;
  message: {
    content: string;
    role: string;
  };
  models?: {
    prosody?: {
      scores?: Record<string, number>;
    };
  };
};

const exampleStory = `"I think of my husband Jim. We were barely making ends meet back in the 90s - still had teen band posters but didn't know how to make rent. That first Christmas together, I was determined to get him a present.

I remember standing in that dusty record shop, hands shaking a little as I slid my rare vinyl across the counter. 'You sure about this?' the dealer asked, eyebrows raised. I nodded, thinking of Jim's face when he'd open the guitar case I'd bought with that money. The leather smell of that handcrafted strap, how perfectly it would match his uncle's vintage guitar. Worth it.

Christmas Eve came, and Jim handed me a wrapped package. Inside was a record by the same band I'd just sold. His eyes sparkled as he told me he'd been secretly giving guitar lessons on weekends to save up. I burst out laughing right there - couldn't help it. And you know, we felt pretty good that Christmas. It was just the two of us, like we wanted it. We didn't have much, but I loved him and I really knew he loved me."`;

export default function ScriptBar({
  callId,
}: {
  callId: ScenarioId;
}) {

    const { messages }: VoiceContextType = useVoice();

  const [showExampleStory, setShowExampleStory] = useState(false);
  const [showCodeReviewHint, setShowCodeReviewHint] = useState(false);
  const [showLandlordHint, setShowLandlordHint] = useState(false);


  const [triggeredSteps, triggeredItems] = useMemo(() => {
    const userMessages = messages?.filter((msg) => msg.type === 'user_message');
    if (userMessages.length === 0) return [new Set(), new Set()];
    const lastUserMessage = userMessages[userMessages.length - 1] as Message;
    const triggeredSteps = new Set<number>();
    const triggeredDescriptions = new Set<string>();
    SCRIPTS[callId]?.forEach((step, stepIndex) => {
      step.description.forEach((description, descriptionIndex) => {
        if (
          description.triggers?.some((trigger) =>
            lastUserMessage.message.content.toLowerCase().includes(trigger)
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
  const scriptTitle = SCRIPT_TITLES[callId];

  return (
    <div className="min-h-[800px] h-fit w-full bg-card border-r border-border">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">{scriptTitle}</h2>
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
                  <p
                    key={itemIndex}
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
                ))}

                {stepIndex === 1 && callId === 'intro-canvassing' && (
                  <>
                    <button
                      onClick={() => setShowLandlordHint(!showLandlordHint)}
                      className="flex items-center gap-1 text-xs mt-3 text-primary hover:text-primary/80 transition-colors"
                    >
                      {showLandlordHint ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      <span>{showLandlordHint ? 'Hide hint' : 'Show hint'}</span>
                    </button>

                    {showLandlordHint && (
                      <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded text-xs">
                        <p className="text-blue-800 dark:text-blue-300">
                          Ask about her landlord situation to hear her personal housing story.
                        </p>
                      </div>
                    )}
                  </>
                )}

                {stepIndex === 1 && callId === 'code-review-junior-feedback' && (
                  <>
                    <button
                      onClick={() => setShowCodeReviewHint(!showCodeReviewHint)}
                      className="flex items-center gap-1 text-xs mt-3 text-primary hover:text-primary/80 transition-colors"
                    >
                      {showCodeReviewHint ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      <span>{showCodeReviewHint ? 'Hide hint' : 'Show hint'}</span>
                    </button>

                    {showCodeReviewHint && (
                      <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded text-xs">
                        <p className="text-blue-800 dark:text-blue-300">
                          When you offer to pair program the junior colleague will be happy.
                        </p>
                      </div>
                    )}
                  </>
                )}

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

                    <button
                      onClick={() => setShowExampleStory(!showExampleStory)}
                      className="flex items-center gap-1 text-xs mt-3 text-primary hover:text-primary/80 transition-colors"
                    >
                      {showExampleStory ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      <span>{showExampleStory ? 'Hide example story' : 'Show example story'}</span>
                    </button>

                    {showExampleStory && (
                      <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded text-xs">
                        <h4 className="font-medium mb-1 text-green-800 dark:text-green-300">
                          Example Story:
                        </h4>
                        <p className="whitespace-pre-line">{exampleStory}</p>
                        <p className="mt-2 italic text-green-700/70 dark:text-green-400/70 text-[10px]">
                          Adapted from &ldquo;Gift of the Magi&rdquo;
                        </p>
                      </div>
                    )}
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