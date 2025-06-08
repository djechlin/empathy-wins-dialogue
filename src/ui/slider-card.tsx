import React, { useState } from 'react';
import { Slider } from '@/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { CheckCircle2 } from 'lucide-react';

interface SliderCardProps {
  id: string;
  title: string;
  question: string;
  defaultOpen?: boolean;
}

const SliderCard = ({
  id,
  title,
  question,
  defaultOpen = true,
}: SliderCardProps) => {
  const [sliderLevel, setSliderLevel] = useState([5]);

  const isCompleted = true;

  return (
    <Card className="border-transparent hover:shadow-sm transition-shadow">
      <CardHeader className="pt-3 pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl">{title}</CardTitle>
            {isCompleted && (
              <div className="flex items-center bg-dialogue-purple text-white px-2 py-1 rounded-full gap-1">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-xs font-medium">{sliderLevel[0]}/10</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-lg font-medium mb-6 text-center">"{question}"</p>

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
      </CardContent>
    </Card>
  );
};

export default SliderCard;
