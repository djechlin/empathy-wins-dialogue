
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Heart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import ActivityCard from '@/components/learn/ActivityCard';
import FactCard from '@/components/learn/FactCard';
import FactCardList from '@/components/learn/FactCardList';
import Quiz from '@/components/learn/Quiz';
import { LoveListWidget } from '@/components/voice/LoveListWidget';
import { HumeVoiceProvider } from '@/components/voice/HumeVoiceProvider';
import { HUME_PERSONAS } from '@/lib/scriptData';
import VideoCard from '@/components/learn/VideoCard';

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
                  Sharing your story
                </h1>
              </div>  
              <p className="text-muted-foreground text-lg">
                Learn to share a vulnerable 2 minute story with a voter in this lesson.
              </p>
            </div>

            <div className="space-y-8">
              <ActivityCard
                id="vulnerable-storytelling-intro"
                title="Qualities of a deep canvassing story"
                description=""
              >
                  <p className="text-muted-foreground">
                    When we speak of our loved ones, we communicate to the voter that we really are here
                    talking to them, first and foremost, because of the people in our lives. Voters often respond
                    with similar openness and share their own stories. Deep canvassers establish this two-way openness
                    before moving on to exploring the issue.
                  </p>

                  <FactCard topic="Key qualities of a deep canvassing story">
                    <FactCardList>
                      <li>Use the person's name and say that you love them</li>
                      <li>Share what makes them lovable and how they make you feel</li>
                      <li>Pause on a moment in time they were there for you</li>
                      <li>Now is the time to focus on relationships, not issues</li>
                    </FactCardList>
                  </FactCard>

                <Quiz
                  questions={[
                    {
                      id: 'storytelling_q1',
                      text: 'When sharing vulnerable stories, you should focus on relationships before discussing political issues.',
                      correctAnswer: true
                    },
                    {
                      id: 'storytelling_q2',
                      text: 'The main goal of vulnerable storytelling is to win the political argument.',
                      correctAnswer: false
                    }
                  ]}
                  title="Quiz"
                  description="Test your understanding of vulnerable storytelling principles."
                />
              </ActivityCard>

              <ActivityCard
                id="exercise-love-list"
                title="Exercise: the love list"
                description="Practice talking about things you love to build your vulnerable storytelling skills"
                defaultOpen={false}
              >
                    <p className="text-muted-foreground">
                      In this exercise, you'll practice talking about people, pets, things, and experiences you love.
                      The AI will listen and capture what you mention, building your personal love list that you can
                      use in future conversations.
                    </p>

                         <VideoCard 
          title="Example love list"
          description="how to example love list"
          url="https://www.youtube.com/embed/zOgCdDJYF4U"
        />


                      <LoveListWidget />
              </ActivityCard>

              <ActivityCard
                id="example-story"
                title="Example Story"
                description="A sample vulnerable story about healthcare"
              >
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

                  <FactCard topic="Why this works">
                    <p className="text-sm text-muted-foreground">
                      Personal relationship (daughter), specific moment (phone call),
                      genuine emotion (helplessness, fear), and connects to broader values (healthcare access).
                    </p>
                  </FactCard>
                </div>

                <Quiz
                  questions={[
                    {
                      id: 'example_q1',
                      text: 'Effective vulnerable stories should include specific moments and genuine emotions.',
                      correctAnswer: true
                    },
                    {
                      id: 'example_q2',
                      text: 'When telling stories, you should avoid mentioning specific details to keep them general.',
                      correctAnswer: false
                    }
                  ]}
                  title="Example Analysis Quiz"
                  description="Test your understanding of what makes an effective vulnerable story."
                />
              </ActivityCard>

              <ActivityCard
                id="practice-exercise"
                title="Practice Exercise"
                description="Develop your own vulnerable story"
              >
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Think of someone you love who has been affected by a political issue. This could be healthcare,
                    education, housing, immigration, or any other topic. Write a 2-3 sentence story following
                    the structure above.
                  </p>

                  <FactCard topic="Remember">
                    <p className="text-muted-foreground">
                      The goal isn't to win an argument, but to show the voter that you care about real people
                      and real consequences. Your vulnerability gives them permission to be vulnerable too.
                    </p>
                  </FactCard>
                </div>

                <Quiz
                  questions={[
                    {
                      id: 'practice_q1',
                      text: 'The primary goal of vulnerable storytelling is to give voters permission to be vulnerable too.',
                      correctAnswer: true
                    },
                    {
                      id: 'practice_q2',
                      text: 'You should only share stories about political issues that directly affect you personally.',
                      correctAnswer: false
                    }
                  ]}
                  title="Practice Exercise Quiz"
                  description="Test your understanding of the practice exercise principles."
                />
              </ActivityCard>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VulnerableStorytelling;
