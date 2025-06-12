import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Progress } from '@/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { CheckCircle, Clock, Heart, Home, Minus, Play, RotateCcw, Square, Users, XCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Report = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [practiceTimer, setPracticeTimer] = useState(60);
  const [isPracticing, setIsPracticing] = useState(false);
  const [activeSnippet, setActiveSnippet] = useState<string | null>(null);

  const practiceTimerRef = useRef<NodeJS.Timeout>();

  const issue = searchParams.get('issue') || 'insulin';
  const duration = parseInt(searchParams.get('duration') || '0');
  const achievedTechniques = searchParams.get('techniques')?.split(',').filter(Boolean) || [];

  const practiceSnippets = [
    {
      id: 'neighbor-daughter',
      title: 'Follow up on family mention',
      voterText: "My neighbor's daughter is diabetic and they've really struggled with the costs.",
      challenge: "Practice asking about the daughter's specific situation",
      suggestedResponse: "How old is their daughter? What's been the hardest part for them?",
    },
    {
      id: 'angry-emotion',
      title: 'Dig deeper into emotions',
      voterText: 'It makes me angry, honestly. No one should have to ration their medication.',
      challenge: 'Validate their anger and explore it further',
      suggestedResponse: 'That anger makes complete sense. What specifically makes you angriest about this situation?',
    },
    {
      id: 'wife-emma',
      title: 'Personal connection opportunity',
      voterText: "Actually, my wife Emma has diabetes too. We're lucky to have good insurance now.",
      challenge: 'Connect on their personal experience',
      suggestedResponse: "Tell me about Emma's experience. What worries you most about her care?",
    },
  ];

  const techniques = [
    { id: 'plain-language', text: 'Used sensory language' },
    { id: 'asked-feelings', text: 'Asked about feelings' },
    { id: 'asked-loved-ones', text: 'Asked about loved ones' },
    { id: 'shared-story', text: 'Shared a personal story' },
  ];

  const sensoryLanguageExamples = [
    { type: 'right', example: 'You said "crushing medical bills" instead of "high medical costs"', category: 'Emotional impact' },
    { type: 'right', example: 'You used "see your family struggle" rather than "family difficulties"', category: 'Visual imagery' },
    { type: 'wrong', example: 'You said "pharmaceutical expenditures" instead of "drug costs"', category: 'Too technical' },
    { type: 'wrong', example: 'You used "healthcare accessibility parameters" instead of "getting care"', category: 'Jargon' },
    { type: 'wrong', example: 'You said "fiscal burden" instead of "money pressure"', category: 'Too formal' },
    { type: 'missed', example: 'Could have said "feel the relief" instead of "experience benefits"', category: 'Physical sensation' },
    { type: 'missed', example: 'Could have used "hear the worry in your voice" for emotional connection', category: 'Auditory' },
    { type: 'missed', example: 'Could have said "taste freedom from worry" instead of "reduced anxiety"', category: 'Metaphorical' },
    { type: 'missed', example: 'Could have used "weight lifted off your shoulders" for burden relief', category: 'Physical metaphor' },
    { type: 'missed', example: 'Could have said "bright future ahead" instead of "positive outcomes"', category: 'Visual metaphor' },
  ];

  const dugDeeperExamples = [
    {
      type: 'good',
      theyStaid: 'Yeah my daughter got really sick one time',
      yourResponse: "I'm sorry to hear that. Was she okay?",
      category: 'Empathy & Follow-up',
    },
    {
      type: 'good',
      theyStaid: 'We struggle with costs every month',
      yourResponse: 'That sounds really stressful. How do you manage?',
      category: 'Emotional connection',
    },
    {
      type: 'good',
      theyStaid: 'I worry about my future',
      yourResponse: 'What specifically worries you the most?',
      category: 'Clarifying question',
    },
  ];

  const familyMentions = [
    {
      mention: 'My wife Mary has been really worried about this',
      suggestedResponse: "Tell me more about Mary's concerns. What keeps her up at night about this?",
      category: 'Spouse connection',
    },
    {
      mention: 'Our granddaughter needs this medication',
      suggestedResponse: 'How old is your granddaughter? What would it mean to your family if she could get her medication reliably?',
      category: 'Grandchild welfare',
    },
    {
      mention: 'My son is studying to be a doctor',
      suggestedResponse:
        "That's wonderful! What does your son think about these healthcare challenges? Does he see this affecting his future patients?",
      category: "Child's perspective",
    },
  ];

  const issueDetails = {
    insulin: { title: 'Lower Insulin Prices' },
    healthcare: { title: 'Expand Healthcare Access' },
    education: { title: 'Education Funding' },
  };

  useEffect(() => {
    // Simulate 3-second report generation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isPracticing) {
      practiceTimerRef.current = setInterval(() => {
        setPracticeTimer((prev) => {
          if (prev <= 1) {
            stopPractice();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (practiceTimerRef.current) clearInterval(practiceTimerRef.current);
    };
  }, [isPracticing]);

  const startPractice = (snippetId: string) => {
    setActiveSnippet(snippetId);
    setPracticeTimer(60);
    setIsPracticing(true);
  };

  const stopPractice = () => {
    setIsPracticing(false);
    setActiveSnippet(null);
    setPracticeTimer(60);
    if (practiceTimerRef.current) clearInterval(practiceTimerRef.current);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const completionRate = (achievedTechniques.length / techniques.length) * 100;
  const overallScore = Math.max(20, Math.min(95, completionRate + duration / 10 + Math.random() * 20));

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Clock className="w-6 h-6 animate-spin" />
                Generating Your Report
              </CardTitle>
              <CardDescription>Our AI is analyzing your conversation and preparing detailed feedback...</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={66} className="w-full" />
                <div className="text-center text-sm text-gray-600">This usually takes about 20 seconds</div>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Analyzing conversation flow</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Evaluating persuasion techniques</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>Generating personalized feedback</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Persuasion Report</h1>
            <p className="text-xl text-gray-600">{issueDetails[issue as keyof typeof issueDetails]?.title} Session</p>
          </div>

          <div className="grid gap-6 mb-8">
            {/* Overall Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Overall Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{Math.round(overallScore)}%</div>
                    <p className="text-gray-600">Overall Score</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">{formatTime(duration)}</div>
                    <p className="text-gray-600">Session Duration</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {achievedTechniques.length}/{techniques.length}
                    </div>
                    <p className="text-gray-600">Techniques Used</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Practice Snippets Section */}
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <Play className="w-6 h-6" />
                  Practice Key Moments
                </CardTitle>
                <CardDescription className="text-purple-700">
                  Retry specific conversation moments with focused 1-minute practice sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {practiceSnippets.map((snippet) => (
                    <div key={snippet.id} className="border border-purple-200 rounded-lg p-4 bg-white">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-purple-800 mb-1">{snippet.title}</h4>
                          <p className="text-sm text-gray-600 italic mb-2">Voter: "{snippet.voterText}"</p>
                          <p className="text-sm text-purple-700 mb-2">
                            <strong>Challenge:</strong> {snippet.challenge}
                          </p>
                          <p className="text-xs text-gray-500">
                            <strong>Suggested approach:</strong> {snippet.suggestedResponse}
                          </p>
                        </div>
                        <div className="ml-4 flex flex-col items-end gap-2">
                          {activeSnippet === snippet.id && isPracticing ? (
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-600 mb-1">
                                {Math.floor(practiceTimer / 60)}:{(practiceTimer % 60).toString().padStart(2, '0')}
                              </div>
                              <Button onClick={stopPractice} variant="outline" size="sm">
                                <Square className="w-4 h-4 mr-1" />
                                Stop
                              </Button>
                            </div>
                          ) : (
                            <Button
                              onClick={() => startPractice(snippet.id)}
                              size="sm"
                              className="bg-purple-600 hover:bg-purple-700"
                              disabled={isPracticing}
                            >
                              <Play className="w-4 h-4 mr-1" />
                              Practice (1 min)
                            </Button>
                          )}
                        </div>
                      </div>
                      {activeSnippet === snippet.id && isPracticing && (
                        <div className="mt-3 p-3 bg-purple-100 rounded-lg border-l-4 border-purple-500">
                          <p className="text-sm text-purple-800">
                            <strong>Now practicing:</strong> Respond to what they just said. Focus on {snippet.challenge.toLowerCase()}.
                          </p>
                          <Progress value={((60 - practiceTimer) / 60) * 100} className="mt-2" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {isPracticing && (
                  <div className="mt-4 p-3 bg-purple-100 rounded-lg">
                    <p className="text-sm text-purple-800">
                      <strong>Tip:</strong> Speak out loud as if you're responding to the voter. Focus on the specific challenge for this
                      moment.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Techniques Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Technique Performance</CardTitle>
                <CardDescription>How well you applied key persuasion strategies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {techniques.map((technique) => {
                    const isAchieved = achievedTechniques.includes(technique.id);
                    return (
                      <div key={technique.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                        {isAchieved ? <CheckCircle className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-400" />}
                        <span className="flex-1">{technique.text}</span>
                        <Badge variant={isAchieved ? 'default' : 'secondary'}>{isAchieved ? 'Achieved' : 'Missed'}</Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Family Mentions - Missed Opportunities */}
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <Users className="w-6 h-6" />
                  Family Mentions - Dig Deeper Opportunities
                </CardTitle>
                <CardDescription className="text-orange-700">
                  When they mentioned family members, you could have explored these connections more deeply
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>They Mentioned</TableHead>
                      <TableHead>You Could Have Asked</TableHead>
                      <TableHead>Connection Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {familyMentions.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium italic text-orange-800">"{item.mention}"</TableCell>
                        <TableCell className="font-medium text-orange-700">"{item.suggestedResponse}"</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                            {item.category}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 p-3 bg-orange-100 rounded-lg">
                  <p className="text-sm text-orange-800">
                    <strong>Tip:</strong> When voters mention specific family members by name or relationship, that's your cue to dig
                    deeper. Ask about their feelings, their specific situation, or how the issue affects that person directly.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Dug Deeper Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-6 h-6 text-red-500" />
                  Dug Deeper
                </CardTitle>
                <CardDescription>Examples of good follow-up responses you made</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>They Said</TableHead>
                      <TableHead>Your Follow-up</TableHead>
                      <TableHead>Category</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dugDeeperExamples.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium italic">"{item.theyStaid}"</TableCell>
                        <TableCell className="font-medium text-green-700">"{item.yourResponse}"</TableCell>
                        <TableCell>
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            {item.category}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Sensory Language Detailed Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Sensory Language Analysis</CardTitle>
                <CardDescription>Detailed breakdown of your language choices</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Result</TableHead>
                      <TableHead>Example</TableHead>
                      <TableHead>Category</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sensoryLanguageExamples.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {item.type === 'right' && <CheckCircle className="w-5 h-5 text-green-600" />}
                          {item.type === 'wrong' && <XCircle className="w-5 h-5 text-red-500" />}
                          {item.type === 'missed' && <Minus className="w-5 h-5 text-gray-400" />}
                        </TableCell>
                        <TableCell className="font-medium">{item.example}</TableCell>
                        <TableCell>
                          <Badge variant={item.type === 'right' ? 'default' : item.type === 'wrong' ? 'destructive' : 'secondary'}>
                            {item.category}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Positive Feedback */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">What You Did Well</CardTitle>
              </CardHeader>
              <CardContent className="text-green-700">
                <ul className="space-y-2">
                  <li>• You maintained a respectful and engaging tone throughout the conversation</li>
                  {achievedTechniques.includes('plain-language') && (
                    <li>• Your language was clear and accessible - no jargon or complex terms</li>
                  )}
                  {achievedTechniques.includes('asked-feelings') && (
                    <li>• You successfully connected on an emotional level by asking about feelings</li>
                  )}
                  {achievedTechniques.includes('asked-loved-ones') && (
                    <li>• You personalized the issue by asking about family and loved ones</li>
                  )}
                  {achievedTechniques.includes('shared-story') && (
                    <li>• You made the conversation relatable by sharing a personal story</li>
                  )}
                  <li>• You demonstrated genuine interest in the voter's perspective</li>
                </ul>
              </CardContent>
            </Card>

            {/* Areas for Improvement */}
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-800">Areas for Improvement</CardTitle>
              </CardHeader>
              <CardContent className="text-orange-700">
                <ul className="space-y-2">
                  {!achievedTechniques.includes('plain-language') && (
                    <li>• Try using more sensory, emotional language to connect better</li>
                  )}
                  {!achievedTechniques.includes('asked-feelings') && <li>• Ask more about how the issue makes them feel personally</li>}
                  {!achievedTechniques.includes('asked-loved-ones') && (
                    <li>• Inquire about how the issue affects their family or loved ones</li>
                  )}
                  {!achievedTechniques.includes('shared-story') && (
                    <li>• Share a personal story to make the conversation more relatable</li>
                  )}
                  <li>• Allow more pauses for the voter to fully express their thoughts</li>
                  <li>• Practice acknowledging their concerns before presenting your perspective</li>
                  {duration < 300 && <li>• Try to extend the conversation to build deeper rapport</li>}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center gap-4">
            <Button onClick={() => navigate('/')} variant="outline" size="lg">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <Button onClick={() => navigate('/roleplay?issue=' + issue)} size="lg">
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Report;
