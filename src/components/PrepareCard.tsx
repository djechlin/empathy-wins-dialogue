import DoDont from '@/components/DoDont';
import NumberCircle from '@/components/NumberCircle';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';

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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-sans flex items-center gap-3">
          <NumberCircle number={stepNumber} color={stepColor} />
          {title}
        </CardTitle>
        <p className="text-gray-600 text-sm font-sans">{description}</p>
      </CardHeader>
      <CardContent className="p-6">
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
    </Card>
  );
};

export default PrepareCard;
