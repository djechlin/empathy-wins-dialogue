import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader } from '@/ui/card';

export interface FactCardProps {
  topic: string;
  children: ReactNode;
  className?: string;
}

const FactCard: React.FC<FactCardProps> = ({ topic, children, className = '' }) => {
  return (
    <Card className={`border-dialogue-neutral hover:shadow-md transition-shadow overflow-hidden ${className}`}>
      <CardHeader className="py-3 px-4 bg-dialogue-neutral/10">
        <h3 className="text-lg font-medium">{topic}</h3>
      </CardHeader>
      <CardContent className="py-4">{children}</CardContent>
    </Card>
  );
};

export default FactCard;
