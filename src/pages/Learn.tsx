
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { motion, AnimatePresence } from 'framer-motion';

const Learn = () => {
  const [openLessons, setOpenLessons] = useState<Record<string, boolean>>({
    lesson1: false,
    lesson2: false,
    lesson3: false
  });
  
  // Track open sections within Lesson 1
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    definition: false,
    characteristics: false,
    caseStudies: false,
    philosophy: false,
    flow: false
  });
  
  const toggleLesson = (lessonId: string) => {
    setOpenLessons(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }));
  };
  
  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Lesson data
  const lessons = [{
    id: 'lesson1',
    title: 'What is deep canvassing?',
    description: 'Learn how to recognize and appreciate different viewpoints in political conversations',
    content: 'This lesson focuses on understanding how different life experiences and values shape political views. You\'ll learn techniques to recognize perspectives different from your own and why this is crucial for productive dialogue.',
    sections: [
      {
        id: 'definition',
        title: 'What is deep canvassing?',
        content: [
          '**Canvassing**: Talking to people to secure their vote or their support.',
          '**Deep canvassing**: A form of canvassing that involves longer, in-depth conversations in which the canvasser builds a connection with the voter before trying to persuade them on an issue.'
        ]
      },
      {
        id: 'characteristics',
        title: 'Characteristics of a deep canvassing conversation',
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
        title: 'Case studies',
        content: [
          'Deep canvassing campaigns have focused on gay rights, transgender rights, extending the social safety net to undocumented immigrants, midterm general election turnout and other issues',
          'Rigorous studies show 3-8 point increase in support for an issue after a deep canvassing conversation.',
          'Furthermore, the effect is long-lasting, seemingly for a year or more'
        ]
      },
      {
        id: 'philosophy',
        title: 'Persuasion Philosophy',
        content: [
          'Political persuasion is possible by creating a safe space to process issues, not by presenting more facts',
          'If information flows like an electric current, deep canvassing focuses on lowering emotional resistance, not piling on more information',
          'Canvassers always listen nonjudgmentally as voters process conflicting opinions, creating a safe space for cognitive dissonance and for the voter to change their mind'
        ]
      },
      {
        id: 'flow',
        title: 'The flow of a deep canvassing conversation',
        content: [
          'People stay on the phone to chat or keep the door open fairly often.',
          'Canvassers get the voter to share their support or opposition to the issue, rating their support 1-10.',
          'The canvasser then focuses the conversation on people the voter knows impacted by the issue, or stories of our loved ones more generally. The canvasser often shares a vulnerable story about one of their own loved ones.',
          'The canvasser only brings up issues and politics after they and the voter are opening up to each other. They then focus on nonjudgmental listening as the voter processes the issue.',
          'The conversation concludes with that same 1-10 scale, so voters say aloud and hear themselves say if they\'ve changed their minds.'
        ]
      }
    ]
  }, {
    id: 'lesson2',
    title: 'Active Listening',
    description: 'Master the art of truly hearing others during challenging political discussions',
    content: 'Active listening is more than just hearing words—it\'s about understanding the meaning and emotion behind them. This lesson covers techniques for demonstrating that you truly understand what someone is saying before responding.'
  }, {
    id: 'lesson3',
    title: 'Finding Common Ground',
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
          
          {/* Lessons Section */}
          <div className="max-w-6xl mx-auto mb-16">
            <h2 className="text-2xl font-bold text-dialogue-darkblue mb-6 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-dialogue-purple" />
              Lessons
            </h2>
            
            <div className="space-y-6">
              {lessons.map(lesson => (
                <Card 
                  key={lesson.id} 
                  className="border-dialogue-neutral hover:shadow-sm transition-shadow cursor-pointer"
                  onClick={() => toggleLesson(lesson.id)}
                >
                  <Collapsible open={openLessons[lesson.id]} onOpenChange={() => toggleLesson(lesson.id)}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xl">
                          Lesson {lesson.id.slice(-1)}: {lesson.title}
                        </CardTitle>
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
                                {/* If this is lesson 1, render the detailed content with collapsible sections */}
                                {lesson.id === 'lesson1' && lesson.sections ? (
                                  <div className="space-y-4">
                                    {lesson.sections.map((section) => (
                                      <Card 
                                        key={section.id} 
                                        className="border-dialogue-neutral hover:shadow-md transition-shadow overflow-hidden"
                                      >
                                        <CardHeader 
                                          className="py-3 px-4 bg-dialogue-neutral/10 cursor-pointer" 
                                          onClick={(e) => {
                                            e.stopPropagation(); // Prevent event from bubbling to parent card
                                            toggleSection(section.id);
                                          }}
                                        >
                                          <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-medium">{section.title}</h3>
                                            <motion.div 
                                              animate={{ rotate: openSections[section.id] ? -180 : 0 }}
                                              transition={{ duration: 0.3, ease: "easeInOut" }}
                                            >
                                              <ChevronDown className="h-4 w-4 text-dialogue-purple" />
                                            </motion.div>
                                          </div>
                                        </CardHeader>
                                        <AnimatePresence mode="wait" initial={false}>
                                          {openSections[section.id] && (
                                            <motion.div
                                              initial={{ opacity: 0, height: 0 }}
                                              animate={{ opacity: 1, height: "auto" }}
                                              exit={{ opacity: 0, height: 0 }}
                                              transition={{ duration: 0.3, ease: "easeInOut" }}
                                            >
                                              <CardContent className="py-4">
                                                <ul className="list-disc pl-5 space-y-2">
                                                  {section.content.map((item, idx) => (
                                                    <li key={idx} className="text-sm" dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                                  ))}
                                                </ul>
                                              </CardContent>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </Card>
                                    ))}
                                  </div>
                                ) : (
                                  <p>{lesson.content}</p>
                                )}
                                
                                <motion.div 
                                  initial={{ opacity: 0 }} 
                                  animate={{ opacity: 1 }} 
                                  exit={{ opacity: 0 }} 
                                  transition={{ delay: 0.2, duration: 0.3 }}
                                  className="bg-dialogue-neutral p-4 rounded-md my-4 border-l-4 border-dialogue-purple"
                                >
                                  <p className="font-semibold">Key concept:</p>
                                  <p className="text-muted-foreground">
                                    {lesson.id === 'lesson1' ? 
                                      'Deep canvassing creates connections through vulnerability and nonjudgmental listening to achieve long-lasting persuasion.' : 
                                      'An important takeaway from this lesson.'}
                                  </p>
                                </motion.div>
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
