import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import PromptBuilder, { type PromptBuilderRef } from './PromptBuilder';
import { Button } from '@/ui/button';
import { Plus, X } from 'lucide-react';

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

    const removeAttendee = (attendeeId: string) => {
      if (attendees.length <= 1) return; // Keep at least one attendee
      const updatedAttendees = attendees.filter((attendee) => attendee.id !== attendeeId);
      setAttendees(updatedAttendees);
      onAttendeesChange?.(updatedAttendees);
    };

    useImperativeHandle(ref, () => ({
      getPromptBuilder: () => promptBuilderRef.current,
      getAttendees: () => attendees,
    }));

    return (
      <div className="space-y-4">
        <h3 className="font-medium">Attendees</h3>

        {attendees.map((attendee, index) => (
          <div key={attendee.id} className="relative">
            {attendees.length > 1 && (
              <Button
                onClick={() => removeAttendee(attendee.id)}
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 z-10 h-6 w-6 p-0 text-gray-400 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            <PromptBuilder
              ref={index === 0 ? promptBuilderRef : undefined}
              name={attendee.displayName}
              color={color}
              defaultOpen={defaultOpen}
              onPromptChange={onPromptChange}
              onDataChange={(data) => handleAttendeeDataChange(attendee.id, data)}
            />
          </div>
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
