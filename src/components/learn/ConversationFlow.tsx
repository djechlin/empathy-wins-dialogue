
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

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

const ConversationFlow: React.FC = () => {
  const dialogue = [
    {
      speaker: 'canvasser' as const,
      message: "Hi, I'm Frank, and I'm talking to voters about universal preschool. On a scale of 1-10, how much do you support making preschool available to all families?"
    },
    {
      speaker: 'voter' as const,
      message: "Oh, I'd say I'm about a 3."
    },
    {
      speaker: 'canvasser' as const,
      message: "Thanks for sharing that! Why is that the right number for you?"
    },
    {
      speaker: 'voter' as const,
      message: "Look I work hard, I'm not married or anything, other people's kids are just other people's problems."
    },
    {
      speaker: 'canvasser' as const,
      message: "That's great! Do kids in your neighborhood usually go to preschool? What's that like for families around you?"
    },
    {
      speaker: 'voter' as const,
      message: "Not really. Most parents I know struggle with childcare costs. My sister has to work two jobs just to afford daycare for her daughter."
    },
    {
      speaker: 'canvasser' as const,
      message: "That sounds really tough for your sister. I know how hard that can be - my mom raised three kids mostly on her own, and I remember her always worrying about finding good care we could afford. Can you tell me more about how this affects your sister?"
    },
    {
      speaker: 'voter' as const,
      message: "She's always stressed about money and finding reliable care. She really wants her daughter to be ready for kindergarten, but quality preschool is just too expensive."
    },
    {
      speaker: 'canvasser' as const,
      message: "It sounds like you really care about your sister and your niece. How do you think universal preschool might change things for families like hers?"
    },
    {
      speaker: 'voter' as const,
      message: "It would be life-changing, honestly. She could focus on one job instead of two, and her daughter would get the early education she deserves."
    },
    {
      speaker: 'canvasser' as const,
      message: "Now, thinking about everything we've discussed, if I asked you again to rate your support for universal preschool on that same 1-10 scale, where would you be?"
    },
    {
      speaker: 'voter' as const,
      message: "Definitely a 9 now. I hadn't really thought about how much it would help families like my sister's."
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
          {dialogue.map((item, index) => (
            <Message
              key={index}
              speaker={item.speaker}
              message={item.message}
              isLast={index === dialogue.length - 1}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversationFlow;
