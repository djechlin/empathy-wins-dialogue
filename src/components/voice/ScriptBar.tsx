import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, CheckCircle, Circle } from 'lucide-react';
import type { Script, Step, StepItem} from '@/types';
import { useVoice } from './HumeVoiceProvider';
import type { UserTranscriptMessage } from '@humeai/voice-react';

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
  isCurrentStep: boolean;
}

function Step({ step, stepIndex, isTriggered, triggeredItems, isCurrentStep }: StepProps) {
  return (
    <div
      className={cn(
        'p-4 rounded-lg border transition-all duration-300',
        isTriggered
          ? 'bg-green-100 dark:bg-green-900/20 border-green-500 shadow-sm'
          : isCurrentStep
          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 shadow-sm ring-2 ring-blue-200'
          : 'bg-muted/30 border-border'
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        {isTriggered ? (
          <CheckCircle className="size-5 text-green-600" />
        ) : (
          <Circle className={cn(
            "size-5",
            isCurrentStep ? "text-blue-600" : "text-gray-400"
          )} />
        )}
        <h3 className={cn(
          "text-lg font-semibold",
          isTriggered ? "text-green-800" : isCurrentStep ? "text-blue-800" : "text-gray-600"
        )}>
          Step {stepIndex + 1}: {step.name}
        </h3>
        {isCurrentStep && !isTriggered && (
          <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full font-medium">
            Current
          </span>
        )}
      </div>
      
      <div className="space-y-3 text-sm">
        {step.items.map((item: StepItem, itemIndex: number) => (
          <div key={itemIndex}>
            <p
              className={cn(
                (!item.triggers || item.triggers.length === 0)
                  ? 'p-3 rounded border transition-colors duration-300 bg-background border-border'
                  : 'italic text-xs mt-1 text-gray-600',
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

export default function ScriptBar({ script }: { script: Script }) {
  const { messages } = useVoice();

  const [triggeredSteps, triggeredItems, currentStepIndex] = useMemo<[Set<number>, Set<string>, number]>(() => {
    const userMessages = messages?.filter((msg): msg is UserTranscriptMessage => msg.type === 'user_message');
    if (!userMessages || userMessages.length === 0) return [new Set(), new Set(), 0];
    
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

    // Determine current step (first non-triggered step, or last step if all triggered)
    let currentStep = 0;
    for (let i = 0; i < script.length; i++) {
      if (!triggeredSteps.has(i)) {
        currentStep = i;
        break;
      }
      if (i === script.length - 1) {
        currentStep = i; // All steps triggered, stay on last step
      }
    }

    return [triggeredSteps, triggeredDescriptions, currentStep];
  }, [messages, script]);

  return (
    <div className="h-full w-full bg-card overflow-y-auto">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2 text-primary">Conversation Script</h2>
          <p className="text-sm text-gray-600">
            Follow these steps to guide your conversation. Complete each step before moving to the next.
          </p>
        </div>
        
        <div className="space-y-4">
          {script.map((step, stepIndex) => (
            <Step
              key={stepIndex}
              step={step}
              stepIndex={stepIndex}
              isTriggered={triggeredSteps.has(stepIndex)}
              triggeredItems={triggeredItems}
              isCurrentStep={stepIndex === currentStepIndex}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
