import React, { useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/ui/carousel';
import { Button } from '@/ui/button';

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
        <div
          className={`max-w-[80%] px-4 py-3 rounded-lg ${
            isCanvasser ? 'bg-dialogue-darkblue text-white' : 'bg-white border border-dialogue-purple text-dialogue-darkblue'
          }`}
        >
          <p className="text-sm leading-relaxed">{message}</p>
        </div>
      </div>
      {!isLast && <div className="h-1"></div>}
    </div>
  );
};

interface PhaseTimelineProps {
  number: number;
  title: string;
}

const PhaseTimeline: React.FC<PhaseTimelineProps> = ({ number, title }) => (
  <div className="flex items-start gap-6 mb-1">
    <div className="flex flex-col items-center flex-shrink-0">
      <div className="w-8 h-8 rounded-full bg-dialogue-purple text-white flex items-center justify-center text-sm font-semibold">
        {number}
      </div>
      <div className="w-0.5 h-4 bg-dialogue-purple/30 mt-2"></div>
    </div>
    <div className="flex-1 pt-1">
      <h4 className="font-medium text-dialogue-darkblue text-sm mb-1">{title}</h4>
    </div>
  </div>
);

interface ConversationExample {
  title: string;
  description: string;
  shortLabel: string;
  phases: Array<{
    number: number;
    title: string;
    messages: Array<{
      speaker: 'canvasser' | 'voter';
      message: string;
    }>;
  }>;
}

