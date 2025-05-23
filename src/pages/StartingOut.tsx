import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, ChevronRight, ChevronDown, Youtube, Check, X, CheckCircle2, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { motion, AnimatePresence } from 'framer-motion';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Toggle } from '@/components/ui/toggle';
import { toast } from '@/components/ui/sonner';
import PracticeCard from '@/components/learn/PracticeCard';

const Learn = () => {
  const [openLessons, setOpenLessons] = useState<Record<string, boolean>>({
    lesson1: false,
    lesson2: false,
    lesson3: false
  });

  // Track quiz answers
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string | null>>({
    question1: null,
    question2: null
  });

  const toggleLesson = (lessonId: string) => {
    setOpenLessons(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }));
  };

  const handleQuizToggle = (question: string, value: string) => {
    setQuizAnswers(prev => {
      // If the same value is already selected, keep it (don't allow toggling off)
      if (prev[question] === value) {
        return prev;
      }

      // Set to the new value
      return {
        ...prev,
        [question]: value
      };
    });
  };

  const resetQuiz = () => {
    setQuizAnswers({
      question1: null,
      question2: null
    });
  };

  // Check if an answer is correct
  const isCorrectAnswer = (questionId: string, answer: string | null): boolean => {
    if (answer === null) return false;

    const correctAnswers: Record<string, string> = {
      question1: "true",
      question2: "true"
    };

    return answer === correctAnswers[questionId];
  };

  // Check if all questions in a lesson are answered correctly
  const isLessonComplete = (lessonId: string): boolean => {
    if (lessonId !== 'lesson1') return false; // Only lesson1 has a quiz for now

    // Check if all questions are answered correctly
    return isCorrectAnswer('question1', quizAnswers.question1) &&
           isCorrectAnswer('question2', quizAnswers.question2);
  };

