import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { useDialogue } from '@/features/dialogue';
import { useCues } from '@/features/dialogue/hooks/useConversationCues';
import { ReplayProvider } from '@/features/dialogue/providers/ReplayProvider';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Progress } from '@/ui/progress';
import { ArrowRight, Bot, Brain, Heart, Lightbulb, Mic, MicOff, Send, Sparkles, Users } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
      organization: 'Against Wildfires',
    },
  };

  const currentIssue = issueDetails[selectedIssue as keyof typeof issueDetails];

  const [roleplayStarted, setRoleplayStarted] = useState(false);

  const voterPersonas = useMemo(
    () =>
      ({
        insulin: 'Frank Hamster, a 55 year old Registered Independent who voted in 2020 but not in 2024',
        climate: 'Frank Hamster, a 55 year old Registered Independent who voted in 2020 but not in 2024',
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
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-2">
                  ✓
                </div>
                <span className="text-sm font-medium text-center text-green-600 font-sans">Conversation Strategy</span>
              </div>

              <ArrowRight className="w-6 h-6 text-gray-400" />

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-2">
                  2
                </div>
                <span className="text-sm font-medium text-center text-blue-600 font-sans">Roleplay</span>
              </div>

              <ArrowRight className="w-6 h-6 text-gray-400" />

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
            <div className="lg:col-span-2 space-y-6">
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
                    {/* Conversation messages */}
                    {messages.slice(-3).map((message) => (
                      <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[90%] p-3 rounded-lg ${
                            message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <div className="text-xs opacity-70 mb-1">
                            {message.role === 'user' ? 'You' : message.role === 'voter_narrator' ? 'Narrator' : 'Frank'}
                          </div>
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
  const { activeCues } = useCues(currentIssue);

  const getIconAndColor = useCallback((type: string) => {
    switch (type) {
      case 'person':
        return { icon: Users, colorClass: 'from-purple-50 to-purple-100 border-purple-200', iconColor: 'text-purple-600' };
      case 'feeling':
        return { icon: Heart, colorClass: 'from-pink-50 to-pink-100 border-pink-200', iconColor: 'text-pink-600' };
      case 'framing':
        return { icon: Send, colorClass: 'from-green-50 to-green-100 border-green-200', iconColor: 'text-green-600' };
      case 'perspective':
        return { icon: Brain, colorClass: 'from-blue-50 to-blue-100 border-blue-200', iconColor: 'text-blue-600' };
      case 'canvasser':
        return { icon: Sparkles, colorClass: 'from-amber-50 to-amber-100 border-amber-200', iconColor: 'text-amber-600' };
      default:
        return { icon: Sparkles, colorClass: 'from-gray-50 to-gray-100 border-gray-200', iconColor: 'text-gray-600' };
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
  const selectedIssue = sessionStorage.getItem('selectedIssue') || 'insulin';

  const voterPersonas = useMemo(
    () =>
      ({
        insulin: 'Frank Hamster, a 55 year old Registered Independent who voted in 2020 but not in 2024',
        climate: 'Frank Hamster, a 55 year old Registered Independent who voted in 2020 but not in 2024',
      }) as const,
    [],
  );

  const initialMessage = useMemo(
    () => ({
      id: 'initial',
      role: 'voter_narrator' as const,
      content: `You'll be talking with ${voterPersonas[selectedIssue as keyof typeof voterPersonas]}.`,
      timestamp: new Date(),
    }),
    [selectedIssue, voterPersonas],
  );

  return (
    <ReplayProvider initialMessage={initialMessage}>
      <RoleplayContent />
    </ReplayProvider>
  );
};

export default Roleplay;
