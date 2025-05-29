import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Ear, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CallWorkspace as VoiceCallWorkspace } from '@/components/voice/CallWorkspace';
import PracticeCard from '@/components/learn/PracticeCard';

const EmpatheticListening = () => {
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
                <div className="p-2 rounded-lg bg-green-50">
                  <Ear className="h-6 w-6 text-green-600" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-dialogue-darkblue">
                  Eliciting the Voter's Story
                </h1>
              </div>
              <p className="text-muted-foreground text-lg">
                Develop skills for drawing out personal experiences and values in political conversations.
              </p>
            </div>

            <div className="space-y-8">
              <Card className="border-dialogue-neutral">
                <CardHeader>
                  <CardTitle>Noticing Clues</CardTitle>
                  <CardDescription>
                    Reading between the lines to understand what really matters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Effective empathetic listening starts with noticing subtle cues that reveal deeper emotions 
                      and concerns. These clues often point to what's really driving someone's political views.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-dialogue-darkblue mb-2">Verbal Clues:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Voice changes when mentioning certain topics</li>
                          <li>• Pauses before responding to specific questions</li>
                          <li>• Repetition of particular phrases or concerns</li>
                          <li>• Mentions of family, work, or personal experiences</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-dialogue-darkblue mb-2">Emotional Clues:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Frustration when discussing certain issues</li>
                          <li>• Enthusiasm about specific solutions</li>
                          <li>• Concern or worry in their tone</li>
                          <li>• Pride when talking about achievements</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dialogue-neutral">
                <CardHeader>
                  <CardTitle>Asking About People in Their Life</CardTitle>
                  <CardDescription>
                    Moving from abstract politics to personal relationships
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Deep canvassing works because it connects political issues to real people voters care about. 
                      The key is transitioning from policy discussions to personal stories and relationships.
                    </p>
                    <div className="space-y-3">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-dialogue-darkblue mb-2">Natural Transition Questions:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• "How does this issue affect your family?"</li>
                          <li>• "Is there someone in your life who's been impacted by this?"</li>
                          <li>• "What do your kids/parents think about this?"</li>
                          <li>• "Have you seen this affect anyone you know personally?"</li>
                        </ul>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded p-4">
                        <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">💡 Pro Tip</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          When they mention someone, resist the urge to immediately share your own story. 
                          Ask follow-up questions about their person first.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dialogue-neutral">
                <CardHeader>
                  <CardTitle>Learning Their Names</CardTitle>
                  <CardDescription>
                    Making conversations personal and memorable
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Using names creates intimacy and shows you're truly listening. It transforms abstract 
                      "issues" into stories about real people with real names.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-dialogue-darkblue mb-2">Getting Names:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• "What's your daughter's name?"</li>
                          <li>• "Tell me about [their name]..."</li>
                          <li>• "How old is [name]?"</li>
                          <li>• "What does [name] do for work?"</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-dialogue-darkblue mb-2">Using Names:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• "So Maria is worried about..."</li>
                          <li>• "It sounds like David's experience..."</li>
                          <li>• "What would help Sarah in this situation?"</li>
                          <li>• "How is Tom handling that?"</li>
                        </ul>
                      </div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded p-4">
                      <p className="text-sm text-green-700 dark:text-green-300">
                        <strong>Remember:</strong> When you use someone's name, you're acknowledging them as a 
                        real person, not just an example. This creates emotional investment in the conversation.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dialogue-neutral">
                <CardHeader>
                  <CardTitle>Using Reflection to Dig Deeper</CardTitle>
                  <CardDescription>
                    Techniques for encouraging more meaningful sharing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Reflection involves mirroring back what you've heard to show understanding and encourage 
                      the speaker to go deeper. It's a powerful tool for building trust and uncovering core concerns.
                    </p>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-dialogue-darkblue mb-2">Emotional Reflection:</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>• "It sounds like you're really concerned about..."</p>
                          <p>• "I can hear the frustration in your voice when you talk about..."</p>
                          <p>• "You seem proud of how Sarah handled that situation..."</p>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-dialogue-darkblue mb-2">Content Reflection:</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>• "So what I'm hearing is that the main issue for your family is..."</p>
                          <p>• "It sounds like David's biggest challenge right now is..."</p>
                          <p>• "Let me make sure I understand - you're saying that..."</p>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-dialogue-darkblue mb-2">Value Reflection:</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>• "I can tell that family is really important to you..."</p>
                          <p>• "It's clear you value fairness and want everyone to have a chance..."</p>
                          <p>• "You really care about making sure kids have opportunities..."</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dialogue-neutral">
                <CardHeader>
                  <CardTitle>What is Empathetic Listening?</CardTitle>
                  <CardDescription>
                    The foundation of meaningful political dialogue
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Empathetic listening goes beyond hearing words - it's about understanding the emotions, 
                      experiences, and values behind what someone is saying. In deep canvassing, this creates 
                      the safe space voters need to process complex political issues.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded p-4">
                        <h4 className="font-medium text-red-800 dark:text-red-300 mb-2">❌ Regular Listening</h4>
                        <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                          <li>• Waiting for your turn to speak</li>
                          <li>• Judging or evaluating what you hear</li>
                          <li>• Preparing counterarguments</li>
                          <li>• Focusing on facts and logic only</li>
                        </ul>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded p-4">
                        <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">✅ Empathetic Listening</h4>
                        <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                          <li>• Fully present and engaged</li>
                          <li>• Understanding emotions and values</li>
                          <li>• Reflecting back what you hear</li>
                          <li>• Creating space for processing</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dialogue-neutral">
                <CardHeader>
                  <CardTitle>The HEAR Method</CardTitle>
                  <CardDescription>
                    A framework for empathetic listening in political conversations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-dialogue-darkblue mb-2">H - Halt Your Internal Voice</h4>
                        <p className="text-sm text-muted-foreground">
                          Stop planning your response. Stop judging. Focus entirely on understanding what they're sharing.
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-dialogue-darkblue mb-2">E - Engage with Curiosity</h4>
                        <p className="text-sm text-muted-foreground">
                          Ask open-ended questions that help them share more about their experiences and feelings.
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-dialogue-darkblue mb-2">A - Acknowledge What You Hear</h4>
                        <p className="text-sm text-muted-foreground">
                          Reflect back their emotions and experiences to show you understand what matters to them.
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-dialogue-darkblue mb-2">R - Respond with Validation</h4>
                        <p className="text-sm text-muted-foreground">
                          Validate their feelings and experiences, even if you disagree with their conclusions.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dialogue-neutral">
                <CardHeader>
                  <CardTitle>Powerful Listening Phrases</CardTitle>
                  <CardDescription>
                    Language that encourages deeper sharing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-dialogue-darkblue mb-2">To Encourage Sharing:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• "Tell me more about that..."</li>
                          <li>• "What was that like for you?"</li>
                          <li>• "Help me understand..."</li>
                          <li>• "How did that affect you?"</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-dialogue-darkblue mb-2">To Show Understanding:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• "It sounds like you felt..."</li>
                          <li>• "I can hear that this is important because..."</li>
                          <li>• "What I'm understanding is..."</li>
                          <li>• "That must have been difficult..."</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dialogue-neutral">
                <CardHeader>
                  <CardTitle>Common Listening Mistakes</CardTitle>
                  <CardDescription>
                    Pitfalls to avoid during political conversations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                        <div>
                          <p className="font-medium">The "But Actually..." Response</p>
                          <p className="text-sm text-muted-foreground">
                            Immediately correcting their facts instead of acknowledging their feelings first.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                        <div>
                          <p className="font-medium">Solution Jumping</p>
                          <p className="text-sm text-muted-foreground">
                            Rushing to offer solutions before fully understanding their perspective.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                        <div>
                          <p className="font-medium">Emotional Dismissal</p>
                          <p className="text-sm text-muted-foreground">
                            Saying things like "You shouldn't feel that way" or "That's not logical."
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-dialogue-neutral p-4 rounded-md border-l-4 border-dialogue-purple">
                      <p className="font-semibold">Remember:</p>
                      <p className="text-muted-foreground">
                        People need to feel heard before they can hear you. Validation doesn't mean agreement - 
                        it means acknowledging their human experience.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dialogue-neutral">
                <CardHeader>
                  <CardTitle>Practice: Engaging Busy Voters</CardTitle>
                  <CardDescription>
                    Practice using the "door is open" principle with a busy voter scenario
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      This focused practice scenario helps you get comfortable with the opening moments of a conversation 
                      when a voter mentions being busy. Practice starting the conversation and getting through the 1-10 question.
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded p-4">
                      <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Your Script:</h4>
                      <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                        <p><strong>Opening:</strong> "My name's Jill, I'm talking to voters about increase funding for our libraries, is this Adam?"</p>
                        <p><strong>If busy:</strong> <em>Continue the conversation</em></p>
                        <p><strong>1-10 Question:</strong> "Great, real quick on a scale of 1-10, where 1 means you're opposed and 10 means you definitely support increasing library funding, what number is right for you?"</p>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <VoiceCallWorkspace scenarioId='busy-voter-libraries' />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <PracticeCard
                id="practice"
                title="Practice empathetic listening"
                description="Start a phone call with a virtual voice assistant who will roleplay the voter"
                scenarioId="empathetic-listening"
                quiz={[
                  {
                    id: 'practice_q1',
                    text: 'In voice practice, it\'s important to listen for emotional cues and respond with empathy.',
                    correctAnswer: true
                  },
                  {
                    id: 'practice_q2',
                    text: 'You should always stick exactly to the script during practice conversations.',
                    correctAnswer: false
                  }
                ]}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EmpatheticListening;
