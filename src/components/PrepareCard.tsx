import NumberCircle from '@/components/NumberCircle';
import { Card, CardHeader, CardTitle } from '@/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
  isExpanded?: boolean;
  onToggle?: () => void;
}

const PrepareCard = ({ stepNumber, stepColor, title, isExpanded = false, onToggle }: PrepareCardProps) => {
  return (
    <Card
      className={`cursor-pointer hover:shadow-lg transition-all duration-200 h-[200px] aspect-[3/4] ${
        isExpanded ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      }`}
      onClick={onToggle}
    >
      <CardHeader className="h-full flex flex-col justify-center items-center text-center p-4">
        <div className="flex flex-col items-center gap-2">
          <NumberCircle number={stepNumber} color={stepColor} />
          <CardTitle className="font-sans text-sm">{title}</CardTitle>
          <div className="flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full border border-purple-200 text-xs">
            <span className="text-sm font-medium">{isExpanded ? 'Close' : 'Examples'}</span>
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default PrepareCard;
