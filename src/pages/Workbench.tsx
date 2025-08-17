import Navbar from '@/components/layout/Navbar';
import PromptBuilderSuite from '@/components/PromptBuilderSuite';
import { generateTimestampId } from '@/utils/id';
import { type PromptBuilderData } from '@/utils/promptBuilder';
import { useCallback, useReducer, useEffect, useState } from 'react';
import ChatSuite from './ChatSuite';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { LogIn, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WorkbenchState {
  organizers: PromptBuilderData[];
  organizerPromptText: string;
  organizerFirstMessage: string;
  attendees: PromptBuilderData[];
  coaches: PromptBuilderData[];
  organizerDirty: boolean;
  attendeesDirty: boolean;
  coachesDirty: boolean;
}

type WorkbenchAction =
  | { type: 'UPDATE_ORGANIZERS'; payload: PromptBuilderData[] }
  | { type: 'UPDATE_ORGANIZER_DATA'; payload: { systemPrompt: string; firstMessage: string } }
  | { type: 'UPDATE_ATTENDEES'; payload: PromptBuilderData[] }
  | { type: 'UPDATE_COACHES'; payload: PromptBuilderData[] }
  | { type: 'SET_ORGANIZER_DIRTY'; payload: boolean }
  | { type: 'SET_ATTENDEES_DIRTY'; payload: boolean }
  | { type: 'SET_COACHES_DIRTY'; payload: boolean };

function workbenchReducer(state: WorkbenchState, action: WorkbenchAction): WorkbenchState {
  console.log('workbench dispatch: ', action.type);
  switch (action.type) {
    case 'UPDATE_ORGANIZERS':
      return {
        ...state,
        organizers: action.payload,
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
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [state, dispatch] = useReducer(workbenchReducer, {
    organizers: [],
    organizerPromptText: '',
    organizerFirstMessage: '',
    attendees: [{ id: generateTimestampId(), name: 'attendee', system_prompt: '', firstMessage: '', persona: 'attendee' as const }],
    coaches: [],
    organizerDirty: false,
    attendeesDirty: false,
    coachesDirty: false,
  });

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Workbench: Error getting session:', error);
      } else {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const organizerPromptChangeCb = useCallback((organizers: PromptBuilderData[]) => {
    dispatch({ type: 'UPDATE_ORGANIZERS', payload: organizers });
  }, []);

  const handleAttendeesChangeCb = useCallback((attendees: PromptBuilderData[]) => {
    dispatch({ type: 'UPDATE_ATTENDEES', payload: attendees });
  }, []);

  const handleCoachesChange = useCallback((coaches: PromptBuilderData[]) => {
    dispatch({ type: 'UPDATE_COACHES', payload: coaches.filter((c) => c.starred) });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Navbar pageTitle="Workbench" pageSummary="Develop AI organizer prompts" />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${!user ? 'filter blur-sm pointer-events-none' : ''}`}>
            <div className="space-y-4">
              <div className="w-full space-y-4">
                <PromptBuilderSuite
                  persona="organizer"
                  color="bg-purple-200"
                  defaultOpen={true}
                  onPromptBuildersChange={organizerPromptChangeCb}
                />

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

      {!user && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-2xl font-serif">Authentication Required</CardTitle>
              <CardDescription>
                You need to be logged in to access the Workbench. Please sign in or create an account to continue.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-dialogue-purple hover:bg-dialogue-darkblue" onClick={() => navigate('/auth')}>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Workbench;
