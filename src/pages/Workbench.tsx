import Navbar from '@/components/layout/Navbar';
import PromptBuilder, { type PromptBuilderRef } from '@/components/PromptBuilder';
import PromptBuilderSuite from '@/components/PromptBuilderSuite';
import { type PromptBuilderData } from '@/utils/promptBuilder';
import { useCallback, useReducer, useRef } from 'react';
import ChatSuite from './ChatSuite';

interface WorkbenchState {
  organizerPrompt: PromptBuilderData | null;
  organizerPromptText: string;
  organizerFirstMessage: string;
  attendees: PromptBuilderData[];
}

type WorkbenchAction =
  | { type: 'SELECT_PROMPT'; payload: { participant: 'organizer'; prompt: PromptBuilderData | null } }
  | { type: 'UPDATE_ORGANIZER_DATA'; payload: { systemPrompt: string; firstMessage: string } }
  | { type: 'UPDATE_ATTENDEES'; payload: PromptBuilderData[] };

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
    attendees: [{ id: '1', name: 'attendee', system_prompt: '', firstMessage: '', persona: 'attendee' as const }],
  });

  const organizerRef = useRef<PromptBuilderRef>(null);

  const handleOrganizerPromptChange = useCallback((data: { systemPrompt: string; firstMessage: string }) => {
    dispatch({ type: 'UPDATE_ORGANIZER_DATA', payload: data });
  }, []);

  const handleAttendeesChange = useCallback((attendees: PromptBuilderData[]) => {
    dispatch({ type: 'UPDATE_ATTENDEES', payload: attendees });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar pageTitle="Workbench" pageSummary="Develop AI organizer prompts" />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="w-full space-y-4">
                <PromptBuilder
                  ref={organizerRef}
                  persona="organizer"
                  color="bg-purple-200"
                  defaultOpen={true}
                  onDataChange={handleOrganizerPromptChange}
                />

                <PromptBuilderSuite
                  persona="attendee"
                  color="bg-orange-200"
                  defaultOpen={true}
                  onPromptBuildersChange={handleAttendeesChange}
                />
              </div>
            </div>

            {/* Conversation Column */}
            <div className="space-y-4">
              <ChatSuite
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
