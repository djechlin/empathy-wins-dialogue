import Navbar from '@/components/layout/Navbar';
import Chat from '@/pages/Chat';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/ui/collapsible';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { PromptBuilderData } from '@/utils/promptBuilder';
import { supabase } from '@/integrations/supabase/client';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import { Button } from '@/ui/button';
import { ChevronDown, LogIn, Lock } from 'lucide-react';
import { CardDescription } from '@/ui/card';


const WorkbenchDemo = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [organizerId, setOrganizerId] = useState<string>(searchParams.get('organizerId') || '');
  const [organizerData, setOrganizerData] = useState<PromptBuilderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const controlStatus = 'started';
  const [isSystemPromptOpen, setIsSystemPromptOpen] = useState(false);

  // UUID validation regex
  const isValidUUID = (uuid: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  const fetchOrganizerData = useCallback(async (id: string) => {
    if (!isValidUUID(id)) {
      setError('Invalid UUID format');
      setOrganizerData(null);
      return;
    }

    setLoading(true);
    setError(null);

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
      setError(errorMessage);
      setOrganizerData(null);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleOrganizerIdChange = (value: string) => {
    setOrganizerId(value);
    if (value) {
      setSearchParams({ organizerId: value });
    } else {
      setSearchParams({});
    }
  };

  const handleFetchOrganizer = () => {
    if (organizerId.trim()) {
      fetchOrganizerData(organizerId.trim());
    }
  };

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
    if (urlOrganizerId && urlOrganizerId !== organizerId) {
      setOrganizerId(urlOrganizerId);
      fetchOrganizerData(urlOrganizerId);
    }
  }, [searchParams, organizerId, fetchOrganizerData]);

  // Auto-fetch when organizerId changes and is valid
  useEffect(() => {
    if (organizerId && isValidUUID(organizerId)) {
      fetchOrganizerData(organizerId);
    }
  }, [organizerId, fetchOrganizerData]);

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Navbar pageTitle="Workbench Demo" pageSummary="Test organizer prompts with live chat" />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${!user ? 'filter blur-sm pointer-events-none' : ''}`}>
            {/* Organizer Input Widget */}
            <Card>
              <CardHeader>
                <CardTitle className="text-purple-800">Organizer ID Input</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="organizerId">Organizer UUID</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="organizerId"
                      value={organizerId}
                      onChange={(e) => handleOrganizerIdChange(e.target.value)}
                      placeholder="Enter organizer UUID..."
                      className={`flex-1 ${organizerId && !isValidUUID(organizerId) ? 'border-red-500' : ''}`}
                    />
                    <Button
                      onClick={handleFetchOrganizer}
                      disabled={!organizerId || !isValidUUID(organizerId) || loading}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {loading ? 'Loading...' : 'Fetch'}
                    </Button>
                  </div>
                  {organizerId && !isValidUUID(organizerId) && <p className="text-sm text-red-600 mt-1">Invalid UUID format</p>}
                </div>

                {error && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">{error}</div>}

                {organizerData && (
                  <div className="bg-purple-50 border border-purple-200 p-3 rounded">
                    <h3 className="font-medium text-purple-800">{organizerData.name}</h3>

                    <Collapsible open={isSystemPromptOpen} onOpenChange={setIsSystemPromptOpen}>
                      <CollapsibleTrigger className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800 cursor-pointer mt-1">
                        <ChevronDown className={`h-3 w-3 transition-transform ${isSystemPromptOpen ? 'rotate-180' : ''}`} />
                        Click to reveal organizer system prompt
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2">
                        <div className="bg-purple-100 border border-purple-300 p-2 rounded text-sm text-purple-700">
                          {organizerData.system_prompt}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Chat Component */}
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
                    <CardTitle className="text-purple-800">Chat</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 text-center py-8">Enter a valid organizer UUID to start chatting</p>
                  </CardContent>
                </Card>
              )}
            </div>
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
