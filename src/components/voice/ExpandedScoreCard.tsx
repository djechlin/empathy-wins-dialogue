
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { X, ExternalLink } from 'lucide-react';
import * as Icons from 'lucide-react';

interface ScoreCardConfig {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  sense: 'do' | 'dont';
}

interface ScoreCardData {
  status: 'to-do' | 'good' | 'great' | number;
  examples: string[];
}

interface ExpandedScoreCardProps {
  config: ScoreCardConfig;
  data: ScoreCardData;
  onClose: () => void;
}

const ExpandedScoreCard = ({ config, data, onClose }: ExpandedScoreCardProps) => {
  const IconComponent = Icons[config.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;

  const getIconStyles = () => {
    if (config.sense === 'dont') {
      return "bg-red-100";
    }
    
    if (data.status === 'good' || data.status === 'great') {
      return "bg-dialogue-purple";
    }
    
    const iconColorMap: Record<string, string> = {
      Heart: 'bg-pink-100',
      Search: 'bg-blue-100',
      Book: 'bg-green-100',
      Ear: 'bg-purple-100',
      Handshake: 'bg-orange-100',
      Users: 'bg-indigo-100'
    };
    return iconColorMap[config.icon] || 'bg-gray-100';
  };

  const getIconColor = () => {
    if (config.sense === 'dont') {
      return "text-red-600";
    }
    
    if (data.status === 'good' || data.status === 'great') {
      return "text-white";
    }
    
    const iconColorMap: Record<string, string> = {
      Heart: 'text-pink-600',
      Search: 'text-blue-600',
      Book: 'text-green-600',
      Ear: 'text-purple-600',
      Handshake: 'text-orange-600',
      Users: 'text-indigo-600'
    };
    return iconColorMap[config.icon] || 'text-gray-600';
  };

  const getBadgeContent = () => {
    if (config.sense === 'dont') {
      if (typeof data.status === 'number') {
        if (data.status === 0) return 'Good so far';
        if (data.status === 1) return '1 mistake';
        return '2+ mistakes';
      }
      return null;
    }
    
    if (data.status === 'to-do') return 'To-do';
    if (data.status === 'good') return 'Good';
    if (data.status === 'great') return 'Great';
    
    return null;
  };

  const getBadgeStyles = () => {
    if (config.sense === 'dont') {
      return "bg-white text-amber-800 border border-amber-300";
    }
    
    if (data.status === 'to-do') {
      return "bg-white text-dialogue-purple border border-dialogue-purple";
    }
    
    if (data.status === 'good') {
      return "bg-dialogue-neutral text-dialogue-purple";
    }
    
    if (data.status === 'great') {
      return "bg-dialogue-purple text-white";
    }
    
    return "bg-gray-100 text-gray-600";
  };

  const getDetailedInfo = () => {
    if (config.sense === 'do') {
      const infoMap: Record<string, string> = {
        'ask-feelings': 'Asking about emotions helps create deeper connections and shows genuine interest in the other person\'s experience.',
        'dig-deeper': 'Follow-up questions demonstrate active listening and help uncover the root causes of concerns.',
        'share-story': 'Personal vulnerability encourages reciprocal openness and builds trust through shared experiences.',
        'listen-actively': 'Active listening involves full attention, empathy, and understanding before formulating responses.',
        'find-common-ground': 'Identifying shared values and experiences creates bridges for productive dialogue.',
        'show-empathy': 'Acknowledging others\' perspectives without judgment validates their feelings and experiences.'
      };
      return infoMap[config.id] || 'This behavior helps build stronger connections in conversations.';
    } else {
      const infoMap: Record<string, string> = {
        'lecture-politics': 'Giving political speeches can shut down dialogue and make others feel unheard or dismissed.',
        'get-defensive': 'Defensive responses often escalate tension and prevent productive conversation.'
      };
      return infoMap[config.id] || 'This behavior can harm productive dialogue and should be avoided.';
    }
  };

  const getAIFeedback = () => {
    if (config.sense === 'do') {
      if (data.status === 'great') {
        return "Excellent work! You're demonstrating this skill consistently and effectively.";
      } else if (data.status === 'good') {
        return "Good progress! You're applying this technique well. Consider using it more frequently for even better results.";
      } else {
        return "This is an important skill to develop. Look for opportunities to practice this technique in your conversations.";
      }
    } else {
      if (typeof data.status === 'number') {
        if (data.status === 0) {
          return "Great job avoiding this behavior! Keep maintaining this awareness throughout the conversation.";
        } else if (data.status === 1) {
          return "You slipped into this behavior once. Try to catch yourself earlier and redirect the conversation.";
        } else {
          return "This behavior appeared multiple times. Focus on listening more and speaking less to avoid falling into this pattern.";
        }
      }
    }
    return "";
  };

  const badgeContent = getBadgeContent();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <Card className={cn(
        "w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in",
        config.sense === 'dont' ? "bg-amber-50 border-amber-200" : "bg-white"
      )}>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
          <div className="flex items-start gap-4 flex-1">
            <div className={cn("p-3 rounded-full flex-shrink-0", getIconStyles())}>
              {IconComponent && <IconComponent className={cn("h-6 w-6", getIconColor())} />}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h2 className={cn(
                  "text-xl font-semibold",
                  config.sense === 'dont' ? "text-amber-800" : "text-gray-800"
                )}>
                  {config.title}
                </h2>
                {badgeContent && (
                  <Badge variant="secondary" className={cn("text-sm", getBadgeStyles())}>
                    {badgeContent}
                  </Badge>
                )}
              </div>
              <p className={cn(
                "text-base mb-3",
                config.sense === 'dont' ? "text-amber-700" : "text-gray-600"
              )}>
                {config.subtitle}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {data.examples.length > 0 && (
            <div>
              <h3 className={cn(
                "font-medium mb-3",
                config.sense === 'dont' ? "text-amber-800" : "text-gray-800"
              )}>
                Examples from your conversation:
              </h3>
              <div className="space-y-2">
                {data.examples.map((example, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "p-3 rounded-lg border",
                      config.sense === 'dont' 
                        ? "bg-amber-100 border-amber-200" 
                        : "bg-gray-50 border-gray-200"
                    )}
                  >
                    <p className={cn(
                      "italic",
                      config.sense === 'dont' ? "text-amber-700" : "text-gray-700"
                    )}>
                      "{example}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className={cn(
              "font-medium mb-2",
              config.sense === 'dont' ? "text-amber-800" : "text-gray-800"
            )}>
              About this technique:
            </h3>
            <p className={cn(
              "text-sm",
              config.sense === 'dont' ? "text-amber-700" : "text-gray-600"
            )}>
              {getDetailedInfo()}
            </p>
          </div>

          <div>
            <h3 className={cn(
              "font-medium mb-2",
              config.sense === 'dont' ? "text-amber-800" : "text-gray-800"
            )}>
              AI Feedback:
            </h3>
            <p className={cn(
              "text-sm",
              config.sense === 'dont' ? "text-amber-700" : "text-gray-600"
            )}>
              {getAIFeedback()}
            </p>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Learn More
            </Button>
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpandedScoreCard;
