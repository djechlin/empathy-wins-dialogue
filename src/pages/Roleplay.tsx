import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { useDialogue } from '@/features/dialogue';
import { ReplayProvider } from '@/features/dialogue/providers/ReplayProvider';
import { DialogueMessage } from '@/features/dialogue/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Progress } from '@/ui/progress';
import { Mic, MicOff, MessageCircle, ArrowRight, Lightbulb, Bot, Heart, Users, Sparkles } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Parse Lucas replay data
const lucasReplayText = `Voter: Hello? Is someone at my door?

Canvasser: Hi. My name is Lucas, and I'm interested in talking with you more about health care in America.

Voter: Oh, healthcare? I don't know if I have much to say about that.

Voter: I'm Frank, by the way.

Voter: What organization are you with?

Canvasser: I'm with Americans with diabetes.

Canvasser: And we're interested in capping the price of insulin so that, citizens pay less money for lifesaving medication.

Canvasser: Which costs big companies only a dollar to make.

Canvasser: But sells for two hundred dollars.

Voter: Oh, I see. Well, I don't have diabetes myself, so I haven't really thought much about insulin prices.

Voter: Sounds like there's quite a markup there, but isn't that how most medications work?

Voter: Companies spend money on research and then charge more to make their profit back.

Voter: I tend to think the government getting involved just makes things more expensive in the long run with all the bureaucracy.

Canvasser: Yeah. I I think I I understand where you're coming from. Definitely government regulation can cause prices to go up. Certainly for new medication research. But insulin's been around for a hundred years. Actually, the inventor of insulin sold the patent for one dollar. So that everyone could have access to this medication. And what has happened is these companies have taken this very, very cheap to make product that sells for a dollar in Mexico and are charging people two hundred, three hundred dollars here.

Voter: Hmm, I didn't know that about insulin being that old or that the inventor sold it for so little.

Voter: That does make it seem different than new medications still under research.

Voter: So it's that much cheaper in Mexico?

Voter: That's pretty wild. I guess I can see why people would be upset about that.

Voter: But I'm still not sure what the government could do that wouldn't just create more problems.

Voter: You know how these things go.

Canvasser: I do know how these things go. And, certainly, when the government gets involved, it can cause problems. I mean, my brother has diabetes actually right now, and it's pretty difficult for him if he doesn't his health insurance doesn't cover his insulin. He's just out of luck. And I think that we should make sure that I think one of the things government can do well is it can make sure that companies don't rip off American citizens.

Canvasser: Given the price difference between Mexico and the US for the same drug, you can see that or at least for my brother, it can see that he's having to pay way more than others are.

Voter: I didn't realize your brother has diabetes.

Voter: That must be tough for him.

Voter: Is he managing okay?

Voter: Does he have to pay those high prices you mentioned?

Canvasser: Yeah. He is, he's doing better, certainly. But and right now, because of his insurance plan, he doesn't have to pay as much. But if he didn't have health insurance like many people don't, or if he had a worse health insurance plan, like he was working for you know, Target, then he he would be in trouble.

Voter: Well, I'm glad he has decent insurance now.

Voter: I can see how that would be really stressful otherwise.

Voter: His mom was worried sick.

Voter: Do you think a lot of people are in that situation with insulin?

Voter: Having to choose between medicine and other necessities?

Voter: I'm curious - does your brother ever struggle with affording his insulin?

Voter: How does that affect him and your family?

Canvasser: Oh, I'm I'm sorry to hear about your nephew. Yeah. I I mean, certainly, I think not being able to afford life saving medication because you've gotten laid off or because you're you know, your job changes is is terrible.

Canvasser: My brother, like I said, doesn't struggle now because of his current job situation, but I think he is worried that if he changes jobs in the future, or, you know, gets laid off unexpectedly, that could all change, and then he could be in real trouble.

Voter: That's a real worry to live with, isn't it?

Voter: I can see how that would create a lot of stress.

Voter: My nephew was only without his medication for about a month, but my sister was beside herself with worry.

Voter: It's not right that people have to worry about basic health needs just because of job changes.

Voter: What do you think would help people like your brother have more security?

Voter: Is that what this insulin price cap idea would do?

Canvasser: Yeah. Exactly. So if we were to cap the price of insulin from, say, two hundred dollars to thirty dollars even though my brother would be paying the same amount right now, if he was fired, or or, you know, he just was between jobs. He would just be able to afford it out of pocket rather than having to pay these exorbitant prices.

Canvasser: Oh, and your nephew too. Right? Wouldn't your, your sister wouldn't have had to worry about him because they could have just afforded it because it wouldn't have been outrageously expensive.

Voter: You're right, it would have made a huge difference for them.

Voter: My sister was trying to help him pay for it, but she's a single mom and it was just too much on top of her other bills.

Voter: That was a really stressful time for our whole family.

Voter: I hadn't really thought about it that way before - how a price cap could be like a safety net for people between jobs.

Voter: That makes a lot of sense.

Voter: What are you folks actually doing to try to make this happen?

Voter: Is there something specific you're asking people to do?

Canvasser: Yeah. So I'm I'm glad you asked. Right now, there's some legislation in congress that is being voted on within a month. And we're trying to get people to call their representatives to tell them to vote for it so that it will significantly increase the likelihood that it passes.

Voter: That makes sense. You know, after hearing about how this could help people like my nephew and your brother, I think I would be willing to make that call.

Canvasser: Would that be something you'd be willing to do?

Voter: Who would I need to contact exactly?

Voter: Do you have the information for who my representative is?

Voter: You know what? I think I would be willing to do that.

Voter: After thinking about what my nephew and sister went through, and knowing your brother faces the same worry, it just seems like the right thing to do.

Voter: Do you have the number I should call?

Voter: And what exactly should I say when I call?

Canvasser: Yeah. I have the number right here. Let me give you a card.

Canvasser: When you call, you'll just talk to one of the staffers at the representative's office. You just tell them your name. You'll tell them your ZIP ZIP code so that they know your constituent, and then you can you can just tell them your concern. So in this case, you know, tell them that you support proposition twenty eight and, that you hope that your senator, senator White House will also vote for it.`;

