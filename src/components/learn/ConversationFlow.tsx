
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
}

const PhaseHeader: React.FC<PhaseHeaderProps> = ({ title }) => (
  <div className="my-6">
    <Separator className="mb-4 bg-dialogue-darkblue" />
    <div className="flex justify-start mb-4">
      <div className="border-2 border-dotted border-dialogue-purple px-3 py-2 rounded-lg bg-dialogue-purple/5">
        <h4 className="font-medium text-dialogue-purple text-sm italic">{title}</h4>
      </div>
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
          <PhaseHeader title="1. Introduce the issue" />
          
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

          <PhaseHeader title="2. Share canvasser story" />

          <Message
            speaker="canvasser"
            message="That's great! Do kids in your neighborhood usually go to preschool? What's that like for families around you?"
          />

          <Message
            speaker="voter"
            message="Not really. Most parents I know struggle with childcare costs. My sister has to work two jobs just to afford daycare for her daughter."
          />

          <PhaseHeader title="3. Elicit voter story" />

          <Message
            speaker="canvasser"
            message="That sounds really tough for your sister. I know how hard that can be - my mom raised three kids mostly on her own, and I remember her always worrying about finding good care we could afford. Can you tell me more about how this affects your sister?"
          />

          <Message
            speaker="voter"
            message="She's always stressed about money and finding reliable care. She really wants her daughter to be ready for kindergarten, but quality preschool is just too expensive."
          />

          <PhaseHeader title="4. Explore the issue" />

          <Message
            speaker="canvasser"
            message="It sounds like you really care about your sister and your niece. How do you think universal preschool might change things for families like hers?"
          />

          <Message
            speaker="voter"
            message="It would be life-changing, honestly. She could focus on one job instead of two, and her daughter would get the early education she deserves."
          />

          <PhaseHeader title="5. Conclude and reflect" />

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
