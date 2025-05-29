
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MessageProps {
  speaker: 'canvasser' | 'voter';
  message: string;
  isLast?: boolean;
}

const Message: React.FC<MessageProps> = ({ speaker, message, isLast = false }) => {
  const isCanvasser = speaker === 'canvasser';
  
  return (
    <div className="flex flex-col gap-2">
      <div className={`flex ${isCanvasser ? 'justify-start' : 'justify-end'} gap-2`}>
        <div className={`max-w-[80%] px-4 py-3 rounded-lg ${
          isCanvasser 
            ? 'bg-dialogue-purple text-white' 
            : 'bg-white border border-dialogue-purple text-dialogue-darkblue'
        }`}>
          <p className="text-sm leading-relaxed">{message}</p>
        </div>
      </div>
      {!isLast && <div className="h-3"></div>}
    </div>
  );
};

interface PhaseTimelineProps {
  number: number;
  title: string;
  description: string;
}

const PhaseTimeline: React.FC<PhaseTimelineProps> = ({ number, title, description }) => (
  <div className="flex items-start gap-6 mb-8">
    <div className="flex flex-col items-center flex-shrink-0">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-8 h-8 rounded-full bg-dialogue-purple text-white flex items-center justify-center text-sm font-semibold hover:bg-dialogue-purple/80 transition-colors cursor-help">
              {number}
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-xs">
            <p className="font-medium">{title}</p>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="w-0.5 h-16 bg-dialogue-purple/30 mt-2"></div>
    </div>
    <div className="flex-1 pt-1">
      <h4 className="font-medium text-dialogue-darkblue text-sm mb-4">{title}</h4>
    </div>
  </div>
);

const ConversationFlow: React.FC = () => {
  const phases = [
    {
      number: 1,
      title: "Introduce the issue",
      description: "Start with a clear, direct question about the topic to gauge initial support and establish the conversation framework."
    },
    {
      number: 2,
      title: "Share canvasser story",
      description: "Build connection by sharing a relevant personal experience that demonstrates vulnerability and creates emotional resonance."
    },
    {
      number: 3,
      title: "Elicit voter story",
      description: "Ask open-ended questions to draw out the voter's personal experiences and help them connect the issue to their own life."
    },
    {
      number: 4,
      title: "Explore the issue",
      description: "Guide the conversation to help the voter think through how the issue might affect people they care about."
    },
    {
      number: 5,
      title: "Conclude and reflect",
      description: "Return to the initial question to measure any shift in perspective and reinforce the connection made."
    }
  ];

  return (
    <Card className="border-dialogue-neutral">
      <CardContent className="p-6">
        <div className="mb-6">
          <h3 className="font-semibold text-dialogue-darkblue text-lg">Deep Canvassing Conversation Example</h3>
          <p className="text-sm text-muted-foreground mt-1">See how a real conversation flows from opening to closing</p>
        </div>
        
        <div className="space-y-0">
          <PhaseTimeline 
            number={1}
            title="Introduce the issue"
            description="Start with a clear, direct question about the topic to gauge initial support and establish the conversation framework."
          />
          
          <div className="ml-14 space-y-0 mb-8">
            <Message
              speaker="canvasser"
              message="Hi, I'm Frank, and I'm talking to voters about universal preschool. On a scale of 1-10, how much do you support making preschool available to all families?"
            />
            
            <Message
              speaker="voter"
              message="Oh, I'd say I'm about a 3."
            />

            <Message
              speaker="canvasser"
              message="Thanks for sharing that! Why is that the right number for you?"
            />

            <Message
              speaker="voter"
              message="Look I work hard, I'm not married or anything, other people's kids are just other people's problems."
            />
          </div>

          <PhaseTimeline 
            number={2}
            title="Share canvasser story"
            description="Build connection by sharing a relevant personal experience that demonstrates vulnerability and creates emotional resonance."
          />

          <div className="ml-14 space-y-0 mb-8">
            <Message
              speaker="canvasser"
              message="That's great! Do kids in your neighborhood usually go to preschool? What's that like for families around you?"
            />

            <Message
              speaker="voter"
              message="Not really. Most parents I know struggle with childcare costs. My sister has to work two jobs just to afford daycare for her daughter."
            />
          </div>

          <PhaseTimeline 
            number={3}
            title="Elicit voter story"
            description="Ask open-ended questions to draw out the voter's personal experiences and help them connect the issue to their own life."
          />

          <div className="ml-14 space-y-0 mb-8">
            <Message
              speaker="canvasser"
              message="That sounds really tough for your sister. I know how hard that can be - my mom raised three kids mostly on her own, and I remember her always worrying about finding good care we could afford. Can you tell me more about how this affects your sister?"
            />

            <Message
              speaker="voter"
              message="She's always stressed about money and finding reliable care. She really wants her daughter to be ready for kindergarten, but quality preschool is just too expensive."
            />
          </div>

          <PhaseTimeline 
            number={4}
            title="Explore the issue"
            description="Guide the conversation to help the voter think through how the issue might affect people they care about."
          />

          <div className="ml-14 space-y-0 mb-8">
            <Message
              speaker="canvasser"
              message="It sounds like you really care about your sister and your niece. How do you think universal preschool might change things for families like hers?"
            />

            <Message
              speaker="voter"
              message="It would be life-changing, honestly. She could focus on one job instead of two, and her daughter would get the early education she deserves."
            />
          </div>

          <PhaseTimeline 
            number={5}
            title="Conclude and reflect"
            description="Return to the initial question to measure any shift in perspective and reinforce the connection made."
          />

          <div className="ml-14 space-y-0">
            <Message
              speaker="canvasser"
              message="Now, thinking about everything we've discussed, if I asked you again to rate your support for universal preschool on that same 1-10 scale, where would you be?"
            />

            <Message
              speaker="voter"
              message="Definitely a 9 now. I hadn't really thought about how much it would help families like my sister's."
              isLast={true}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversationFlow;
