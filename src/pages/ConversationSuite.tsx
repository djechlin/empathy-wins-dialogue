import { AttendeeData } from '@/components/PromptBuilderSuite';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/ui/collapsible';
import { ChevronRight } from 'lucide-react';
import { useCallback, useState } from 'react';
import Conversation from './Conversation';

interface ConversationSuiteProps {
  attendees: AttendeeData[];
  organizerPromptText: string;
  organizerFirstMessage: string;
}

const ConversationSuite = ({ attendees, organizerPromptText, organizerFirstMessage }: ConversationSuiteProps) => {
  const [openAttendees, setOpenAttendees] = useState<Record<string, boolean>>({
    [attendees[0]?.id || '1']: true,
  });

  const toggleAttendee = useCallback((attendeeId: string) => {
    setOpenAttendees((prev) => ({
      ...prev,
      [attendeeId]: !prev[attendeeId],
    }));
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Conversations</h3>

      {attendees.filter(attendee => attendee.systemPrompt.trim() !== '').map((attendee) => (
        <Collapsible key={attendee.id} open={openAttendees[attendee.id] || false} onOpenChange={() => toggleAttendee(attendee.id)}>
          <CollapsibleTrigger asChild>
            <div className="w-full justify-start text-sm font-medium p-2 h-auto cursor-pointer hover:bg-gray-100 rounded-md flex items-center">
              <ChevronRight className={cn('h-4 w-4 mr-2 transition-transform', openAttendees[attendee.id] ? 'rotate-90' : '')} />
              Chat with {attendee.displayName}
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-2">
            <Conversation
              attendeeDisplayName={attendee.displayName}
              organizerPromptText={organizerPromptText}
              organizerFirstMessage={organizerFirstMessage}
              attendeeSystemPrompt={attendee.systemPrompt}
            />
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
};

export default ConversationSuite;
