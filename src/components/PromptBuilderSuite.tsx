import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import PromptBuilder, { type PromptBuilderRef } from './PromptBuilder';
import { Button } from '@/ui/button';
import { Plus } from 'lucide-react';

export interface AttendeeData {
  id: string;
  displayName: string;
  systemPrompt: string;
  firstMessage: string;
}

interface PromptBuilderSuiteProps {
  name: string;
  color: string;
  defaultOpen?: boolean;
  onPromptChange?: (systemPrompt: string) => void;
  onAttendeesChange?: (attendees: AttendeeData[]) => void;
}

export interface PromptBuilderSuiteRef {
  getPromptBuilder: () => PromptBuilderRef | null;
  getAttendees: () => AttendeeData[];
}

const PromptBuilderSuite = forwardRef<PromptBuilderSuiteRef, PromptBuilderSuiteProps>(
  ({ color, defaultOpen, onPromptChange, onAttendeesChange }, ref) => {
    const promptBuilderRef = useRef<PromptBuilderRef>(null);
    const [attendees, setAttendees] = useState<AttendeeData[]>([{ id: '1', displayName: 'attendee', systemPrompt: '', firstMessage: '' }]);

    const handleAttendeeDataChange = (attendeeId: string, data: { systemPrompt: string; firstMessage: string; displayName: string }) => {
      const updatedAttendees = attendees.map((attendee) => (attendee.id === attendeeId ? { ...attendee, ...data } : attendee));
      setAttendees(updatedAttendees);
      onAttendeesChange?.(updatedAttendees);
    };

    const addAttendee = () => {
      const newId = (attendees.length + 1).toString();
      const newAttendees = [
        ...attendees,
        {
          id: newId,
          displayName: `attendee-${newId}`,
          systemPrompt: '',
          firstMessage: '',
        },
      ];
      setAttendees(newAttendees);
      onAttendeesChange?.(newAttendees);
    };


    useImperativeHandle(ref, () => ({
      getPromptBuilder: () => promptBuilderRef.current,
      getAttendees: () => attendees,
    }));

    return (
      <div className="space-y-4">
        <h3 className="font-medium">Attendees</h3>

        {attendees.map((attendee, index) => (
          <PromptBuilder
            key={attendee.id}
            ref={index === 0 ? promptBuilderRef : undefined}
            name={attendee.displayName}
            color={color}
            defaultOpen={defaultOpen}
            onPromptChange={onPromptChange}
            onDataChange={(data) => handleAttendeeDataChange(attendee.id, data)}
          />
        ))}

        {/* Add Prompt Builder button at bottom */}
        <Button onClick={addAttendee} size="sm" variant="outline" className="w-full text-xs py-2">
          <Plus className="h-3 w-3 mr-1" />
          Add Prompt Builder
        </Button>
      </div>
    );
  },
);

PromptBuilderSuite.displayName = 'PromptBuilderSuite';

export default PromptBuilderSuite;
