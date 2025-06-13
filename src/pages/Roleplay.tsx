import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { useDialogue } from '@/features/dialogue';
import { useConversationCues } from '@/features/dialogue/hooks/useConversationCues';
import { ReplayProvider } from '@/features/dialogue/providers/ReplayProvider';
import { DialogueMessage } from '@/features/dialogue/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Progress } from '@/ui/progress';
import { ArrowRight, Bot, Brain, Flag, Heart, Lightbulb, Mic, MicOff, Sparkles, Users } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Parse Lucas replay data
const lucasReplayText = `Voter: Hello? Is someone at my door?

Canvasser: Hi. My name is Lucas, and I'm interested in talking with you more about health care in America.

Voter: Oh, healthcare? I don't know if I have much to say about that. I'm Frank, by the way.What organization are you with?

Canvasser: I'm with Americans with diabetes.

Canvasser: And we're interested in capping the price of insulin so that, citizens pay less money for lifesaving medication.

Canvasser: Which costs big companies only a dollar to make.

Canvasser: But sells for two hundred dollars.

Voter: Oh, I see. Well, I don't have diabetes myself, so I haven't really thought much about insulin prices.  Sounds like there's quite a markup there, but isn't that how most medications work? Companies spend money on research and then charge more to make their profit back.  I tend to think the government getting involved just makes things more expensive in the long run with all the bureaucracy.

Canvasser: Yeah. I I think I I understand where you're coming from. Definitely government regulation can cause prices to go up. Certainly for new medication research. But insulin's been around for a hundred years. Actually, the inventor of insulin sold the patent for one dollar. So that everyone could have access to this medication. And what has happened is these companies have taken this very, very cheap to make product that sells for a dollar in Mexico and are charging people two hundred, three hundred dollars here.

Voter: Hmm, I didn't know that about insulin being that old or that the inventor sold it for so little. That does make it seem different than new medications still under research. So it's that much cheaper in Mexico? That's pretty wild. I guess I can see why people would be upset about that.  But I'm still not sure what the government could do that wouldn't just create more problems. You know how these things go.

Canvasser: I do know how these things go. And, certainly, when the government gets involved, it can cause problems. I mean, my brother has diabetes actually right now, and it's pretty difficult for him if he doesn't his health insurance doesn't cover his insulin. He's just out of luck. And I think that we should make sure that I think one of the things government can do well is it can make sure that companies don't rip off American citizens.

Canvasser: Given the price difference between Mexico and the US for the same drug, you can see that or at least for my brother, it can see that he's having to pay way more than others are. I didn't realize your brother has diabetes. That must be tough for him. Is he managing okay?  Does he have to pay those high prices you mentioned?

Canvasser: Yeah. He is, he's doing better, certainly. But and right now, because of his insurance plan, he doesn't have to pay as much. But if he didn't have health insurance like many people don't, or if he had a worse health insurance plan, like he was working for you know, Target, then he he would be in trouble.

Voter: Well, I'm glad he has decent insurance now. I can see how that would be really stressful otherwise. His mom was worried sick. Do you think a lot of people are in that situation with insulin? Having to choose between medicine and other necessities?  I'm curious - does your brother ever struggle with affording his insulin?  How does that affect him and your family?

Canvasser: Oh, I'm I'm sorry to hear about your nephew. Yeah. I I mean, certainly, I think not being able to afford life saving medication because you've gotten laid off or because you're you know, your job changes is is terrible.

Canvasser: My brother, like I said, doesn't struggle now because of his current job situation, but I think he is worried that if he changes jobs in the future, or, you know, gets laid off unexpectedly, that could all change, and then he could be in real trouble.

Voter: That's a real worry to live with, isn't it? I can see how that would create a lot of stress. My nephew was only without his medication for about a month, but my sister was beside herself with worry.  It's not right that people have to worry about basic health needs just because of job changes. What do you think would help people like your brother have more security? Is that what this insulin price cap idea would do?

Canvasser: Yeah. Exactly. So if we were to cap the price of insulin from, say, two hundred dollars to thirty dollars even though my brother would be paying the same amount right now, if he was fired, or or, you know, he just was between jobs. He would just be able to afford it out of pocket rather than having to pay these exorbitant prices.

Canvasser: Oh, and your nephew too. Right? Wouldn't your, your sister wouldn't have had to worry about him because they could have just afforded it because it wouldn't have been outrageously expensive.

Voter: You're right, it would have made a huge difference for them.

Voter: My sister was trying to help him pay for it, but she's a single mom and it was just too much on top of her other bills. That was a really stressful time for our whole family. I hadn't really thought about it that way before - how a price cap could be like a safety net for people between jobs. That makes a lot of sense. What are you folks actually doing to try to make this happen? Is there something specific you're asking people to do?

Canvasser: Yeah. So I'm I'm glad you asked. Right now, there's some legislation in congress that is being voted on within a month. And we're trying to get people to call their representatives to tell them to vote for it so that it will significantly increase the likelihood that it passes.

Voter: That makes sense. You know, after hearing about how this could help people like my nephew and your brother, I think I would be willing to make that call.

Canvasser: Would that be something you'd be willing to do? Who would I need to contact exactly?  Do you have the information for who my representative is? You know what? I think I would be willing to do that. After thinking about what my nephew and sister went through, and knowing your brother faces the same worry, it just seems like the right thing to do. Do you have the number I should call?  And what exactly should I say when I call?

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

  const issueDetails = {
    insulin: {
      title: 'Healthcare - Insulin Affordability',
      plainLanguage: 'affordable insulin for people with diabetes',
      organization: 'Diabetes Advocates',
    },
    climate: {
      title: 'Climate - Wildfire Management',
      plainLanguage: 'protecting our communities from wildfires',
      organization: 'Against Wildfiresj',
    },
  };

  const currentIssue = issueDetails[selectedIssue as keyof typeof issueDetails];

  const [roleplayStarted, setRoleplayStarted] = useState(false);

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
    navigate(`/challenge/competencies?duration=${timeElapsed}&techniques=`);
  }, [disconnect, navigate, timeElapsed]);

  const startRoleplay = useCallback(async () => {
    setRoleplayStarted(true);
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
                    {/* Show voter info as first message from Frank */}
                    <div className="flex justify-start">
                      <div className="max-w-[90%] p-3 rounded-lg bg-gray-100 text-gray-800">
                        <div className="text-xs opacity-70 mb-1">Frank</div>
                        <p className="text-sm">
                          Hi there! I'm Frank Hamster, a 55 year old Registered Independent. I voted in 2020 but didn't make it to the polls
                          in 2024. My representative is Peter Gerbil.
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
                  <ContextAwareTipsBox currentIssue={currentIssue} />
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
  currentIssue?: {
    organization: string;
    plainLanguage: string;
  };
}

const ContextAwareTipsBox = ({ currentIssue }: ContextAwareTipsBoxProps) => {
  const { activeCues } = useConversationCues(currentIssue);

  const getIconAndColor = useCallback((type: string) => {
    switch (type) {
      case 'person':
        return { icon: Users, colorClass: 'from-green-50 to-green-100 border-green-200', iconColor: 'text-green-600' };
      case 'feeling':
        return { icon: Heart, colorClass: 'from-purple-50 to-purple-100 border-purple-200', iconColor: 'text-purple-600' };
      case 'framing':
        return { icon: Flag, colorClass: 'from-green-50 to-green-100 border-green-200', iconColor: 'text-green-600' };
      case 'perspective':
        return { icon: Brain, colorClass: 'from-blue-50 to-blue-100 border-blue-200', iconColor: 'text-blue-600' };
      case 'canvasser':
        return { icon: Sparkles, colorClass: 'from-red-50 to-red-100 border-red-200', iconColor: 'text-red-500' };
      default:
        return { icon: Sparkles, colorClass: 'from-amber-50 to-amber-100 border-amber-200', iconColor: 'text-amber-600' };
    }
  }, []);

  if (activeCues.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        <Bot className="w-8 h-8 mx-auto mb-2 opacity-30" />
        <p className="text-sm">Listening for opportunities to connect...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activeCues.map((cue, index) => {
        const { icon: IconComponent, colorClass, iconColor } = getIconAndColor(cue.type);

        return (
          <div
            key={`${cue.type}-${index}`}
            className="transition-all duration-500 ease-in-out transform"
            style={{
              transform: `translateY(${index * 4}px)`,
              opacity: 1,
            }}
          >
            <div className={`bg-gradient-to-r ${colorClass} border rounded-lg p-4`}>
              <div className="flex items-start gap-4">
                <IconComponent className={`w-8 h-8 ${iconColor} flex-shrink-0 mt-1`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Cue</span>
                    <span className="text-xs px-2 py-0.5 bg-white/70 rounded-full border text-gray-600">{cue.type}</span>
                  </div>
                  <p className="text-gray-800 text-sm leading-relaxed font-medium mb-1">"{cue.text}"</p>
                  <p className="text-gray-600 text-xs italic">{cue.rationale}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
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
