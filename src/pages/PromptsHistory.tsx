import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Card, CardContent } from '@/ui/card';
import { Separator } from '@/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { fetchAllPromptBuildersForPersona, type PromptBuilderData } from '@/utils/promptBuilder';
import { supabase } from '@/integrations/supabase/client';
import { Copy, GraduationCap, Star, UserCheck, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { User } from '@supabase/supabase-js';

import Navbar from '@/components/layout/Navbar';

type PersonaType = 'organizer' | 'attendee' | 'coach' | 'scout';

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
  {
    title: 'Scouts',
    icon: GraduationCap,
    persona: 'scout',
    description: 'Prompt builders for scouting and reconnaissance scenarios',
  },
];

const PromptsHistory = () => {
  const { toast } = useToast();
  const [promptData, setPromptData] = useState<Record<PersonaType, PromptBuilderData[]>>({
    organizer: [],
    attendee: [],
    coach: [],
    scout: [],
  });
  const [loading, setLoading] = useState(true);
  const [showOnlyMine, setShowOnlyMine] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const loadAllPrompts = async () => {
      try {
        const userId = showOnlyMine ? user?.id : undefined;
        const [organizers, attendees, coaches, scouts] = await Promise.all([
          fetchAllPromptBuildersForPersona('organizer', userId),
          fetchAllPromptBuildersForPersona('attendee', userId),
          fetchAllPromptBuildersForPersona('coach', userId),
          fetchAllPromptBuildersForPersona('scout', userId),
        ]);

        setPromptData({
          organizer: organizers || [],
          attendee: attendees || [],
          coach: coaches || [],
          scout: scouts || [],
        });
      } catch (error) {
        console.error('Error loading prompt builders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAllPrompts();
  }, [showOnlyMine, user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
    });
    const time = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    });
    return `${formattedDate} ${time}`;
  };

  const formatDateLabels = (prompt: PromptBuilderData) => {
    const created = prompt.created_at;
    const updated = prompt.updated_at;

    if (!created && !updated) return '';
    if (!updated || created === updated) return `Created: ${formatDate(created!)}`;

    return `Created: ${formatDate(created!)} • Updated: ${formatDate(updated)}`;
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: `${type} copied!`,
        description: 'Text has been copied to your clipboard.',
      });
    } catch {
      toast({
        title: 'Copy failed',
        description: 'Unable to copy text to clipboard.',
        variant: 'destructive',
      });
    }
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

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <Button variant={!showOnlyMine ? 'default' : 'outline'} size="sm" onClick={() => setShowOnlyMine(false)}>
              Everyone's
            </Button>
            <Button variant={showOnlyMine ? 'default' : 'outline'} size="sm" onClick={() => setShowOnlyMine(true)} disabled={!user}>
              Mine
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {personaSections.map((section) => {
            const prompts = promptData[section.persona];
            const IconComponent = section.icon;

            return (
              <div key={section.persona} className="space-y-3">
                <div className="flex items-center gap-2">
                  <IconComponent className="h-6 w-6 text-primary" />
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </div>
                  <Badge variant="secondary" className="ml-auto text-xs">
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
                  <div className="space-y-2">
                    {prompts.map((prompt) => (
                      <Card key={prompt.id} className="hover:shadow-sm transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-sm font-sans truncate">{prompt.name}</h3>
                                    {prompt.starred && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 flex-shrink-0" />}
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">{formatDateLabels(prompt)}</span>
                                  </div>
                                </div>
                                <Badge variant="outline" className="text-xs capitalize flex-shrink-0 ml-2">
                                  {prompt.persona}
                                </Badge>
                              </div>

                              <div className="space-y-3">
                                <div>
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-medium text-muted-foreground">System Prompt</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => copyToClipboard(prompt.system_prompt, 'System prompt')}
                                      className="h-6 w-6 p-0"
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  <p className="text-xs text-muted-foreground line-clamp-2">{prompt.system_prompt}</p>
                                </div>

                                {prompt.firstMessage && (
                                  <div>
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-xs font-medium text-muted-foreground">First Message</span>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyToClipboard(prompt.firstMessage!, 'First message')}
                                        className="h-6 w-6 p-0"
                                      >
                                        <Copy className="h-3 w-3" />
                                      </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-2">{prompt.firstMessage}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {section.persona !== 'coach' && <Separator className="mt-4" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PromptsHistory;
