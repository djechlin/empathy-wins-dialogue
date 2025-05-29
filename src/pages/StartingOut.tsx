import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Youtube, Check, X } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import SliderCard from '@/components/ui/slider-card';
import PracticeCard from '@/components/learn/PracticeCard';
import FactCard from '@/components/learn/FactCard';
import FactCardList from '@/components/learn/FactCardList';
import ActivityCard from '@/components/learn/ActivityCard';
import Quiz from '@/components/learn/Quiz';
import VideoCard from '@/components/learn/VideoCard';

const Learn = () => {
  return <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container-custom py-12">
          <div className="max-w-3xl mx-auto mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-dialogue-darkblue mb-4">Learn the deep canvass method</h1>
            <p className="text-muted-foreground mb-8">For this module, we'll focus on a hypothetical city ballot initiative to improve bus and subway service. The campaign is deploying deep canvassers to talk to people who are registered to vote, but who never vote in off-year local elections.

Do you think the canvasser and possible voters will get into arguments? Maybe there won't be heated partisan debates, but the the canvasser and voter genuinely disagree about the importance of voting. The canvasser must truly persuade the prospective voter to change their minds. Therefore, we can study the full deep canvass method just by learning how to persuade nonvoters in a local election.</p>
          </div>

          {/* Deep Canvassing Assessment */}
          <div className="max-w-6xl mx-auto mb-12">
            <SliderCard
              id="deep-canvassing-assessment"
              title="How do you feel about deep canvassing?"
              question="I am interested in having vulnerable political conversations with voters with different perspectives than mine."
            />
          </div>

          <div className="max-w-6xl mx-auto mb-16">
            <div className="space-y-6">
                <ActivityCard
                  id="activity1"
                  title="What is deep canvassing?"
                  description="Learn how to recognize and appreciate different viewpoints in political conversations"
                >
                  <div className="space-y-4 mb-6">
                    <VideoCard
                      title="Watch: Deep Canvassing Explained"
                      description="Watch this video to get an introduction to deep canvassing"
                      url="https://www.youtube.com/embed/Ip_pjb5_fgA"
                    />

                    <FactCard topic="Definition and Purpose">
                      <FactCardList>
                        <li><strong>Canvassing</strong>: Talking to people to secure their vote or their support.</li>
                        <li><strong>Deep canvassing</strong>: A form of canvassing that involves longer, in-depth conversations in which the canvasser builds a connection with the voter before trying to persuade them on an issue.</li>
                      </FactCardList>
                    </FactCard>

                    <FactCard topic="Characteristics of a deep canvassing conversation">
                      <FactCardList>
                        <li>Conversations last up to 20 minutes</li>
                        <li>Canvassers focus on building a connection by sharing stories about loved ones with the voter</li>
                        <li>Instead of explaining the issue to the voter, the canvasser asks the voter how the issue impacts their loves ones or people in their community and nonjudgmentally listens</li>
                        <li>Canvassers assume most opposers are persuadable, and most supporters could use a nudge</li>
                        <li>Canvassers can fall back to traditional canvassing when they feel there's no need to persuade a voter deeply</li>
                      </FactCardList>
                    </FactCard>

                    <FactCard topic="Case studies">
                      <FactCardList>
                        <li>Deep canvassing campaigns have focused on gay rights, transgender rights, extending the social safety net to undocumented immigrants, midterm general election turnout and other issues</li>
                        <li>Rigorous studies show 3-8 point increase in support for an issue after a deep canvassing conversation.</li>
                        <li>Furthermore, the effect is long-lasting, seemingly for a year or more</li>
                      </FactCardList>
                    </FactCard>

                    <FactCard topic="Persuasion Philosophy">
                      <FactCardList>
                        <li>Political persuasion is possible by creating a safe space to process issues, not by presenting more facts</li>
                        <li>If information flows like an electric current, deep canvassing focuses on lowering emotional resistance, not piling on more information</li>
                        <li>Canvassers always listen nonjudgmentally as voters process conflicting opinions, creating a safe space for cognitive dissonance and for the voter to change their mind</li>
                      </FactCardList>
                    </FactCard>

                    <FactCard topic="Conversation flow">
                      <FactCardList>
                        <li>People stay on the phone to chat or keep the door open fairly often.</li>
                        <li>Canvassers get the voter to share their support or opposition to the issue, rating their support 1-10.</li>
                        <li>The canvasser then focuses the conversation on people the voter knows impacted by the issue, or stories of our loved ones more generally. The canvasser often shares a vulnerable story about one of their own loved ones.</li>
                        <li>The canvasser only brings up issues and politics after they and the voter are opening up to each other. They then focus on nonjudgmental listening as the voter processes the issue.</li>
                        <li>The conversation concludes with that same 1-10 scale, so voters say aloud and hear themselves say if they've changed their minds.</li>
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
                      </FactCardList>
                    </FactCard>

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
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card className="border-green-200 bg-green-50">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2">
                            <div className="p-1 bg-green-500 rounded-full">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-green-800">Story Dos</h3>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-green-800">Share specific, personal details that create emotional connection</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-green-800">Focus on how the issue affects people you care about</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-green-800">Use everyday language that anyone can understand</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-green-800">Show vulnerability and authentic emotion</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-red-200 bg-red-50">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2">
                            <div className="p-1 bg-red-500 rounded-full">
                              <X className="h-4 w-4 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-red-800">Story Don'ts</h3>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-start gap-2">
                            <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-red-800">Use political jargon or partisan talking points</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-red-800">Make it about statistics or policy details</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-red-800">Tell a generic story that could apply to anyone</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-red-800">Rush through it or make it too long</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

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
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card className="border-blue-200 bg-blue-50">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2">
                            <div className="p-1 bg-blue-500 rounded-full">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-blue-800">Conversation Dos</h3>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-blue-800">Ask "Tell me about a time when..." to get stories</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-blue-800">Listen for emotional moments and explore them</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-blue-800">Give them space to think and process</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-blue-800">Let them make connections themselves</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-orange-200 bg-orange-50">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2">
                            <div className="p-1 bg-orange-500 rounded-full">
                              <X className="h-4 w-4 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-orange-800">Conversation Don'ts</h3>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-start gap-2">
                            <X className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-orange-800">Jump straight into political arguments</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <X className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-orange-800">Tell them how their story connects to the issue</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <X className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-orange-800">Rush them or fill silence immediately</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <X className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-orange-800">Judge or dismiss their experiences</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

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