const conversationExamples: ConversationExample[] = [
  {
    title: 'Universal Preschool Example',
    description: 'See how a real conversation flows from opening to closing',
    shortLabel: 'Preschool',
    phases: [
      {
        number: 1,
        title: 'Introduce the issue',
        messages: [
          {
            speaker: 'canvasser',
            message:
              "Hi, I'm Frank, and I'm talking to voters about universal preschool. On a scale of 1-10, how much do you support making preschool available to all families?",
          },
          { speaker: 'voter', message: "Oh, I'd say I'm about a 3." },
          { speaker: 'canvasser', message: 'Thanks for sharing that! Why is that the right number for you?' },
          {
            speaker: 'voter',
            message: "Look I work hard, I'm not married or anything, other people's kids are just other people's problems.",
          },
        ],
      },
      {
        number: 2,
        title: 'Share canvasser story',
        messages: [
          {
            speaker: 'canvasser',
            message: "That's great! Do kids in your neighborhood usually go to preschool? What's that like for families around you?",
          },
          {
            speaker: 'voter',
            message:
              'Not really. Most parents I know struggle with childcare costs. My sister has to work two jobs just to afford daycare for her daughter.',
          },
        ],
      },
      {
        number: 3,
        title: 'Elicit voter story',
        messages: [
          {
            speaker: 'canvasser',
            message:
              'That sounds really tough for your sister. I know how hard that can be - my mom raised three kids mostly on her own, and I remember her always worrying about finding good care we could afford. Can you tell me more about how this affects your sister?',
          },
          {
            speaker: 'voter',
            message:
              "She's always stressed about money and finding reliable care. She really wants her daughter to be ready for kindergarten, but quality preschool is just too expensive.",
          },
        ],
      },
      {
        number: 4,
        title: 'Explore the issue',
        messages: [
          {
            speaker: 'canvasser',
            message:
              'It sounds like you really care about your sister and your niece. How do you think universal preschool might change things for families like hers?',
          },
          {
            speaker: 'voter',
            message:
              'It would be life-changing, honestly. She could focus on one job instead of two, and her daughter would get the early education she deserves.',
          },
        ],
      },
      {
        number: 5,
        title: 'Conclude and reflect',
        messages: [
          {
            speaker: 'canvasser',
            message:
              "Now, thinking about everything we've discussed, if I asked you again to rate your support for universal preschool on that same 1-10 scale, where would you be?",
          },
          {
            speaker: 'voter',
            message: "Definitely a 9 now. I hadn't really thought about how much it would help families like my sister's.",
          },
        ],
      },
    ],
  },
  {
    title: 'Healthcare Access Example',
    description: 'Conversation about improving healthcare access in the community',
    shortLabel: 'Healthcare',
    phases: [
      {
        number: 1,
        title: 'Introduce the issue',
        messages: [
          {
            speaker: 'canvasser',
            message:
              "Hi, I'm Sarah. I'm talking to folks about expanding healthcare access in our community. On a scale of 1-10, how important is it to you that everyone has access to affordable healthcare?",
          },
          {
            speaker: 'voter',
            message: "I'd say around a 4. Healthcare is expensive, but I have insurance through work.",
          },
          { speaker: 'canvasser', message: 'That makes sense. What makes 4 the right number for you?' },
          {
            speaker: 'voter',
            message: "Well, I'm covered, so it's not really my problem. People should just get jobs with benefits.",
          },
        ],
      },
      {
        number: 2,
        title: 'Share canvasser story',
        messages: [
          {
            speaker: 'canvasser',
            message:
              "I understand that perspective. My dad actually lost his job and health insurance when he was 58, right before he needed surgery. Even though he'd worked his whole life, he couldn't afford the care he needed. Have you ever known someone who struggled with healthcare costs?",
          },
        ],
      },
      {
        number: 3,
        title: 'Elicit voter story',
        messages: [
          {
            speaker: 'voter',
            message:
              "Actually, yeah. My neighbor is diabetic and sometimes skips his insulin because it's so expensive. He works part-time jobs that don't offer insurance.",
          },
          {
            speaker: 'canvasser',
            message: 'That must be scary for him and the people who care about him. How does that affect your neighborhood?',
          },
          {
            speaker: 'voter',
            message:
              "It's awful. We've had to call an ambulance twice when his blood sugar got dangerous. His wife is always worried sick.",
          },
        ],
      },
      {
        number: 4,
        title: 'Explore the issue',
        messages: [
          {
            speaker: 'canvasser',
            message:
              'It sounds like you really care about your neighbors. How do you think better healthcare access might change things for families like his?',
          },
          {
            speaker: 'voter',
            message: "He wouldn't have to choose between rent and medicine. And his wife could stop worrying about losing him.",
          },
        ],
      },
      {
        number: 5,
        title: 'Conclude and reflect',
        messages: [
          {
            speaker: 'canvasser',
            message:
              "Thinking about your neighbor and everything we've talked about, where would you be now on that 1-10 scale for healthcare access?",
          },
          { speaker: 'voter', message: 'Probably an 8. Nobody should have to live in fear like that.' },
        ],
      },
    ],
  },
  {
    title: 'LGBTQ+ Rights Example',
    description: 'Building support for LGBTQ+ equality through personal connection',
    shortLabel: 'LGBTQ+',
    phases: [
      {
        number: 1,
        title: 'Introduce the issue',
        messages: [
          {
            speaker: 'canvasser',
            message:
              "Hi, I'm Alex. I'm talking to voters about protecting LGBTQ+ rights in our state. On a scale of 1-10, how important is it to you that LGBTQ+ people have equal rights and protections?",
          },
          {
            speaker: 'voter',
            message: "Honestly, probably a 2. I don't have anything against them, but I think they already have enough rights.",
          },
          { speaker: 'canvasser', message: 'Thanks for being honest. What makes 2 feel right to you?' },
          {
            speaker: 'voter',
            message: 'I just think we should focus on other issues. This seems like a distraction from more important things.',
          },
        ],
      },
      {
        number: 2,
        title: 'Share canvasser story',
        messages: [
          {
            speaker: 'canvasser',
            message:
              "I can understand prioritizing issues. My younger brother actually came out as gay in high school. I remember how scared he was, and how some kids at school made his life really difficult. Do you know anyone who's LGBTQ+?",
          },
        ],
      },
      {
        number: 3,
        title: 'Elicit voter story',
        messages: [
          {
            speaker: 'voter',
            message: "My coworker's daughter is... she's transgender. It's been really hard on the family.",
          },
          {
            speaker: 'canvasser',
            message:
              'That sounds heartbreaking. It sounds like you really care about your coworker and their family. How do you think stronger protections might help kids like their daughter?',
          },
          {
            speaker: 'voter',
            message: 'Maybe she could go to school without being afraid. Maybe she could just be a normal kid instead of a target.',
          },
        ],
      },
      {
        number: 4,
        title: 'Explore the issue',
        messages: [
          {
            speaker: 'canvasser',
            message:
              "That's heartbreaking. It sounds like you really care about your coworker and their family. How do you think stronger protections might help kids like their daughter?",
          },
          {
            speaker: 'voter',
            message: 'Maybe she could go to school without being afraid. Maybe she could just be a normal kid instead of a target.',
          },
        ],
      },
      {
        number: 5,
        title: 'Conclude and reflect',
        messages: [
          {
            speaker: 'canvasser',
            message: 'Thinking about that young girl and other kids like her, where would you be now on supporting LGBTQ+ protections?',
          },
          { speaker: 'voter', message: "Maybe a 7. No kid should go through what she's going through." },
        ],
      },
    ],
  },
  {
    title: 'Clean Air Initiative Example',
    description: 'Environmental conversation focusing on family health impacts',
    shortLabel: 'Clean Air',
    phases: [
      {
        number: 1,
        title: 'Introduce the issue',
        messages: [
          {
            speaker: 'canvasser',
            message:
              "Hi, I'm Maria. I'm talking to residents about the clean air initiative to reduce pollution in our area. On a scale of 1-10, how important is cleaner air to you?",
          },
          { speaker: 'voter', message: 'Maybe a 5. The air seems fine to me.' },
          { speaker: 'canvasser', message: "That's fair. What makes 5 the right number?" },
          {
            speaker: 'voter',
            message: "I don't really notice air quality day to day. Seems like an expensive solution to a problem I don't see.",
          },
        ],
      },
      {
        number: 2,
        title: 'Share canvasser story',
        messages: [
          {
            speaker: 'canvasser',
            message:
              "I used to think the same way until my daughter developed asthma. The doctor said air pollution was making it worse. Now I notice every smoggy day because she can't play outside. Do you have kids or grandkids who spend time outdoors?",
          },
        ],
      },
      {
        number: 3,
        title: 'Elicit voter story',
        messages: [
          {
            speaker: 'voter',
            message:
              'My grandson plays soccer. Now that you mention it, there have been days when practice gets cancelled because of air quality alerts.',
          },
          {
            speaker: 'canvasser',
            message: 'That must be disappointing for him. How does your family feel about those cancelled practices?',
          },
          {
            speaker: 'voter',
            message:
              "He's always so bummed out. And my daughter worries about him running around when the air is bad. She checks the air quality app now before letting him play outside.",
          },
        ],
      },
      {
        number: 4,
        title: 'Explore the issue',
        messages: [
          {
            speaker: 'canvasser',
            message:
              "It sounds like air quality is already affecting your grandson's life. How do you think cleaner air might change things for kids like him?",
          },
          {
            speaker: 'voter',
            message: 'He could play soccer year-round without my daughter worrying. Kids could just be kids without checking an app first.',
          },
        ],
      },
      {
        number: 5,
        title: 'Conclude and reflect',
        messages: [
          {
            speaker: 'canvasser',
            message:
              'Thinking about your grandson and all the kids who want to play outside safely, where would you be now on supporting the clean air initiative?',
          },
          { speaker: 'voter', message: 'Definitely an 8. Every kid deserves to breathe clean air.' },
        ],
      },
    ],
  },
  {
    title: 'Voter Turnout Example',
    description: 'Encouraging civic engagement and voting participation',
    shortLabel: 'Voting',
    phases: [
      {
        number: 1,
        title: 'Introduce the issue',
        messages: [
          {
            speaker: 'canvasser',
            message:
              "Hi, I'm David. I'm talking to folks about the importance of voting in local elections. On a scale of 1-10, how important do you think it is for people to vote in every election?",
          },
          {
            speaker: 'voter',
            message: "Probably a 3. I vote in presidential elections, but local stuff doesn't seem to matter much.",
          },
          {
            speaker: 'canvasser',
            message: 'I hear that a lot. What makes local elections feel less important to you?',
          },
          {
            speaker: 'voter',
            message: "It's just school board and city council. How much can they really affect my life?",
          },
        ],
      },
      {
        number: 2,
        title: 'Share canvasser story',
        messages: [
          {
            speaker: 'canvasser',
            message:
              "I used to feel the same way until the city council voted to close the library near my mom's house. She'd been going there for 20 years, and suddenly it was gone because not enough people voted in that election. Have you ever been affected by a local decision?",
          },
        ],
      },
      {
        number: 3,
        title: 'Elicit voter story',
        messages: [
          {
            speaker: 'voter',
            message: 'Actually, they just changed the bus route in my neighborhood. Now I have to walk an extra 15 minutes to get to work.',
          },
          {
            speaker: 'canvasser',
            message: "That's a real daily impact. How has that change affected your routine?",
          },
          {
            speaker: 'voter',
            message:
              "It's annoying, especially in winter. I have to leave earlier, and sometimes I'm late if the bus is delayed. I never even knew they were considering changing it.",
          },
        ],
      },
      {
        number: 4,
        title: 'Explore the issue',
        messages: [
          {
            speaker: 'canvasser',
            message:
              'That decision probably went through the city council. How do you think more people voting in local elections might change decisions like that?',
          },
          {
            speaker: 'voter',
            message:
              "Maybe they'd actually consider how it affects working people like me. Maybe they'd hold public meetings that people actually know about.",
          },
        ],
      },
      {
        number: 5,
        title: 'Conclude and reflect',
        messages: [
          {
            speaker: 'canvasser',
            message:
              'Thinking about that bus route and other local decisions that affect your daily life, how important does voting in local elections feel now?',
          },
          {
            speaker: 'voter',
            message: 'Probably a 7. I guess these decisions do matter more than I thought.',
          },
        ],
      },
    ],
  },
  {
    title: 'Strong Supporter Example',
    description: 'When a voter is already strongly supportive - early exit strategy',
    shortLabel: 'Early Exit',
    phases: [
      {
        number: 1,
        title: 'Introduce the issue',
        messages: [
          {
            speaker: 'canvasser',
            message:
              "Hi, I'm Jennifer. I'm talking to voters about funding for public schools. On a scale of 1-10, how much do you support increasing funding for our local schools?",
          },
          { speaker: 'voter', message: 'Oh, definitely a 10. Schools are absolutely crucial.' },
          {
            speaker: 'canvasser',
            message: "That's wonderful! What makes you feel so strongly about school funding?",
          },
          {
            speaker: 'voter',
            message:
              "I'm a retired teacher, and I've seen firsthand how underfunded schools hurt kids. Every child deserves proper resources, small class sizes, and updated materials. Education is the foundation of everything.",
          },
        ],
      },
      {
        number: 2,
        title: 'Early exit with strong supporter',
        messages: [
          {
            speaker: 'canvasser',
            message:
              "It's clear you really understand the importance of this issue. Since you're already such a strong supporter, I won't take up more of your time. Can I count on your vote for the school funding measure?",
          },
          {
            speaker: 'voter',
            message: "Absolutely. I'll be first in line to vote, and I'll encourage my neighbors too.",
          },
          {
            speaker: 'canvasser',
            message: "Perfect! Thank you so much for your support and for all you've done for education. Have a great day!",
          },
        ],
      },
    ],
  },
];

