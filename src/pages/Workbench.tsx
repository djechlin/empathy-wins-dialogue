import Navbar from '@/components/layout/Navbar';
import PromptBuilderSuite from '@/components/PromptBuilderSuite';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { generateTimestampId } from '@/utils/id';
import { type PromptBuilderData } from '@/utils/promptBuilder';
import { User } from '@supabase/supabase-js';
import { Lock, LogIn } from 'lucide-react';
import { useCallback, useEffect, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatSuite from './ChatSuite';

interface WorkbenchState {
  organizers: PromptBuilderData[];
  organizerId: string;
  organizerName: string;
  organizerPromptText: string;
  organizerFirstMessage: string;
  attendees: PromptBuilderData[];
  coaches: PromptBuilderData[];
  scouts: PromptBuilderData[];
  organizerDirty: boolean;
  attendeesDirty: boolean;
  coachesDirty: boolean;
  scoutsDirty: boolean;
}

type WorkbenchAction =
  | { type: 'UPDATE_ORGANIZERS'; payload: PromptBuilderData[] }
  | { type: 'UPDATE_ORGANIZER_DATA'; payload: { systemPrompt: string; firstMessage: string; organizerName: string; organizerId: string } }
  | { type: 'UPDATE_ATTENDEES'; payload: PromptBuilderData[] }
  | { type: 'UPDATE_COACHES'; payload: PromptBuilderData[] }
  | { type: 'UPDATE_SCOUTS'; payload: PromptBuilderData[] }
  | { type: 'SET_ORGANIZER_DIRTY'; payload: boolean }
  | { type: 'SET_ATTENDEES_DIRTY'; payload: boolean }
  | { type: 'SET_COACHES_DIRTY'; payload: boolean }
  | { type: 'SET_SCOUTS_DIRTY'; payload: boolean };

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
        organizerId: action.payload.organizerId,
        organizerName: action.payload.organizerName,
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

    case 'UPDATE_SCOUTS':
      return {
        ...state,
        scouts: action.payload,
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

    case 'SET_SCOUTS_DIRTY':
      return {
        ...state,
        scoutsDirty: action.payload,
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
    organizerId: '',
    organizerName: '',
    organizerPromptText: '',
    organizerFirstMessage: '',
    attendees: [{ id: generateTimestampId(), name: 'attendee', system_prompt: '', firstMessage: '', persona: 'attendee' as const }],
    coaches: [],
    scouts: [],
    organizerDirty: false,
    attendeesDirty: false,
    coachesDirty: false,
    scoutsDirty: false,
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

    const starredOrganizers = organizers.filter((o) => o.starred);
    if (starredOrganizers.length === 1) {
      const selectedOrganizer = starredOrganizers[0];
      dispatch({
        type: 'UPDATE_ORGANIZER_DATA',
        payload: {
          organizerId: selectedOrganizer.id,
          systemPrompt: selectedOrganizer.system_prompt,
          firstMessage: selectedOrganizer.firstMessage || '',
          organizerName: selectedOrganizer.name,
        },
      });
    } else if (starredOrganizers.length === 0) {
      dispatch({
        type: 'UPDATE_ORGANIZER_DATA',
        payload: { systemPrompt: '', firstMessage: '', organizerId: '', organizerName: '' },
      });
    }
  }, []);

  const handleAttendeesChangeCb = useCallback((attendees: PromptBuilderData[]) => {
    dispatch({ type: 'UPDATE_ATTENDEES', payload: attendees });
  }, []);

  const handleCoachesChange = useCallback((coaches: PromptBuilderData[]) => {
    dispatch({ type: 'UPDATE_COACHES', payload: coaches.filter((c) => c.starred) });
  }, []);

  const handleScoutsChange = useCallback((scouts: PromptBuilderData[]) => {
    dispatch({ type: 'UPDATE_SCOUTS', payload: scouts.filter((s) => s.starred) });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Navbar pageTitle="Workbench" />
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
                <PromptBuilderSuite persona="scout" color="bg-purple-100" defaultOpen={true} onPromptBuildersChange={handleScoutsChange} />
              </div>
            </div>

            <div className="space-y-4">
              {(() => {
                const starredOrganizers = state.organizers.filter((o) => o.starred && !o.archived);
                if (starredOrganizers.length === 1) {
                  return (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-blue-800">Using organizer {starredOrganizers[0].name}</h3>
                        </div>
                      </div>
                    </div>
                  );
                } else if (starredOrganizers.length > 1) {
                  return (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M8.485 3.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.19-1.458-1.517-2.625L8.485 3.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-yellow-800">Multiple Starred Organizers</h3>
                          <p className="text-sm text-yellow-700 mt-1">
                            Star the organizer you want to use. Only one organizer is supported at a time right now. Currently starred:{' '}
                            {starredOrganizers.map((o) => o.name).join(', ')}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                } else if (starredOrganizers.length === 0 && state.organizers.length > 0) {
                  return (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M8.485 3.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.19-1.458-1.517-2.625L8.485 3.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-yellow-800">No Organizer Selected</h3>
                          <p className="text-sm text-yellow-700 mt-1">Star an organizer to enable chat functionality.</p>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              <ChatSuite
                attendees={state.attendees}
                coaches={state.coaches}
                scouts={state.scouts}
                organizerId={state.organizerId}
                organizerName={state.organizerName}
                organizerPromptText={state.organizerPromptText}
                organizerFirstMessage={state.organizerFirstMessage}
                hasValidOrganizer={state.organizers.filter((o) => o.starred && !o.archived).length === 1}
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
