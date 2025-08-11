import Navbar from '@/components/layout/Navbar';
import PromptBuilder from '@/components/PromptBuilder';
import PromptBuilderSuite from '@/components/PromptBuilderSuite';
import { generateTimestampId } from '@/utils/id';
import { type PromptBuilderData } from '@/utils/promptBuilder';
import { useCallback, useReducer } from 'react';
import ChatSuite from './ChatSuite';

interface WorkbenchState {
  organizerPrompt: PromptBuilderData | null;
  organizerPromptText: string;
  organizerFirstMessage: string;
  attendees: PromptBuilderData[];
  coaches: PromptBuilderData[];
  organizerDirty: boolean;
  attendeesDirty: boolean;
  coachesDirty: boolean;
}

type WorkbenchAction =
  | { type: 'SELECT_PROMPT'; payload: { participant: 'organizer'; prompt: PromptBuilderData | null } }
  | { type: 'UPDATE_ORGANIZER_DATA'; payload: { systemPrompt: string; firstMessage: string } }
  | { type: 'UPDATE_ATTENDEES'; payload: PromptBuilderData[] }
  | { type: 'UPDATE_COACHES'; payload: PromptBuilderData[] }
  | { type: 'SET_ORGANIZER_DIRTY'; payload: boolean }
  | { type: 'SET_ATTENDEES_DIRTY'; payload: boolean }
  | { type: 'SET_COACHES_DIRTY'; payload: boolean };

function workbenchReducer(state: WorkbenchState, action: WorkbenchAction): WorkbenchState {
  console.log('workbench dispatch: ', action.type);
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

    case 'UPDATE_COACHES':
      return {
        ...state,
        coaches: action.payload,
      };

    case 'SET_ORGANIZER_DIRTY':
      return {
        ...state,
        organizerDirty: action.payload,
      };

    case 'SET_ATTENDEES_DIRTY':
      return {
        ...state,
        attendeesDirty: action.payload,
      };

    case 'SET_COACHES_DIRTY':
      return {
        ...state,
        coachesDirty: action.payload,
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
    attendees: [{ id: generateTimestampId(), name: 'attendee', system_prompt: '', firstMessage: '', persona: 'attendee' as const }],
    coaches: [],
    organizerDirty: false,
    attendeesDirty: false,
    coachesDirty: false,
  });

  const organizerPromptChangeCb = useCallback((data: { systemPrompt: string; firstMessage: string }) => {
    dispatch({ type: 'UPDATE_ORGANIZER_DATA', payload: data });
  }, []);

  const handleAttendeesChangeCb = useCallback((attendees: PromptBuilderData[]) => {
    dispatch({ type: 'UPDATE_ATTENDEES', payload: attendees });
  }, []);

  const handleCoachesChange = useCallback((coaches: PromptBuilderData[]) => {
    dispatch({ type: 'UPDATE_COACHES', payload: coaches.filter((c) => c.starred) });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar pageTitle="Workbench" pageSummary="Develop AI organizer prompts" />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="w-full space-y-4">
                <PromptBuilder persona="organizer" color="bg-purple-200" defaultOpen={true} onDataChange={organizerPromptChangeCb} />

                <PromptBuilderSuite
                  persona="attendee"
                  color="bg-orange-200"
                  defaultOpen={true}
                  onPromptBuildersChange={handleAttendeesChangeCb}
                />
                <PromptBuilderSuite persona="coach" color="bg-red-200" defaultOpen={true} onPromptBuildersChange={handleCoachesChange} />
              </div>
            </div>

            <div className="space-y-4">
              <ChatSuite
                attendees={state.attendees}
                coaches={state.coaches}
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
