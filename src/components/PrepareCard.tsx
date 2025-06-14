import DoDont from '@/components/DoDont';
import NumberCircle from '@/components/NumberCircle';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface DoDontExample {
  doHeading: string;
  dontHeading: string;
  voter?: string;
  do: string;
  dont: string;
}

interface PrepareCardProps {
  stepNumber: number;
  stepColor: 'green' | 'orange' | 'blue' | 'purple' | 'red' | 'yellow';
  title: string;
  description: string;
  doDontExamples: DoDontExample[];
}

const PrepareCard = ({ stepNumber, stepColor, title, doDontExamples }: PrepareCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card
      className={`cursor-pointer hover:shadow-lg transition-shadow duration-200 ${isExpanded ? 'h-auto' : 'h-auto min-h-[200px] aspect-[3/4]'}`}
    >
      <CardHeader
        className={`${isExpanded ? 'h-auto' : 'h-full'} flex flex-col justify-center items-center text-center p-6`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-col items-center gap-4">
          <NumberCircle number={stepNumber} color={stepColor} />
          <CardTitle className="font-sans text-xl">{title}</CardTitle>
          <div className="flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full border border-purple-200">
            <span className="text-sm font-medium">{isExpanded ? 'Close' : 'See examples'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="p-6 pt-0">
          <div className="space-y-6">
            {doDontExamples.map((example, index) => (
              <DoDont
                key={index}
                doHeading={example.doHeading}
                dontHeading={example.dontHeading}
                voter={example.voter}
                do={example.do}
                dont={example.dont}
              />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default PrepareCard;
