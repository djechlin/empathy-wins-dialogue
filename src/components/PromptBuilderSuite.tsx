import { forwardRef, useImperativeHandle, useRef, useState, useEffect, useMemo } from 'react';
import PromptBuilder, { type PromptBuilderRef } from './PromptBuilder';
import { Button } from '@/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/ui/collapsible';
import { Plus, Archive, ArchiveRestore, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fetchAllPromptBuildersForPersona, archivePromptBuilder, savePromptBuilder } from '@/utils/promptBuilder';
import { useToast } from '@/hooks/use-toast';

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
  onPromptChange?: (systemPrompt: string) => void;
  onAttendeesChange?: (attendees: AttendeeData[]) => void;
}

export interface PromptBuilderSuiteRef {
  getPromptBuilder: () => PromptBuilderRef | null;
  getAttendees: () => AttendeeData[];
}

const PromptBuilderSuite = forwardRef<PromptBuilderSuiteRef, PromptBuilderSuiteProps>(
  ({ color, defaultOpen, onPromptChange, onAttendeesChange }, ref) => {
    const promptBuilderRef = useRef<PromptBuilderRef>(null);
    const [attendees, setAttendees] = useState<AttendeeData[]>([]);
    const [loading, setLoading] = useState(true);
    const [archivedOpen, setArchivedOpen] = useState(false);
    const { toast } = useToast();

    const activeAttendees = useMemo(() => attendees.filter((a) => !a.archived), [attendees]);
    const archivedAttendees = useMemo(() => attendees.filter((a) => a.archived), [attendees]);

    // Fetch attendees on load
    useEffect(() => {
      const loadAttendees = async () => {
        setLoading(true);
        try {
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
        } catch (error) {
          console.error('Error loading attendees:', error);
          // Fallback to default attendee if fetch fails
          setAttendees([{ id: '1', displayName: 'attendee', systemPrompt: '', firstMessage: '' }]);
        } finally {
          setLoading(false);
        }
      };
      loadAttendees();
    }, []);

    // Update exposed attendees when active attendees change
    useEffect(() => {
      onAttendeesChange?.(activeAttendees);
    }, [activeAttendees, onAttendeesChange]);

    const handleAttendeeDataChange = (attendeeId: string, data: { systemPrompt: string; firstMessage: string; displayName: string }) => {
      const updatedAttendees = attendees.map((attendee) => (attendee.id === attendeeId ? { ...attendee, ...data } : attendee));
      setAttendees(updatedAttendees);
      onAttendeesChange?.(updatedAttendees);
    };

    const addAttendee = async () => {
      const newAttendee = {
        name: `attendee-${attendees.length + 1}`,
        system_prompt: '',
        persona: 'attendee',
        firstMessage: '',
      };

      try {
        const success = await savePromptBuilder(newAttendee);
        if (success) {
          // Reload attendees to get the saved one with proper ID
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
    };

    const handleArchiveToggle = async (attendeeId: string, currentlyArchived: boolean) => {
      const newArchivedStatus = !currentlyArchived;

      // Optimistic UI update
      setAttendees((prev) => prev.map((a) => (a.id === attendeeId ? { ...a, archived: newArchivedStatus } : a)));

      try {
        const success = await archivePromptBuilder(attendeeId, newArchivedStatus);
        if (!success) {
          // Revert optimistic update on failure
          setAttendees((prev) => prev.map((a) => (a.id === attendeeId ? { ...a, archived: currentlyArchived } : a)));
          toast({
            title: 'Error',
            description: `Failed to ${newArchivedStatus ? 'archive' : 'unarchive'} attendee`,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Success',
            description: `Attendee ${newArchivedStatus ? 'archived' : 'unarchived'} successfully`,
          });
        }
      } catch (error) {
        console.error('Archive error:', error);
        // Revert optimistic update on error
        setAttendees((prev) => prev.map((a) => (a.id === attendeeId ? { ...a, archived: currentlyArchived } : a)));
        toast({
          title: 'Error',
          description: `Failed to ${newArchivedStatus ? 'archive' : 'unarchive'} attendee`,
          variant: 'destructive',
        });
      }
    };

    useImperativeHandle(ref, () => ({
      getPromptBuilder: () => promptBuilderRef.current,
      getAttendees: () => activeAttendees,
    }));

    const AttendeeItem = ({ attendee, index, isArchived }: { attendee: AttendeeData; index: number; isArchived: boolean }) => (
      <div className={cn('relative', isArchived ? 'opacity-60' : '')}>
        <div className="absolute top-2 right-2 z-10 flex gap-1">
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
          name={attendee.displayName}
          color={color}
          defaultOpen={defaultOpen && !isArchived}
          onPromptChange={onPromptChange}
          onDataChange={(data) => handleAttendeeDataChange(attendee.id, data)}
        />
      </div>
    );

    if (loading) {
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
  },
);

PromptBuilderSuite.displayName = 'PromptBuilderSuite';

export default PromptBuilderSuite;
