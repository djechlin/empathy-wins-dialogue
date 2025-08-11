import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Textarea } from '@/ui/textarea';
import { fetchMostRecentPromptForPersona, savePromptBuilder } from '@/utils/promptBuilder';
import { AnimatePresence, motion } from 'framer-motion';
import { Archive, ArchiveRestore, ChevronDown, Star } from 'lucide-react';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useReducer } from 'react';

interface PromptBuilderProps {
  persona: 'organizer' | 'attendee' | 'coach';
  color: string; // Tailwind background color class (e.g., 'bg-purple-200')
  initialPrompt?: string;
  initialFirstMessage?: string;
  initialDisplayName?: string;
  defaultOpen?: boolean;
  archived?: boolean;
  starred?: boolean;
  promptBuilderId?: string;
  onDataChange?: (data: { systemPrompt: string; firstMessage: string; displayName: string }) => void;
  onDirtyChange?: (dirty: boolean) => void;
  onArchiveToggle?: (id: string, archived: boolean) => void;
  onStarToggle?: (id: string, starred: boolean) => void;
}

export interface PromptBuilderRef {
  getSystemPrompt: () => string;
  getFirstMessage: () => string;
}

enum SaveStatus {
  SAVED = 'saved',
  DIRTY = 'dirty',
  SAVING = 'saving',
  ERROR = 'error',
}

interface PromptBuilderState {
  id: string | null;
  systemPrompt: string;
  firstMessage: string;
  saveStatus: SaveStatus;
  saveError: string | null;
  displayName: string;
  loading: 'new' | 'loading' | 'loaded' | 'error';
  isEditingName: boolean;
  editNameValue: string;
  isOpen: boolean;
  lastSavedPromptBuilder: {
    systemPrompt: string;
    firstMessage: string;
    displayName: string;
  } | null;
}

type PromptBuilderAction =
  | { type: 'SET_SYSTEM_PROMPT'; payload: string }
  | { type: 'SET_FIRST_MESSAGE'; payload: string }
  | { type: 'SET_SAVE_STATUS'; payload: SaveStatus }
  | { type: 'SET_SAVE_ERROR'; payload: string | null }
  | { type: 'SET_DISPLAY_NAME'; payload: string }
  | { type: 'SET_LOADING'; payload: 'new' | 'loading' | 'loaded' | 'error' }
  | { type: 'SET_IS_EDITING_NAME'; payload: boolean }
  | { type: 'SET_EDIT_NAME_VALUE'; payload: string }
  | { type: 'SET_IS_OPEN'; payload: boolean }
  | { type: 'LOAD_PROMPT_DATA'; payload: { id?: string; systemPrompt: string; firstMessage: string; displayName: string } }
  | { type: 'MARK_DIRTY' }
  | { type: 'START_SAVING' }
  | { type: 'SAVE_SUCCESS'; payload: { id: string } }
  | { type: 'SAVE_FAILED'; payload: string }
  | { type: 'COMPLETE_NAME_EDIT'; payload: string }
  | { type: 'CANCEL_NAME_EDIT' }
  | { type: 'UPDATE_LAST_SAVED'; payload: { systemPrompt: string; firstMessage: string; displayName: string } };