type Lesson = {
  id: string;
  lessonTitle: string;
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

type QuizQuestion = {
  id: string;
  text: string;
  correctAnswer: boolean;
}

  // Lesson data
  const lessons: Lesson[] = [{
    id: 'lesson1',
    lessonTitle: 'What is deep canvassing?',
    description: 'Learn how to recognize and appreciate different viewpoints in political conversations',
    content: 'This lesson focuses on understanding how different life experiences and values shape political views. You\'ll learn techniques to recognize perspectives different from your own and why this is crucial for productive dialogue.',
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
    lessonTitle: 'Practice deep canvassing',
    description: 'Start a phone call with a virtual voice assistant who will roleplay the voter',
    content: 'Practice your deep canvassing skills in a safe environment with our AI voice assistant. This interactive experience allows you to apply what you\'ve learned in real conversation scenarios.'
  }, {
    id: 'lesson2',
    lessonTitle: 'Learning to talk about someone we love',
    description: 'Learn to practice vulnerability with the voter by telling your story',
    content: 'Active listening is more than just hearing words—it\'s about understanding the meaning and emotion behind them. This lesson covers techniques for demonstrating that you truly understand what someone is saying before responding.'
  }, {
    id: 'lesson3',
    lessonTitle: 'Telling our story about a loved one',
    description: 'Learn to practice vulnerability with the voter by telling your story',
    content: 'Active listening is more than just hearing words—it\'s about understanding the meaning and emotion behind them. This lesson covers techniques for demonstrating that you truly understand what someone is saying before responding.'
  }, {
    id: 'lesson4',
    lessonTitle: 'Finding Common Ground',
    description: 'Discover strategies for identifying shared values despite political differences',
    content: 'Even in heated political disagreements, common values often exist beneath the surface. This lesson teaches methods for identifying shared concerns and building conversations on areas of agreement rather than division.'
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

          <div className="max-w-6xl mx-auto mb-16">
            <div className="space-y-6">
              {lessons.map(lesson => (
                <Card
                  key={lesson.id}
                  className={`border-dialogue-neutral hover:shadow-sm transition-shadow cursor-pointer ${
                    isLessonComplete(lesson.id) ? 'border-dialogue-darkblue border-2' : ''
                  }`}
                  onClick={() => toggleLesson(lesson.id)}
                >
                  <Collapsible open={openLessons[lesson.id]} onOpenChange={() => toggleLesson(lesson.id)}>
                    <CardHeader className="pt-3 pb-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-xl">
                            {lesson.lessonTitle}
                          </CardTitle>
                          {isLessonComplete(lesson.id) && (
                            <div className="flex items-center bg-dialogue-purple text-white px-2 py-1 rounded-full gap-1">
                              <CheckCircle2 className="h-4 w-4" />
                              <span className="text-xs font-medium">Complete</span>
                            </div>
                          )}
                        </div>
                        <div className="p-2 hover:bg-muted rounded-full transition-colors">
                          <motion.div animate={{
                            rotate: openLessons[lesson.id] ? -180 : 0
                          }} transition={{
                            duration: 0.3,
                            ease: "easeInOut"
                          }}>
                            <ChevronDown className="h-5 w-5" />
                          </motion.div>
                        </div>
                      </div>
                      <CardDescription>
                        {lesson.description}
                      </CardDescription>
                      {lesson.id === 'practice' && (
                        <div className="flex items-center gap-2 mt-2 text-dialogue-purple">
                          <Phone className="h-4 w-4" />
                          <span className="text-sm font-medium">Interactive voice practice</span>
                        </div>
                      )}
                    </CardHeader>

                    <AnimatePresence mode="wait" initial={false}>
                      {openLessons[lesson.id] && (
                        <CollapsibleContent forceMount>
                          <motion.div
                            key={`content-${lesson.id}`}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            onClick={(e) => e.stopPropagation()} // Prevent clicks inside content from toggling
                          >
                            <CardContent>
                              <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 20, opacity: 0 }}
                                transition={{ delay: 0.1, duration: 0.3 }}
                                className="prose max-w-none mb-4"
                              >
                                {/* If this is lesson 1, render the detailed content with sections */}
                                {lesson.id === 'lesson1' && lesson.sections ? (
                                  <div className="space-y-4">
                                    {lesson.sections.map((section) => (
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
                                          ) : section.isQuiz ? (
                                            <div className="space-y-6">
                                              <div className="text-sm text-muted-foreground mb-4">
                                                Select your answers to test your knowledge of deep canvassing concepts.
                                              </div>

                                              <div className="space-y-8">
                                                {section.questions.map((question) => (
                                                  <div key={question.id} className="space-y-3">
                                                    <div className="font-medium">{question.text}</div>

                                                    <div className="flex flex-wrap gap-3">
                                                      <div className="flex items-center gap-2">
                                                        <Toggle
                                                          pressed={quizAnswers[question.id] === "true"}
                                                          onPressedChange={() => handleQuizToggle(question.id, "true")}
                                                          variant="outline"
                                                          className={`border ${
                                                            quizAnswers[question.id] === "true"
                                                              ? isCorrectAnswer(question.id, "true")
                                                                ? "bg-green-100 border-green-500 text-green-700"
                                                                : "bg-red-100 border-red-500 text-red-700"
                                                              : ""
                                                          }`}
                                                        >
                                                          <span>True</span>
                                                          {quizAnswers[question.id] === "true" && (
                                                            isCorrectAnswer(question.id, "true")
                                                              ? <Check className="ml-2 h-4 w-4 text-green-600" />
                                                              : <X className="ml-2 h-4 w-4 text-red-600" />
                                                          )}
                                                        </Toggle>
                                                      </div>

                                                      <div className="flex items-center gap-2">
                                                        <Toggle
                                                          pressed={quizAnswers[question.id] === "false"}
                                                          onPressedChange={() => handleQuizToggle(question.id, "false")}
                                                          variant="outline"
                                                          className={`border ${
                                                            quizAnswers[question.id] === "false"
                                                              ? isCorrectAnswer(question.id, "false")
                                                                ? "bg-green-100 border-green-500 text-green-700"
                                                                : "bg-red-100 border-red-500 text-red-700"
                                                              : ""
                                                          }`}
                                                        >
                                                          <span>False</span>
                                                          {quizAnswers[question.id] === "false" && (
                                                            isCorrectAnswer(question.id, "false")
                                                              ? <Check className="ml-2 h-4 w-4 text-green-600" />
                                                              : <X className="ml-2 h-4 w-4 text-red-600" />
                                                          )}
                                                        </Toggle>
                                                      </div>
                                                    </div>

                                                    {quizAnswers[question.id] !== null && !isCorrectAnswer(question.id, quizAnswers[question.id]) && (
                                                      <div className="text-sm p-2 bg-red-50 text-red-800 rounded-md">
                                                        <p>The correct answer is: {question.correctAnswer ? "True" : "False"}</p>
                                                      </div>
                                                    )}
                                                  </div>
                                                ))}
                                              </div>

                                              {isLessonComplete(lesson.id) && (
                                                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-center gap-3">
                                                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                                                  <div>
                                                    <h4 className="font-medium text-green-800">Lesson Complete!</h4>
                                                    <p className="text-sm text-green-700">
                                                      You've successfully completed this lesson's knowledge check.
                                                    </p>
                                                  </div>
                                                </div>
                                              )}

                                              <div className="flex justify-end pt-4 border-t">
                                                <Button
                                                  onClick={resetQuiz}
                                                  variant="outline"
                                                  size="sm"
                                                  className="flex items-center gap-1"
                                                >
                                                  <X className="h-4 w-4" />
                                                  Reset Answers
                                                </Button>
                                              </div>
                                            </div>
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
                                ) : lesson.id === 'practice' ? (
                                  <PracticeCard isOpen={openLessons[lesson.id]} />
                                ) : (
                                  <p>{lesson.content}</p>
                                )}
                              </motion.div>

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
                            </CardContent>
                          </motion.div>
                        </CollapsibleContent>
                      )}
                    </AnimatePresence>
                  </Collapsible>
                </Card>
              ))}
            </div>
          </div>

          {/* Learning Paths */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-dialogue-neutral hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">
                  Introduction to Political Dialogue
                </CardTitle>
                <CardDescription>
                  Assessment & learning fundamentals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Start with a personalized assessment and learn the core concepts of effective political conversation.
                </p>
                <Link to="/learn-intro">
                  <Button variant="outline" className="w-full mt-2 flex justify-between items-center">
                    <span>Begin Introduction</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-dialogue-neutral hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">
                  Chapter Learning
                </CardTitle>
                <CardDescription>
                  Structured learning modules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Dive into focused learning chapters covering specific dialogue skills and techniques.
                </p>
                <div className="space-y-3">
                  <Link to="/learn/chapter1">
                    <Button variant="outline" className="w-full flex justify-between items-center">
                      <span>Chapter 1: Understanding Perspectives</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/learn/chapter2">
                    <Button variant="outline" className="w-full flex justify-between items-center">
                      <span>Chapter 2: Active Listening</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/learn/chapter3">
                    <Button variant="outline" className="w-full flex justify-between items-center">
                      <span>Chapter 3: Finding Common Ground</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>;
};

export default Learn;
