import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Textarea } from '@/ui/textarea';
import { fetchMostRecentPromptForPersona, savePromptBuilder } from '@/utils/promptBuilder';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

interface PromptBuilderProps {
  name: string;
  color: string; // Tailwind background color class (e.g., 'bg-purple-200')
  initialPrompt?: string;
  initialFirstMessage?: string;
  initialDisplayName?: string;
  initialVariables?: Record<string, string>;
  showFirstMessage?: boolean;
  defaultOpen?: boolean;
  onPromptChange?: (systempPrompt: string) => void;
  onDataChange?: (data: { systemPrompt: string; firstMessage: string; displayName: string }) => void;
}

export interface PromptBuilderRef {
  getSystemPrompt: () => string;
  getFirstMessage: () => string;
}

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
      name,
      color,
      initialPrompt = '',
      initialFirstMessage = '',
      initialDisplayName,
      showFirstMessage = false,
      defaultOpen = true,
      onPromptChange,
      onDataChange,
    },
    ref,
  ) => {
    const [systemPrompt, setSystemPrompt] = useState(initialPrompt);
    const [firstMessage, setFirstMessage] = useState(initialFirstMessage);
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(true);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [displayName, setDisplayName] = useState(initialDisplayName || name);
    const [isLoaded, setIsLoaded] = useState(!!initialPrompt || !!initialDisplayName);
    const [isEditingName, setIsEditingName] = useState(false);
    const [editNameValue, setEditNameValue] = useState(displayName);
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const handleSave = async () => {
      // If already saved (not dirty), auto-succeed
      if (isSaved) {
        return true;
      }

      // Use current display name, or generate timestamped name if it's still the default
      const nameToSave = displayName === name ? generateTimestampedName(name.toLowerCase()) : displayName;
      if (displayName === name) {
        setDisplayName(nameToSave);
      }

      setIsSaving(true);
      setSaveError(null);
      try {
        const result = await savePromptBuilder({
          name: nameToSave,
          system_prompt: systemPrompt,
          persona: name.toLowerCase(),
          firstMessage: firstMessage,
        });

        if (result) {
          setIsSaved(true);
        } else {
          setSaveError('Save failed - operation returned false');
        }
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        setSaveError(errorMessage);
        return false;
      } finally {
        setIsSaving(false);
      }
    };

    const handleStartEditingName = () => {
      setIsEditingName(true);
      setEditNameValue(displayName);
    };

    const handleSaveNameEdit = () => {
      setDisplayName(editNameValue.trim() || name);
      setIsEditingName(false);
    };

    const handleCancelNameEdit = () => {
      setEditNameValue(displayName);
      setIsEditingName(false);
    };

    const handleNameKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSaveNameEdit();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleCancelNameEdit();
      }
    };

    // Sync editNameValue with displayName when displayName changes from external sources
    useEffect(() => {
      if (!isEditingName) {
        setEditNameValue(displayName);
      }
    }, [displayName, isEditingName]);

    // Track changes to determine if dirty
    useEffect(() => {
      setIsSaved(false);
      setSaveError(null);
    }, [systemPrompt, firstMessage, displayName]);

    // Auto-load most recent prompt for this persona on mount
    useEffect(() => {
      const loadMostRecentPrompt = async () => {
        console.log(`PromptBuilder ${name}: Starting to load...`);
        if (isLoaded) return; // Avoid loading multiple times

        try {
          console.log(`PromptBuilder ${name}: Fetching for persona: ${name.toLowerCase()}`);
          const recentPrompt = await fetchMostRecentPromptForPersona(name.toLowerCase());
          console.log(`PromptBuilder ${name}: Received data:`, recentPrompt);
          if (recentPrompt) {
            setSystemPrompt(recentPrompt.system_prompt);
            setFirstMessage(recentPrompt.firstMessage || '');
            setDisplayName(recentPrompt.name);
            setIsSaved(true); // Mark as saved since we just loaded it
          }
        } catch (error) {
          console.error(`PromptBuilder ${name}: Error loading most recent prompt:`, error);
        } finally {
          setIsLoaded(true);
          console.log(`PromptBuilder ${name}: Loading complete`);
        }
      };

      loadMostRecentPrompt();
    }, [name, isLoaded]);

    // Call callbacks when full sprompt or first message changes
    useEffect(() => {
      onPromptChange?.(systemPrompt);
      onDataChange?.({ systemPrompt, firstMessage, displayName });
    }, [systemPrompt, firstMessage, displayName, onPromptChange, onDataChange]);

    // Expose getter methods for programmatic access
    useImperativeHandle(ref, () => ({
      getSystemPrompt: () => systemPrompt,
      getFirstMessage: () => firstMessage || '',
    }));

    return (
      <div className={`${color} rounded-lg p-4`}>
        <div className="flex items-center justify-between w-full mb-2">
          <button className="flex items-center gap-2 flex-1" onClick={() => setIsOpen(!isOpen)}>
            <span className="font-medium">{name.charAt(0).toUpperCase() + name.slice(1)}</span>
            {isEditingName ? (
              <Input
                value={editNameValue}
                onChange={(e) => setEditNameValue(e.target.value)}
                onKeyDown={handleNameKeyDown}
                onBlur={handleSaveNameEdit}
                className="text-xs font-mono h-6 px-1 py-0.5 min-w-0 w-auto ml-2"
                style={{ width: `${Math.max(editNameValue.length * 8, 80)}px` }}
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span
                className="text-xs text-gray-500 font-mono cursor-pointer hover:bg-gray-100 px-1 py-0.5 rounded ml-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartEditingName();
                }}
              >
                {displayName}
              </span>
            )}
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="h-4 w-4 shrink-0" />
            </motion.div>
          </button>
          <Button
            onClick={handleSave}
            disabled={isSaving || isSaved}
            size="sm"
            variant="outline"
            className="text-xs px-2 py-1 h-auto font-sans ml-2"
          >
            {isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
          </Button>
        </div>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pt-4">
                {saveError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                    <div className="font-medium">Save Error:</div>
                    <div className="mt-1">{saveError}</div>
                  </div>
                )}
                {showFirstMessage && firstMessage !== undefined && setFirstMessage && (
                  <div>
                    <Label className="text-sm mb-2 block text-gray-600">First message (not part of prompt)</Label>
                    <Textarea
                      value={firstMessage}
                      onChange={(e) => setFirstMessage(e.target.value)}
                      placeholder="Enter first message..."
                      className="min-h-[100px] text-sm flex-1"
                    />
                  </div>
                )}
                <div>
                  <Label className="text-sm mb-2 block text-gray-600">System Prompt</Label>
                  <Textarea
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    placeholder={`Enter ${name.toLowerCase()} system prompt...`}
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
