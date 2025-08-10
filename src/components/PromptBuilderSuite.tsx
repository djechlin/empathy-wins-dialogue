import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Button } from '@/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/ui/collapsible';
import { generateTimestampName } from '@/utils/id';
import { fetchAllPromptBuildersForPersona, savePromptBuilder } from '@/utils/promptBuilder';
import { ChevronRight, Plus } from 'lucide-react';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useReducer, useRef } from 'react';
import PromptBuilder, { type PromptBuilderRef } from './PromptBuilder';

export interface AttendeeData {
  id: string;
  displayName: string;
  systemPrompt: string;
  firstMessage: string;
  archived?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface PromptBuilderSuiteProps {
  name: string;
  color: string;
  defaultOpen?: boolean;
  onAttendeesChange?: (attendees: AttendeeData[]) => void;
}

export interface PromptBuilderSuiteRef {
  getPromptBuilder: () => PromptBuilderRef | null;
  getAttendees: () => AttendeeData[];
}

interface PromptBuilderSuiteState {
  attendees: AttendeeData[];
  loading: 'new' | 'loading' | 'loaded';
  error: string | null;
  archivedOpen: boolean;
}

type PromptBuilderSuiteAction =
  | { type: 'SET_LOADING'; payload: 'new' | 'loading' | 'loaded' }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_ATTENDEES'; payload: AttendeeData[] }
  | { type: 'LOAD_ATTENDEES_SUCCESS'; payload: AttendeeData[] }
  | { type: 'LOAD_ATTENDEES_ERROR'; payload: { error: string; fallbackAttendees: AttendeeData[] } }
  | { type: 'ADD_ATTENDEE'; payload: AttendeeData }
  | { type: 'UPDATE_ATTENDEE'; payload: { id: string; data: Partial<AttendeeData> } }
  | { type: 'TOGGLE_ARCHIVE'; payload: { id: string; archived: boolean } }
  | { type: 'TOGGLE_ARCHIVED_EXPANDED' };

function promptBuilderSuiteReducer(state: PromptBuilderSuiteState, action: PromptBuilderSuiteAction): PromptBuilderSuiteState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'LOAD_ATTENDEES':
      return { ...state, attendees: action.payload };

    case 'LOAD_ATTENDEES_SUCCESS':
      return { ...state, attendees: action.payload, loading: 'loaded', error: null };

    case 'LOAD_ATTENDEES_ERROR':
      return {
        ...state,
        attendees: action.payload.fallbackAttendees,
        error: action.payload.error,
        loading: 'loaded',
      };

    case 'ADD_ATTENDEE':
      return { ...state, attendees: [...state.attendees, action.payload] };

    case 'UPDATE_ATTENDEE':
      return {
        ...state,
        attendees: state.attendees.map((a) => (a.id === action.payload.id ? { ...a, ...action.payload.data } : a)),
      };

    case 'TOGGLE_ARCHIVE':
      return {
        ...state,
        attendees: state.attendees.map((a) => (a.id === action.payload.id ? { ...a, archived: action.payload.archived } : a)),
      };

    case 'TOGGLE_ARCHIVED_EXPANDED':
      return { ...state, archivedOpen: !state.archivedOpen };

    default:
      return state;
  }
}

