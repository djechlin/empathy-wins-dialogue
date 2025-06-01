
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
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
  examples: string[]; // up to 2
}

interface ScoreCardProps {
  config: ScoreCardConfig;
  data: ScoreCardData;
  onClick?: () => void;
  stepNumber?: number;
  isCurrentStep?: boolean;
  isPreviousStep?: boolean;
}

const ScoreCard = ({ config, data, onClick, stepNumber, isCurrentStep, isPreviousStep }: ScoreCardProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevStatus, setPrevStatus] = useState(data.status);

  // Trigger animation when status changes
  useEffect(() => {
    if (data.status !== prevStatus) {
      setIsAnimating(true);
      setPrevStatus(data.status);
      
      // Reset animation after it completes
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [data.status, prevStatus]);

  const IconComponent = Icons[config.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
  
  const getCardStyles = () => {
    if (config.sense === 'dont') {
      return "bg-amber-50 border-amber-200 hover:bg-amber-100";
    }
    
    // Purple outline for current and previous steps
    if (isCurrentStep || isPreviousStep) {
      if (data.status === 'great') {
        return "bg-dialogue-neutral border-dialogue-purple";
      }
      return "bg-white border-dialogue-purple";
    }
    
    if (data.status === 'great') {
      return "bg-dialogue-neutral border-dialogue-purple";
    }
    
    if (data.status === 'good') {
      return "bg-white border-dialogue-purple";
    }
    
    return "bg-white border-gray-200 hover:bg-gray-50";
  };

  const getIconStyles = () => {
    if (config.sense === 'dont') {
      return "bg-red-100";
    }
    
    if (data.status === 'great') {
      // Dark versions of the original colors (only for great state)
      const iconColorMap: Record<string, string> = {
        Heart: 'bg-pink-800',
        Search: 'bg-blue-800',
        Book: 'bg-green-800',
        Ear: 'bg-purple-800',
        Handshake: 'bg-orange-800',
        Users: 'bg-indigo-800',
        Blocks: 'bg-gray-800'
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
      Blocks: 'bg-gray-100'
    };
    return iconColorMap[config.icon] || 'bg-gray-100';
  };

  const getIconColor = () => {
    if (config.sense === 'dont') {
      return "text-red-600";
    }
    
    if (data.status === 'great') {
      // Much lighter colors, almost white for dark background (only for great state)
      const iconColorMap: Record<string, string> = {
        Heart: 'text-pink-100',
        Search: 'text-blue-100',
        Book: 'text-green-100',
        Ear: 'text-purple-100',
        Handshake: 'text-orange-100',
        Users: 'text-indigo-100',
        Blocks: 'text-gray-100'
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
      Blocks: 'text-gray-600'
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
    
    // Show step number instead of status for 'do' cards
    if (stepNumber) {
      return `Step ${stepNumber}`;
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
      return "bg-dialogue-darkblue text-white";
    }
    
    return "bg-gray-100 text-gray-600";
  };

  const badgeContent = getBadgeContent();

  return (
    <div
      onClick={onClick}
      className={cn(
        "aspect-square p-4 rounded-lg border-2 transition-all duration-200 flex flex-col justify-between relative",
        config.sense === 'do' && onClick ? "cursor-pointer" : "",
        isAnimating ? "scale-110 z-10" : "scale-100",
        getCardStyles()
      )}
    >
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <div className={cn("p-2 rounded-full flex-shrink-0", getIconStyles())}>
            {IconComponent && <IconComponent className={cn("h-4 w-4", getIconColor())} />}
          </div>
          {badgeContent && (
            <Badge 
              variant="secondary" 
              className={cn("text-xs", getBadgeStyles())}
            >
              {badgeContent}
            </Badge>
          )}
        </div>
        <h4 className={cn(
          "font-medium text-sm mb-1",
          config.sense === 'dont' ? "text-amber-800" : "text-gray-800"
        )}>
          {config.title}
        </h4>
        <p className={cn(
          "text-xs leading-tight mb-2",
          config.sense === 'dont' ? "text-amber-700" : "text-gray-600"
        )}>
          {config.subtitle}
        </p>
        
        {data.examples.length > 0 && (
          <div className="space-y-1">
            {data.examples.slice(0, 2).map((example, index) => (
              <p 
                key={index} 
                className={cn(
                  "text-xs italic truncate",
                  config.sense === 'dont' ? "text-amber-600" : "text-gray-500"
                )}
                title={example}
              >
                "{example}"
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoreCard;
