
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface MessageProps {
  speaker: 'canvasser' | 'voter';
  message: string;
  isLast?: boolean;
}

const Message: React.FC<MessageProps> = ({ speaker, message, isLast = false }) => {
  const isCanvasser = speaker === 'canvasser';
  
  return (
    <div className="flex items-start gap-4">
      {/* Timeline line */}
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-3 ${
          isCanvasser 
            ? 'bg-dialogue-purple' 
            : 'border-2 border-dialogue-purple bg-white'
        }`}></div>
        {!isLast && <div className="w-0.5 bg-dialogue-purple/30 flex-grow min-h-[60px] mt-2"></div>}
      </div>
      
      {/* Message bubble */}
      <div className={`flex ${isCanvasser ? 'justify-start' : 'justify-end'} flex-grow`}>
        <div className={`max-w-[80%] px-4 py-3 rounded-lg ${
          isCanvasser 
            ? 'bg-dialogue-purple text-white' 
            : 'bg-grey-100 border border-dialogue-neutral text-dialogue-darkblue'
        }`}>
          <p className="text-sm leading-relaxed">{message}</p>
        </div>
      </div>
    </div>
  );
};

interface InsightNodeProps {
  title: string;
  isLast?: boolean;
}

const InsightNode: React.FC<InsightNodeProps> = ({ title, isLast = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-start gap-4 my-6">
      {/* Timeline line with insight node */}
      <div className="flex flex-col items-center">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <button className="w-6 h-6 rounded-full bg-dialogue-purple/10 border-2 border-dialogue-purple flex items-center justify-center hover:bg-dialogue-purple/20 transition-colors">
              <Info className="w-3 h-3 text-dialogue-purple" />
            </button>
          </CollapsibleTrigger>
          {!isLast && <div className="w-0.5 bg-dialogue-purple/30 flex-grow min-h-[40px] mt-2"></div>}
        </Collapsible>
      </div>
      
      {/* Expandable insight content */}
      <div className="flex-grow">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleContent className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
            <div className="border border-dialogue-purple/30 px-4 py-3 rounded-lg bg-dialogue-purple/5 max-w-[85%] mb-2">
              <p className="text-sm text-dialogue-purple leading-relaxed">{title}</p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

const ConversationFlow: React.FC = () => {
  return (
    <Card className="border-dialogue-neutral">
      <CardContent className="p-6">
        <div className="mb-6">
          <h3 className="font-semibold text-dialogue-darkblue text-lg">Deep Canvassing Conversation Example</h3>
          <p className="text-sm text-muted-foreground mt-1">See how a real conversation flows from opening to closing</p>
          <p className="text-xs text-dialogue-purple mt-2 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Click the info icons to reveal coaching insights
          </p>
        </div>
        
        <div className="space-y-0">
          <InsightNode title="Canvasser introduces the issue and establishes voter interest" />
          
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

          <InsightNode title="The voter doesn't sound interested in other people's family, but they're still engaging, and a 3 means they're open to it. So, the canvasser makes themselves vulnerable by opening up about their own experiences." />

          <Message
            speaker="canvasser"
            message="That's great! Do kids in your neighborhood usually go to preschool? What's that like for families around you?"
          />

          <Message
            speaker="voter"
            message="Not really. Most parents I know struggle with childcare costs. My sister has to work two jobs just to afford daycare for her daughter."
          />

          <InsightNode title="The canvasser elicits the voter for a similar story." />

          <Message
            speaker="canvasser"
            message="That sounds really tough for your sister. I know how hard that can be - my mom raised three kids mostly on her own, and I remember her always worrying about finding good care we could afford. Can you tell me more about how this affects your sister?"
          />

          <Message
            speaker="voter"
            message="She's always stressed about money and finding reliable care. She really wants her daughter to be ready for kindergarten, but quality preschool is just too expensive."
          />

          <InsightNode title="The canvasser gives the voter space to explore the issue, with both of their loved ones in mind." />

          <Message
            speaker="canvasser"
            message="It sounds like you really care about your sister and your niece. How do you think universal preschool might change things for families like hers?"
          />

          <Message
            speaker="voter"
            message="It would be life-changing, honestly. She could focus on one job instead of two, and her daughter would get the early education she deserves."
          />

          <InsightNode title="The canvasser asks where they stand a second time, to let the voter hear themselves say if they changed their minds." isLast={true} />

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
