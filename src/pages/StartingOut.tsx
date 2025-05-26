import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Youtube } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import SliderCard from '@/components/ui/slider-card';
import PracticeCard from '@/components/learn/PracticeCard';
import FactCard from '@/components/learn/FactCard';
import ActivityCard from '@/components/learn/ActivityCard';
import Quiz from '@/components/learn/Quiz';

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
                    {/* Video Section */}
                    <Card className="border-dialogue-neutral hover:shadow-md transition-shadow overflow-hidden">
                      <CardHeader className="py-3 px-4 bg-dialogue-neutral/10">
                        <h3 className="text-lg font-medium">Watch: Deep Canvassing Explained</h3>
                      </CardHeader>
                      <CardContent className="py-4">
                        <div className="mb-4">
                          <AspectRatio ratio={16/9}>
                            <iframe
                              className="w-full h-full rounded-md"
                              src="https://www.youtube.com/embed/Ip_pjb5_fgA"
                              title="Deep Canvassing Video"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </AspectRatio>
                          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                            <Youtube className="h-4 w-4 text-red-600" />
                            <span>Watch this video to get an introduction to deep canvassing</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <FactCard topic="Definition and Purpose">
                      <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Canvassing</strong>: Talking to people to secure their vote or their support.</li>
                        <li><strong>Deep canvassing</strong>: A form of canvassing that involves longer, in-depth conversations in which the canvasser builds a connection with the voter before trying to persuade them on an issue.</li>
                      </ul>
                    </FactCard>

                    <FactCard topic="Characteristics of a deep canvassing conversation">
                      <ul className="list-disc pl-5 space-y-2 text-sm">
                        <li>Conversations last up to 20 minutes</li>
                        <li>Canvassers focus on building a connection by sharing stories about loved ones with the voter</li>
                        <li>Instead of explaining the issue to the voter, the canvasser asks the voter how the issue impacts their loves ones or people in their community and nonjudgmentally listens</li>
                        <li>Canvassers assume most opposers are persuadable, and most supporters could use a nudge</li>
                        <li>Canvassers can fall back to traditional canvassing when they feel there's no need to persuade a voter deeply</li>
                      </ul>
                    </FactCard>

                    <FactCard topic="Case studies">
                      <ul className="list-disc pl-5 space-y-2 text-sm">
                        <li>Deep canvassing campaigns have focused on gay rights, transgender rights, extending the social safety net to undocumented immigrants, midterm general election turnout and other issues</li>
                        <li>Rigorous studies show 3-8 point increase in support for an issue after a deep canvassing conversation.</li>
                        <li>Furthermore, the effect is long-lasting, seemingly for a year or more</li>
                      </ul>
                    </FactCard>

                    <FactCard topic="Persuasion Philosophy">
                      <ul className="list-disc pl-5 space-y-2 text-sm">
                        <li>Political persuasion is possible by creating a safe space to process issues, not by presenting more facts</li>
                        <li>If information flows like an electric current, deep canvassing focuses on lowering emotional resistance, not piling on more information</li>
                        <li>Canvassers always listen nonjudgmentally as voters process conflicting opinions, creating a safe space for cognitive dissonance and for the voter to change their mind</li>
                      </ul>
                    </FactCard>

                    <FactCard topic="Conversation flow">
                      <ul className="list-disc pl-5 space-y-2 text-sm">
                        <li>People stay on the phone to chat or keep the door open fairly often.</li>
                        <li>Canvassers get the voter to share their support or opposition to the issue, rating their support 1-10.</li>
                        <li>The canvasser then focuses the conversation on people the voter knows impacted by the issue, or stories of our loved ones more generally. The canvasser often shares a vulnerable story about one of their own loved ones.</li>
                        <li>The canvasser only brings up issues and politics after they and the voter are opening up to each other. They then focus on nonjudgmental listening as the voter processes the issue.</li>
                        <li>The conversation concludes with that same 1-10 scale, so voters say aloud and hear themselves say if they've changed their minds.</li>
                      </ul>
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

                {/* Activity 2: Learning to talk about someone we love */}
                <ActivityCard
                  id="story"
                  title="Learning to talk about someone we love"
                  description="Learn to practice vulnerability with the voter by telling your story"
                >
                  <p className="mb-6">Active listening is more than just hearing words—it's about understanding the meaning and emotion behind them. This activity covers techniques for demonstrating that you truly understand what someone is saying before responding.</p>
                  
                  <Quiz 
                    questions={[
                      {
                        id: 'story_q1',
                        text: 'Sharing personal stories about loved ones helps create emotional connection with voters.',
                        correctAnswer: true
                      },
                      {
                        id: 'story_q2',
                        text: 'You should only share positive stories about your loved ones, never any struggles or challenges.',
                        correctAnswer: false
                      }
                    ]}
                    title="Quiz"
                    description="Test your understanding of sharing personal stories."
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
