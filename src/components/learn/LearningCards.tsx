
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Slider } from '@/ui/slider';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Textarea } from '@/ui/textarea';
import { Plus, Trash2, List, ListCheck, Youtube, Users, ArrowDown, ArrowUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/ui/sonner';
import { Skeleton } from '@/ui/skeleton';
import VideoCard from './VideoCard';

const LearningCards = () => {
  const [comfortLevel, setComfortLevel] = useState([5]);
  const [friends, setFriends] = useState(['']);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [reflection, setReflection] = useState('');
  const [savingComfort, setSavingComfort] = useState(false);
  const [loadingWillingness, setLoadingWillingness] = useState(true);

  // Fetch willingness data when component mounts
  useEffect(() => {
    async function fetchWillingnessData() {
      try {
        setLoadingWillingness(true);

        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          // Not authenticated, just stop loading
          setLoadingWillingness(false);
          return;
        }

        // Get the latest willingness value for this user
        const { data, error } = await supabase
          .from('willingness')
          .select('value')
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) {
          console.error('Error fetching willingness data:', error);
          toast.error('Failed to load your saved comfort level');
        } else if (data && data.length > 0) {
          // Set the comfort level from the database if a value exists
          if (data[0].value !== null) {
            setComfortLevel([data[0].value]);
          }
          console.log('Loaded comfort level from database:', data[0].value);
        } else {
          console.log('No willingness data found');
        }
      } catch (error) {
        console.error('Error in fetching willingness data:', error);
      } finally {
        setLoadingWillingness(false);
      }
    }

    fetchWillingnessData();
  }, []);

  const addFriend = () => {
    setFriends([...friends, '']);
  };

  const updateFriend = (index: number, value: string) => {
    const updatedFriends = [...friends];
    updatedFriends[index] = value;
    setFriends(updatedFriends);
  };

  const removeFriend = (index: number) => {
    const updatedFriends = friends.filter((_, i) => i !== index);
    setFriends(updatedFriends);
  };

  const toggleScenario = (scenario: string) => {
    if (selectedScenarios.includes(scenario)) {
      setSelectedScenarios(selectedScenarios.filter(s => s !== scenario));
    } else {
      setSelectedScenarios([...selectedScenarios, scenario]);
    }
  };

  const saveComfortLevel = async () => {
    try {
      setSavingComfort(true);

      // Check if user is authenticated
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error('You must be logged in to save your comfort level');
        return;
      }

      console.log('Saving comfort level:', comfortLevel[0]);

      // Insert the comfort level into the willingness table
      // user_id will be set automatically via the DEFAULT value we set
      const { error } = await supabase
        .from('willingness')
        .insert([{ value: comfortLevel[0] }]);

      if (error) {
        console.error('Error saving comfort level:', error);
        toast.error('Failed to save your comfort level');
        return;
      }

      toast.success('Your comfort level has been saved!');
    } catch (error) {
      console.error('Error in saving comfort level:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setSavingComfort(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="space-y-8">
        {/* Card 1: Comfort Level Slider */}
        <Card className="shadow-lg border-dialogue-neutral animate-fade-in">
          <CardHeader>
            <CardTitle>How comfortable are you having political conversations?</CardTitle>
            <CardDescription>
              Rate your comfort level on a scale from 1 to 10
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {loadingWillingness ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-full" />
                  <div className="flex justify-between mt-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                  <Skeleton className="h-8 w-40 mx-auto" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <>
                  <div>
                    <Slider
                      value={comfortLevel}
                      onValueChange={setComfortLevel}
                      max={10}
                      min={1}
                      step={1}
                      className="py-4"
                    />
                    <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                      <span>1 - Very uncomfortable</span>
                      <span>10 - Very comfortable</span>
                    </div>
                  </div>
                  <div className="text-center text-xl font-heading">
                    Your comfort level: <span className="text-dialogue-purple font-bold">{comfortLevel[0]}</span>
                  </div>
                  <p className="text-muted-foreground">
                    Understanding your starting point helps us tailor the learning experience for you.
                  </p>
                  <Button
                    onClick={saveComfortLevel}
                    disabled={savingComfort}
                    className="w-full bg-dialogue-purple hover:bg-dialogue-darkblue"
                  >
                    {savingComfort ? 'Saving...' : 'Save My Comfort Level'}
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <VideoCard
          title="Introduction to Empathetic Political Dialogue"
          description="Watch this short video to learn the basics of having productive political conversations"
          url="https://www.youtube.com/embed/zOgCdDJYF4U"
        />

        {/* Card 3: Friends List */}
        <Card className="shadow-lg border-dialogue-neutral animate-fade-in">
          <CardHeader>
            <CardTitle>Who would you like to have better conversations with?</CardTitle>
            <CardDescription>
              List the people you want to connect with for meaningful political dialogue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {friends.map((friend, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={friend}
                    onChange={(e) => updateFriend(index, e.target.value)}
                    placeholder={`Friend ${index + 1}'s name`}
                    className="flex-grow"
                  />
                  {friends.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeFriend(index)}
                      className="shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}

              <Button
                variant="outline"
                onClick={addFriend}
                className="w-full border-dashed border-dialogue-neutral"
              >
                <Plus className="mr-2 h-4 w-4" /> Add another person
              </Button>

              <div className="pt-4">
                <p className="text-muted-foreground mb-4">
                  These are the people you've identified for having more productive political conversations.
                  Once you complete this lesson, you'll have tools to engage with them effectively.
                </p>
                <Button className="w-full bg-dialogue-purple hover:bg-dialogue-darkblue">
                  Save My List
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Challenging Scenarios */}
        <Card className="shadow-lg border-dialogue-neutral animate-fade-in">
          <CardHeader>
            <CardTitle>What scenarios do you find most challenging?</CardTitle>
            <CardDescription>
              Select all that apply to help us customize your learning experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                "Family gatherings with opposing viewpoints",
                "Social media disagreements with friends",
                "Workplace political discussions",
                "Community meetings on divisive issues",
                "One-on-one conversations with someone who disagrees",
                "Group settings where I'm the minority opinion"
              ].map((scenario) => (
                <div
                  key={scenario}
                  className={`p-4 rounded-md border cursor-pointer transition-colors ${
                    selectedScenarios.includes(scenario)
                      ? 'bg-dialogue-purple bg-opacity-10 border-dialogue-purple'
                      : 'border-dialogue-neutral hover:bg-muted'
                  }`}
                  onClick={() => toggleScenario(scenario)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{scenario}</span>
                    <ListCheck className={`h-5 w-5 ${
                      selectedScenarios.includes(scenario)
                        ? 'text-dialogue-purple'
                        : 'text-muted-foreground'
                    }`} />
                  </div>
                </div>
              ))}

              <div className="pt-6">
                <p className="text-muted-foreground mb-4">
                  Understanding your specific challenges helps us provide more targeted strategies
                  for these situations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 5: Reflection */}
        <Card className="shadow-lg border-dialogue-neutral animate-fade-in">
          <CardHeader>
            <CardTitle>Reflect on your political dialogue goals</CardTitle>
            <CardDescription>
              Share what you hope to achieve by improving your political conversation skills
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="I hope to improve my political conversation skills because..."
                className="w-full h-40 resize-none"
              />

              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5 text-dialogue-purple" />
                  What successful dialogue looks like:
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <ArrowDown className="h-4 w-4 text-dialogue-purple mt-1 shrink-0" />
                    <span>Lower tension in conversations about politics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowUp className="h-4 w-4 text-dialogue-purple mt-1 shrink-0" />
                    <span>Increased understanding of different perspectives</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowUp className="h-4 w-4 text-dialogue-purple mt-1 shrink-0" />
                    <span>More productive exchanges that build relationships</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4">
                <Button className="w-full bg-dialogue-purple hover:bg-dialogue-darkblue">
                  Complete Learning Module
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LearningCards;