function parseLucasReplay(): DialogueMessage[] {
  const lines = lucasReplayText.split('\n').filter((line) => line.trim());
  const messages: DialogueMessage[] = [];

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('Voter:')) {
      messages.push({
        id: `msg-${index}`,
        role: 'assistant',
        content: trimmedLine.replace('Voter:', '').trim(),
        timestamp: new Date(Date.now() + index * 1000),
      });
    } else if (trimmedLine.startsWith('Canvasser:')) {
      messages.push({
        id: `msg-${index}`,
        role: 'user',
        content: trimmedLine.replace('Canvasser:', '').trim(),
        timestamp: new Date(Date.now() + index * 1000),
      });
    }
  });

  return messages;
}

function RoleplayContent() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { messages, connect, disconnect, togglePause, isPaused, timeElapsed } = useDialogue();

  // Load preparation data from sessionStorage
  const selectedIssue = sessionStorage.getItem('selectedIssue') || 'insulin';
  const personType = sessionStorage.getItem('personType') || '';
  const eventType = sessionStorage.getItem('eventType') || '';
  const selectedFeeling = sessionStorage.getItem('selectedFeeling') || '';

  const issueDetails = {
    insulin: {
      title: 'Healthcare - Insulin Affordability',
      plainLanguage: 'affordable insulin for people with diabetes',
      organization: 'Diabetes Advocates<sup>†</sup>',
    },
    climate: {
      title: 'Climate - Wildfire Management',
      plainLanguage: 'protecting our communities from wildfires',
      organization: 'Against Wildfires<sup>†</sup>',
    },
  };

  const currentIssue = issueDetails[selectedIssue as keyof typeof issueDetails];

  const [roleplayStarted, setRoleplayStarted] = useState(false);
  const [currentScriptStep, setCurrentScriptStep] = useState(1);
  const [voterSharedContent, setVoterSharedContent] = useState<{ people: string[]; feelings: string[] }>({ people: [], feelings: [] });

  const voterPersonas = useMemo(
    () =>
      ({
        insulin: 'Frank, a registered independent concerned about healthcare costs',
        climate: 'Frank, a registered independent concerned about environmental issues',
      }) as const,
    [],
  );

  const finishRoleplay = useCallback(() => {
    disconnect();
    navigate(`/report?duration=${timeElapsed}&techniques=`);
  }, [disconnect, navigate, timeElapsed]);

  const startRoleplay = useCallback(async () => {
    setRoleplayStarted(true);
    setCurrentScriptStep(1); // Start with step 1 when roleplay begins
    await connect();
    toast({
      title: 'Roleplay Started',
      description: 'Start with your framing, then listen for names, emotions, and moments to dig deeper.',
    });
  }, [connect, toast]);

  const toggleRecording = useCallback(() => {
    togglePause();
  }, [togglePause]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const progressPercentage = useMemo(() => (timeElapsed / 600) * 100, [timeElapsed]);

  // Extract people names and feelings from voter messages
  useEffect(() => {
    const extractSharedContent = () => {
      const voterMessages = messages.filter((msg) => msg.role === 'assistant');
      const people: string[] = [];
      const feelings: string[] = [];

      voterMessages.forEach((msg) => {
        // Simple regex to extract potential people names (capitalized words after common relationship terms)
        const peopleMatches = msg.content.match(
          /(?:my|his|her|our) (?:brother|sister|mother|father|son|daughter|nephew|niece|cousin|friend|husband|wife|partner) (\w+)/gi,
        );
        if (peopleMatches) {
          peopleMatches.forEach((match) => {
            const name = match.split(' ').pop();
            if (name && name.length > 0 && !people.includes(name)) {
              people.push(name);
            }
          });
        }

        // Extract feeling/emotion words
        const feelingWords = [
          'worried',
          'scared',
          'anxious',
          'happy',
          'sad',
          'angry',
          'frustrated',
          'relieved',
          'grateful',
          'hopeful',
          'stressed',
          'overwhelmed',
          'proud',
          'disappointed',
          'concerned',
          'nervous',
          'excited',
          'depressed',
        ];
        feelingWords.forEach((feeling) => {
          if (msg.content.toLowerCase().includes(feeling) && !feelings.includes(feeling)) {
            feelings.push(feeling);
          }
        });
      });

      setVoterSharedContent({ people, feelings });
    };

    if (messages.length > 0) {
      extractSharedContent();
    }
  }, [messages]);

  // Progress through script steps based on conversation
  useEffect(() => {
    if (!roleplayStarted || messages.length === 0) return;

    const userMessages = messages.filter((msg) => msg.role === 'user');
    const voterMessages = messages.filter((msg) => msg.role === 'assistant');

    // Step 1: Check if user has done framing (introduced themselves and the issue)
    if (currentScriptStep === 1 && userMessages.length > 0) {
      const firstMessage = userMessages[0];
      const hasFraming =
        firstMessage.content.toLowerCase().includes('name') ||
        firstMessage.content.toLowerCase().includes('talk about') ||
        firstMessage.content.toLowerCase().includes(currentIssue.plainLanguage.toLowerCase());

      if (hasFraming && voterMessages.length > 0) {
        setCurrentScriptStep(2);
      }
    }

    // Step 2: Check if user has shared their story
    if (currentScriptStep === 2 && userMessages.length > 1) {
      const hasSharedStory = userMessages.some(
        (msg) =>
          msg.content.toLowerCase().includes(eventType.toLowerCase()) ||
          msg.content.toLowerCase().includes(personType.toLowerCase()) ||
          msg.content.toLowerCase().includes(selectedFeeling.toLowerCase()),
      );

      if (hasSharedStory) {
        setCurrentScriptStep(3);
      }
    }

    // Step 3+: General listening and coaching
    if (currentScriptStep >= 3) {
      // Continue showing listening coaching
    }
  }, [messages, roleplayStarted, currentScriptStep, eventType, personType, selectedFeeling, currentIssue]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Progress Flow */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-6">
              {/* Step 1 - Completed */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-2">
                  ✓
                </div>
                <span className="text-sm font-medium text-center text-green-600 font-sans">Conversation Strategy</span>
              </div>

              <ArrowRight className="w-6 h-6 text-gray-400" />

              {/* Step 2 - Current Step */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-2">
                  2
                </div>
                <span className="text-sm font-medium text-center text-blue-600 font-sans">Roleplay</span>
              </div>

              <ArrowRight className="w-6 h-6 text-gray-400" />

              {/* Step 3 - Future Step */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white border-2 border-gray-300 text-gray-400 rounded-full flex items-center justify-center font-bold text-lg mb-2">
                  3
                </div>
                <span className="text-sm font-medium text-center text-gray-400 font-sans">Learn how you did</span>
              </div>
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Roleplay</h1>
            <p className="text-gray-600">Speaking with: {voterPersonas[selectedIssue as keyof typeof voterPersonas]}</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Main conversation area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Session Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Session Progress</span>
                    <span className="text-lg font-mono">{formatTime(timeElapsed)} / 10:00</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={progressPercentage} className="mb-4" />
                  {!roleplayStarted ? (
                    <div className="text-center">
                      <p className="text-gray-600 mb-4">Ready to practice active listening? Watch for coaching cues as they speak.</p>
                      <Button onClick={startRoleplay} size="lg">
                        Start Roleplay
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="flex justify-center gap-4">
                        <Button
                          onClick={toggleRecording}
                          variant={isPaused ? 'default' : 'outline'}
                          size="lg"
                          className="flex items-center gap-2"
                        >
                          {isPaused ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                          {isPaused ? 'Resume' : 'Pause'}
                        </Button>
                        <Button onClick={finishRoleplay} variant="outline">
                          Finish Roleplay
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent conversation */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    ref={(el) => {
                      if (el) {
                        el.scrollTop = el.scrollHeight;
                      }
                    }}
                    className="space-y-3 max-h-96 overflow-y-auto"
                  >
                    {/* Always show voter info as first message */}
                    <div className="flex justify-center">
                      <div className="max-w-[90%] p-3 rounded-lg bg-gray-50 border border-gray-200">
                        <p className="text-sm text-gray-600 italic text-center">
                          You'll be talking with Frank Hamster, a 55 year old Registered Independent who voted in 2020 but not 2024. His
                          representative is Peter Gerbil.
                        </p>
                      </div>
                    </div>

                    {/* Conversation messages */}
                    {messages.slice(-3).map((message) => (
                      <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[90%] p-3 rounded-lg ${
                            message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <div className="text-xs opacity-70 mb-1">{message.role === 'user' ? 'You' : 'Frank'}</div>
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Voter Shared Content Footer */}
                  {roleplayStarted && (voterSharedContent.people.length > 0 || voterSharedContent.feelings.length > 0) && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h6 className="text-xs font-medium text-gray-500 mb-2">What Frank has shared:</h6>
                      <div className="flex flex-wrap gap-2">
                        {voterSharedContent.people.map((person, index) => (
                          <span
                            key={`person-${index}`}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 border border-blue-200"
                          >
                            👤 {person}
                          </span>
                        ))}
                        {voterSharedContent.feelings.map((feeling, index) => (
                          <span
                            key={`feeling-${index}`}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 border border-purple-200"
                          >
                            💭 {feeling}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Conversation Cues */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    Conversation Cues
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ContextAwareTipsBox 
                    voterSharedContent={voterSharedContent} 
                    currentScriptStep={currentScriptStep}
                    roleplayStarted={roleplayStarted}
                    currentIssue={currentIssue}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

interface ContextAwareTipsBoxProps {
  voterSharedContent: {
    people: string[];
    feelings: string[];
  };
  currentScriptStep: number;
  roleplayStarted: boolean;
  currentIssue?: {
    organization: string;
    plainLanguage: string;
  };
}

const ContextAwareTipsBox = ({ voterSharedContent, currentScriptStep, roleplayStarted, currentIssue }: ContextAwareTipsBoxProps) => {
  const [visibleTips, setVisibleTips] = useState<Array<{ id: string; content: React.ReactNode }>>([]);

  useEffect(() => {
    const tips: Array<{ id: string; content: React.ReactNode }> = [];

    // Show opening script as first cue when roleplay hasn't started
    if (!roleplayStarted && currentIssue) {
      tips.push({
        id: 'opening-script',
        content: (
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Start with your framing</span>
            </div>
            <div className="bg-white border border-blue-200 rounded p-3 mb-2">
              <p className="text-gray-800 text-sm leading-relaxed">
                "My name is [your name], I'm here with{' '}
                <span dangerouslySetInnerHTML={{ __html: currentIssue.organization }} /> to talk about{' '}
                {currentIssue.plainLanguage}."
              </p>
            </div>
            <p className="text-gray-600 text-xs">
              This introduces you and frames the conversation around the issue.
            </p>
          </div>
        )
      });
    }

    if (voterSharedContent.people.length > 0) {
      tips.push({
        id: 'people',
        content: (
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Great! They mentioned people!</span>
            </div>
            <p className="text-sm text-blue-700">
              Ask about <strong>{voterSharedContent.people.join(', ')}</strong> - How did this affect them personally?
            </p>
          </div>
        ),
      });
    }

    if (voterSharedContent.feelings.length > 0) {
      tips.push({
        id: 'feelings',
        content: (
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Wonderful! They shared emotions!</span>
            </div>
            <p className="text-sm text-purple-700">
              They felt <strong>{voterSharedContent.feelings.join(', ')}</strong> - Ask them to tell you more about why.
            </p>
          </div>
        ),
      });
    }

    if (currentScriptStep >= 3 && voterSharedContent.people.length === 0 && voterSharedContent.feelings.length === 0) {
      tips.push({
        id: 'deeper',
        content: (
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-medium text-amber-900">Time to go deeper!</span>
            </div>
            <p className="text-sm text-amber-700">Try asking about their family or personal experiences with this issue.</p>
          </div>
        ),
      });
    }

    setVisibleTips(tips.slice(0, 2)); // Show only the first 2 tips

    // Auto-fade after 10 seconds, but not for the opening script
    if (roleplayStarted) {
      const timer = setTimeout(() => {
        setVisibleTips([]);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [voterSharedContent, currentScriptStep, roleplayStarted, currentIssue]);

  if (visibleTips.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        <Bot className="w-8 h-8 mx-auto mb-2 opacity-30" />
        <p className="text-sm">Listening for opportunities to connect...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 transition-opacity duration-1000">
      {visibleTips.map((tip) => (
        <div key={tip.id} className="animate-in slide-in-from-bottom-2 duration-500">
          {tip.content}
        </div>
      ))}
    </div>
  );
};

const Roleplay = () => {
  const lucasMessages = useMemo(() => parseLucasReplay(), []);

  return (
    <ReplayProvider messages={lucasMessages} playbackSpeed={1}>
      <RoleplayContent />
    </ReplayProvider>
  );
};

export default Roleplay;
