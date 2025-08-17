import Navbar from '@/components/layout/Navbar';
import Chat from '@/pages/Chat';
import { Button } from '@/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { PromptBuilderData } from '@/utils/promptBuilder';
import { supabase } from '@/integrations/supabase/client';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

interface ChatStatus {
  started?: boolean;
  messageCount?: number;
  lastActivity?: Date;
}

const WorkbenchDemo = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [organizerId, setOrganizerId] = useState<string>(searchParams.get('organizerId') || '');
  const [organizerData, setOrganizerData] = useState<PromptBuilderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [controlStatus, setControlStatus] = useState<'ready' | 'started' | 'paused' | 'ended'>('ready');
  const [chatStatus, setChatStatus] = useState<ChatStatus>({});

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
      const { data, error: supabaseError } = await supabase
        .from('prompts')
        .select('*')
        .eq('id', id)
        .eq('persona', 'organizer')
        .single();

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

  const handleChatStatusUpdate = useCallback((updates: ChatStatus) => {
    setChatStatus(prev => ({ ...prev, ...updates }));
  }, []);

  const handleStartChat = () => {
    setControlStatus('started');
  };

  const handlePauseToggle = () => {
    if (controlStatus === 'started') {
      setControlStatus('paused');
    } else if (controlStatus === 'paused') {
      setControlStatus('started');
    }
  };

  const handleFinishChat = () => {
    setControlStatus('ended');
  };

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
    <div className="min-h-screen bg-gray-50">
      <Navbar pageTitle="Workbench Demo" pageSummary="Test organizer prompts with live chat" />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Organizer Input Widget */}
            <Card>
              <CardHeader>
                <CardTitle>Organizer ID Input</CardTitle>
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
                    >
                      {loading ? 'Loading...' : 'Fetch'}
                    </Button>
                  </div>
                  {organizerId && !isValidUUID(organizerId) && (
                    <p className="text-sm text-red-600 mt-1">Invalid UUID format</p>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                    {error}
                  </div>
                )}

                {organizerData && (
                  <div className="bg-green-50 border border-green-200 p-3 rounded">
                    <h3 className="font-medium text-green-800">{organizerData.name}</h3>
                    <p className="text-sm text-green-600 mt-1">
                      System prompt: {organizerData.system_prompt.substring(0, 100)}
                      {organizerData.system_prompt.length > 100 ? '...' : ''}
                    </p>
                    {organizerData.firstMessage && (
                      <p className="text-sm text-green-600 mt-1">
                        First message: {organizerData.firstMessage.substring(0, 100)}
                        {organizerData.firstMessage.length > 100 ? '...' : ''}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Chat Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Chat Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    onClick={handleStartChat}
                    disabled={!organizerData || controlStatus !== 'ready'}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Start Chat
                  </Button>
                  <Button
                    onClick={handlePauseToggle}
                    disabled={controlStatus === 'ready' || controlStatus === 'ended'}
                    variant="outline"
                  >
                    {controlStatus === 'paused' ? 'Resume' : 'Pause'}
                  </Button>
                  <Button
                    onClick={handleFinishChat}
                    disabled={controlStatus === 'ready' || controlStatus === 'ended'}
                    variant="destructive"
                  >
                    Finish
                  </Button>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  Status: <span className="font-medium">{controlStatus}</span>
                  {chatStatus.messageCount && (
                    <span className="ml-4">Messages: {chatStatus.messageCount}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Component */}
          {organizerData && (
            <div className="mt-6">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkbenchDemo;