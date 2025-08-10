import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Button } from '@/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/ui/collapsible';
import { archivePromptBuilder, fetchAllPromptBuildersForPersona, type PromptBuilderData } from '@/utils/promptBuilder';
import { Archive, ArchiveRestore, ChevronRight, Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface PromptBuilderSetProps {
  persona: string;
  color: string;
  onSelectPrompt?: (prompt: PromptBuilderData) => void;
  onCreateNew?: () => void;
}

const PromptBuilderSet = ({ persona, color, onSelectPrompt, onCreateNew }: PromptBuilderSetProps) => {
  const [prompts, setPrompts] = useState<PromptBuilderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [archivedOpen, setArchivedOpen] = useState(false);
  const { toast } = useToast();

  const activePrompts = prompts.filter((p) => !p.archived);
  const archivedPrompts = prompts.filter((p) => p.archived);

  const loadPrompts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllPromptBuildersForPersona(persona);
      setPrompts(data);
    } catch (error) {
      console.error('Error loading prompts:', error);
    } finally {
      setLoading(false);
    }
  }, [persona]);

  useEffect(() => {
    loadPrompts();
  }, [loadPrompts]);

  const handleArchiveToggle = async (promptId: string, currentlyArchived: boolean) => {
    const newArchivedStatus = !currentlyArchived;

    // Optimistic UI update
    setPrompts((prev) => prev.map((p) => (p.id === promptId ? { ...p, archived: newArchivedStatus } : p)));

    try {
      const success = await archivePromptBuilder(promptId, newArchivedStatus);

      if (!success) {
        // Revert optimistic update on failure
        setPrompts((prev) => prev.map((p) => (p.id === promptId ? { ...p, archived: currentlyArchived } : p)));

        toast({
          title: 'Error',
          description: `Failed to ${newArchivedStatus ? 'archive' : 'unarchive'} prompt`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: `Prompt ${newArchivedStatus ? 'archived' : 'unarchived'} successfully`,
        });
      }
    } catch {
      // Revert optimistic update on error
      setPrompts((prev) => prev.map((p) => (p.id === promptId ? { ...p, archived: currentlyArchived } : p)));

      toast({
        title: 'Error',
        description: `Failed to ${newArchivedStatus ? 'archive' : 'unarchive'} prompt`,
        variant: 'destructive',
      });
    }
  };

  const PromptItem = ({ prompt, isArchived }: { prompt: PromptBuilderData; isArchived: boolean }) => (
    <div className={cn('rounded-lg p-3 border', isArchived ? 'opacity-60' : '')}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium font-mono">{prompt.name}</h4>
            <span className="text-xs text-gray-500">{new Date(prompt.updated_at || '').toLocaleDateString()}</span>
          </div>
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{prompt.system_prompt.substring(0, 100)}...</p>
        </div>
        <div className="flex items-center gap-2 ml-2">
          {onSelectPrompt && (
            <Button size="sm" variant="outline" onClick={() => onSelectPrompt(prompt)} className="text-xs px-2 py-1 h-auto">
              Load
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleArchiveToggle(prompt.id!, prompt.archived || false)}
            className="text-xs px-2 py-1 h-auto"
          >
            {isArchived ? <ArchiveRestore className="h-3 w-3" /> : <Archive className="h-3 w-3" />}
          </Button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={`${color} rounded-lg p-4`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${color} rounded-lg p-4 space-y-4`}>
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-lg capitalize">{persona} Prompts</h3>
        {onCreateNew && (
          <Button size="sm" variant="outline" onClick={onCreateNew} className="text-xs px-2 py-1 h-auto">
            <Plus className="h-3 w-3 mr-1" />
            Create New
          </Button>
        )}
      </div>

      {/* Active prompts */}
      <div className="space-y-2">
        {activePrompts.length > 0 ? (
          activePrompts.map((prompt) => <PromptItem key={prompt.id} prompt={prompt} isArchived={false} />)
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No active prompts yet.</p>
            {onCreateNew && (
              <Button size="sm" variant="outline" onClick={onCreateNew} className="mt-2 text-xs">
                <Plus className="h-3 w-3 mr-1" />
                Create your first prompt
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Archived prompts collapsible section */}
      {archivedPrompts.length > 0 && (
        <Collapsible open={archivedOpen} onOpenChange={setArchivedOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-start text-xs text-gray-600 hover:text-gray-900">
              <ChevronRight className={cn('h-3 w-3 mr-1 transition-transform', archivedOpen ? 'rotate-90' : '')} />
              Archived ({archivedPrompts.length})
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            {archivedPrompts.map((prompt) => (
              <PromptItem key={prompt.id} prompt={prompt} isArchived={true} />
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};

export default PromptBuilderSet;
