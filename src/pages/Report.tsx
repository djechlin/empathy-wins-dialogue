import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import StepNavigation from '@/components/StepNavigation';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Progress } from '@/ui/progress';
import {
  CheckCircle,
  Clock,
  Heart,
  Home,
  RotateCcw,
  XCircle,
  Target,
  Ear,
  Compass,
  MessageSquareX,
  Search,
  HelpCircle,
} from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { createCompetencyReportPrompt } from '@/lib/deepCanvassingPrompt';
import { ConversationReport } from '@/types/ConversationReport';
import { useConversationSession } from '@/features/dialogue';
import lucasTranscript from '@/features/dialogue/providers/replays/lucas.txt?raw';

const Report = () => {
  const navigate = useNavigate();
  const { messages, hasMessages } = useConversationSession();
  const [isLoading, setIsLoading] = useState(true);
  const [report, setReport] = useState<ConversationReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Convert dialogue messages to transcript format
  const getTranscript = useCallback(() => {
    // First check session storage for saved transcript
    const savedTranscript = sessionStorage.getItem('report.transcript');
    if (savedTranscript) {
      return savedTranscript;
    }
    
    // Then check conversation session messages
    if (hasMessages) {
      return messages
        .map((msg) => {
          const role = msg.role === 'user' ? 'Canvasser' : 'Voter';
          return `${role}: ${msg.content}`;
        })
        .join('\n\n');
    }
    
    // Fallback to lucas.txt for testing
    return lucasTranscript;
  }, [hasMessages, messages]);

  useEffect(() => {
    const generateReport = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const transcript = getTranscript();
        const prompt = createCompetencyReportPrompt(transcript);

        const { data, error: supabaseError } = await supabase.functions.invoke('claude-report', {
          body: {
            userMessage: prompt,
          },
        });

        if (supabaseError) {
          throw new Error('Failed to generate report: ' + supabaseError.message);
        }

        // Extract JSON from response
        const jsonMatch = data.match(/<json>(.*?)<\/json>/s);
        if (!jsonMatch) {
          throw new Error('No valid JSON found in response');
        }

        const reportData = JSON.parse(jsonMatch[1]) as ConversationReport;
        setReport(reportData);
      } catch (err) {
        console.error('Error generating report:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    generateReport();
  }, [getTranscript]);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'message-x':
        return MessageSquareX;
      case 'search':
        return Search;
      case 'heart':
        return Heart;
      case 'help-circle':
        return HelpCircle;
      case 'target':
        return Target;
      case 'ear':
        return Ear;
      case 'compass':
        return Compass;
      default:
        return CheckCircle;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Clock className="w-6 h-6 animate-spin" />
                Generating Your Deep Canvassing Report
              </CardTitle>
              <CardDescription>Our AI is analyzing your conversation and evaluating deep canvassing techniques...</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={66} className="w-full" />
                <div className="text-center text-sm text-gray-600">This usually takes about 20 seconds</div>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Analyzing vulnerability and connection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Evaluating empathetic listening</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>Generating personalized coaching feedback</span>
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

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-red-600">
                <XCircle className="w-6 h-6" />
                Error Generating Report
              </CardTitle>
              <CardDescription>We encountered an issue while analyzing your conversation.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center text-sm text-red-600">{error}</div>
                <Button onClick={() => window.location.reload()} className="w-full">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (!report) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <StepNavigation stepNumber={3} />

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Deep Canvassing Report</h1>
            <p className="text-xl text-gray-600">Competency Assessment and Coaching Feedback</p>
          </div>

          {/* Summary Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Overall Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{report.summary}</p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{report.baseScore}/10</div>
                  <p className="text-sm text-gray-600">Starting Position</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">{report.currentScore}/10</div>
                  <p className="text-sm text-gray-600">Final Position</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">{report.completedSteps}/4</div>
                  <p className="text-sm text-gray-600">Steps Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 mb-8">
            {/* Deep Canvassing Competencies */}
            <Card>
              <CardHeader>
                <CardTitle>Deep Canvassing Competencies</CardTitle>
                <CardDescription>How well you applied each core technique</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {report.categories.map((category) => {
                    const IconComponent = getIconComponent(category.icon);
                    return (
                      <div key={category.id} className="border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <IconComponent className="w-6 h-6 text-blue-600" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{category.name}</h3>
                            <div className="flex items-center gap-2">
                              <div className="text-2xl font-bold text-blue-600">{category.score}/10</div>
                              <Progress value={category.score * 10} className="flex-1 max-w-32" />
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3">{category.feedback}</p>
                        <div className="space-y-3">
                          <h4 className="font-medium text-sm text-gray-600">Examples from your conversation:</h4>
                          <div className="space-y-3">
                            {category.examples.map((example, idx) => {
                              const isPositive = example.type === 'positive';
                              return (
                                <div
                                  key={idx}
                                  className={`p-3 rounded-lg border ${isPositive ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
                                >
                                  <div className="flex items-start gap-2 mb-2">
                                    {isPositive ? (
                                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    ) : (
                                      <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                                    )}
                                    <div className="flex-1">
                                      <blockquote className={`italic text-sm mb-1 ${isPositive ? 'text-green-800' : 'text-red-800'}`}>
                                        "{example.quote}"
                                      </blockquote>
                                      <p className={`text-xs ${isPositive ? 'text-green-700' : 'text-red-700'}`}>{example.analysis}</p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Key Moments */}
            <Card>
              <CardHeader>
                <CardTitle>Key Moments in Your Conversation</CardTitle>
                <CardDescription>Significant moments that shaped the conversation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {report.keyMoments.map((moment, idx) => {
                    const isPositive = moment.type === 'positive';
                    const isImprovement = moment.type === 'improvement';
                    const iconColor = isPositive ? 'text-green-600' : isImprovement ? 'text-orange-500' : 'text-red-500';
                    const bgColor = isPositive
                      ? 'bg-green-50 border-green-200'
                      : isImprovement
                        ? 'bg-orange-50 border-orange-200'
                        : 'bg-red-50 border-red-200';

                    return (
                      <div key={idx} className={`p-4 rounded-lg border ${bgColor}`}>
                        <div className="flex items-start gap-3">
                          {isPositive ? (
                            <CheckCircle className={`w-5 h-5 mt-0.5 ${iconColor}`} />
                          ) : isImprovement ? (
                            <Clock className={`w-5 h-5 mt-0.5 ${iconColor}`} />
                          ) : (
                            <XCircle className={`w-5 h-5 mt-0.5 ${iconColor}`} />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium text-gray-500">{moment.timestamp}</span>
                              <Badge variant={isPositive ? 'default' : isImprovement ? 'secondary' : 'destructive'}>
                                {moment.type.replace('_', ' ')}
                              </Badge>
                            </div>
                            <p className="text-gray-700 mb-2">{moment.description}</p>
                            {moment.quote && (
                              <blockquote className="italic text-gray-600 border-l-2 border-gray-300 pl-3">"{moment.quote}"</blockquote>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Strengths */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">What You Did Well</CardTitle>
              </CardHeader>
              <CardContent className="text-green-700">
                <ul className="space-y-2">
                  {report.strengths.map((strength, idx) => (
                    <li key={idx}>• {strength}</li>
                  ))}
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
                  {report.improvements.map((improvement, idx) => (
                    <li key={idx}>• {improvement}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800">Next Steps for Learning</CardTitle>
              </CardHeader>
              <CardContent className="text-blue-700">
                <ul className="space-y-2">
                  {report.nextSteps.map((step, idx) => (
                    <li key={idx}>• {step}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center gap-4">
            <Button onClick={() => navigate('/')} variant="outline" size="lg">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <Button onClick={() => navigate('/roleplay')} size="lg">
              <RotateCcw className="w-4 h-4 mr-2" />
              Practice Again
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Report;
