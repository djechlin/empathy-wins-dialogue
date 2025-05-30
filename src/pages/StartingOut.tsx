import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Youtube, Check, X, MessageCircle, Clock, Heart, Users, TrendingUp, Target, Lightbulb, ArrowRight } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import SliderCard from '@/components/ui/slider-card';
import PracticeCard from '@/components/learn/PracticeCard';
import FactCard from '@/components/learn/FactCard';
import FactCardList from '@/components/learn/FactCardList';
import ActivityCard from '@/components/learn/ActivityCard';
import Quiz from '@/components/learn/Quiz';
import DosAndDonts, { 
  Dos, 
  Donts, 
  ConversationDos, 
  ConversationDonts, 
  DosAndDontsItem, 
  ConversationDosAndDontsItem 
} from '@/components/learn/DosAndDonts';
import VideoCard from '@/components/learn/VideoCard';
import ConversationFlow from '@/components/learn/ConversationFlow';

const Learn = () => {
  return <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container-custom py-12">
          <div className="max-w-3xl mx-auto mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-dialogue-darkblue mb-4">Learn the deep canvass method</h1>
          </div>

          {/* Deep Canvassing Assessment */}
          <div className="max-w-6xl mx-auto mb-12">
            <SliderCard
              id="deep-canvassing-assessment"
              title="How do you feel about deep canvassing?"
              question="I can persuade swing voters on issues important to me."
            />
          </div>

          <div className="max-w-6xl mx-auto mb-16">
            <div className="space-y-6">
                <ActivityCard
                  id="activity1"
                  title="What is deep canvassing?"
                  description="Learn how to recognize and appreciate different viewpoints in political conversations"
                >
                  <div className="space-y-6">
                    {/* Hero Section with Key Stats */}
                    <div className="bg-gradient-to-r from-dialogue-purple/10 to-dialogue-blue/10 rounded-lg p-6 border border-dialogue-purple/20">
                      <div className="grid md:grid-cols-3 gap-4 text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-dialogue-purple/20 rounded-full flex items-center justify-center mb-2">
                            <TrendingUp className="h-6 w-6 text-dialogue-purple" />
                          </div>
                          <div className="text-2xl font-bold text-dialogue-darkblue">3-8%</div>
                          <div className="text-sm text-muted-foreground">Increase in support</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-dialogue-purple/20 rounded-full flex items-center justify-center mb-2">
                            <Clock className="h-6 w-6 text-dialogue-purple" />
                          </div>
                          <div className="text-2xl font-bold text-dialogue-darkblue">20 min</div>
                          <div className="text-sm text-muted-foreground">Conversation length</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-dialogue-purple/20 rounded-full flex items-center justify-center mb-2">
                            <Target className="h-6 w-6 text-dialogue-purple" />
                          </div>
                          <div className="text-2xl font-bold text-dialogue-darkblue">1+ year</div>
                          <div className="text-sm text-muted-foreground">Lasting impact</div>
                        </div>
                      </div>
                    </div>

                    {/* Definition Section */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card className="border-dialogue-neutral/30">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2">
                            <MessageCircle className="h-5 w-5 text-dialogue-purple" />
                            <h3 className="font-semibold">Traditional Canvassing</h3>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm text-muted-foreground">Quick conversations focused on securing votes through information sharing and persuasion arguments.</p>
                        </CardContent>
                      </Card>

                      <Card className="border-dialogue-purple/30 bg-dialogue-purple/5">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2">
                            <Heart className="h-5 w-5 text-dialogue-purple" />
                            <h3 className="font-semibold text-dialogue-purple">Deep Canvassing</h3>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm">Longer, in-depth conversations that build genuine connection through shared stories before attempting persuasion.</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Key Characteristics */}
                    <FactCard topic="Key Characteristics of Deep Canvassing">
                      <div className="grid gap-3">
                        <div className="flex items-start gap-3">
                          <Clock className="h-5 w-5 text-dialogue-purple mt-0.5 flex-shrink-0" />
                          <div>
                            <strong>Extended Conversations:</strong> Up to 20 minutes of meaningful dialogue
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Heart className="h-5 w-5 text-dialogue-purple mt-0.5 flex-shrink-0" />
                          <div>
                            <strong>Story-Based Connection:</strong> Canvassers share vulnerable stories about loved ones to build trust
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Users className="h-5 w-5 text-dialogue-purple mt-0.5 flex-shrink-0" />
                          <div>
                            <strong>Voter-Centered Approach:</strong> Focus on how issues impact the voter's community and loved ones
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Target className="h-5 w-5 text-dialogue-purple mt-0.5 flex-shrink-0" />
                          <div>
                            <strong>Persuasion Through Listening:</strong> Nonjudgmental listening as voters process conflicting opinions
                          </div>
                        </div>
                      </div>
                    </FactCard>

                    {/* Philosophy Section */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                      <div className="flex items-start gap-3 mb-4">
                        <Lightbulb className="h-6 w-6 text-dialogue-purple mt-1" />
                        <h3 className="font-semibold text-dialogue-darkblue text-lg">The Philosophy Behind Deep Canvassing</h3>
                      </div>
                      <div className="space-y-3 text-sm">
                        <p className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 text-dialogue-purple mt-0.5 flex-shrink-0" />
                          Political persuasion happens by creating safe spaces for processing, not by presenting more facts
                        </p>
                        <p className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 text-dialogue-purple mt-0.5 flex-shrink-0" />
                          Focus on lowering emotional resistance rather than piling on information
                        </p>
                        <p className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 text-dialogue-purple mt-0.5 flex-shrink-0" />
                          Create space for cognitive dissonance and natural mind-changing
                        </p>
                      </div>
                    </div>

                    {/* Conversation Flow */}
                    <FactCard topic="Typical Conversation Flow">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 p-3 bg-dialogue-neutral/10 rounded-lg">
                          <div className="w-6 h-6 bg-dialogue-purple text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                          <div>
                            <strong>Opening & Rating:</strong> Get voter to share their support/opposition on a 1-10 scale
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-dialogue-neutral/10 rounded-lg">
                          <div className="w-6 h-6 bg-dialogue-purple text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                          <div>
                            <strong>Story Sharing:</strong> Focus on people impacted by the issue, share vulnerable personal stories
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-dialogue-neutral/10 rounded-lg">
                          <div className="w-6 h-6 bg-dialogue-purple text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                          <div>
                            <strong>Deep Listening:</strong> Nonjudgmental listening as voter processes the issue
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-dialogue-neutral/10 rounded-lg">
                          <div className="w-6 h-6 bg-dialogue-purple text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                          <div>
                            <strong>Closing Rating:</strong> Return to 1-10 scale so voter hears themselves articulate any change
                          </div>
                        </div>
                      </div>
                    </FactCard>

                    {/* Case Studies */}
                    <FactCard topic="Proven Impact Across Issues">
                      <FactCardList>
                        <li>Gay rights and transgender rights campaigns</li>
                        <li>Extending social safety net to undocumented immigrants</li>
                        <li>Midterm general election turnout initiatives</li>
                        <li>Rigorous studies show 3-8 point increase in support</li>
                        <li>Effects last for a year or more after conversation</li>
                      </FactCardList>
                    </FactCard>
                  </div>

                  <Quiz
                    questions={[
                      {
                        id: 'question1',
                        text: 'Deep canvassers share vulnerable stories from their own life to connect with the voter.',
                        correctAnswer: true
                      },
                      {
                        id: 'question2',
                        text: 'Deep canvassers listen to voters talk through the issue rather than share lots of new facts and information.',
                        correctAnswer: true
                      }
                    ]}
                    title="Quiz"
                    description="Select your answers to test your knowledge of deep canvassing concepts."
                  />
                </ActivityCard>

                {/* Real Conversation Examples - As Activity Card */}
                <ActivityCard
                  id="conversation-examples"
                  title="Real Deep Canvassing Conversations"
                  description="See how actual conversations unfold from first contact to successful persuasion. These examples show the power of personal stories and genuine listening."
                >
                  <ConversationFlow />
                </ActivityCard>

                <ActivityCard
                  id="preparing-story"
                  title="Preparing your story"
                  description="Learn how to craft compelling personal narratives for deep canvassing conversations"
                >
                  <div className="space-y-4 mb-6">
                    <FactCard topic="Framing the issue">
                      <FactCardList>
                        <li>Start by clearly defining the issue you're canvassing about in your own words</li>
                        <li>Focus on the human impact rather than policy details or statistics</li>
                        <li>Think about how this issue connects to values like fairness, safety, opportunity, or community</li>
                        <li>Practice explaining the issue in 1-2 sentences that anyone could understand</li>
                        <li>Issues that affect people directly and can impact people positively are best for deep canvass conversations</li>
                        <li>Right after introducing yourself, ask them how they feel about the issue on a scale of 1-10 as soon as possible. This tells the voter why you're here, and sparks their interest</li>
                        <li>Always ask why that number is right for them, no matter if they're a 1, a 5 or a 10</li>
                      </FactCardList>
                    </FactCard>

                    {/* Issue Dos and Don'ts Section */}
                    <DosAndDonts>
                      <Dos title="Issue Dos">
                        <DosAndDontsItem type="do">
                          Should impact people directly
                        </DosAndDontsItem>
                        <DosAndDontsItem type="do">
                          Should have the potential to impact people positively
                        </DosAndDontsItem>
                      </Dos>

                      <Donts title="Issue Don'ts">
                        <DosAndDontsItem type="dont">
                          Use politics jargon like "filibuster" and "supermajority"
                        </DosAndDontsItem>
                        <DosAndDontsItem type="dont">
                          Use an "attack" issue like "tax the rich" or "vote out corruption"
                        </DosAndDontsItem>
                      </Donts>
                    </DosAndDonts>

                    <FactCard topic="Crafting your personal story">
                      <FactCardList>
                        <li>Choose a story about someone you love - family member, friend, or community member</li>
                        <li>Focus on vulnerability and emotion, not political arguments</li>
                        <li>Avoid partisan language or policy jargon</li>
                        <li>Make it personal and specific - details help create connection</li>
                        <li>Practice telling it in 60-90 seconds</li>
                      </FactCardList>
                    </FactCard>

                    {/* Dos and Don'ts Section */}
                    <DosAndDonts>
                      <Dos>
                        <DosAndDontsItem type="do">
                          Share specific, personal details that create emotional connection
                        </DosAndDontsItem>
                        <DosAndDontsItem type="do">
                          Focus on how the issue affects people you care about
                        </DosAndDontsItem>
                        <DosAndDontsItem type="do">
                          Use everyday language that anyone can understand
                        </DosAndDontsItem>
                        <DosAndDontsItem type="do">
                          Show vulnerability and authentic emotion
                        </DosAndDontsItem>
                      </Dos>

                      <Donts>
                        <DosAndDontsItem type="dont">
                          Use political jargon or partisan talking points
                        </DosAndDontsItem>
                        <DosAndDontsItem type="dont">
                          Make it about statistics or policy details
                        </DosAndDontsItem>
                        <DosAndDontsItem type="dont">
                          Tell a generic story that could apply to anyone
                        </DosAndDontsItem>
                        <DosAndDontsItem type="dont">
                          Rush through it or make it too long
                        </DosAndDontsItem>
                      </Donts>
                    </DosAndDonts>

                    <FactCard topic="Eliciting stories from voters">
                      <FactCardList>
                        <li>Ask open-ended questions about their experiences or loved ones</li>
                        <li>Use phrases like "Tell me about a time when..." or "Have you or someone you care about ever..."</li>
                        <li>Listen for emotional moments and ask follow-up questions</li>
                        <li>Show genuine curiosity and empathy</li>
                        <li>Don't rush - give them space to think and share</li>
                      </FactCardList>
                    </FactCard>

                    {/* Conversation Dos and Don'ts */}
                    <DosAndDonts>
                      <ConversationDos>
                        <ConversationDosAndDontsItem type="do">
                          Ask "Tell me about a time when..." to get stories
                        </ConversationDosAndDontsItem>
                        <ConversationDosAndDontsItem type="do">
                          Listen for emotional moments and explore them
                        </ConversationDosAndDontsItem>
                        <ConversationDosAndDontsItem type="do">
                          Give them space to think and process
                        </ConversationDosAndDontsItem>
                        <ConversationDosAndDontsItem type="do">
                          Let them make connections themselves
                        </ConversationDosAndDontsItem>
                      </ConversationDos>

                      <ConversationDonts>
                        <ConversationDosAndDontsItem type="dont">
                          Jump straight into political arguments
                        </ConversationDosAndDontsItem>
                        <ConversationDosAndDontsItem type="dont">
                          Tell them how their story connects to the issue
                        </ConversationDosAndDontsItem>
                        <ConversationDosAndDontsItem type="dont">
                          Rush them or fill silence immediately
                        </ConversationDosAndDontsItem>
                        <ConversationDosAndDontsItem type="dont">
                          Judge or dismiss their experiences
                        </ConversationDosAndDontsItem>
                      </ConversationDonts>
                    </DosAndDonts>

                    <FactCard topic="Connecting stories to the issue">
                      <FactCardList>
                        <li>Help voters see how their personal experiences relate to the broader issue</li>
                        <li>Ask questions like "How do you think this connects to...?" or "What would it mean if...?"</li>
                        <li>Let them make the connection themselves rather than telling them</li>
                        <li>Validate their feelings and experiences</li>
                        <li>Stay focused on shared values and common ground</li>
                      </FactCardList>
                    </FactCard>
                  </div>

                  <Quiz
                    questions={[
                      {
                        id: 'story_q1',
                        text: 'Make sure you\'re talking to the right person before getting to the 1-10 scale.',
                        correctAnswer: false
                      },
                      {
                        id: 'story_q2',
                        text: 'If they say they\'re a 0 or a 10, you should wrap up right away.',
                        correctAnswer: false
                      },
                      {
                        id: 'story_q3',
                        text: '"Healthcare" is a good way to frame issues about healthcare.',
                        correctAnswer: false
                      },
                      {
                        id: 'story_q4',
                        text: 'It\'s okay if your story has nothing to do about issues or politics.',
                        correctAnswer: true
                      },
                      {
                        id: 'story_q5',
                        text: 'Voters share stories about their loved ones too.',
                        correctAnswer: true
                      },
                      {
                        id: 'story_q6',
                        text: 'Share facts when the conversation is vulnerable.',
                        correctAnswer: false
                      }
                    ]}
                    title="Quiz"
                    description="Test your understanding of story preparation for deep canvassing."
                  />
                </ActivityCard>
                
                <PracticeCard
                  id="practice"
                  title="Practice deep canvassing"
                  description="Start a phone call with a virtual voice assistant who will roleplay the voter"
                  scenarioId="deep-canvassing"
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

                {/* Activity 4: Telling our story about a loved one */}
                <ActivityCard
                  id="telling"
                  title="Telling our story about a loved one"
                  description="Learn to practice vulnerability with the voter by telling your story"
                >
                  <p className="mb-6">Active listening is more than just hearing words—it's about understanding the meaning and emotion behind them. This activity covers techniques for demonstrating that you truly understand what someone is saying before responding.</p>

                  <Quiz
                    questions={[
                      {
                        id: 'telling_q1',
                        text: 'When telling your story, you should focus on how the issue personally affects someone you care about.',
                        correctAnswer: true
                      },
                      {
                        id: 'telling_q2',
                        text: 'The goal of telling your story is to convince the voter that your perspective is the only correct one.',
                        correctAnswer: false
                      }
                    ]}
                    title="Quiz"
                    description="Test your understanding of telling your story."
                  />
                </ActivityCard>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>;
};

export default Learn;
