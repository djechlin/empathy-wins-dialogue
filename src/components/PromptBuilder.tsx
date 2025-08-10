import { AccordionContent, AccordionItem, AccordionTrigger } from '@/ui/accordion';
import { Button } from '@/ui/button';
import { Label } from '@/ui/label';
import { Textarea } from '@/ui/textarea';
import { savePromptBuilder, fetchMostRecentPromptForPersona } from '@/utils/promptBuilder';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';

interface PromptBuilderProps {
  name: string;
  color: string; // Tailwind background color class (e.g., 'bg-purple-200')
  initialPrompt?: string;
  initialVariables?: Record<string, string>;
  showFirstMessage?: boolean;
  onPromptChange?: (fullPrompt: string) => void;
  onDataChange?: (data: { fullPrompt: string; firstMessage: string }) => void;
}

export interface PromptBuilderRef {
  getSystemPrompt: () => string;
  getFirstMessage: () => string;
  getVariables: () => Record<string, string>;
  getFullPrompt: () => string;
}

// Utility function to convert variable name to XML tag
const nameToXmlTag = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
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
  ({ name, color, initialPrompt = '', initialVariables = {}, showFirstMessage = false, onPromptChange, onDataChange }, ref) => {
    // Internal state management
    const [systemPrompt, setSystemPrompt] = useState(initialPrompt);
    const [variables, setVariables] = useState<Record<string, string>>(initialVariables);
    const [firstMessage, setFirstMessage] = useState('');
    const [newVariableName, setNewVariableName] = useState('');
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(true);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [displayName, setDisplayName] = useState(name);
    const [isLoaded, setIsLoaded] = useState(false);
    const [editingVariableName, setEditingVariableName] = useState<string | null>(null);
    const [tempVariableName, setTempVariableName] = useState('');

    const handleSave = async () => {
      // Generate timestamped name before saving
      const timestampedName = generateTimestampedName(name.toLowerCase());
      setDisplayName(timestampedName);

      setIsSaving(true);
      setSaveError(null);
      try {
        const result = await savePromptBuilder({
          name: timestampedName,
          system_prompt: systemPrompt,
          persona: name.toLowerCase(),
          firstMessage: firstMessage,
          variables: variables,
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

    // Track changes to determine if dirty
    useEffect(() => {
      setIsSaved(false);
      setSaveError(null);
    }, [systemPrompt, variables, firstMessage]);

    // Auto-load most recent prompt for this persona on mount
    useEffect(() => {
      const loadMostRecentPrompt = async () => {
        if (isLoaded) return; // Avoid loading multiple times

        try {
          const recentPrompt = await fetchMostRecentPromptForPersona(name.toLowerCase());
          if (recentPrompt) {
            setSystemPrompt(recentPrompt.system_prompt);
            setVariables(recentPrompt.variables);
            setFirstMessage(recentPrompt.firstMessage || '');
            setDisplayName(recentPrompt.name);
            setIsSaved(true); // Mark as saved since we just loaded it
          }
        } catch (error) {
          console.error('Error loading most recent prompt:', error);
        } finally {
          setIsLoaded(true);
        }
      };

      loadMostRecentPrompt();
    }, [name, isLoaded]);

    // Memoized full prompt computation
    const fullPrompt = useMemo(() => {
      const variableTags = Object.entries(variables)
        .map(([name, value]) => `<${nameToXmlTag(name)}>${value}</${nameToXmlTag(name)}>`)
        .join('\n\n');
      return `${systemPrompt}\n\n${variableTags}`;
    }, [systemPrompt, variables]);

    // Call callbacks when full prompt or first message changes
    useEffect(() => {
      onPromptChange?.(fullPrompt);
      onDataChange?.({ fullPrompt, firstMessage });
    }, [fullPrompt, firstMessage, onPromptChange, onDataChange]);

    // Internal variable management functions
    const addVariable = (name: string) => {
      if (!name.trim() || variables[name]) return;
      setVariables((prev) => ({ ...prev, [name]: '' }));
    };

    const removeVariable = (name: string) => {
      setVariables((prev) => {
        const newVariables = { ...prev };
        delete newVariables[name];
        return newVariables;
      });
    };

    const reorderVariables = (fromIndex: number, toIndex: number) => {
      setVariables((prev) => {
        const entries = Object.entries(prev);
        const [removed] = entries.splice(fromIndex, 1);
        entries.splice(toIndex, 0, removed);
        return Object.fromEntries(entries);
      });
    };

    const startEditingVariable = (varName: string) => {
      setEditingVariableName(varName);
      setTempVariableName(varName);
    };

    const finishEditingVariable = (oldName: string) => {
      const newName = tempVariableName.trim();

      // Don't change if the name is the same or empty
      if (!newName || newName === oldName) {
        setEditingVariableName(null);
        setTempVariableName('');
        return;
      }

      // Don't allow duplicate names
      if (variables[newName] && newName !== oldName) {
        setEditingVariableName(null);
        setTempVariableName('');
        return;
      }

      // Rename the variable
      setVariables((prev) => {
        const newVariables = { ...prev };
        const value = newVariables[oldName];
        delete newVariables[oldName];
        newVariables[newName] = value;
        return newVariables;
      });

      setEditingVariableName(null);
      setTempVariableName('');
    };

    const cancelEditingVariable = () => {
      setEditingVariableName(null);
      setTempVariableName('');
    };

    // Expose getter methods for programmatic access
    useImperativeHandle(ref, () => ({
      getSystemPrompt: () => systemPrompt,
      getFirstMessage: () => firstMessage || '',
      getVariables: () => variables,
      getFullPrompt: () => fullPrompt,
    }));

    // Render the component directly without nested component definitions
    return (
      <AccordionItem value={name.toLowerCase()} className="border-0">
        <div className={`${color} rounded-lg p-4`}>
          <AccordionTrigger className="hover:no-underline p-0">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="font-medium">{name.charAt(0).toUpperCase() + name.slice(1)}</span>
                <span className="text-xs text-gray-500 font-mono">{displayName}</span>
              </div>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave();
                }}
                disabled={isSaving}
                size="sm"
                variant="outline"
                className="text-xs px-2 py-1 h-auto font-sans"
              >
                {isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
              </Button>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-0">
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

              <div>
                {Object.entries(variables).map(([varName, value], index) => (
                  <div
                    key={varName}
                    className="mb-3"
                    draggable={editingVariableName === null}
                    onDragStart={(e) => {
                      if (editingVariableName !== null) {
                        e.preventDefault();
                        return;
                      }
                      setDraggedIndex(index);
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                    onDragOver={(e) => {
                      if (editingVariableName !== null) return;
                      if (draggedIndex !== null && draggedIndex !== index) {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                      }
                    }}
                    onDrop={(e) => {
                      if (editingVariableName !== null) return;
                      if (draggedIndex !== null && draggedIndex !== index) {
                        e.preventDefault();
                        reorderVariables(draggedIndex, index);
                        setDraggedIndex(null);
                      }
                    }}
                    onDragEnd={() => setDraggedIndex(null)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-1 ${editingVariableName === null ? 'cursor-grab hover:cursor-grabbing text-gray-400 hover:text-gray-600' : 'text-gray-300 cursor-not-allowed'}`}
                        >
                          <div className="grid grid-cols-2 gap-0.5 w-3 h-3">
                            <div className="w-1 h-1 bg-current rounded-full"></div>
                            <div className="w-1 h-1 bg-current rounded-full"></div>
                            <div className="w-1 h-1 bg-current rounded-full"></div>
                            <div className="w-1 h-1 bg-current rounded-full"></div>
                            <div className="w-1 h-1 bg-current rounded-full"></div>
                            <div className="w-1 h-1 bg-current rounded-full"></div>
                          </div>
                        </div>
                        {editingVariableName === varName ? (
                          <input
                            type="text"
                            value={tempVariableName}
                            onChange={(e) => setTempVariableName(e.target.value)}
                            onBlur={() => finishEditingVariable(varName)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                finishEditingVariable(varName);
                              } else if (e.key === 'Escape') {
                                e.preventDefault();
                                cancelEditingVariable();
                              }
                            }}
                            className="text-sm font-medium px-1 py-0.5 border rounded text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            autoFocus
                          />
                        ) : (
                          <div
                            onClick={() => startEditingVariable(varName)}
                            className="cursor-pointer hover:bg-gray-100 px-1 py-0.5 rounded"
                          >
                            <code className="text-xs text-gray-500">{'<' + nameToXmlTag(varName) + '>'}</code>
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => removeVariable(varName)}
                        className="text-xs px-2 py-1 h-auto"
                      >
                        Remove
                      </Button>
                    </div>
                    <Textarea
                      value={value}
                      onChange={(e) => setVariables((prev) => ({ ...prev, [varName]: e.target.value }))}
                      placeholder={`Enter ${varName.toLowerCase()}...`}
                      className="min-h-[100px] text-sm"
                    />
                    <div className="text-xs text-gray-400 mt-1">
                      <code>{'</' + nameToXmlTag(varName) + '>'}</code>
                    </div>
                  </div>
                ))}

                <div className="flex items-center gap-2 mt-3">
                  <input
                    type="text"
                    value={newVariableName}
                    onChange={(e) => setNewVariableName(e.target.value)}
                    placeholder="Variable name"
                    className="px-2 py-1 text-xs border rounded flex-1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newVariableName.trim()) {
                        addVariable(newVariableName.trim());
                        setNewVariableName('');
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (newVariableName.trim()) {
                        addVariable(newVariableName.trim());
                        setNewVariableName('');
                      }
                    }}
                    disabled={!newVariableName.trim()}
                    className="text-xs px-2 py-1 h-auto"
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </AccordionContent>
        </div>
      </AccordionItem>
    );
  },
);

PromptBuilder.displayName = 'PromptBuilder';

export default PromptBuilder;
