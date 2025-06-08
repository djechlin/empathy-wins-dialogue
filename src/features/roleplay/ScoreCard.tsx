import React, { useState } from 'react';
import { Badge } from '@/ui/badge';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';
import type { FeedbackId } from '@/types';

// Mapping of feedback IDs to simple badge text
const feedbackBadgeText: Record<FeedbackId, string> = {
  'framing-introduced-your-name': 'Say your name',
  'framing-named-issue-plainspoken': 'Name the issue with plainspoken words',
  'framed-uplifting': 'Talk about the good, not the bad',
  'listened-asked-about-relationship': 'Ask about their family',
  'listened-dug-deeper': 'Dig deeper into how they feel',
  'listened-shared-own-relationship': 'Tell them about your family',
  'listened-got-vulnerable': 'Share a time you struggled',
  'explored-connected-issue': 'Connect the issue to our families',
  'explored-stayed-calm': 'Ask questions when challenged without lecturing',
  'call-voter-interested': 'They\'ll call later',
  'call-voter-called': 'They called right now'
};

// Group feedback IDs by step prefix
const feedbackByStep: Record<string, FeedbackId[]> = {
  'framing': ['framing-introduced-your-name', 'framing-named-issue-plainspoken', 'framed-uplifting'],
  'listening': ['listened-asked-about-relationship', 'listened-dug-deeper', 'listened-shared-own-relationship', 'listened-got-vulnerable'],
  'exploring': ['explored-connected-issue', 'explored-stayed-calm'],
  'calling': ['call-voter-interested', 'call-voter-called']
};

interface ScoreCardConfig {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  tip?: string;
}

interface FeedbackItem {
  type: 'positive' | 'negative' | 'hint' | 'neutral';
  text: string;
  icon: string;
}

interface ScoreCardData {
  status: 'to-do' | 'good' | 'great';
  examples: string[] | FeedbackItem[]; // up to 2
}

interface ScoreCardProps {
  config: ScoreCardConfig;
  data: ScoreCardData;
  stepNumber?: number;
  isCurrentStep?: boolean;
  isPreviousStep?: boolean;
  activatedFeedback?: Set<FeedbackId>;
  isRoleplayEnded?: boolean;
}

