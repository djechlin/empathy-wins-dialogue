import { Badge } from '@/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Separator } from '@/ui/separator';
import { fetchAllPromptBuildersForPersona, type PromptBuilderData } from '@/utils/promptBuilder';
import { Clock, GraduationCap, Star, UserCheck, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import Navbar from '@/components/layout/Navbar';

type PersonaType = 'organizer' | 'attendee' | 'coach';

interface PersonaSection {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  persona: PersonaType;
  description: string;
}

const personaSections: PersonaSection[] = [
  {
    title: 'Organizers',
    icon: Users,
    persona: 'organizer',
    description: 'Prompt builders for organizer role-plays and training scenarios',
  },
  {
    title: 'Attendees',
    icon: UserCheck,
    persona: 'attendee',
    description: 'Prompt builders for attendee interactions and engagement',
  },
  {
    title: 'Coaches',
    icon: GraduationCap,
    persona: 'coach',
    description: 'Prompt builders for coaching and mentorship scenarios',
  },
];

const PromptsHistory = () => {
  const [promptData, setPromptData] = useState<Record<PersonaType, PromptBuilderData[]>>({
    organizer: [],
    attendee: [],
    coach: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllPrompts = async () => {
      try {
        const [organizers, attendees, coaches] = await Promise.all([
          fetchAllPromptBuildersForPersona('organizer'),
          fetchAllPromptBuildersForPersona('attendee'),
          fetchAllPromptBuildersForPersona('coach'),
        ]);

        setPromptData({
          organizer: organizers || [],
          attendee: attendees || [],
          coach: coaches || [],
        });
      } catch (error) {
        console.error('Error loading prompt builders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAllPrompts();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading prompt history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Prompts History | Deep Canvassing Trainer</title>
        <meta name="description" content="View and manage your prompt builder history across organizers, attendees, and coaches." />
      </Helmet>

      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Prompts History</h1>
        </div>

        <div className="space-y-12">
          {personaSections.map((section) => {
            const prompts = promptData[section.persona];
            const IconComponent = section.icon;

            return (
              <div key={section.persona} className="space-y-6">
                <div className="flex items-center gap-3">
                  <IconComponent className="h-8 w-8 text-primary" />
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground">{section.title}</h2>
                    <p className="text-muted-foreground">{section.description}</p>
                  </div>
                  <Badge variant="secondary" className="ml-auto">
                    {prompts.length} {prompts.length === 1 ? 'prompt' : 'prompts'}
                  </Badge>
                </div>

                {prompts.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <IconComponent className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground text-center">No {section.title.toLowerCase()} prompts created yet</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {prompts.map((prompt) => (
                      <Card key={prompt.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-lg line-clamp-2">{prompt.name}</CardTitle>
                            {prompt.starred && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {prompt.updated_at && formatDate(prompt.updated_at)}
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <CardDescription className="line-clamp-3 mb-3">{prompt.system_prompt}</CardDescription>
                          {prompt.firstMessage && (
                            <div className="mt-3 p-3 bg-muted rounded-md">
                              <p className="text-sm text-muted-foreground mb-1">First Message:</p>
                              <p className="text-sm line-clamp-2">{prompt.firstMessage}</p>
                            </div>
                          )}
                          <div className="flex items-center justify-between mt-4">
                            <Badge variant="outline" className="capitalize">
                              {prompt.persona}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {section.persona !== 'coach' && <Separator className="mt-8" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PromptsHistory;
