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

const PrepareCard = ({ stepNumber, stepColor, title, description, doDontExamples }: PrepareCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card>
      <CardHeader 
        className="cursor-pointer" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="font-sans flex items-center justify-between">
          <div className="flex items-center gap-3">
            <NumberCircle number={stepNumber} color={stepColor} />
            {title}
          </div>
          <div className="flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full border border-purple-200">
            <span className="text-sm font-medium">{isExpanded ? 'Close' : 'See examples'}</span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </CardTitle>
        <p className="text-gray-600 text-sm font-sans">{description}</p>
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