const promptBuilderReducer = (state: PromptBuilderState, action: PromptBuilderAction): PromptBuilderState => {
  switch (action.type) {
    case 'SET_SYSTEM_PROMPT':
      return { ...state, systemPrompt: action.payload };
    case 'SET_FIRST_MESSAGE':
      return { ...state, firstMessage: action.payload };
    case 'SET_SAVE_STATUS':
      return { ...state, saveStatus: action.payload };
    case 'SET_SAVE_ERROR':
      return { ...state, saveError: action.payload };
    case 'SET_DISPLAY_NAME':
      return { ...state, displayName: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_IS_EDITING_NAME':
      return { ...state, isEditingName: action.payload };
    case 'SET_EDIT_NAME_VALUE':
      return { ...state, editNameValue: action.payload };
    case 'SET_IS_OPEN':
      return { ...state, isOpen: action.payload };
    case 'LOAD_PROMPT_DATA':
      return {
        ...state,
        id: action.payload.id || null,
        systemPrompt: action.payload.systemPrompt,
        firstMessage: action.payload.firstMessage,
        displayName: action.payload.displayName,
        editNameValue: action.payload.displayName,
        saveStatus: SaveStatus.SAVED,
        lastSavedPromptBuilder: {
          systemPrompt: action.payload.systemPrompt,
          firstMessage: action.payload.firstMessage,
          displayName: action.payload.displayName,
        },
      };
    case 'MARK_DIRTY':
      return { ...state, saveStatus: SaveStatus.DIRTY, saveError: null };
    case 'START_SAVING':
      return { ...state, saveStatus: SaveStatus.SAVING, saveError: null };
    case 'SAVE_SUCCESS':
      return {
        ...state,
        id: action.payload.id,
        saveStatus: SaveStatus.SAVED,
        lastSavedPromptBuilder: {
          systemPrompt: state.systemPrompt,
          firstMessage: state.firstMessage,
          displayName: state.displayName,
        },
      };
    case 'SAVE_FAILED':
      return { ...state, saveStatus: SaveStatus.ERROR, saveError: action.payload };
    case 'COMPLETE_NAME_EDIT':
      return { ...state, displayName: action.payload, isEditingName: false };
    case 'CANCEL_NAME_EDIT':
      return { ...state, editNameValue: state.displayName, isEditingName: false };
    case 'UPDATE_LAST_SAVED':
      return {
        ...state,
        lastSavedPromptBuilder: action.payload,
      };
    default:
      return state;
  }
};

const getPersonaDisplayName = (persona: 'organizer' | 'attendee' | 'coach'): string => {
  const names = {
    organizer: 'Organizer',
    attendee: 'Attendee',
    coach: 'Coach',
  };
  return names[persona];
};

// Generate timestamped name for prompt builder instance
const generateTimestampedName = (type: string): string => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${type}-${month}/${date}-${hours}:${minutes}:${seconds}`;
};

const PromptBuilder = forwardRef<PromptBuilderRef, PromptBuilderProps>(
  (
    {
      persona,
      color,
      initialPrompt = '',
      initialFirstMessage = '',
      initialDisplayName,
      defaultOpen = true,
      archived = false,
      starred = false,
      promptBuilderId,
      onDataChange,
      onDirtyChange,
      onArchiveToggle,
      onStarToggle,
    },
    ref,
  ) => {
    const initialState: PromptBuilderState = {
      id: promptBuilderId || null,
      systemPrompt: initialPrompt,
      firstMessage: initialFirstMessage,
      saveStatus: SaveStatus.SAVED,
      saveError: null,
      displayName: initialDisplayName || persona,
      loading: initialPrompt || initialFirstMessage ? 'loaded' : 'new',
      isEditingName: false,
      editNameValue: initialDisplayName || persona,
      isOpen: defaultOpen,
      lastSavedPromptBuilder:
        initialPrompt || initialFirstMessage || initialDisplayName
          ? {
              systemPrompt: initialPrompt,
              firstMessage: initialFirstMessage,
              displayName: initialDisplayName || persona,
            }
          : null,
    };

    const [state, dispatch] = useReducer(promptBuilderReducer, initialState);

    const isDirty = useCallback(() => {
      if (!state.lastSavedPromptBuilder) return false;

      return (
        state.systemPrompt !== state.lastSavedPromptBuilder.systemPrompt ||
        state.firstMessage !== state.lastSavedPromptBuilder.firstMessage ||
        state.displayName !== state.lastSavedPromptBuilder.displayName
      );
    }, [state.systemPrompt, state.firstMessage, state.displayName, state.lastSavedPromptBuilder]);

    const handleSave = useCallback(async () => {
      // If not dirty, no need to save
      if (!isDirty()) {
        return true;
      }

      let finalDisplayName = state.displayName;
      if (state.displayName === persona) {
        finalDisplayName = generateTimestampedName(persona);
        dispatch({ type: 'SET_DISPLAY_NAME', payload: finalDisplayName });
      }

      dispatch({ type: 'START_SAVING' });
      try {
        const savedData = await savePromptBuilder({
          id: state.id || undefined,
          name: finalDisplayName,
          system_prompt: state.systemPrompt,
          persona,
          firstMessage: state.firstMessage,
        });

        dispatch({ type: 'SAVE_SUCCESS', payload: { id: savedData.id } });
        return true;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        dispatch({ type: 'SAVE_FAILED', payload: errorMessage });
        return false;
      }
    }, [isDirty, state.id, state.systemPrompt, state.firstMessage, state.displayName, persona]);

    const handleSaveNameEdit = useCallback(() => {
      dispatch({ type: 'COMPLETE_NAME_EDIT', payload: state.editNameValue.trim() || persona });
    }, [state.editNameValue, persona]);

    const handleCancelNameEdit = useCallback(() => {
      dispatch({ type: 'CANCEL_NAME_EDIT' });
    }, []);

    const handleNameKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSaveNameEdit();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          handleCancelNameEdit();
        }
      },
      [handleSaveNameEdit, handleCancelNameEdit],
    );

    const handleArchiveToggle = useCallback(
      (currentlyArchived: boolean) => {
        if (!promptBuilderId || !onArchiveToggle) return;

        onArchiveToggle(promptBuilderId, !currentlyArchived);
      },
      [promptBuilderId, onArchiveToggle],
    );

    const handleStarToggle = useCallback(
      (currentlyStarred: boolean) => {
        if (!promptBuilderId || !onStarToggle) return;

        onStarToggle(promptBuilderId, !currentlyStarred);
      },
      [promptBuilderId, onStarToggle],
    );

    useEffect(() => {
      const dirty = isDirty();
      if (dirty && state.saveStatus === SaveStatus.SAVED) {
        dispatch({ type: 'MARK_DIRTY' });
      } else if (!dirty && state.saveStatus === SaveStatus.DIRTY) {
        dispatch({ type: 'SAVE_SUCCESS', payload: { id: state.id || '' } });
      }

      // Notify parent of dirty state changes
      onDirtyChange?.(dirty || state.saveStatus === SaveStatus.DIRTY);
    }, [
      isDirty,
      state.id,
      state.systemPrompt,
      state.firstMessage,
      state.displayName,
      state.lastSavedPromptBuilder,
      state.saveStatus,
      onDirtyChange,
    ]);

    useEffect(() => {
      const load = async () => {
        if (state.loading !== 'new') {
          return;
        }

        try {
          const recentPrompt = await fetchMostRecentPromptForPersona(persona);
          if (recentPrompt) {
            dispatch({
              type: 'LOAD_PROMPT_DATA',
              payload: {
                id: recentPrompt.id,
                systemPrompt: recentPrompt.system_prompt,
                firstMessage: recentPrompt.firstMessage || '',
                displayName: recentPrompt.name,
              },
            });
          }
          dispatch({ type: 'SET_LOADING', payload: 'loaded' });
        } catch (error) {
          console.error(`PromptBuilder: Error loading most recent prompt:`, error);
          dispatch({ type: 'SET_LOADING', payload: 'error' });
        }
      };

      load();
    }, [persona, state.loading]);

    useEffect(() => {
      if (initialDisplayName === state.displayName && initialFirstMessage === state.firstMessage && initialPrompt === state.systemPrompt) {
        return;
      }
      onDataChange?.({ systemPrompt: state.systemPrompt, firstMessage: state.firstMessage, displayName: state.displayName });
    }, [initialDisplayName, initialFirstMessage, initialPrompt, state.systemPrompt, state.firstMessage, state.displayName, onDataChange]);

    useImperativeHandle(ref, () => ({
      getSystemPrompt: () => state.systemPrompt,
      getFirstMessage: () => state.firstMessage || '',
    }));

    return (
      <div className={`${color} rounded-lg p-4`}>
        <div className="flex items-center w-full mb-2">
          <button className="flex items-center gap-2" onClick={() => dispatch({ type: 'SET_IS_OPEN', payload: !state.isOpen })}>
            <span className="font-medium">{getPersonaDisplayName(persona)}</span>
            {state.isEditingName ? (
              <Input
                value={state.editNameValue}
                onChange={(e) => dispatch({ type: 'SET_EDIT_NAME_VALUE', payload: e.target.value })}
                onKeyDown={handleNameKeyDown}
                onBlur={handleSaveNameEdit}
                className="text-xs font-mono h-6 px-1 py-0.5 min-w-0 w-auto ml-2"
                style={{ width: `${Math.max(state.editNameValue.length * 8, 80)}px` }}
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span
                className="text-xs text-gray-500 font-mono cursor-pointer hover:bg-gray-100 px-1 py-0.5 rounded ml-2"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch({ type: 'SET_IS_EDITING_NAME', payload: true });
                  dispatch({ type: 'SET_EDIT_NAME_VALUE', payload: state.displayName });
                }}
              >
                {state.displayName}
              </span>
            )}
          </button>
          <div className="flex items-center gap-2 ml-auto">
            {persona !== 'organizer' && promptBuilderId && onStarToggle && (
              <Button
                onClick={() => handleStarToggle(starred)}
                size="sm"
                variant="ghost"
                className={`h-6 w-6 p-0 ${starred ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-500`}
                title={starred ? 'Unstar' : 'Star'}
              >
                <Star className={`h-3 w-3 ${starred ? 'fill-current' : ''}`} />
              </Button>
            )}
            {persona !== 'organizer' && promptBuilderId && onArchiveToggle && (
              <Button
                onClick={() => handleArchiveToggle(archived)}
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-gray-400 hover:text-blue-500"
                title={archived ? 'Show' : 'Hide'}
              >
                {archived ? <ArchiveRestore className="h-3 w-3" /> : <Archive className="h-3 w-3" />}
              </Button>
            )}
            <Button
              onClick={handleSave}
              disabled={state.saveStatus === SaveStatus.SAVING || (!isDirty() && state.saveStatus === SaveStatus.SAVED)}
              size="sm"
              variant="outline"
              className={`text-xs px-2 py-1 h-auto font-sans ${
                isDirty() ? 'bg-orange-50 border-orange-200 text-orange-700' : 'text-gray-500'
              }`}
            >
              {state.saveStatus === SaveStatus.SAVING ? 'Saving...' : isDirty() ? 'Save Changes' : 'Saved'}
            </Button>
            <button onClick={() => dispatch({ type: 'SET_IS_OPEN', payload: !state.isOpen })}>
              <motion.div animate={{ rotate: state.isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="h-4 w-4 shrink-0" />
              </motion.div>
            </button>
          </div>
        </div>
        <AnimatePresence initial={false}>
          {state.isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pt-4">
                {state.saveError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                    <div className="font-medium">Save Error:</div>
                    <div className="mt-1">{state.saveError}</div>
                  </div>
                )}
                {persona === 'organizer' && (
                  <div>
                    <Label className="text-sm mb-2 block text-gray-600">First message (not part of prompt)</Label>
                    <Textarea
                      value={state.firstMessage}
                      onChange={(e) => dispatch({ type: 'SET_FIRST_MESSAGE', payload: e.target.value })}
                      placeholder="Enter first message..."
                      className="min-h-[100px] text-sm flex-1"
                    />
                  </div>
                )}
                <div>
                  <Label className="text-sm mb-2 block text-gray-600">System Prompt</Label>
                  <Textarea
                    value={state.systemPrompt}
                    onChange={(e) => dispatch({ type: 'SET_SYSTEM_PROMPT', payload: e.target.value })}
                    placeholder={`Enter ${getPersonaDisplayName(persona).toLowerCase()} system prompt...`}
                    className="min-h-[200px] text-sm flex-1"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  },
);

PromptBuilder.displayName = 'PromptBuilder';

export default PromptBuilder;
