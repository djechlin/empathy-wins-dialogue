import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';

interface ScoreCardConfig {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
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
}

const ScoreCard = ({ config, data, stepNumber, isCurrentStep, isPreviousStep }: ScoreCardProps) => {

  const IconComponent = Icons[config.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
  
  const getCardStyles = () => {
    const borderClass = isCurrentStep ? "border-dialogue-purple border-2" : "border-gray-200 border-2";
    const bgClass = data.status === 'great' ? "bg-dialogue-neutral" : "bg-white";
    
    return `${bgClass} ${borderClass}`;
  };

  const getIconStyles = () => {
    if (data.status === 'great') {
      // Dark versions of the original colors (only for great state)
      const iconColorMap: Record<string, string> = {
        Heart: 'bg-pink-800',
        Search: 'bg-blue-800',
        Book: 'bg-green-800',
        Ear: 'bg-purple-800',
        Handshake: 'bg-orange-800',
        Users: 'bg-indigo-800',
        Blocks: 'bg-gray-800',
        Sun: 'bg-yellow-800'
      };
      return iconColorMap[config.icon] || 'bg-gray-800';
    }
    
    // Default icon colors for to-do and good states
    const iconColorMap: Record<string, string> = {
      Heart: 'bg-pink-100',
      Search: 'bg-blue-100',
      Book: 'bg-green-100',
      Ear: 'bg-purple-100',
      Handshake: 'bg-orange-100',
      Users: 'bg-indigo-100',
      Blocks: 'bg-gray-100',
      Sun: 'bg-yellow-100'
    };
    return iconColorMap[config.icon] || 'bg-gray-100';
  };

  const getIconColor = () => {
    if (data.status === 'great') {
      // Much lighter colors, almost white for dark background (only for great state)
      const iconColorMap: Record<string, string> = {
        Heart: 'text-pink-100',
        Search: 'text-blue-100',
        Book: 'text-green-100',
        Ear: 'text-purple-100',
        Handshake: 'text-orange-100',
        Users: 'text-indigo-100',
        Blocks: 'text-gray-100',
        Sun: 'text-yellow-100'
      };
      return iconColorMap[config.icon] || 'text-white';
    }
    
    // Keep original colors for to-do and good states
    const iconColorMap: Record<string, string> = {
      Heart: 'text-pink-600',
      Search: 'text-blue-600',
      Book: 'text-green-600',
      Ear: 'text-purple-600',
      Handshake: 'text-orange-600',
      Users: 'text-indigo-600',
      Blocks: 'text-gray-600',
      Sun: 'text-yellow-600'
    };
    return iconColorMap[config.icon] || 'text-gray-600';
  };

  const getBadgeContent = () => {
    if (data.status === 'to-do' && stepNumber) {
      const durations = ['30 seconds', '2 minutes', '2 minutes'];
      return durations[stepNumber - 1] || `Step ${stepNumber}`;
    }
    if (data.status === 'good') return 'Good';
    if (data.status === 'great') return 'Great';
    
    return null;
  };

  const getBadgeStyles = () => {
    if (data.status === 'to-do') {
      return "bg-white text-dialogue-purple border border-dialogue-purple";
    }
    
    if (data.status === 'good') {
      return "bg-dialogue-neutral text-dialogue-purple";
    }
    
    if (data.status === 'great') {
      return "bg-dialogue-darkblue text-white";
    }
    
    return "bg-gray-100 text-gray-600";
  };

  const badgeContent = getBadgeContent();

  return (
    <div
      className={cn(
        "w-full p-3 rounded-lg transition-colors duration-200 flex items-start gap-3 relative",
        getCardStyles()
      )}
    >
      {/* Icon */}
      <div className={cn("p-2 rounded-full flex-shrink-0", getIconStyles())}>
        {IconComponent && <IconComponent className={cn("h-4 w-4", getIconColor())} />}
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-medium text-base text-gray-800">
            {config.title}
          </h4>
          {badgeContent && (
            <Badge 
              variant="secondary" 
              className={cn("text-xs ml-2 flex-shrink-0", getBadgeStyles())}
            >
              {badgeContent}
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-2">
          {config.subtitle}
        </p>
        
        <div className="space-y-2">
          {data.examples.map((example, index) => {
            // Handle both string and FeedbackItem formats
            if (typeof example === 'string') {
              return (
                <p 
                  key={index} 
                  className="text-xs italic text-gray-500 leading-relaxed"
                >
                  {example}
                </p>
              );
            } else {
              // FeedbackItem format with icon
              return (
                <div 
                  key={index} 
                  className="flex items-start gap-2"
                >
                  <span className={cn(
                    "text-xs font-medium flex-shrink-0 mt-0.5",
                    example.type === 'positive' ? "text-green-600" : 
                    example.type === 'negative' ? "text-red-600" :
                    example.type === 'hint' ? "text-blue-600" : "text-gray-500"
                  )}>
                    {example.type === 'positive' ? '✓' : 
                     example.type === 'negative' ? '!' :
                     example.type === 'hint' ? '?' : ''}
                  </span>
                  <p className="text-xs italic text-gray-500 leading-relaxed">
                    {example.text}
                  </p>
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;
