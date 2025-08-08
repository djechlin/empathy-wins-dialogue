import { Button } from '@/ui/button';
import { Label } from '@/ui/label';
import { Textarea } from '@/ui/textarea';
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/ui/accordion';

interface PromptVariable {
  name: string;
  value: string;
  onChange: (value: string) => void;
}

interface PromptBuilderProps {
  name: string;
  color: string; // Tailwind background color class (e.g., 'bg-purple-200')
  prompt: string;
  onPromptChange: (value: string) => void;
  variables: PromptVariable[];
  onAddVariable?: (name: string) => void;
  onRemoveVariable?: (name: string) => void;
  onReorderVariables?: (fromIndex: number, toIndex: number) => void;
  firstMessage?: string;
  onFirstMessageChange?: (value: string) => void;
  showFirstMessage?: boolean;
  onSave?: () => Promise<boolean> | boolean;
}

export interface PromptBuilderRef {
  save: () => Promise<boolean>;
}

// Utility function to convert variable name to XML tag
const nameToXmlTag = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
};

// Generate participant name with timestamp
const generateParticipantName = (type: string): string => {
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
      prompt,
      onPromptChange,
      variables,
      onAddVariable,
      onRemoveVariable,
      onReorderVariables,
      firstMessage,
      onFirstMessageChange,
      showFirstMessage = false,
      onSave,
    },
    ref,
  ) => {
    const [newVariableName, setNewVariableName] = useState('');
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [participantName] = useState(() => generateParticipantName(name.toLowerCase()));
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
      if (!onSave) return;

      setIsSaving(true);
      try {
        const result = await onSave();
        return result;
      } catch (error) {
        console.error('Save failed:', error);
        return false;
      } finally {
        setIsSaving(false);
      }
    };

    // Expose save function for programmatic calls
    useImperativeHandle(ref, () => ({
      save: handleSave,
    }));

    const Header = () => (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <span className="font-medium">{name.charAt(0).toUpperCase() + name.slice(1)}</span>
          <span className="text-xs text-gray-500 font-mono">{participantName}</span>
        </div>
        {onSave && (
          <Button onClick={handleSave} disabled={isSaving} size="sm" variant="outline" className="text-xs px-2 py-1 h-auto">
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        )}
      </div>
    );

    const Content = () => (
      <div className="space-y-4 pt-4">
        {showFirstMessage && firstMessage !== undefined && onFirstMessageChange && (
          <div>
            <Label className="text-sm mb-2 block text-gray-600">First message (not part of prompt)</Label>
            <Textarea
              value={firstMessage}
              onChange={(e) => onFirstMessageChange(e.target.value)}
              placeholder="Enter first message..."
              className="min-h-[100px] text-sm flex-1"
            />
          </div>
        )}
        <div>
          <Label className="text-sm mb-2 block text-gray-600">System Prompt</Label>
          <Textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder={`Enter ${name.toLowerCase()} system prompt...`}
            className="min-h-[200px] text-sm flex-1"
          />
        </div>

        <div>
          {variables.map((variable, index) => (
            <div
              key={variable.name}
              className="mb-3"
              draggable={!!onReorderVariables}
              onDragStart={(e) => {
                if (onReorderVariables) {
                  setDraggedIndex(index);
                  e.dataTransfer.effectAllowed = 'move';
                }
              }}
              onDragOver={(e) => {
                if (draggedIndex !== null && draggedIndex !== index) {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                }
              }}
              onDrop={(e) => {
                if (onReorderVariables && draggedIndex !== null && draggedIndex !== index) {
                  e.preventDefault();
                  onReorderVariables(draggedIndex, index);
                  setDraggedIndex(null);
                }
              }}
              onDragEnd={() => setDraggedIndex(null)}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {onReorderVariables && (
                    <div className="cursor-grab hover:cursor-grabbing text-gray-400 hover:text-gray-600 p-1">
                      <div className="grid grid-cols-2 gap-0.5 w-3 h-3">
                        <div className="w-1 h-1 bg-current rounded-full"></div>
                        <div className="w-1 h-1 bg-current rounded-full"></div>
                        <div className="w-1 h-1 bg-current rounded-full"></div>
                        <div className="w-1 h-1 bg-current rounded-full"></div>
                        <div className="w-1 h-1 bg-current rounded-full"></div>
                        <div className="w-1 h-1 bg-current rounded-full"></div>
                      </div>
                    </div>
                  )}
                  <Label className="text-sm text-gray-600">
                    <code className="text-xs text-gray-500">{'<' + nameToXmlTag(variable.name) + '>'}</code>
                  </Label>
                </div>
                {onRemoveVariable && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => onRemoveVariable(variable.name)}
                    className="text-xs px-2 py-1 h-auto"
                  >
                    Remove
                  </Button>
                )}
              </div>
              <Textarea
                value={variable.value}
                onChange={(e) => variable.onChange(e.target.value)}
                placeholder={`Enter ${variable.name.toLowerCase()}...`}
                className="min-h-[100px] text-sm"
              />
              <div className="text-xs text-gray-400 mt-1">
                <code>{'</' + nameToXmlTag(variable.name) + '>'}</code>
              </div>
            </div>
          ))}

          {onAddVariable && (
            <div className="flex items-center gap-2 mt-3">
              <input
                type="text"
                value={newVariableName}
                onChange={(e) => setNewVariableName(e.target.value)}
                placeholder="Variable name"
                className="px-2 py-1 text-xs border rounded flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && newVariableName.trim()) {
                    onAddVariable(newVariableName.trim());
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
                    onAddVariable(newVariableName.trim());
                    setNewVariableName('');
                  }
                }}
                disabled={!newVariableName.trim()}
                className="text-xs px-2 py-1 h-auto"
              >
                Add
              </Button>
            </div>
          )}
        </div>
      </div>
    );

    return (
      <AccordionItem value={name.toLowerCase()} className="border-0">
        <div className={`${color} rounded-lg p-4`}>
          <AccordionTrigger className="hover:no-underline p-0">
            <Header />
          </AccordionTrigger>
          <AccordionContent className="pb-0">
            <Content />
          </AccordionContent>
        </div>
      </AccordionItem>
    );
  },
);

export default PromptBuilder;
