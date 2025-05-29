
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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
            : 'bg-grey-100 border border-dialogue-neutral text-dialogue-darkblue'
        }`}>
          <p className="text-sm leading-relaxed">{message}</p>
        </div>
      </div>
      {!isLast && <div className="h-3"></div>}
    </div>
  );
};

interface PhaseHeaderProps {
  title: string;
  description: string;
}

const PhaseHeader: React.FC<PhaseHeaderProps> = ({ title, description }) => (
  <div className="my-6">
    <Separator className="mb-4" />
    <div className="text-center mb-4">
      <h4 className="font-semibold text-dialogue-darkblue text-base mb-1">{title}</h4>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  </div>
);

const ConversationFlow: React.FC = () => {
  return (
    <Card className="border-dialogue-neutral">
      <CardContent className="p-6">
        <div className="mb-6">
          <h3 className="font-semibold text-dialogue-darkblue text-lg">Deep Canvassing Conversation Example</h3>
          <p className="text-sm text-muted-foreground mt-1">See how a real conversation flows from opening to closing</p>
        </div>
        
        <div className="space-y-0">
          <PhaseHeader 
            title="Phase 1: Opening & Initial Assessment" 
            description="Introduce yourself and get their initial position"
          />
          
          <Message
            speaker="canvasser"
            message="Hi, I'm Frank, and I'm talking to voters about universal preschool. On a scale of 1-10, how much do you support making preschool available to all families?"
          />
          
          <Message
            speaker="voter"
            message="Oh, I'd say I'm about a 3."
          />

          <PhaseHeader 
            title="Phase 2: Exploration & Understanding" 
            description="Ask why and listen to their reasoning"
          />

          <Message
            speaker="canvasser"
            message="Thanks for sharing that! Why is that the right number for you?"
          />

          <Message
            speaker="voter"
            message="Look I work hard, I'm not married or anything, other people's kids are just other people's problems."
          />

          <PhaseHeader 
            title="Phase 3: Connection Building" 
            description="Find common ground and shared experiences"
          />

          <Message
            speaker="canvasser"
            message="That's great! Do kids in your neighborhood usually go to preschool? What's that like for families around you?"
          />

          <Message
            speaker="voter"
            message="Not really. Most parents I know struggle with childcare costs. My sister has to work two jobs just to afford daycare for her daughter."
          />

          <PhaseHeader 
            title="Phase 4: Vulnerable Storytelling" 
            description="Share personal stories to deepen the connection"
          />

          <Message
            speaker="canvasser"
            message="That sounds really tough for your sister. I know how hard that can be - my mom raised three kids mostly on her own, and I remember her always worrying about finding good care we could afford. Can you tell me more about how this affects your sister?"
          />

          <Message
            speaker="voter"
            message="She's always stressed about money and finding reliable care. She really wants her daughter to be ready for kindergarten, but quality preschool is just too expensive."
          />

          <PhaseHeader 
            title="Phase 5: Processing & Reflection" 
            description="Help them connect their values to the issue"
          />

          <Message
            speaker="canvasser"
            message="It sounds like you really care about your sister and your niece. How do you think universal preschool might change things for families like hers?"
          />

          <Message
            speaker="voter"
            message="It would be life-changing, honestly. She could focus on one job instead of two, and her daughter would get the early education she deserves."
          />

          <PhaseHeader 
            title="Phase 6: Closing & Reassessment" 
            description="Return to the scale to measure attitude change"
          />

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
      </CardContent>
    </Card>
  );
};

export default ConversationFlow;
