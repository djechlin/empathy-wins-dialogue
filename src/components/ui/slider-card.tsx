import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronDown } from 'lucide-react';

interface SliderCardProps {
  title: string;
  question: string;
  defaultOpen?: boolean;
}

const SliderCard = ({ title, question, defaultOpen = true }: SliderCardProps) => {
  const [sliderLevel, setSliderLevel] = useState([5]);
  const [note, setNote] = useState('');
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const isCompleted = note.length >= 8;

  return (
    <Card className={`border-dialogue-neutral hover:shadow-sm transition-shadow cursor-pointer ${
      isCompleted ? 'border-dialogue-purple border-2' : ''
    }`}
    onClick={() => setIsOpen(!isOpen)}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pt-3 pb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">{title}</CardTitle>
              {isCompleted && (
                <div className="flex items-center bg-dialogue-purple text-white px-2 py-1 rounded-full gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-xs font-medium">You said: {sliderLevel[0]}/10</span>
                </div>
              )}
            </div>
            <div className="p-2 hover:bg-muted rounded-full transition-colors">
              <motion.div animate={{
                rotate: isOpen ? -180 : 0
              }} transition={{
                duration: 0.3,
                ease: "easeInOut"
              }}>
                <ChevronDown className="h-5 w-5" />
              </motion.div>
            </div>
          </div>
        </CardHeader>

        <AnimatePresence mode="wait" initial={false}>
          {isOpen && (
            <CollapsibleContent forceMount>
              <motion.div
                key="slider-content"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                onClick={(e) => e.stopPropagation()}
              >
                <CardContent>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <p className="text-lg font-medium mb-6">
                        "{question}"
                      </p>
                    </div>
                    
                    <div>
                      <Slider
                        value={sliderLevel}
                        onValueChange={setSliderLevel}
                        max={10}
                        min={0}
                        step={1}
                        className="py-4"
                      />
                      <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                        <span>0 - Strongly disagree</span>
                        <span className="font-medium text-dialogue-darkblue">
                          {sliderLevel[0]}
                        </span>
                        <span>10 - Strongly agree</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label htmlFor="slider-note" className="block text-sm font-medium mb-2">
                          Leave a short note on why that's the right number for you
                        </label>
                        <Textarea
                          id="slider-note"
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          placeholder="I chose this number because..."
                          className="w-full h-20 resize-none"
                        />
                      </div>
                    </div>
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

export default SliderCard;