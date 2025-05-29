
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
            <p className="text-muted-foreground mb-8">For this module, we'll focus on a hypothetical city ballot initiative to improve bus and subway service. The campaign is deploying deep canvassers to talk to people who are registered to vote, but who never vote in off-year local elections.

Do you think the canvasser and possible voters will get into arguments? Maybe there won't be heated partisan debates, but the the canvasser and voter genuinely disagree about the importance of voting. The canvasser must truly persuade the prospective voter to change their minds. Therefore, we can study the full deep canvass method just by learning how to persuade nonvoters in a local election.</p>
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
                {/* Real Conversation Examples - As Activity Card */}
                <ActivityCard
                  id="conversation-examples"
                  title="Real Deep Canvassing Conversations"
                  description="See how actual conversations unfold from first contact to successful persuasion. These examples show the power of personal stories and genuine listening."
                >
                  <ConversationFlow />
                </ActivityCard>

                <ActivityCard
                  id="activity1"
                  title="What is deep canvassing?"
                  description="Learn how to recognize and appreciate different viewpoints in political conversations"
                >
                  <div className="space-y-4 mb-6">
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
