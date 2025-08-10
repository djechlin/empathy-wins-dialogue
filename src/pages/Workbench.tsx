import Navbar from '@/components/layout/Navbar';
import PromptBuilder, { type PromptBuilderRef } from '@/components/PromptBuilder';
import PromptBuilderSuite, { type AttendeeData, type PromptBuilderSuiteRef } from '@/components/PromptBuilderSuite';
import { type PromptBuilderData } from '@/utils/promptBuilder';
import React, { useCallback, useReducer, useRef } from 'react';
import ConversationSuite from './ConversationSuite';

interface WorkbenchState {
  organizerPrompt: PromptBuilderData | null;
  organizerPromptText: string;
  organizerFirstMessage: string;
  attendees: AttendeeData[];
}

type WorkbenchAction =
  | { type: 'SELECT_PROMPT'; payload: { participant: 'organizer'; prompt: PromptBuilderData | null } }
  | { type: 'UPDATE_ORGANIZER_DATA'; payload: { systemPrompt: string; firstMessage: string } }
  | { type: 'UPDATE_ATTENDEES'; payload: AttendeeData[] };

function workbenchReducer(state: WorkbenchState, action: WorkbenchAction): WorkbenchState {
  switch (action.type) {
    case 'SELECT_PROMPT':
      return {
        ...state,
        organizerPrompt: action.payload.prompt,
      };

    case 'UPDATE_ORGANIZER_DATA':
      return {
        ...state,
        organizerPromptText: action.payload.systemPrompt,
        organizerFirstMessage: action.payload.firstMessage,
      };

    case 'UPDATE_ATTENDEES':
      return {
        ...state,
        attendees: action.payload,
      };

    default:
      return state;
  }
}

const Workbench = () => {
  const [state, dispatch] = useReducer(workbenchReducer, {
    organizerPrompt: null,
    organizerPromptText: '',
    organizerFirstMessage: '',
    attendees: [{ id: '1', displayName: 'attendee', systemPrompt: '', firstMessage: '' }],
  });

  const organizerRef = useRef<PromptBuilderRef>(null);
  const attendeeRef = useRef<PromptBuilderSuiteRef>(null);

  const handleOrganizerPromptChange = useCallback((data: { systemPrompt: string; firstMessage: string }) => {
    dispatch({ type: 'UPDATE_ORGANIZER_DATA', payload: data });
  }, []);

  const handleAttendeesChange = useCallback((attendees: AttendeeData[]) => {
    dispatch({ type: 'UPDATE_ATTENDEES', payload: attendees });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar pageTitle="Workbench" pageSummary="Develop AI organizer prompts" />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ height: 'calc(100vh - 120px)' }}>
            {/* Participants Column */}
            <div className="space-y-4 h-full overflow-y-auto">
              <h2 className="font-semibold mb-4">Participants</h2>
              <div className="w-full space-y-4">
                <PromptBuilder
                  ref={organizerRef}
                  persona="organizer"
                  color="bg-purple-200"
                  defaultOpen={true}
                  onDataChange={handleOrganizerPromptChange}
                />

                <PromptBuilderSuite
                  ref={attendeeRef}
                  name="attendee"
                  color="bg-orange-200"
                  defaultOpen={true}
                  onAttendeesChange={handleAttendeesChange}
                />
              </div>
            </div>

            {/* Conversation Column */}
            <div className="space-y-4 h-full">
              <ConversationSuite
                attendees={state.attendees}
                organizerPromptText={state.organizerPromptText}
                organizerFirstMessage={state.organizerFirstMessage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workbench;
