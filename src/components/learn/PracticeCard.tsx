import { CallWorkspace as VoiceCallWorkspace } from '@/components/voice/CallWorkspace';
import { Phone } from 'lucide-react';
import { ScenarioId } from '@/lib/scriptData';
import ActivityCard from './ActivityCard';
import Quiz, { QuizQuestion } from './Quiz';

interface PracticeCardProps {
  id: string;
  title: string;
  description: string;
  defaultOpen?: boolean;
  scenarioId: ScenarioId;
  quiz?: QuizQuestion[];
  className?: string;
}

const PracticeCard = ({
  id,
  title,
  description,
  defaultOpen = false,
  scenarioId,
  quiz,
  className = ""
}: PracticeCardProps) => {
  return (
    <ActivityCard
      id={id}
      title={title}
      description={description}
      defaultOpen={defaultOpen}
      className={className}
      headerExtra={
        <div className="flex items-center gap-2 mt-2 text-dialogue-purple">
          <Phone className="h-4 w-4" />
          <span className="text-sm font-medium">Interactive voice practice</span>
        </div>
      }
    >
      <div className="space-y-6">
        <VoiceCallWorkspace callId={scenarioId} />

        {quiz && quiz.length > 0 && (
          <Quiz
            questions={quiz}
            title="Practice Quiz"
            description="Test your understanding of voice practice concepts."
          />
        )}
      </div>
    </ActivityCard>
  );
};

export default PracticeCard;