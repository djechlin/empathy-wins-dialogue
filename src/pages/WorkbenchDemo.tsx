import Navbar from '@/components/layout/Navbar';
import Chat from '@/pages/Chat';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { PromptBuilderData } from '@/utils/promptBuilder';
import { supabase } from '@/integrations/supabase/client';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

const WorkbenchDemo = () => {
  const [searchParams] = useSearchParams();
  const [organizerData, setOrganizerData] = useState<PromptBuilderData | null>(null);
  const [loading, setLoading] = useState(false);
  const controlStatus = 'started';

  // UUID validation regex
  const isValidUUID = (uuid: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  const fetchOrganizerData = useCallback(async (id: string) => {
    if (!isValidUUID(id)) {
      toast.error('Invalid organizer UUID format');
      return;
    }

    setLoading(true);

    try {
      const { data, error: supabaseError } = await supabase.from('prompts').select('*').eq('id', id).eq('persona', 'organizer').single();

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      if (!data) {
        throw new Error('Organizer not found');
      }

      const organizer: PromptBuilderData = {
        id: data.id,
        name: data.name,
        system_prompt: data.system_prompt,
        persona: 'organizer',
        firstMessage: data.first_message || '',
        archived: data.archived || false,
        starred: data.starred || false,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      setOrganizerData(organizer);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch organizer';
      setOrganizerData(null);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChatStatusUpdate = useCallback(() => {
    // No longer tracking chat status in UI
  }, []);


  // Auto-fetch organizer when organizerId is provided via URL
  useEffect(() => {
    const urlOrganizerId = searchParams.get('organizerId');
    if (urlOrganizerId) {
      fetchOrganizerData(urlOrganizerId);
    }
  }, [searchParams, fetchOrganizerData]);

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Navbar pageTitle="Workbench Demo" pageSummary="Test organizer prompts with live chat" />
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div>
            {organizerData ? (
              <Chat
                attendeePb={{
                  id: 'human-attendee',
                  name: 'Human',
                  system_prompt: '',
                  persona: 'attendee',
                  firstMessage: '',
                  starred: true,
                }}
                organizerPb={organizerData}
                organizerMode="ai"
                attendeeMode="human"
                controlStatus={controlStatus}
                onStatusUpdate={handleChatStatusUpdate}
                coaches={[]}
                defaultOpen={true}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-purple-600">Chat Demo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 text-center py-8">
                    {loading ? 'Loading organizer...' : 'Provide a valid organizer UUID in the URL (?organizerId=...) to start chatting'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkbenchDemo;
