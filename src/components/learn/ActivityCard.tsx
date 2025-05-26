import React, { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { motion, AnimatePresence } from 'framer-motion';

export interface ActivityCardProps {
  id: string;
  title: string;
  description: string;
  isOpen: boolean;
  isComplete?: boolean;
  onToggle: () => void;
  children: ReactNode;
  headerExtra?: ReactNode; // For additional elements in header like the phone icon
  className?: string;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  id,
  title,
  description,
  isOpen,
  isComplete = false,
  onToggle,
  children,
  headerExtra,
  className = ""
}) => {
  return (
    <Card
      className={`border-dialogue-neutral hover:shadow-sm transition-shadow cursor-pointer ${
        isComplete ? 'border-dialogue-darkblue border-2' : ''
      } ${className}`}
      onClick={onToggle}
    >
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CardHeader className="pt-3 pb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">
                {title}
              </CardTitle>
              {isComplete && (
                <div className="flex items-center bg-dialogue-purple text-white px-2 py-1 rounded-full gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-xs font-medium">Complete</span>
                </div>
              )}
            </div>
            <div className="p-2 hover:bg-muted rounded-full transition-colors">
              <motion.div 
                animate={{
                  rotate: isOpen ? -180 : 0
                }} 
                transition={{
                  duration: 0.3,
                  ease: "easeInOut"
                }}
              >
                <ChevronDown className="h-5 w-5" />
              </motion.div>
            </div>
          </div>
          <CardDescription>
            {description}
          </CardDescription>
          {headerExtra}
        </CardHeader>

        <AnimatePresence mode="wait" initial={false}>
          {isOpen && (
            <CollapsibleContent forceMount>
              <motion.div
                key={`content-${id}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                onClick={(e) => e.stopPropagation()} // Prevent clicks inside content from toggling
              >
                <CardContent>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className="prose max-w-none mb-4"
                  >
                    {children}
                  </motion.div>
                </CardContent>
              </motion.div>
            </CollapsibleContent>
          )}
        </AnimatePresence>
      </Collapsible>
    </Card>
  );
};

export default ActivityCard;