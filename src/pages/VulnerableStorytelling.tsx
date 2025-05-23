import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const VulnerableStorytelling = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container-custom py-12">
          <div className="max-w-4xl mx-auto">
            <Link to="/learn">
              <Button variant="ghost" className="mb-6 flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Learning Paths
              </Button>
            </Link>
            
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-red-50">
                  <Heart className="h-6 w-6 text-red-600" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-dialogue-darkblue">
                  Vulnerable Storytelling
                </h1>
              </div>
              <p className="text-muted-foreground text-lg">
                Master the art of sharing personal stories to build genuine connection with voters.
              </p>
            </div>

            <div className="space-y-8">
              <Card className="border-dialogue-neutral">
                <CardHeader>
                  <CardTitle>Why Vulnerability Works</CardTitle>
                  <CardDescription>
                    Understanding the psychology behind personal storytelling in political conversations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Vulnerable storytelling creates emotional connection by showing your humanity. When you share 
                      a personal story about someone you love, it signals to the voter that this conversation is 
                      about real people, not abstract politics.
                    </p>
                    <div className="bg-dialogue-neutral/10 rounded-lg p-4">
                      <h4 className="font-medium mb-2 text-dialogue-darkblue">Key Principles:</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Share stories about people you genuinely care about</li>
                        <li>• Focus on emotions and relationships, not policy details</li>
                        <li>• Be authentic - voters can sense when stories are rehearsed</li>
                        <li>• Keep stories concise but emotionally rich</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dialogue-neutral">
                <CardHeader>
                  <CardTitle>Story Structure</CardTitle>
                  <CardDescription>
                    How to craft compelling personal narratives for deep canvassing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-dialogue-darkblue mb-2">1. The Person</h4>
                        <p className="text-sm text-muted-foreground">
                          Introduce someone you love - their relationship to you and what makes them special
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-dialogue-darkblue mb-2">2. The Moment</h4>
                        <p className="text-sm text-muted-foreground">
                          Describe a specific time when the issue affected them or when you realized something important
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-dialogue-darkblue mb-2">3. The Feeling</h4>
                        <p className="text-sm text-muted-foreground">
                          Share how it made you feel and why this person matters to you
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dialogue-neutral">
                <CardHeader>
                  <CardTitle>Example Story</CardTitle>
                  <CardDescription>
                    A sample vulnerable story about healthcare
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded p-4">
                      <p className="text-sm italic">
                        "I think of my daughter Sarah. She's 28 now, works as a teacher, and has Type 1 diabetes. 
                        Last year, she had to ration her insulin because even with insurance, she couldn't afford 
                        her prescription. I remember getting that phone call from her, crying, saying she was 
                        scared. As her parent, feeling helpless when your child is suffering... it's something 
                        that stays with you. Sarah is brilliant, caring, and she's dedicating her life to educating 
                        kids. She shouldn't have to choose between her medication and paying rent."
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <strong>Why this works:</strong> Personal relationship (daughter), specific moment (phone call), 
                      genuine emotion (helplessness, fear), and connects to broader values (healthcare access).
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dialogue-neutral">
                <CardHeader>
                  <CardTitle>Practice Exercise</CardTitle>
                  <CardDescription>
                    Develop your own vulnerable story
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Think of someone you love who has been affected by a political issue. This could be healthcare, 
                      education, housing, immigration, or any other topic. Write a 2-3 sentence story following 
                      the structure above.
                    </p>
                    <div className="bg-dialogue-neutral p-4 rounded-md border-l-4 border-dialogue-purple">
                      <p className="font-semibold">Remember:</p>
                      <p className="text-muted-foreground">
                        The goal isn't to win an argument, but to show the voter that you care about real people 
                        and real consequences. Your vulnerability gives them permission to be vulnerable too.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VulnerableStorytelling;