
import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import ActivityCard from '../learn/ActivityCard';

interface SliderCardProps {
  id: string;
  title: string;
  question: string;
  defaultOpen?: boolean;
}

const SliderCard = ({ id, title, question, defaultOpen = true }: SliderCardProps) => {
  const [sliderLevel, setSliderLevel] = useState([5]);
  const [note, setNote] = useState('');

  const isCompleted = note.length >= 8;

  return (
    <ActivityCard
      id={id}
      title={title}
      description=""
      defaultOpen={defaultOpen}
      isComplete={isCompleted}
      headerExtra={isCompleted ? (
        <div className="flex items-center bg-dialogue-purple text-white px-2 py-1 rounded-full gap-1 mt-2">
          <span className="text-xs font-medium">You said: {sliderLevel[0]}/10</span>
        </div>
      ) : undefined}
    >
      <p className="text-lg font-medium mb-6 text-center">
        "{question}"
      </p>
      
      <Slider
        value={sliderLevel}
        onValueChange={setSliderLevel}
        max={10}
        min={0}
        step={1}
        className="py-4 mb-2"
      />
      <div className="flex justify-between mb-6 text-sm text-muted-foreground">
        <span>0 - Strongly disagree</span>
        <span className="font-medium text-dialogue-darkblue">
          {sliderLevel[0]}
        </span>
        <span>10 - Strongly agree</span>
      </div>

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
    </ActivityCard>
  );
};

export default SliderCard;
