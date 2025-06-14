import { ArrowRight } from 'lucide-react';

interface StepNavigationProps {
  stepNumber: 1 | 2 | 3;
}

const StepNavigation = ({ stepNumber }: StepNavigationProps) => {
  const steps = [
    { number: 1, label: 'Prepare' },
    { number: 2, label: 'Roleplay' },
    { number: 3, label: 'Learn how you did' }
  ];

  return (
    <div className="mb-8 flex items-center justify-center space-x-6">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-12 h-12 ${
              step.number === stepNumber 
                ? 'bg-blue-600 text-white' 
                : 'bg-white border-2 border-gray-300 text-gray-400'
            } rounded-full flex items-center justify-center font-bold text-lg mb-2`}>
              {step.number}
            </div>
            <span className={`text-sm font-medium text-center font-sans ${
              step.number === stepNumber ? 'text-blue-600' : 'text-gray-400'
            }`}>
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <ArrowRight className="w-6 h-6 text-gray-400 ml-6" />
          )}
        </div>
      ))}
    </div>
  );
};

export default StepNavigation;