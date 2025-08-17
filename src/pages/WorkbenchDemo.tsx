import Navbar from '@/components/layout/Navbar';
import Chat from '@/pages/Chat';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { PromptBuilderData } from '@/utils/promptBuilder';
import { supabase } from '@/integrations/supabase/client';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import { Button } from '@/ui/button';
import { LogIn, Lock } from 'lucide-react';
import { CardDescription } from '@/ui/card';

const WorkbenchDemo = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
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

  // Authentication check
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('WorkbenchDemo: Error getting session:', error);
      } else {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
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
          <div className={`${!user ? 'filter blur-sm pointer-events-none' : ''}`}>
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

      {!user && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-2xl font-serif">Authentication Required</CardTitle>
              <CardDescription>
                You need to be logged in to access the Workbench Demo. Please sign in or create an account to continue.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-dialogue-purple hover:bg-dialogue-darkblue" onClick={() => navigate('/auth')}>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default WorkbenchDemo;
