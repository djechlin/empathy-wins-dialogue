import NumberCircle from '@/components/NumberCircle';
import { Card, CardHeader, CardTitle } from '@/ui/card';

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
      <CardHeader className="h-full flex flex-col items-center text-center p-4">
        <div className="flex flex-col items-center h-full">
          <div className="mt-4">
            <NumberCircle number={stepNumber} color={stepColor} />
          </div>
          <div className="flex-1 flex items-center justify-center px-2">
            <CardTitle className="font-sans text-sm leading-tight">{title}</CardTitle>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default PrepareCard;
