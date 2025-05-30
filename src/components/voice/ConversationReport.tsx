import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, XCircle, TrendingUp, Clock, Target } from 'lucide-react';
import { ConversationReport as ReportType, KeyMoment } from '@/types/conversationReport';
import CategoryCard from './CategoryCard';

interface ConversationReportProps {
  report: ReportType;
}

const ConversationReport = ({ report }: ConversationReportProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-600';
    if (score >= 1) return 'text-yellow-600';
    return 'text-red-600';
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

  const getTopCategory = () => {
    const sorted = [...report.categories].sort((a, b) => b.score - a.score);
    return sorted[0];
  };

  const getLowestCategory = () => {
    const sorted = [...report.categories].sort((a, b) => a.score - b.score);
    return sorted[0];
  };

  const topCategory = getTopCategory();
  const lowestCategory = getLowestCategory();

  return (
    <div className="space-y-6">
      {/* Summary Section */}
      <Card className="bg-gradient-to-r from-dialogue-blue/10 to-dialogue-purple/10 border-dialogue-blue/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-dialogue-darkblue mb-4">
            Conversation Summary
          </CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getScoreColor(report.overallScore)} mb-1`}>
                {report.overallScore}/10
              </div>
              <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <TrendingUp className="h-4 w-4" />
                Persuasion
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-dialogue-purple mb-1">
                {topCategory.name}
              </div>
              <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <Target className="h-4 w-4" />
                Strongest Area ({topCategory.score}/10)
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-medium text-orange-600 mb-1">
                {lowestCategory.name}
              </div>
              <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <AlertCircle className="h-4 w-4" />
                Focus Area ({lowestCategory.score}/10)
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-white/80 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-dialogue-purple" />
              <span className="font-medium">Duration:</span>
              <span>{report.conversationLength}</span>
              <span className="text-gray-500">•</span>
              <span className="font-medium">Progress:</span>
              <span>{report.completedSteps}/{report.totalSteps} steps completed</span>
            </div>
            <div className="text-sm text-gray-700">
              <span className="font-medium">Key insight:</span> {report.strengths[0]}
            </div>
            <div className="text-sm text-gray-700">
              <span className="font-medium">Primary opportunity:</span> {report.improvements[0]}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {report.categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
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