const PromptBuilderSuite = forwardRef<PromptBuilderSuiteRef, PromptBuilderSuiteProps>(({ color, defaultOpen, onAttendeesChange }, ref) => {
  const promptBuilderRef = useRef<PromptBuilderRef>(null);
  const [state, dispatch] = useReducer(promptBuilderSuiteReducer, {
    attendees: [],
    loading: 'new' as const,
    error: null,
    archivedOpen: false,
  });
  const { toast } = useToast();

  const activeAttendees = useMemo(() => state.attendees.filter((a) => !a.archived), [state.attendees]);
  const archivedAttendees = useMemo(() => state.attendees.filter((a) => a.archived), [state.attendees]);

  useEffect(() => {
    console.log('PromptBuilderSuite: useEffect loadAttendees triggered', { loading: state.loading });
    if (state.loading !== 'new') {
      return;
    }

    const loadAttendees = async () => {
      console.log('PromptBuilderSuite: async loadAttendees() called', { loading: state.loading });
      try {
        dispatch({ type: 'SET_LOADING', payload: 'loading' });
        const data = await fetchAllPromptBuildersForPersona('attendee');
        const attendeeData: AttendeeData[] = data.map((pb) => ({
          id: pb.id || '',
          displayName: pb.name,
          systemPrompt: pb.system_prompt,
          firstMessage: pb.firstMessage || '',
          archived: pb.archived,
          created_at: pb.created_at,
          updated_at: pb.updated_at,
        }));
        dispatch({ type: 'LOAD_ATTENDEES_SUCCESS', payload: attendeeData });
      } catch (error) {
        console.error('PromptBuilderSuite: Error loading attendees:', error);
        dispatch({
          type: 'LOAD_ATTENDEES_ERROR',
          payload: {
            error: 'Authentication required. Please sign in to load your attendees.',
            fallbackAttendees: [{ id: '1', displayName: 'attendee', systemPrompt: '', firstMessage: '' }],
          },
        });
      }
    };
    loadAttendees();
  }, [state.loading]);

  useEffect(() => {
    console.log('PromptBuilderSuite: useEffect onAttendeesChange triggered');
    //  onAttendeesChange?.(activeAttendees);
  }, [activeAttendees, onAttendeesChange]);

  const handleAttendeeDataChange = useCallback(
    (attendeeId: string, data: { systemPrompt: string; firstMessage: string; displayName: string }) => {
      console.log('handle attendee data change with id ', attendeeId);
      dispatch({ type: 'UPDATE_ATTENDEE', payload: { id: attendeeId, data } });
    },
    [],
  );

  const addAttendee = useCallback(async () => {
    console.log('PromptBuilderSuite: async addAttendee() called');
    const newAttendee = {
      name: generateTimestampName('attendee'),
      system_prompt: '',
      persona: 'attendee',
      firstMessage: '',
    };

    try {
      await savePromptBuilder(newAttendee);
      toast({
        title: 'Success',
        description: 'New attendee created successfully',
      });
      
      // Refetch attendees to show the new one
      try {
        dispatch({ type: 'SET_LOADING', payload: 'loading' });
        const data = await fetchAllPromptBuildersForPersona('attendee');
        const attendeeData: AttendeeData[] = data.map((pb) => ({
          id: pb.id || '',
          displayName: pb.name,
          systemPrompt: pb.system_prompt,
          firstMessage: pb.firstMessage || '',
          archived: pb.archived,
          created_at: pb.created_at,
          updated_at: pb.updated_at,
        }));
        dispatch({ type: 'LOAD_ATTENDEES_SUCCESS', payload: attendeeData });
      } catch (refetchError) {
        console.error('Error refetching attendees after creation:', refetchError);
        dispatch({ type: 'SET_LOADING', payload: 'loaded' });
      }
    } catch (error) {
      console.error('Error creating attendee:', error);
      toast({
        title: 'Error',
        description: 'Failed to create new attendee',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const handleArchiveToggle = useCallback((attendeeId: string, archived: boolean) => {
    console.log('PromptBuilderSuite: handleArchiveToggle() called', { attendeeId, archived });
    dispatch({ type: 'TOGGLE_ARCHIVE', payload: { id: attendeeId, archived } });
  }, []);

  useImperativeHandle(ref, () => ({
    getPromptBuilder: () => promptBuilderRef.current,
    getAttendees: () => activeAttendees,
  }));

  if (state.loading === 'loading') {
    return (
      <div className="space-y-4">
        <h3 className="font-medium">Attendees</h3>
        <div className="animate-pulse space-y-3">
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="space-y-4">
        <h3 className="font-medium">Attendees</h3>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <div className="font-medium">Error Loading Attendees:</div>
          <div className="mt-1">{state.error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Active attendees */}
      {activeAttendees.length > 0 ? (
        <div className="space-y-3">
          {activeAttendees.map((attendee, index) => (
            <PromptBuilder
              key={attendee.id}
              ref={index === 0 ? promptBuilderRef : undefined}
              persona="attendee"
              initialPrompt={attendee.systemPrompt}
              initialFirstMessage={attendee.firstMessage}
              initialDisplayName={attendee.displayName}
              color={color}
              defaultOpen={defaultOpen}
              archived={attendee.archived || false}
              promptBuilderId={attendee.id}
              onDataChange={(data) => handleAttendeeDataChange(attendee.id, data)}
              onArchiveToggle={handleArchiveToggle}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">No active attendees yet.</p>
        </div>
      )}

      {/* Add Prompt Builder button */}
      <Button onClick={addAttendee} size="sm" variant="outline" className="w-full text-xs py-2">
        <Plus className="h-3 w-3 mr-1" />
        Add attendee
      </Button>

      {/* Archived attendees collapsible section */}
      {archivedAttendees.length > 0 && (
        <Collapsible open={state.archivedOpen} onOpenChange={() => dispatch({ type: 'TOGGLE_ARCHIVED_EXPANDED' })}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-start text-xs text-gray-600 hover:text-gray-900">
              <ChevronRight className={cn('h-3 w-3 mr-1 transition-transform', state.archivedOpen ? 'rotate-90' : '')} />
              Archived ({archivedAttendees.length})
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-2">
            {archivedAttendees.map((attendee) => (
              <div key={attendee.id} className="opacity-60">
                <PromptBuilder
                  key={attendee.id}
                  persona="attendee"
                  initialPrompt={attendee.systemPrompt}
                  initialFirstMessage={attendee.firstMessage}
                  initialDisplayName={attendee.displayName}
                  color={color}
                  defaultOpen={false}
                  archived={attendee.archived || false}
                  promptBuilderId={attendee.id}
                  onDataChange={(data) => handleAttendeeDataChange(attendee.id, data)}
                  onArchiveToggle={handleArchiveToggle}
                />
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
});

PromptBuilderSuite.displayName = 'PromptBuilderSuite';

export default PromptBuilderSuite;
