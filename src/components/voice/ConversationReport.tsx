
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, XCircle, Heart, MessageCircle, BookOpen, Users } from 'lucide-react';
import { ConversationReport as ReportType, KeyMoment } from '@/types/conversationReport';

interface ConversationReportProps {
  report: ReportType;
}

const ConversationReport = ({ report }: ConversationReportProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  const getMomentIcon = (type: KeyMoment['type']) => {
    switch (type) {
      case 'positive':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'improvement':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'missed_opportunity':
        return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const categoryIcons = {
    storyTelling: <Heart className="h-5 w-5" />,
    empathicListening: <MessageCircle className="h-5 w-5" />,
    scriptAdherence: <BookOpen className="h-5 w-5" />,
    connectionBuilding: <Users className="h-5 w-5" />
  };

  const categoryNames = {
    storyTelling: 'Vulnerable Storytelling',
    empathicListening: 'Empathetic Listening',
    scriptAdherence: 'Script Adherence',
    connectionBuilding: 'Connection Building'
  };

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            Conversation Report
          </CardTitle>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(report.overallScore)}`}>
                {report.overallScore}%
              </div>
              <div className="text-sm text-gray-600">Overall Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-dialogue-darkblue">
                {report.completedSteps}/{report.totalSteps}
              </div>
              <div className="text-sm text-gray-600">Steps Completed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-medium text-dialogue-purple">
                {report.conversationLength}
              </div>
              <div className="text-sm text-gray-600">Duration</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Category Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(report.categories).map(([key, category]) => (
          <Card key={key}>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <div className="flex items-center gap-2">
                {categoryIcons[key as keyof typeof categoryIcons]}
                <CardTitle className="text-lg">
                  {categoryNames[key as keyof typeof categoryNames]}
                </CardTitle>
              </div>
              <Badge 
                variant={getScoreBadgeVariant(category.score)}
                className="ml-auto"
              >
                {category.score}%
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">{category.feedback}</p>
              {category.examples.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-700">Examples:</p>
                  {category.examples.map((example, index) => (
                    <p key={index} className="text-xs text-gray-500 italic">
                      "{example}"
                    </p>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Key Moments */}
      <Card>
        <CardHeader>
          <CardTitle>Key Moments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {report.keyMoments.map((moment, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                {getMomentIcon(moment.type)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{moment.timestamp}</span>
                    <Badge variant="outline" className="text-xs">
                      {moment.type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700">{moment.description}</p>
                  {moment.quote && (
                    <p className="text-sm text-gray-500 italic mt-1">"{moment.quote}"</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strengths and Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-700 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {report.strengths.map((strength, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  {strength}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-orange-700 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {report.improvements.map((improvement, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  {improvement}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="text-dialogue-purple">Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {report.nextSteps.map((step, index) => (
              <li key={index} className="text-sm flex items-start gap-2">
                <div className="w-6 h-6 bg-dialogue-purple text-white rounded-full flex items-center justify-center text-xs font-medium mt-0.5 flex-shrink-0">
                  {index + 1}
                </div>
                {step}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConversationReport;