const ConversationFlow: React.FC = () => {
  const [currentExample, setCurrentExample] = useState(0);

  const renderConversation = (example: ConversationExample) => {
    return (
      <div className="space-y-0">
        {example.phases.map((phase, phaseIndex) => (
          <div key={phase.number}>
            <PhaseTimeline number={phase.number} title={phase.title} />

            <div className="ml-14 space-y-0 mb-8">
              {phase.messages.map((msg, msgIndex) => (
                <Message
                  key={msgIndex}
                  speaker={msg.speaker}
                  message={msg.message}
                  isLast={phaseIndex === example.phases.length - 1 && msgIndex === phase.messages.length - 1}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Carousel className="w-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2 flex-wrap">
            {conversationExamples.map((example, index) => (
              <Button
                key={index}
                variant={currentExample === index ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentExample(index)}
                className="text-xs"
              >
                {example.shortLabel}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <CarouselPrevious onClick={() => setCurrentExample((prev) => (prev > 0 ? prev - 1 : conversationExamples.length - 1))} />
            <CarouselNext onClick={() => setCurrentExample((prev) => (prev + 1) % conversationExamples.length)} />
          </div>
        </div>

        <CarouselContent>
          <CarouselItem>
            <div className="mb-4">
              <h4 className="font-medium text-dialogue-darkblue mb-1">{conversationExamples[currentExample].title}</h4>
              <p className="text-sm text-muted-foreground">{conversationExamples[currentExample].description}</p>
            </div>
            {renderConversation(conversationExamples[currentExample])}
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default ConversationFlow;
