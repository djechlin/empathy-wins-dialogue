
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useVoice } from './HumeVoiceProvider';

interface ChecklistItem {
  id: string;
  text: string;
  type: 'do' | 'dont';
  completed: boolean | null; // null = not attempted, true = success, false = failure
  triggers: string[]; // keywords that indicate this practice
  antiTriggers?: string[]; // keywords that indicate violation of this practice
}

const checklistItems: ChecklistItem[] = [
  {
    id: 'share-story',
    text: 'Share a personal, vulnerable story',
    type: 'do',
    completed: null,
    triggers: ['my', 'i', 'personal', 'story', 'experience', 'happened to me'],
    antiTriggers: []
  },
  {
    id: 'ask-questions',
    text: 'Ask open-ended questions about their experiences',
    type: 'do',
    completed: null,
    triggers: ['?', 'what', 'how', 'why', 'tell me', 'can you share'],
    antiTriggers: []
  },
  {
    id: 'active-listening',
    text: 'Demonstrate active listening with reflective responses',
    type: 'do',
    completed: null,
    triggers: ['that sounds', 'i hear', 'it seems like', 'i understand', 'that must'],
    antiTriggers: []
  },
  {
    id: 'find-common-ground',
    text: 'Look for shared values and experiences',
    type: 'do',
    completed: null,
    triggers: ['both', 'we both', 'similar', 'same', 'agree', 'common'],
    antiTriggers: []
  },
  {
    id: 'show-empathy',
    text: 'Express genuine empathy for their perspective',
    type: 'do',
    completed: null,
    triggers: ['sorry', 'difficult', 'hard', 'understand', 'feel'],
    antiTriggers: []
  },
  {
    id: 'avoid-arguments',
    text: "Don't argue or debate facts",
    type: 'dont',
    completed: null,
    triggers: [],
    antiTriggers: ['wrong', 'incorrect', 'that\'s not true', 'actually', 'but the facts', 'you\'re mistaken']
  },
  {
    id: 'avoid-dismissing',
    text: "Don't dismiss their concerns as invalid",
    type: 'dont',
    completed: null,
    triggers: [],
    antiTriggers: ['that\'s silly', 'ridiculous', 'doesn\'t matter', 'not important', 'overreacting']
  },
  {
    id: 'avoid-lecturing',
    text: "Don't lecture or give long monologues",
    type: 'dont',
    completed: null,
    triggers: [],
    antiTriggers: [] // This would need message length analysis
  },
  {
    id: 'avoid-assumptions',
    text: "Don't make assumptions about their beliefs",
    type: 'dont',
    completed: null,
    triggers: [],
    antiTriggers: ['you people', 'people like you', 'you probably', 'you always', 'you never']
  },
  {
    id: 'stay-respectful',
    text: 'Maintain respect even when disagreeing',
    type: 'do',
    completed: null,
    triggers: ['respect', 'appreciate', 'value', 'thank you', 'grateful'],
    antiTriggers: []
  }
];

export default function DeepCanvassingChecklist() {
  const [items, setItems] = useState<ChecklistItem[]>(checklistItems);
  const { messages } = useVoice();

  useEffect(() => {
    const userMessages = messages?.filter(msg => msg.type === 'user_message') || [];
    if (userMessages.length === 0) return;

    const lastUserMessage = userMessages[userMessages.length - 1];
    const messageContent = lastUserMessage.message?.content?.toLowerCase() || '';

    setItems(currentItems => 
      currentItems.map(item => {
        // Check for positive triggers (do's)
        if (item.type === 'do' && item.completed === null) {
          const hasPositiveTrigger = item.triggers.some(trigger => 
            messageContent.includes(trigger.toLowerCase())
          );
          if (hasPositiveTrigger) {
            return { ...item, completed: true };
          }
        }

        // Check for negative triggers (don'ts)
        if (item.type === 'dont' && item.completed === null && item.antiTriggers) {
          const hasNegativeTrigger = item.antiTriggers.some(trigger => 
            messageContent.includes(trigger.toLowerCase())
          );
          if (hasNegativeTrigger) {
            return { ...item, completed: false };
          }
        }

        return item;
      })
    );
  }, [messages]);

  const completedCount = items.filter(item => item.completed === true).length;
  const failedCount = items.filter(item => item.completed === false).length;
  const totalCount = items.length;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Deep Canvassing Checklist</span>
          <span className="text-sm font-normal">
            {completedCount}/{totalCount}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              'flex items-start gap-3 p-3 rounded-lg border transition-all',
              item.completed === true && 'bg-green-50 border-green-200',
              item.completed === false && 'bg-red-50 border-red-200',
              item.completed === null && 'bg-gray-50 border-gray-200'
            )}
          >
            <div className="flex-shrink-0 mt-0.5">
              {item.completed === true && (
                <Check className="h-5 w-5 text-green-600" />
              )}
              {item.completed === false && (
                <X className="h-5 w-5 text-red-600" />
              )}
              {item.completed === null && (
                <Circle className="h-5 w-5 text-gray-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn(
                'text-sm font-medium',
                item.type === 'do' ? 'text-green-800' : 'text-red-800',
                item.completed === null && 'text-gray-600'
              )}>
                {item.type === 'do' ? 'DO: ' : "DON'T: "}
                {item.text}
              </p>
            </div>
          </div>
        ))}
        
        {completedCount > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">
              Great job! You've successfully demonstrated {completedCount} best practices.
            </p>
          </div>
        )}
        
        {failedCount > 0 && (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800 font-medium">
              Watch out: {failedCount} practices to avoid were detected.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