const ScoreCard = ({ config, data, stepNumber, isCurrentStep, isPreviousStep, activatedFeedback = new Set(), isRoleplayEnded = false }: ScoreCardProps) => {
  const [tipDismissed, setTipDismissed] = useState(false);

  const IconComponent = Icons[config.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
  
  const getCardStyles = () => {
    const borderClass = isCurrentStep ? 'border-dialogue-purple border-2' : 'border-gray-200 border-2';
    const bgClass = data.status === 'great' ? 'bg-dialogue-neutral' : 'bg-white';
    
    return `${bgClass} ${borderClass}`;
  };

  const getIconStyles = () => {
    if (data.status === 'great') {
      // Dark versions of the original colors (only for great state)
      const iconColorMap: Record<string, string> = {
        Heart: 'bg-pink-800',
        Search: 'bg-blue-800',
        Book: 'bg-blue-800',
        Ear: 'bg-purple-800',
        Handshake: 'bg-orange-800',
        Users: 'bg-indigo-800',
        Blocks: 'bg-gray-800',
        Sun: 'bg-yellow-800',
        Phone: 'bg-green-800'
      };
      return iconColorMap[config.icon] || 'bg-gray-800';
    }
    
    // Default icon colors for to-do and good states
    const iconColorMap: Record<string, string> = {
      Heart: 'bg-pink-100',
      Search: 'bg-blue-100',
      Book: 'bg-blue-100',
      Ear: 'bg-purple-100',
      Handshake: 'bg-orange-100',
      Users: 'bg-indigo-100',
      Blocks: 'bg-gray-100',
      Sun: 'bg-yellow-100',
      Phone: 'bg-green-100'
    };
    return iconColorMap[config.icon] || 'bg-gray-100';
  };

  const getIconColor = () => {
    if (data.status === 'great') {
      // Much lighter colors, almost white for dark background (only for great state)
      const iconColorMap: Record<string, string> = {
        Heart: 'text-pink-100',
        Search: 'text-blue-100',
        Book: 'text-blue-100',
        Ear: 'text-purple-100',
        Handshake: 'text-orange-100',
        Users: 'text-indigo-100',
        Blocks: 'text-gray-100',
        Sun: 'text-yellow-100',
        Phone: 'text-green-100'
      };
      return iconColorMap[config.icon] || 'text-white';
    }
    
    // Keep original colors for to-do and good states
    const iconColorMap: Record<string, string> = {
      Heart: 'text-pink-600',
      Search: 'text-blue-600',
      Book: 'text-blue-600',
      Ear: 'text-purple-600',
      Handshake: 'text-orange-600',
      Users: 'text-indigo-600',
      Blocks: 'text-gray-600',
      Sun: 'text-yellow-600',
      Phone: 'text-green-600'
    };
    return iconColorMap[config.icon] || 'text-gray-600';
  };

  const getBadgeContent = () => {
    // Get feedback badges for this step
    const stepFeedback = feedbackByStep[config.id] || [];
    
    if (stepFeedback.length > 0) {
      // Count how many are activated
      const activatedCount = stepFeedback.filter(feedbackId => activatedFeedback.has(feedbackId)).length;
      const totalCount = stepFeedback.length;
      
      // Calculate status based on activated badges
      if (activatedCount === totalCount) {
        return 'Great';
      } else if (activatedCount >= totalCount / 2) {
        return 'Good';
      }
      
      // If we have feedback badges but less than half are activated, show step duration
      if (stepNumber) {
        const durations = ['1 minute', '3 minutes', '2 minutes', '30 seconds'];
        return durations[stepNumber - 1] || `Step ${stepNumber}`;
      }
      return null;
    }
    
    // Fall back to timer/step info if no badges are available
    if (data.status === 'to-do' && stepNumber) {
      const durations = ['1 minute', '3 minutes', '2 minutes', '30 seconds'];
      return durations[stepNumber - 1] || `Step ${stepNumber}`;
    }
    if (data.status === 'good') return 'Good';
    if (data.status === 'great') return 'Great';
    
    return null;
  };

  const getBadgeStyles = () => {
    // Get feedback badges for this step and calculate dynamic status
    const stepFeedback = feedbackByStep[config.id] || [];
    
    if (stepFeedback.length > 0) {
      const activatedCount = stepFeedback.filter(feedbackId => activatedFeedback.has(feedbackId)).length;
      const totalCount = stepFeedback.length;
      
      if (activatedCount === totalCount) {
        return 'bg-dialogue-darkblue text-white';
      } else if (activatedCount >= totalCount / 2) {
        return 'bg-dialogue-neutral text-dialogue-purple';
      }
      
      // If we have feedback badges but less than half are activated, show as to-do
      return 'bg-white text-dialogue-purple border border-dialogue-purple';
    }
    
    // Fall back to original status
    if (data.status === 'to-do') {
      return 'bg-white text-dialogue-purple border border-dialogue-purple';
    }
    
    if (data.status === 'good') {
      return 'bg-dialogue-neutral text-dialogue-purple';
    }
    
    if (data.status === 'great') {
      return 'bg-dialogue-darkblue text-white';
    }
    
    return 'bg-gray-100 text-gray-600';
  };

  const badgeContent = getBadgeContent();

  return (
    <div
      className={cn(
        'w-full p-3 rounded-lg transition-colors duration-200 flex items-start gap-3 relative',
        getCardStyles()
      )}
    >
      {/* Icon */}
      <div className={cn('p-2 rounded-full flex-shrink-0', getIconStyles())}>
        {IconComponent && <IconComponent className={cn('h-4 w-4', getIconColor())} />}
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-medium text-base text-gray-800 font-sans">
            {config.title}
          </h4>
          {badgeContent && (
            <Badge 
              variant="secondary" 
              className={cn('text-xs ml-2 flex-shrink-0', getBadgeStyles())}
            >
              {badgeContent}
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
          <Icons.MessageCircleQuestion className="h-4 w-4" />
          {config.subtitle}
        </p>

        {/* Tip - only show if config has one and not dismissed */}
        {config.tip && !tipDismissed && (
          <div className="mb-3 bg-blue-50 border border-blue-200 rounded-lg p-3 relative">
            <button
              onClick={() => setTipDismissed(true)}
              className="absolute top-2 right-2 text-blue-600 hover:text-blue-800 transition-colors"
              aria-label="Dismiss tip"
            >
              <Icons.X className="h-4 w-4" />
            </button>
            <div className="flex items-start gap-2 pr-6">
              <Icons.Info className="h-4 w-4 text-dialogue-purple flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800">
                {config.tip}
              </p>
            </div>
          </div>
        )}

        {/* Feedback badges */}
        {feedbackByStep[config.id] && (
          <div className="mt-3 flex flex-wrap gap-1">
            {feedbackByStep[config.id].map((feedbackId) => (
              <Badge
                key={feedbackId}
                variant="outline"
                className={cn(
                  'text-xs px-2 py-1',
                  activatedFeedback.has(feedbackId)
                    ? 'bg-dialogue-darkblue border-dialogue-darkblue text-white'
                    : 'bg-white border-dialogue-purple text-dialogue-purple'
                )}
              >
                {feedbackBadgeText[feedbackId]}
              </Badge>
            ))}
          </div>
        )}

        {/* Detailed feedback items after roleplay ends */}
        {isRoleplayEnded && data.examples && Array.isArray(data.examples) && data.examples.length > 0 && (
          <div className="mt-3 space-y-2">
            {data.examples.map((example, index) => {
              if (typeof example === 'string') {
                return (
                  <div key={index} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    {example}
                  </div>
                );
              } else {
                // FeedbackItem
                const isPositive = example.type === 'positive';
                const isNegative = example.type === 'negative';
                
                return (
                  <div 
                    key={index} 
                    className={cn(
                      'flex items-start gap-2 p-2 rounded text-sm',
                      isPositive && 'bg-green-50 border border-green-200',
                      isNegative && 'bg-red-50 border border-red-200',
                      !isPositive && !isNegative && 'bg-gray-50 border border-gray-200'
                    )}
                  >
                    <div className={cn(
                      'flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold',
                      isPositive && 'bg-green-600 text-white',
                      isNegative && 'bg-red-600 text-white',
                      !isPositive && !isNegative && 'bg-gray-400 text-white'
                    )}>
                      {isPositive ? '✓' : isNegative ? '!' : '?'}
                    </div>
                    <span className={cn(
                      isPositive && 'text-green-800',
                      isNegative && 'text-red-800',
                      !isPositive && !isNegative && 'text-gray-700'
                    )}>
                      {example.text}
                    </span>
                  </div>
                );
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoreCard;
