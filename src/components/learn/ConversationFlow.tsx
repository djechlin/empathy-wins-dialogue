
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface FlowStepProps {
  number: number;
  title: string;
  description: string;
  isLast?: boolean;
}

const FlowStep: React.FC<FlowStepProps> = ({ number, title, description, isLast = false }) => {
  return (
    <div className="flex items-start gap-4">
      <div className="flex flex-col items-center">
        <div className="w-6 h-6 bg-dialogue-purple text-white rounded-full flex items-center justify-center font-semibold text-xs">
          {number}
        </div>
        {!isLast && <div className="w-0.5 h-16 bg-dialogue-purple/30 mt-2"></div>}
      </div>
      <div className="flex-1 pb-8">
        <h4 className="font-semibold text-dialogue-darkblue mb-2">{title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

const ConversationFlow: React.FC = () => {
  const steps = [
    {
      title: "Opening & Scale Rating",
      description: "Canvasser opens with their name, what issue they're supporting, and asks the voter to rate their support on a scale of 1-10."
    },
    {
      title: "Explore Personal Connections",
      description: "Canvasser asks the voter who they know who's affected by the issue and begins exploring the issue with them."
    },
    {
      title: "Share Personal Stories",
      description: "If needed, canvasser shares their story unrelated to politics, just about a time a loved one was there for them, and elicits a similar story from the voter."
    },
    {
      title: "Support & Community Exploration",
      description: "Canvasser gives the voter support as they explore the issue and how it relates to people in their community."
    },
    {
      title: "Second Rating & Reflection",
      description: "Canvasser asks the voter to rate their support a second time, giving the voter a chance to notice if their number has changed."
    }
  ];

  return (
    <Card className="border-dialogue-neutral">
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="font-semibold text-dialogue-darkblue text-lg">Deep Canvassing Conversation Flow</h3>
          <p className="text-sm text-muted-foreground mt-1">A step-by-step guide to conducting effective deep canvassing conversations</p>
        </div>
        <div className="space-y-0">
          {steps.map((step, index) => (
            <FlowStep
              key={index}
              number={index + 1}
              title={step.title}
              description={step.description}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversationFlow;
