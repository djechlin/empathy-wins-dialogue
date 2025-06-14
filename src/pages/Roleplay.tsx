import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import StepNavigation from '@/components/StepNavigation';
import { useConversationSession, useDialogue } from '@/features/dialogue';
import { usePeople } from '@/features/dialogue/hooks/usePeople';
import { DialogueProvider } from '@/features/dialogue/providers/DialogueProvider';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Progress } from '@/ui/progress';
import { BookOpen, Heart, MessageSquare, Mic, MicOff, Smile, User, Users } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RoleplayContent() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { messages, connect, disconnect, togglePause, isPaused, timeElapsed } = useDialogue();
  const { people } = usePeople();
  const { setMessages } = useConversationSession();
  const [selectedIssue] = useState<string>(() => {
    return sessionStorage.getItem('selectedIssue') || '';
  });

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
    // Sync conversation messages to session
    setMessages(messages);

    // Save transcript to session storage for report
    const transcript = messages
      .map((msg) => {
        const role = msg.role === 'user' ? 'Canvasser' : 'Voter';
        return `${role}: ${msg.content}`;
      })
      .join('\n\n');
    sessionStorage.setItem('report.transcript', transcript);

    disconnect();
    navigate('/challenge/competencies');
  }, [disconnect, navigate, messages, setMessages]);

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

  const personColors = [
    'from-orange-50 to-orange-100 border-orange-200 text-orange-600',
    'from-purple-50 to-purple-100 border-purple-200 text-purple-600',
    'from-blue-50 to-blue-100 border-blue-200 text-blue-600',
    'from-green-50 to-green-100 border-green-200 text-green-600',
    'from-pink-50 to-pink-100 border-pink-200 text-pink-600',
    'from-amber-50 to-amber-100 border-amber-200 text-amber-600',
  ];

  const personIcons = [
    <User className="w-6 h-6 mb-1" />,
    <Heart className="w-6 h-6 mb-1" />,
    <Smile className="w-6 h-6 mb-1" />,
    <Heart className="w-6 h-6 mb-1" />,
    <Smile className="w-6 h-6 mb-1" />,
    <User className="w-6 h-6 mb-1" />,
  ];

  const scriptSteps = [
    {
      text: '"My name is [your name], I\'m here with Diabetes Advocates to talk about affordable insulin for people with diabetes."',
      rationale: 'Introduce yourself and frame the issue',
      color: 'bg-green-500',
      hasQuote: true,
    },
    {
      text: '<MessageSquare> "Is there anyone in your life who had trouble seeing a doctor?"\n\n<MessageSquare> "One time when I was sick, someone close to me helped me..."\n\n<Heart> Dig deeper when they share someone',
      rationale: 'Build a connection',
      color: 'bg-orange-500',
      hasQuote: true,
    },
    {
      text: '"Do you have any new thoughts or feelings on issue, after exploring people we know?"',
      rationale: 'Transition to exploring the issue',
      color: 'bg-blue-500',
      hasQuote: true,
    },
    {
      text: '"Would you take your phone and call Representative Peter Gerbil to tell him how you feel? His number is 555-4567"',
      rationale: 'Ask for action',
      color: 'bg-purple-500',
      hasQuote: true,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          <StepNavigation stepNumber={2} />

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

              {/* Script Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-green-600" />
                    Script
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {scriptSteps.map((step, index) => (
                      <div key={`script-${index}`} className="flex items-start gap-6">
                        <div className="flex flex-col items-center flex-shrink-0">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white ${step.color}`}
                          >
                            {index + 1}
                          </div>
                          {index < scriptSteps.length - 1 && <div className="w-0.5 h-4 bg-gray-200 mt-2"></div>}
                        </div>
                        <div className="flex-1 pt-1">
                          <h4 className="font-sans font-semibold text-gray-900 text-base mb-2">{step.rationale}</h4>
                          <div className="flex items-start gap-2">
                            {step.hasQuote && !step.text.includes('<MessageSquare>') && !step.text.includes('<Heart>') && (
                              <MessageSquare className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                            )}
                            <p className="text-sm text-gray-600 whitespace-pre-line">
                              {step.text.split('\n\n').map((line, i) => {
                                if (line.startsWith('<MessageSquare>')) {
                                  return (
                                    <div key={i} className="flex items-start gap-2 mb-2">
                                      <MessageSquare className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                                      <span>{line.replace('<MessageSquare>', '')}</span>
                                    </div>
                                  );
                                }
                                if (line.startsWith('<Heart>')) {
                                  return (
                                    <div key={i} className="flex items-start gap-2 mb-2">
                                      <Heart className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                                      <span>{line.replace('<Heart>', '')}</span>
                                    </div>
                                  );
                                }
                                return (
                                  <div key={i} className="mb-2">
                                    {line}
                                  </div>
                                );
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              {/* People Cues Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    People
                  </CardTitle>
                  <p className="text-sm text-gray-500">People the voter mentioned. Try learning more about them.</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {people.map((person, index) => (
                      <div
                        key={person.text}
                        className={`bg-gradient-to-r ${personColors[index % personColors.length]} border rounded-lg p-3 ${
                          index === 0 ? 'col-span-1.5' : 'col-span-1'
                        }`}
                      >
                        <div className="flex flex-col items-center text-center">
                          {personIcons[index % personIcons.length]}
                          <p className="font-medium text-sm">{person.text}</p>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{person.rationale}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent conversation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    Recent Messages
                  </CardTitle>
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
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

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
    <DialogueProvider initialMessage={initialMessage}>
      <RoleplayContent />
    </DialogueProvider>
  );
};

export default Roleplay;
