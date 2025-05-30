
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import * as Icons from 'lucide-react';
import { CategoryScore } from '@/types/conversationReport';

interface CategoryCardProps {
  category: CategoryScore;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  const getScoreBadgeVariant = (score: number) => {
    if (score >= 4) return 'default';
    if (score >= 1) return 'secondary';
    return 'destructive';
  };

  // Dynamically get the icon component
  const IconComponent = Icons[category.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <div className="flex items-center gap-2">
          {IconComponent && <IconComponent className="h-5 w-5" />}
          <CardTitle className="text-lg">
            {category.name}
          </CardTitle>
        </div>
        <Badge 
          variant={getScoreBadgeVariant(category.score)}
          className="ml-auto"
        >
          {category.score}/10
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-3">{category.feedback}</p>
        {category.examples.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-700">Examples:</p>
            {category.examples.map((example, index) => (
              <p key={index} className="text-xs text-gray-500 italic">
                "{example}"
              </p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
