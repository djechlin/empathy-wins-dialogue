
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { Script, Step, StepItem} from '@/types';
import { SCRIPTS } from '@/lib/scriptData';
import { useVoice, VoiceContextType, UserTranscriptMessage } from '@humeai/voice-react';

interface HintProps {
  hint: string;
}

function Hint({ hint }: HintProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
    <button
    onClick={() => setIsExpanded(!isExpanded)}
    className="flex items-center gap-1 text-xs mt-2 text-primary hover:text-primary/80 transition-colors"
    >
    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
    <span>{isExpanded ? 'Hide hint' : 'Show hint'}</span>
    </button>

    {isExpanded && (
      <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded text-xs">
      <p className="text-blue-800 dark:text-blue-300 whitespace-pre-wrap">
      {hint}
      </p>
      </div>
    )}
    </>
  );
}

interface StepProps {
  step: Step;
  stepIndex: number;
  isTriggered: boolean;
  triggeredItems: Set<string>;
}

function Step({ step, stepIndex, isTriggered, triggeredItems }: StepProps) {
  return (
    <div
    className={cn(
      'p-3 rounded-lg border transition-colors duration-300',
      isTriggered
      ? 'bg-green-100 dark:bg-green-900/20 border-green-500'
      : 'bg-muted/50 border-border'
    )}
    >
    <h3 className="text-md font-medium mb-2 text-primary">{step.name}</h3>
    <div className="space-y-2 text-sm">
    {step.items.map((item: StepItem, itemIndex: number) => (
      <div key={itemIndex}>
      <p
      className={cn(
        (!item.triggers || item.triggers.length === 0)
        ? 'p-2 rounded border transition-colors duration-300 bg-background border-border'
        : 'italic text-xs mt-1',
        triggeredItems.has(`${stepIndex}-${itemIndex}`)
        && 'bg-green-100 dark:bg-green-900/30 border-green-500 dark:border-green-500/50'
      )}
      >
      {item.text}
      </p>
      {item.hint && (
        <Hint hint={item.hint} />
      )}
      </div>
    ))}
    </div>
    </div>
  );
}

  export default function ScriptBar({ script }: { script: Script;}) {

    const { messages }: VoiceContextType = useVoice();

    const [triggeredSteps, triggeredItems] = useMemo<[Set<number>, Set<string>]> (() => {
      const userMessages = messages?.filter((msg): msg is UserTranscriptMessage => msg.type === 'user_message');
      if (!userMessages || userMessages.length === 0) return [new Set(), new Set()];
      const lastUserMessage = userMessages[userMessages.length - 1];
      const triggeredSteps = new Set<number>();
      const triggeredDescriptions = new Set<string>();
      script.forEach((step, stepIndex) => {
        step.items.forEach((description, descriptionIndex) => {
          if (
            description.triggers?.some((trigger) =>
              lastUserMessage.message?.content?.toLowerCase()?.includes(trigger)
          )
        ) {
          triggeredSteps.add(stepIndex);
          triggeredDescriptions.add(`${stepIndex}-${descriptionIndex}`);
        }
      });
    });

    return [triggeredSteps, triggeredDescriptions];
  }, [messages, script]);

  return (
    <div className="min-h-[800px] h-fit w-full bg-card border-r border-border">
    <div className="p-4">
    <h2 className="text-lg font-semibold mb-4">Script</h2>
    <div className="space-y-6">
    {script.map((step, stepIndex) => (
      <Step
      key={stepIndex}
      step={step}
      stepIndex={stepIndex}
      isTriggered={triggeredSteps.has(stepIndex)}
      triggeredItems={triggeredItems}
      />
    ))}
    </div>
    </div>
    </div>
  );
}
