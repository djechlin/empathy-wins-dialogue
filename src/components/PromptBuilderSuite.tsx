import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Button } from '@/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/ui/collapsible';
import { generateTimestampName } from '@/utils/id';
import {
  archivePromptBuilder,
  fetchAllPromptBuildersForPersona,
  PromptBuilderData,
  savePromptBuilder,
  starPromptBuilder,
} from '@/utils/promptBuilder';
import { ChevronRight, Plus } from 'lucide-react';
import { useCallback, useEffect, useMemo, useReducer } from 'react';
import PromptBuilder from './PromptBuilder';

interface PromptBuilderSuiteProps {
  color: string;
  defaultOpen?: boolean;
  persona: 'organizer' | 'attendee' | 'coach';
  onPromptBuildersChange?: (pbs: PromptBuilderData[]) => void;
}
interface PromptBuilderSuiteState {
  promptBuilders: PromptBuilderData[];
  loading: 'new' | 'loading' | 'loaded';
  persona: 'organizer' | 'attendee' | 'coach';
  error: string | null;
  archivedOpen: boolean;
}

type PromptBuilderSuiteAction =
  | { type: 'SET_LOADING'; payload: 'new' | 'loading' | 'loaded' }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_SUCCESS'; payload: PromptBuilderData[] }
  | { type: 'UPDATE'; payload: { id: string; data: Partial<PromptBuilderData> } }
  | { type: 'TOGGLE_ARCHIVE'; payload: { id: string; archived: boolean } }
  | { type: 'TOGGLE_STARRED'; payload: { id: string; starred: boolean } }
  | { type: 'TOGGLE_ARCHIVED_EXPANDED' };

function promptBuilderSuiteReducer(state: PromptBuilderSuiteState, action: PromptBuilderSuiteAction): PromptBuilderSuiteState {
  console.log('dispatch: ', action.type);
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'LOAD_SUCCESS':
      return { ...state, promptBuilders: action.payload, loading: 'loaded', error: null };

    case 'UPDATE':
      return {
        ...state,
        promptBuilders: state.promptBuilders.map((a) => (a.id === action.payload.id ? { ...a, ...action.payload.data } : a)),
      };

    case 'TOGGLE_ARCHIVE':
      return {
        ...state,
        promptBuilders: state.promptBuilders.map((a) => (a.id === action.payload.id ? { ...a, archived: action.payload.archived } : a)),
      };

    case 'TOGGLE_STARRED':
      return {
        ...state,
        promptBuilders: state.promptBuilders.map((a) => (a.id === action.payload.id ? { ...a, starred: action.payload.starred } : a)),
      };

    case 'TOGGLE_ARCHIVED_EXPANDED':
      return { ...state, archivedOpen: !state.archivedOpen };

    default:
      return state;
  }
}

const getPersonaDisplayName = (persona: 'organizer' | 'attendee' | 'coach', plural: boolean = false): string => {
  const names = {
    organizer: plural ? 'Organizers' : 'Organizer',
    attendee: plural ? 'Attendees' : 'Attendee',
    coach: plural ? 'Coaches' : 'Coach',
  };
  return names[persona];
};

