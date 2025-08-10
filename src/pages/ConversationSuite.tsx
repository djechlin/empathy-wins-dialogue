import React, { useState } from 'react';
import Conversation from './Conversation';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/ui/collapsible';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AttendeeData } from '@/components/PromptBuilderSuite';

interface Message {
  id: string;
  sender: 'organizer' | 'attendee';
  content: string;
  timestamp: Date;
}

interface ConversationSuiteProps {
  // Organizer data
  organizerHumanOrAi: 'human' | 'ai';

  // Array of attendees
  attendees: AttendeeData[];

  // Conversation state
  conversationHistory: Message[];
  paused: boolean;
  speaker: 'organizer' | 'attendee';
  userTextInput: string;
  isAwaitingAiResponse: boolean;

  // Event handlers
  onTogglePause: () => void;
  onModeToggle: (participant: 'organizer' | 'attendee', mode: 'human' | 'ai') => void;
  onStartConversation: () => void;
  onUserTextInputChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onSendMessage: () => void;

  // Refs
  inputRef: React.RefObject<HTMLTextAreaElement>;
  messagesEndRef: React.RefObject<HTMLDivElement>;

  // Helper functions
  hasStarted: () => boolean;
}

const ConversationSuite = ({
  organizerHumanOrAi,
  attendees,
  conversationHistory,
  paused,
  speaker,
  userTextInput,
  isAwaitingAiResponse,
  onTogglePause,
  onModeToggle,
  onStartConversation,
  onUserTextInputChange,
  onKeyPress,
  onSendMessage,
  inputRef,
  messagesEndRef,
  hasStarted,
}: ConversationSuiteProps) => {
  const [openAttendees, setOpenAttendees] = useState<Record<string, boolean>>({
    [attendees[0]?.id || '1']: true, // Default first attendee open
  });

  const toggleAttendee = (attendeeId: string) => {
    setOpenAttendees((prev) => ({
      ...prev,
      [attendeeId]: !prev[attendeeId],
    }));
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Conversations</h3>

      {attendees.map((attendee) => (
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
              conversationHistory={conversationHistory}
              paused={paused}
              organizerHumanOrAi={organizerHumanOrAi}
              attendeeHumanOrAi={'ai'} // For now, all attendees are AI
              speaker={speaker}
              userTextInput={userTextInput}
              isAwaitingAiResponse={isAwaitingAiResponse}
              onTogglePause={onTogglePause}
              onModeToggle={onModeToggle}
              onStartConversation={onStartConversation}
              onUserTextInputChange={onUserTextInputChange}
              onKeyPress={onKeyPress}
              onSendMessage={onSendMessage}
              inputRef={inputRef}
              messagesEndRef={messagesEndRef}
              hasStarted={hasStarted}
            />
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
};

export default ConversationSuite;
