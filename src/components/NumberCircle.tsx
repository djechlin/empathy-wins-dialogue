interface NumberCircleProps {
  number: number;
  color: 'green' | 'orange' | 'blue' | 'purple' | 'red' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
}

const NumberCircle = ({ number, color, size = 'md' }: NumberCircleProps) => {
  const colorClasses = {
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
  };

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  return (
    <div className={`${colorClasses[color]} ${sizeClasses[size]} text-white rounded-full flex items-center justify-center font-bold`}>
      {number}
    </div>
  );
};

export default NumberCircle;
