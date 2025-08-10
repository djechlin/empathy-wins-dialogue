import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Button } from '@/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/ui/collapsible';
import { archivePromptBuilder, fetchAllPromptBuildersForPersona, savePromptBuilder } from '@/utils/promptBuilder';
import { Archive, ArchiveRestore, ChevronRight, Plus } from 'lucide-react';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
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

const PromptBuilderSuite = forwardRef<PromptBuilderSuiteRef, PromptBuilderSuiteProps>(({ color, defaultOpen, onAttendeesChange }, ref) => {
  const promptBuilderRef = useRef<PromptBuilderRef>(null);
  const [attendees, setAttendees] = useState<AttendeeData[]>([]);
  const [loading, setLoading] = useState<'new' | 'loading' | 'loaded'>('new');
  const [error, setError] = useState<string | null>(null);
  const [archivedOpen, setArchivedOpen] = useState(false);
  const { toast } = useToast();

  const activeAttendees = useMemo(() => attendees.filter((a) => !a.archived), [attendees]);
  const archivedAttendees = useMemo(() => attendees.filter((a) => a.archived), [attendees]);

  useEffect(() => {
    console.log('PromptBuilderSuite: useEffect loadAttendees triggered', { loading });
    const loadAttendees = async () => {
      console.log('PromptBuilderSuite: async loadAttendees() called', { loading });
      try {
        if (loading !== 'new') {
          return;
        }
        setLoading('loading');
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
        setAttendees(attendeeData);
        setLoading('loaded');
      } catch (error) {
        console.error('PromptBuilderSuite: Error loading attendees:', error);
        setError(`Authentication required. Please sign in to load your attendees.`);
        setAttendees([{ id: '1', displayName: 'attendee', systemPrompt: '', firstMessage: '' }]);
      }
    };
    loadAttendees();
  }, [loading]);

  useEffect(() => {
    console.log('PromptBuilderSuite: useEffect onAttendeesChange triggered', { activeAttendeesCount: activeAttendees.length });
    onAttendeesChange?.(activeAttendees);
  }, [activeAttendees, onAttendeesChange]);

  const handleAttendeeDataChange = useCallback(
    (attendeeId: string, data: { systemPrompt: string; firstMessage: string; displayName: string }) => {
      const updatedAttendees = attendees.map((a) => (a.id === attendeeId ? { ...a, ...data } : a));
      setAttendees(updatedAttendees);
    },
    [attendees],
  );

  const addAttendee = useCallback(async () => {
    console.log('PromptBuilderSuite: async addAttendee() called', { attendeesCount: attendees.length });
    const newAttendee = {
      name: `attendee-${attendees.length + 1}`,
      system_prompt: '',
      persona: 'attendee',
      firstMessage: '',
    };

    try {
      const success = await savePromptBuilder(newAttendee);
      if (success) {
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
        setAttendees(attendeeData);
        toast({
          title: 'Success',
          description: 'New attendee created successfully',
        });
      }
    } catch (error) {
      console.error('Error creating attendee:', error);
      toast({
        title: 'Error',
        description: 'Failed to create new attendee',
        variant: 'destructive',
      });
    }
  }, [attendees.length, toast]);

  const handleArchiveToggle = useCallback(
    async (attendeeId: string, currentlyArchived: boolean) => {
      console.log('PromptBuilderSuite: async handleArchiveToggle() called', { attendeeId, currentlyArchived });
      setAttendees((prev) => prev.map((a) => (a.id === attendeeId ? { ...a, archived: !currentlyArchived } : a)));

      try {
        const success = await archivePromptBuilder(attendeeId, !currentlyArchived);
        if (!success) {
          setAttendees((prev) => prev.map((a) => (a.id === attendeeId ? { ...a, archived: currentlyArchived } : a)));
          toast({
            title: 'Error',
            description: `Failed to ${!currentlyArchived ? 'archive' : 'unarchive'} attendee`,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Success',
            description: `Attendee ${!currentlyArchived ? 'archived' : 'unarchived'} successfully`,
          });
        }
      } catch (error) {
        console.error('Archive error:', error);
        setAttendees((prev) => prev.map((a) => (a.id === attendeeId ? { ...a, archived: currentlyArchived } : a)));
        toast({
          title: 'Error',
          description: `Failed to ${!currentlyArchived ? 'archive' : 'unarchive'} attendee`,
          variant: 'destructive',
        });
      }
    },
    [toast],
  );

  useImperativeHandle(ref, () => ({
    getPromptBuilder: () => promptBuilderRef.current,
    getAttendees: () => activeAttendees,
  }));

  const AttendeeItem = ({ attendee, index, isArchived }: { attendee: AttendeeData; index: number; isArchived: boolean }) => (
    <div className={cn('space-y-2', isArchived ? 'opacity-60' : '')}>
      <div className="flex justify-end">
        <Button
          onClick={() => handleArchiveToggle(attendee.id, attendee.archived || false)}
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0 text-gray-400 hover:text-blue-500"
          title={isArchived ? 'Unarchive' : 'Archive'}
        >
          {isArchived ? <ArchiveRestore className="h-3 w-3" /> : <Archive className="h-3 w-3" />}
        </Button>
      </div>
      <PromptBuilder
        key={attendee.id}
        ref={!isArchived && index === 0 ? promptBuilderRef : undefined}
        persona="attendee"
        initialPrompt={attendee.systemPrompt}
        initialFirstMessage={attendee.firstMessage}
        initialDisplayName={attendee.displayName}
        color={color}
        defaultOpen={defaultOpen && !isArchived}
        onDataChange={(data) => handleAttendeeDataChange(attendee.id, data)}
      />
    </div>
  );

  if (loading === 'loading') {
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

  if (error) {
    return (
      <div className="space-y-4">
        <h3 className="font-medium">Attendees</h3>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <div className="font-medium">Error Loading Attendees:</div>
          <div className="mt-1">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Attendees</h3>

      {/* Active attendees */}
      {activeAttendees.length > 0 ? (
        <div className="space-y-3">
          {activeAttendees.map((attendee, index) => (
            <AttendeeItem key={attendee.id} attendee={attendee} index={index} isArchived={false} />
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
        Add Prompt Builder
      </Button>

      {/* Archived attendees collapsible section */}
      {archivedAttendees.length > 0 && (
        <Collapsible open={archivedOpen} onOpenChange={setArchivedOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-start text-xs text-gray-600 hover:text-gray-900">
              <ChevronRight className={cn('h-3 w-3 mr-1 transition-transform', archivedOpen ? 'rotate-90' : '')} />
              Archived ({archivedAttendees.length})
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-2">
            {archivedAttendees.map((attendee, index) => (
              <AttendeeItem key={attendee.id} attendee={attendee} index={index} isArchived={true} />
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
});

PromptBuilderSuite.displayName = 'PromptBuilderSuite';

export default PromptBuilderSuite;