const PromptBuilderSuite = ({ color, defaultOpen, onPromptBuildersChange, persona }: PromptBuilderSuiteProps) => {
  const [state, dispatch] = useReducer(promptBuilderSuiteReducer, {
    persona,
    promptBuilders: [],
    loading: 'new' as const,
    error: null,
    archivedOpen: false,
  });
  const { toast } = useToast();

  const unarchivedPromptBuilders = useMemo(() => state.promptBuilders.filter((a) => !a.archived), [state.promptBuilders]);
  const archivedPromptBuilders = useMemo(() => state.promptBuilders.filter((a) => a.archived), [state.promptBuilders]);

  useEffect(() => {
    console.log('suite useEffect loading: ', state.loading);
    if (state.loading !== 'new') {
      return;
    }

    const load = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: 'loading' });
        const data = await fetchAllPromptBuildersForPersona(persona);
        dispatch({ type: 'LOAD_SUCCESS', payload: data });
      } catch (error) {
        console.error('PromptBuilderSuite: Error loading:', error);
        toast({
          title: 'Error',
          description: 'Failed to load',
          variant: 'destructive',
        });
      }
    };
    load();
  }, [state.loading, toast, persona]);

  useEffect(() => {
    onPromptBuildersChange?.(unarchivedPromptBuilders);
  }, [unarchivedPromptBuilders, onPromptBuildersChange]);

  const handlePromptBuilderDataChange = useCallback(
    (id: string, data: { systemPrompt: string; firstMessage: string; displayName: string }) => {
      dispatch({
        type: 'UPDATE',
        payload: {
          id: id,
          data: {
            system_prompt: data.systemPrompt,
            firstMessage: data.firstMessage,
            name: data.displayName,
          },
        },
      });
    },
    [],
  );

  const addPromptBuilder = useCallback(async () => {
    const newPromptBuilder = {
      name: generateTimestampName(persona),
      system_prompt: '',
      persona,
      firstMessage: '',
      starred: true,
    };

    try {
      await savePromptBuilder(newPromptBuilder);
      toast({
        title: 'Success',
        description: 'New prompt builder created successfully',
      });

      try {
        dispatch({ type: 'SET_LOADING', payload: 'loading' });
        const data = await fetchAllPromptBuildersForPersona(persona);
        dispatch({ type: 'LOAD_SUCCESS', payload: data });
      } catch (refetchError) {
        console.error('Error refetching prompt builders after creation:', refetchError);
        dispatch({ type: 'SET_LOADING', payload: 'loaded' });
      }
    } catch (error) {
      console.error('Error creating:', error);
      toast({
        title: 'Error',
        description: 'Failed to create',
        variant: 'destructive',
      });
    }
  }, [toast, persona]);

  const handleArchiveToggle = useCallback(
    async (id: string, archived: boolean) => {
      try {
        const success = await archivePromptBuilder(id, archived);

        if (success) {
          dispatch({ type: 'TOGGLE_ARCHIVE', payload: { id, archived } });

          toast({
            title: 'Success',
            description: `${archived ? 'hidden' : 'unhidden'} successfully`,
          });
        } else {
          toast({
            title: 'Error',
            description: 'Failed to update archive status',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error toggling archive status:', error);
        toast({
          title: 'Error',
          description: 'Failed to update archive status',
          variant: 'destructive',
        });
      }
    },
    [toast],
  );

  const handleStarToggle = useCallback(
    async (id: string, starred: boolean) => {
      try {
        // Update database first
        const success = await starPromptBuilder(id, starred);

        if (success) {
          // Only update local state if database update succeeded
          dispatch({ type: 'TOGGLE_STARRED', payload: { id: id, starred } });

          toast({
            title: 'Success',
            description: `${starred ? 'starred' : 'unstarred'} successfully`,
          });
        } else {
          toast({
            title: 'Error',
            description: 'Failed to update starred status',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error toggling starred status:', error);
        toast({
          title: 'Error',
          description: 'Failed to update starred status',
          variant: 'destructive',
        });
      }
    },
    [toast],
  );

  if (state.loading === 'loading') {
    return (
      <div className="space-y-4">
        <h3 className="font-medium">{getPersonaDisplayName(persona, true)}</h3>
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
        <h3 className="font-medium">{getPersonaDisplayName(persona, true)}</h3>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <div className="font-medium">Error Loading:</div>
          <div className="mt-1">{state.error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {unarchivedPromptBuilders.length > 0 ? (
        <div className="space-y-3">
          {unarchivedPromptBuilders.map((pb) => (
            <PromptBuilder
              key={pb.id}
              persona={state.persona}
              initialPrompt={pb.system_prompt}
              initialFirstMessage={pb.firstMessage}
              initialDisplayName={pb.name}
              color={color}
              defaultOpen={defaultOpen}
              archived={pb.archived || false}
              starred={pb.starred || false}
              promptBuilderId={pb.id}
              onDataChange={(data) => handlePromptBuilderDataChange(pb.id, data)}
              onArchiveToggle={handleArchiveToggle}
              onStarToggle={handleStarToggle}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">No active {getPersonaDisplayName(persona, true)} yet.</p>
        </div>
      )}

      <Button
        onClick={addPromptBuilder}
        size="default"
        variant="outline"
        className="w-full text-sm py-3 font-medium bg-white border-blue-600 text-blue-600 hover:bg-blue-50"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add {getPersonaDisplayName(persona)}
      </Button>

      {archivedPromptBuilders.length > 0 && (
        <Collapsible open={state.archivedOpen} onOpenChange={() => dispatch({ type: 'TOGGLE_ARCHIVED_EXPANDED' })}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-start text-xs text-gray-600 hover:text-gray-900">
              <ChevronRight className={cn('h-3 w-3 mr-1 transition-transform', state.archivedOpen ? 'rotate-90' : '')} />
              Hidden ({archivedPromptBuilders.length})
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-2">
            {archivedPromptBuilders.map((pb) => (
              <div key={pb.id} className="opacity-60">
                <PromptBuilder
                  key={pb.id}
                  persona={persona}
                  initialPrompt={pb.system_prompt}
                  initialFirstMessage={pb.firstMessage}
                  initialDisplayName={pb.name}
                  color={color}
                  defaultOpen={false}
                  archived={pb.archived || false}
                  starred={pb.starred || false}
                  promptBuilderId={pb.id}
                  onDataChange={(data) => handlePromptBuilderDataChange(pb.id, data)}
                  onArchiveToggle={handleArchiveToggle}
                  onStarToggle={handleStarToggle}
                />
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};

PromptBuilderSuite.displayName = 'PromptBuilderSuite';

export default PromptBuilderSuite;
