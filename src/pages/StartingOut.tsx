import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, Youtube, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import SliderCard from '@/components/ui/slider-card';
import PracticeCard from '@/components/learn/PracticeCard';
import Quiz, { QuizQuestion } from '@/components/learn/Quiz';
import ActivityCard from '@/components/learn/ActivityCard';

const Learn = () => {
  const [openactivities, setOpenactivities] = useState<Record<string, boolean>>({
    activity1: false,
    activity2: false,
    activity3: false
  });

  // Track activity completion
  const [activityCompletion, setactivityCompletion] = useState<Record<string, boolean>>({
    activity1: false
  });

  const toggleactivity = (activityId: string) => {
    setOpenactivities(prev => ({
      ...prev,
      [activityId]: !prev[activityId]
    }));
  };

  // Handle quiz completion
  const handleQuizComplete = (activityId: string, passed: boolean) => {
    setactivityCompletion(prev => ({
      ...prev,
      [activityId]: passed
    }));
  };

  // Check if a activity is complete
  const isactivityComplete = (activityId: string): boolean => {
    return activityCompletion[activityId] || false;
  };

type Activity = {
  id: string;
  activityTitle: string;
  description: string;
  content: string;
  sections?: Section[];
}

type Section = {
  id: string;
  sectionTitle: string;
  isVideo?: boolean;
  videoUrl?: string;
  isQuiz?: boolean;
  content?: string[];
  questions?: QuizQuestion[];
}

  // activity data
  const activities: Activity[] = [{
    id: 'activity1',
    activityTitle: 'What is deep canvassing?',
    description: 'Learn how to recognize and appreciate different viewpoints in political conversations',
    content: 'This activity focuses on understanding how different life experiences and values shape political views. You\'ll learn techniques to recognize perspectives different from your own and why this is crucial for productive dialogue.',
    sections: [
      {
        id: 'video',
        sectionTitle: 'Watch: Deep Canvassing Explained',
        content: [],
        isVideo: true,
        videoUrl: 'https://www.youtube.com/watch?v=Ip_pjb5_fgA'
      },
      {
        id: 'definition',
        sectionTitle: 'Definition and Purpose',
        content: [
          '**Canvassing**: Talking to people to secure their vote or their support.',
          '**Deep canvassing**: A form of canvassing that involves longer, in-depth conversations in which the canvasser builds a connection with the voter before trying to persuade them on an issue.'
        ]
      },
      {
        id: 'characteristics',
        sectionTitle: 'Characteristics of a deep canvassing conversation',
        content: [
          'Conversations last up to 20 minutes',
          'Canvassers focus on building a connection by sharing stories about loved ones with the voter',
          'Instead of explaining the issue to the voter, the canvasser asks the voter how the issue impacts their loves ones or people in their community and nonjudgmentally listens',
          'Canvassers assume most opposers are persuadable, and most supporters could use a nudge',
          'Canvassers can fall back to traditional canvassing when they feel there\'s no need to persuade a voter deeply'
        ]
      },
      {
        id: 'caseStudies',
        sectionTitle: 'Case studies',
        content: [
          'Deep canvassing campaigns have focused on gay rights, transgender rights, extending the social safety net to undocumented immigrants, midterm general election turnout and other issues',
          'Rigorous studies show 3-8 point increase in support for an issue after a deep canvassing conversation.',
          'Furthermore, the effect is long-lasting, seemingly for a year or more'
        ]
      },
      {
        id: 'philosophy',
        sectionTitle: 'Persuasion Philosophy',
        content: [
          'Political persuasion is possible by creating a safe space to process issues, not by presenting more facts',
          'If information flows like an electric current, deep canvassing focuses on lowering emotional resistance, not piling on more information',
          'Canvassers always listen nonjudgmentally as voters process conflicting opinions, creating a safe space for cognitive dissonance and for the voter to change their mind'
        ]
      },
      {
        id: 'flow',
        sectionTitle: 'Conversation flow',
        content: [
          'People stay on the phone to chat or keep the door open fairly often.',
          'Canvassers get the voter to share their support or opposition to the issue, rating their support 1-10.',
          'The canvasser then focuses the conversation on people the voter knows impacted by the issue, or stories of our loved ones more generally. The canvasser often shares a vulnerable story about one of their own loved ones.',
          'The canvasser only brings up issues and politics after they and the voter are opening up to each other. They then focus on nonjudgmental listening as the voter processes the issue.',
          'The conversation concludes with that same 1-10 scale, so voters say aloud and hear themselves say if they\'ve changed their minds.'
        ]
      },
      {
        id: 'quiz',
        sectionTitle: 'Quiz',
        isQuiz: true,
        questions: [
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
        ]
      }
    ]
  }, {
    id: 'practice',
    activityTitle: 'Practice deep canvassing',
    description: 'Start a phone call with a virtual voice assistant who will roleplay the voter',
    content: 'Practice your deep canvassing skills in a safe environment with our AI voice assistant. This interactive experience allows you to apply what you\'ve learned in real conversation scenarios.'
  }, {
    id: 'story',
    activityTitle: 'Learning to talk about someone we love',
    description: 'Learn to practice vulnerability with the voter by telling your story',
    content: 'Active listening is more than just hearing words—it\'s about understanding the meaning and emotion behind them. This activity covers techniques for demonstrating that you truly understand what someone is saying before responding.'
  }, {
    id: 'telling',
    activityTitle: 'Telling our story about a loved one',
    description: 'Learn to practice vulnerability with the voter by telling your story',
    content: 'Active listening is more than just hearing words—it\'s about understanding the meaning and emotion behind them. This activity covers techniques for demonstrating that you truly understand what someone is saying before responding.'
  }];

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
              title="How do you feel about deep canvassing?"
              question="I am interested in having vulnerable political conversations with voters with different perspectives than mine."
            />
          </div>

          <div className="max-w-6xl mx-auto mb-16">
            <div className="space-y-6">
              {activities.map(activity => (
                <ActivityCard
                  key={activity.id}
                  id={activity.id}
                  title={activity.activityTitle}
                  description={activity.description}
                  isOpen={openactivities[activity.id]}
                  isComplete={isactivityComplete(activity.id)}
                  onToggle={() => toggleactivity(activity.id)}
                  headerExtra={activity.id === 'practice' ? (
                    <div className="flex items-center gap-2 mt-2 text-dialogue-purple">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm font-medium">Interactive voice practice</span>
                    </div>
                  ) : undefined}
                >
                  {/* If this is activity 1, render the detailed content with sections */}
                  {activity.id === 'activity1' && activity.sections ? (
                    <div className="space-y-4">
                      {activity.sections.map((section) => (
                        <Card
                          key={section.id}
                          className="border-dialogue-neutral hover:shadow-md transition-shadow overflow-hidden"
                        >
                          <CardHeader className="py-3 px-4 bg-dialogue-neutral/10">
                            <h3 className="text-lg font-medium">{section.sectionTitle}</h3>
                          </CardHeader>
                          <CardContent className="py-4">
                            {section.isVideo ? (
                              <div className="mb-4">
                                <AspectRatio ratio={16/9}>
                                  <iframe
                                    className="w-full h-full rounded-md"
                                    src={`https://www.youtube.com/embed/${section.videoUrl.split('v=')[1]}`}
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
                            ) : section.isQuiz && section.questions ? (
                              <Quiz 
                                questions={section.questions}
                                title={section.sectionTitle}
                                description="Select your answers to test your knowledge of deep canvassing concepts."
                                onQuizComplete={(passed) => handleQuizComplete(activity.id, passed)}
                              />
                            ) : (
                              <ul className="list-disc pl-5 space-y-2">
                                {section.content.map((item, idx) => (
                                  <li key={idx} className="text-sm" dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                ))}
                              </ul>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : activity.id === 'practice' ? (
                    <PracticeCard isOpen={openactivities[activity.id]} />
                  ) : (
                    <p>{activity.content}</p>
                  )}

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    className="flex justify-end mt-4"
                  >
                    <Button variant="outline" className="flex items-center gap-2">
                      <span>Continue Learning</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </ActivityCard>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>;
};

export default Learn;
