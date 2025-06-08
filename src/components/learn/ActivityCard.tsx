import React, { ReactNode, useState, Children, isValidElement, cloneElement } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import { Collapsible, CollapsibleContent } from '@/ui/collapsible';
import { motion, AnimatePresence } from 'framer-motion';
import { expandFade } from '@/ui/motionConstants';

export interface ActivityCardProps {
  id: string;
  title: string;
  description: string;
  defaultOpen?: boolean;
  children: ReactNode;
  headerExtra?: ReactNode;
  className?: string;
  isComplete?: boolean;
  completionText?: string;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  id,
  title,
  description,
  defaultOpen = false,
  children,
  headerExtra,
  className = '',
  isComplete: externalIsComplete = false,
  completionText,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [internalIsComplete, setInternalIsComplete] = useState(false);

  // Use external isComplete if provided, otherwise use internal state
  const isComplete = externalIsComplete || internalIsComplete;

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleQuizComplete = (passed: boolean) => {
    setInternalIsComplete(passed);
  };

  return (
    <Card className={`border-dialogue-neutral hover:shadow-sm transition-shadow ${isComplete ? 'border-transparent' : ''} ${className}`}>
      <Collapsible open={isOpen} onOpenChange={handleToggle}>
        <CardHeader className="pt-3 pb-2 cursor-pointer" onClick={handleToggle}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">{title}</CardTitle>
              {isComplete && (
                <div className="flex items-center bg-dialogue-purple text-white px-2 py-1 rounded-full gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-xs font-medium">{completionText || 'Complete'}</span>
                </div>
              )}
            </div>
            <div className="p-2 hover:bg-muted rounded-full transition-colors">
              <motion.div
                animate={{
                  rotate: isOpen ? -180 : 0,
                }}
                transition={{
                  duration: 0.3,
                  ease: 'easeInOut',
                }}
              >
                <ChevronDown className="h-5 w-5" />
              </motion.div>
            </div>
          </div>
          <CardDescription>{description}</CardDescription>
          {headerExtra}
        </CardHeader>

        {/* I think quiz goes here but previous vibe coding created a mess so I removed it */}
      </Collapsible>
    </Card>
  );
};

export default ActivityCard;
