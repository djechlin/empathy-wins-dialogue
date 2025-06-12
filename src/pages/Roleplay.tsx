import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Progress } from '@/ui/progress';
import { AlertCircle, Clock, Heart, Lightbulb, Mic, MicOff, User, Users, MessageCircle, ArrowRight } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ConversationMessage {
  id: number;
  speaker: 'canvasser' | 'voter';
  text: string;
  timestamp: number;
}

interface CoachingCue {
  id: string;
  type: 'name' | 'emotion' | 'time' | 'opportunity';
  trigger: string;
  prompt: string;
  urgency: 'high' | 'medium' | 'low';
  appearsAt: number;
  dismissedAt?: number;
}

interface MentionedPerson {
  name: string;
  relationship: string;
  context: string;
  firstMentionedAt: number;
  followedUp: boolean;
}

const Roleplay = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const [isRecording, setIsRecording] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [achievedTechniques, setAchievedTechniques] = useState<string[]>([]);
  const [roleplayStarted, setRoleplayStarted] = useState(false);
  const [conversationMessages, setConversationMessages] = useState<ConversationMessage[]>([]);
  const [activeCues, setActiveCues] = useState<CoachingCue[]>([]);
  const [dismissedCues, setDismissedCues] = useState<string[]>([]);
  const [mentionedPeople, setMentionedPeople] = useState<MentionedPerson[]>([]);

  const timerRef = useRef<NodeJS.Timeout>();
  const messageTimerRef = useRef<NodeJS.Timeout>();
  const sessionDuration = 600; // 10 minutes in seconds

  const techniques = useMemo(
    () =>
      [
        { id: 'plain-language', text: 'Used plain language', achieved: false },
        { id: 'asked-feelings', text: 'Asked about feelings', achieved: false },
        { id: 'asked-loved-ones', text: 'Asked about loved ones', achieved: false },
        { id: 'shared-story', text: 'Shared a personal story', achieved: false },
      ] as const,
    [],
  );

  const voterPersonas = useMemo(
    () =>
      ({
        insulin: 'Sarah, a working mother concerned about healthcare costs',
        climate: 'Mike, a small business owner in rural area',
      }) as const,
    [],
  );

  const mockConversation = useMemo<ConversationMessage[]>(
    () => [
      {
        id: 1,
        speaker: 'voter' as const,
        text: "Hi there! I'm glad you reached out. I have to be honest, I'm pretty busy these days, but what did you want to talk about?",
        timestamp: 2,
      },
      {
        id: 2,
        speaker: 'canvasser',
        text: 'Thanks for taking the time, Sarah. I wanted to talk about something that affects a lot of families - the cost of insulin. Have you or anyone you know been affected by high prescription costs?',
        timestamp: 3,
      },
      {
        id: 3,
        speaker: 'voter',
        text: "Actually, yes. My neighbor's daughter is diabetic and they've really struggled with the costs. It's honestly heartbreaking to watch.",
        timestamp: 4,
      },
      {
        id: 4,
        speaker: 'canvasser',
        text: 'That must be really difficult to see your neighbors going through that. How does it make you feel when you hear about families having to choose between medicine and other necessities?',
        timestamp: 5,
      },
      {
        id: 5,
        speaker: 'voter',
        text: "It makes me angry, honestly. No one should have to ration their medication because they can't afford it. It just doesn't seem right in a country like ours.",
        timestamp: 6,
      },
      {
        id: 6,
        speaker: 'canvasser',
        text: "I completely understand that anger. I feel the same way. My own aunt had to cut her insulin doses in half last year because of the cost. Have you thought about what could be done to help families like your neighbor's?",
        timestamp: 7,
      },
      {
        id: 7,
        speaker: 'voter',
        text: "I hadn't really thought about solutions, but there has to be something we can do. What are you thinking?",
        timestamp: 8,
      },
      {
        id: 8,
        speaker: 'canvasser',
        text: "There's actually legislation being proposed that would cap insulin costs at $35 per month. It would mean families like your neighbor's wouldn't have to make those impossible choices anymore.",
        timestamp: 9,
      },
      {
        id: 9,
        speaker: 'voter',
        text: "That sounds reasonable. $35 is still money, but it's not going to break anyone's budget. How would something like that work?",
        timestamp: 10,
      },
      {
        id: 10,
        speaker: 'canvasser',
        text: "The idea is to limit what insurance companies and pharmacies can charge patients directly. The medication would still be covered, but there would be a cap on out-of-pocket costs. It's worked in other states.",
        timestamp: 11,
      },
      {
        id: 11,
        speaker: 'voter',
        text: "That makes sense. I'm generally skeptical of government intervention, but when people are literally dying because they can't afford medicine... that's just wrong.",
        timestamp: 12,
      },
      {
        id: 12,
        speaker: 'voter',
        text: "Actually, my wife Emma has diabetes too. We're lucky to have good insurance now, but I know that could change.",
        timestamp: 13,
      },
      {
        id: 13,
        speaker: 'canvasser',
        text: "I appreciate your honesty about being skeptical - that's completely understandable. What would it mean to you personally to know that your neighbor's family wouldn't have to worry about this anymore?",
        timestamp: 14,
      },
      {
        id: 14,
        speaker: 'voter',
        text: 'It would be a huge relief, honestly. I worry about them all the time. And I worry about what would happen to my own family if we ever faced something like this.',
        timestamp: 15,
      },
    ],
    [],
  );

  const predefinedCues = useMemo<CoachingCue[]>(
    () => [
      {
        id: 'neighbor-daughter',
        type: 'name' as const,
        trigger: "neighbor's daughter",
        prompt: "Ask about the daughter's age or specific struggles",
        urgency: 'high' as const,
        appearsAt: 26,
      },
      {
        id: 'heartbreaking',
        type: 'emotion' as const,
        trigger: 'heartbreaking',
        prompt: "Follow up: 'What's the hardest part for you to watch?'",
        urgency: 'high' as const,
        appearsAt: 26,
      },
      {
        id: 'angry-emotion',
        type: 'emotion' as const,
        trigger: 'angry',
        prompt: 'Validate their anger and dig deeper into why',
        urgency: 'medium' as const,
        appearsAt: 53,
      },
      {
        id: 'wife-emma',
        type: 'name' as const,
        trigger: 'wife Emma',
        prompt: "Ask: 'How does Emma feel about the costs? What's her biggest concern?'",
        urgency: 'high' as const,
        appearsAt: 171,
      },
      {
        id: 'worry-opportunity',
        type: 'opportunity' as const,
        trigger: 'worry about them',
        prompt: 'This is your moment - they care deeply. Ask what keeps them up at night.',
        urgency: 'high' as const,
        appearsAt: 191,
      },
    ],
    [],
  );

  const peoplePatterns = useMemo(
    () =>
      [
        {
          pattern: /neighbor's daughter/i,
          name: "neighbor's daughter",
          relationship: 'neighbor',
          context: 'diabetic, struggling with insulin costs',
        },
        {
          pattern: /wife Emma/i,
          name: 'Emma',
          relationship: 'wife',
          context: 'has diabetes, currently has good insurance',
        },
        {
          pattern: /my aunt/i,
          name: 'aunt',
          relationship: 'aunt',
          context: 'had to cut insulin doses due to cost',
        },
      ] as const,
    [],
  );

  const finishRoleplay = useCallback(() => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (messageTimerRef.current) clearInterval(messageTimerRef.current);

    navigate(`/report?duration=${timeElapsed}&techniques=${achievedTechniques.join(',')}`);
  }, [navigate, timeElapsed, achievedTechniques]);

  const mockAchieveTechnique = useCallback(
    (techniqueId: string) => {
      if (!achievedTechniques.includes(techniqueId)) {
        setAchievedTechniques((prev) => [...prev, techniqueId]);
        const technique = techniques.find((t) => t.id === techniqueId);
        if (technique) {
          toast({
            title: 'Great technique!',
            description: technique.text,
          });
        }
      }
    },
    [achievedTechniques, toast, techniques],
  );

  const extractMentionedPeople = useCallback(
    (message: ConversationMessage) => {
      peoplePatterns.forEach(({ pattern, name, relationship, context }) => {
        if (pattern.test(message.text) && !mentionedPeople.find((p) => p.name === name)) {
          const newPerson: MentionedPerson = {
            name,
            relationship,
            context,
            firstMentionedAt: message.timestamp,
            followedUp: false,
          };
          setMentionedPeople((prev) => [...prev, newPerson]);
        }
      });
    },
    [mentionedPeople, peoplePatterns],
  );

  const markPersonFollowedUp = useCallback((personName: string) => {
    setMentionedPeople((prev) => prev.map((person) => (person.name === personName ? { ...person, followedUp: true } : person)));
  }, []);

  const dismissCue = useCallback((cueId: string) => {
    setActiveCues((prev) => prev.filter((cue) => cue.id !== cueId));
    setDismissedCues((prev) => [...prev, cueId]);
  }, []);

  const startRoleplay = useCallback(async () => {
    setRoleplayStarted(true);
    setIsRecording(true);
    setConversationMessages([]);
    setActiveCues([]);
    setDismissedCues([]);
    setMentionedPeople([]);

    toast({
      title: 'Roleplay Started',
      description: 'Listen for names, emotions, and moments to dig deeper.',
    });
  }, [toast]);

  const toggleRecording = useCallback(() => {
    setIsRecording(!isRecording);
  }, [isRecording]);

  useEffect(() => {
    if (roleplayStarted) {
      timerRef.current = setInterval(() => {
        setTimeElapsed((prev) => {
          if (prev >= sessionDuration) {
            finishRoleplay();
            return sessionDuration;
          }
          return prev + 1;
        });
      }, 1000);

      messageTimerRef.current = setInterval(() => {
        setConversationMessages((prevMessages) => {
          const nextMessageIndex = prevMessages.length;
          const nextMessage = mockConversation[nextMessageIndex];

          if (nextMessage) {
            // Extract mentioned people
            extractMentionedPeople(nextMessage);

            // Check for new coaching cues based on time elapsed
            setTimeElapsed((currentTime) => {
              const newCues = predefinedCues.filter(
                (cue) =>
                  cue.appearsAt === currentTime && !dismissedCues.includes(cue.id) && !activeCues.find((active) => active.id === cue.id),
              );

              if (newCues.length > 0) {
                setActiveCues((prev) => [...prev, ...newCues]);
              }
              return currentTime;
            });

            // Check for technique achievements
            if (nextMessage.speaker === 'canvasser') {
              if (nextMessage.text.toLowerCase().includes('feel') && !achievedTechniques.includes('asked-feelings')) {
                mockAchieveTechnique('asked-feelings');
              }
              if (nextMessage.text.toLowerCase().includes('aunt') && !achievedTechniques.includes('shared-story')) {
                mockAchieveTechnique('shared-story');
              }
              if (nextMessage.text.toLowerCase().includes('$35') && !achievedTechniques.includes('plain-language')) {
                mockAchieveTechnique('plain-language');
              }
            }

            return [...prevMessages, nextMessage];
          }

          return prevMessages;
        });
      }, 2000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (messageTimerRef.current) clearInterval(messageTimerRef.current);
    };
  }, [
    roleplayStarted,
    activeCues,
    dismissedCues,
    achievedTechniques,
    extractMentionedPeople,
    mockAchieveTechnique,
    finishRoleplay,
    mockConversation,
    predefinedCues,
    sessionDuration,
  ]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const getCueIcon = useCallback((type: string) => {
    switch (type) {
      case 'name':
        return Users;
      case 'emotion':
        return Heart;
      case 'time':
        return Clock;
      case 'opportunity':
        return Lightbulb;
      default:
        return AlertCircle;
    }
  }, []);

  const getCueColor = useCallback((urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'border-red-300 bg-red-50';
      case 'medium':
        return 'border-yellow-300 bg-yellow-50';
      case 'low':
        return 'border-blue-300 bg-blue-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  }, []);

  const progressPercentage = useMemo(() => (timeElapsed / sessionDuration) * 100, [timeElapsed, sessionDuration]);

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
                          variant={isRecording ? 'destructive' : 'default'}
                          size="lg"
                          className="flex items-center gap-2"
                        >
                          {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                          {isRecording ? 'Pause' : 'Resume'}
                        </Button>
                        <Button onClick={finishRoleplay} variant="outline">
                          Finish Roleplay
                        </Button>
                      </div>
                      {isRecording && (
                        <div className="flex items-center justify-center gap-2 text-red-600">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                          <span>Recording...</span>
                        </div>
                      )}
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
                    {conversationMessages.slice(-3).map((message) => (
                      <div key={message.id} className={`flex ${message.speaker === 'canvasser' ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[90%] p-3 rounded-lg ${
                            message.speaker === 'canvasser' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <div className="text-xs opacity-70 mb-1">{message.speaker === 'canvasser' ? 'You' : 'Frank'}</div>
                          <p className="text-sm">{message.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Coaching Cues */}
            <div className="lg:col-span-2 space-y-4">
              {/* Your Script */}
              {personType && eventType && selectedFeeling && currentIssue && (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Script</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 text-sm">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
                          1
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 mb-1">Framing:</h5>
                          <p className="text-gray-700 font-mono text-xs">
                            My name is [your name], I'm here with <span dangerouslySetInnerHTML={{ __html: currentIssue.organization }} />{' '}
                            to talk about {currentIssue.plainLanguage}.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
                          2
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 mb-1">Share your story:</h5>
                          <p className="text-gray-700 font-mono text-xs">
                            One time, I {eventType} and was really worried. What happened was...
                            <br />
                            <span className="text-gray-500">[your story]</span>
                            <br />
                            My {personType} was really there for me. They helped me by...
                            <br />
                            <span className="text-gray-500">[what they did]</span>
                            <br />
                            and that really made me feel {selectedFeeling}. Is there a time someone was really there for you?
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
                          3
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 mb-1">Dig deeper:</h5>
                          <div className="text-gray-600 text-xs space-y-2">
                            <div className="flex items-center gap-2">
                              <MessageCircle className="w-3 h-3 text-blue-500" />
                              <p>Ask about their family.</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <MessageCircle className="w-3 h-3 text-blue-500" />
                              <p>When they name a person, ask more about them.</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <MessageCircle className="w-3 h-3 text-blue-500" />
                              <p>When they say how they feel, ask why.</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
                          4
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 mb-1">Explore together:</h5>
                          <p className="text-gray-700 font-mono text-xs">
                            It sounds like we both really care about the people we love. Does that change how you think about this issue at
                            all?
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
                          5
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 mb-1">Ask for action:</h5>
                          <p className="text-gray-700 font-mono text-xs">
                            Now that we've explored the issue together, would you take your phone and tell your representative Peter Gerbil
                            how you feel, at 555-4567?
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Live Coaching</CardTitle>
                </CardHeader>
                <CardContent>
                  {activeCues.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Listen actively. Cues will appear here when they mention important details.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activeCues.map((cue) => {
                        const Icon = getCueIcon(cue.type);
                        return (
                          <div key={cue.id} className={`border-2 rounded-lg p-4 ${getCueColor(cue.urgency)} animate-fade-in`}>
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <Icon className="w-5 h-5 mt-0.5 text-gray-600" />
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="outline" className="text-xs">
                                      {cue.type}
                                    </Badge>
                                    {cue.urgency === 'high' && (
                                      <Badge variant="destructive" className="text-xs">
                                        Act Now
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="font-medium text-gray-800 mb-1">They said: "{cue.trigger}"</p>
                                  <p className="text-sm text-gray-700">{cue.prompt}</p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => dismissCue(cue.id)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                ✕
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* People Mentioned Section */}
                  {mentionedPeople.length > 0 && (
                    <div className="mt-6 pt-4 border-t">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        People Mentioned
                      </h4>
                      <div className="space-y-2">
                        {mentionedPeople.map((person, index) => (
                          <div
                            key={index}
                            className={`flex items-center justify-between p-2 rounded border ${
                              person.followedUp ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'
                            }`}
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{person.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {person.relationship}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">{person.context}</p>
                            </div>
                            {!person.followedUp && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markPersonFollowedUp(person.name)}
                                className="text-xs px-2 py-1 h-auto"
                              >
                                Mark as followed up
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Techniques Progress */}
                  <div className="mt-6 pt-4 border-t">
                    <h4 className="font-medium mb-3">Techniques Used</h4>
                    <div className="space-y-2">
                      {techniques.map((technique) => {
                        const isAchieved = achievedTechniques.includes(technique.id);
                        return (
                          <div
                            key={technique.id}
                            className={`flex items-center gap-2 text-sm ${isAchieved ? 'text-green-700' : 'text-gray-500'}`}
                          >
                            <div className={`w-2 h-2 rounded-full ${isAchieved ? 'bg-green-500' : 'bg-gray-300'}`} />
                            {technique.text}
                          </div>
                        );
                      })}
                    </div>
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
};

export default Roleplay;
