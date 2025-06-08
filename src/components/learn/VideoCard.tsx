import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';

interface VideoCardProps {
  title: string;
  description: string;
  url: string;
  className?: string;
}

const VideoCard = ({ title, description, url, className = '' }: VideoCardProps) => {
  return (
    <Card className={`shadow-lg border-dialogue-neutral animate-fade-in ${className}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-video">
          <iframe
            className="w-full h-full rounded-md"
            src={url}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <p className="mt-4 text-muted-foreground">
          This video explains key concepts and strategies for engaging in meaningful political discussions with friends, family, and
          colleagues.
        </p>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
