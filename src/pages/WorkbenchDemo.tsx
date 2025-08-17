import Navbar from '@/components/layout/Navbar';
import Chat from '@/pages/Chat';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

const WorkbenchDemo = () => {
  const [searchParams] = useSearchParams();
  const controlStatus = 'started';

  const handleChatStatusUpdate = useCallback(() => {
    // No longer tracking chat status in UI
  }, []);

  // Skip fetching organizer data in demo mode - demo works with organizerId only
  // Demo mode is indicated by the /workbench/demo route which has no database access

  const urlOrganizerId = searchParams.get('organizerId');

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Navbar pageTitle="Workbench Demo" pageSummary="Test organizer prompts with live chat" />
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div>
            {urlOrganizerId ? (
              <Chat
                attendeePb={{
                  id: 'human-attendee',
                  name: 'Human',
                  system_prompt: '',
                  persona: 'attendee',
                  firstMessage: '',
                  starred: true,
                }}
                organizerId={urlOrganizerId}
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
                    Provide a valid organizer UUID in the URL (?organizerId=...) to start chatting
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
