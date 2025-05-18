
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { motion, AnimatePresence } from 'framer-motion';

const Learn = () => {
  const [openLessons, setOpenLessons] = useState<Record<string, boolean>>({
    lesson1: false,
    lesson2: false,
    lesson3: false,
  });

  const toggleLesson = (lessonId: string) => {
    setOpenLessons(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }));
  };

  // Lesson data
  const lessons = [
    {
      id: 'lesson1',
      title: 'Understanding Perspectives',
      description: 'Learn how to recognize and appreciate different viewpoints in political conversations',
      content: 'This lesson focuses on understanding how different life experiences and values shape political views. You\'ll learn techniques to recognize perspectives different from your own and why this is crucial for productive dialogue.'
    },
    {
      id: 'lesson2',
      title: 'Active Listening',
      description: 'Master the art of truly hearing others during challenging political discussions',
      content: 'Active listening is more than just hearing words—it\'s about understanding the meaning and emotion behind them. This lesson covers techniques for demonstrating that you truly understand what someone is saying before responding.'
    },
    {
      id: 'lesson3',
      title: 'Finding Common Ground',
      description: 'Discover strategies for identifying shared values despite political differences',
      content: 'Even in heated political disagreements, common values often exist beneath the surface. This lesson teaches methods for identifying shared concerns and building conversations on areas of agreement rather than division.'
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container-custom py-12">
          <div className="max-w-3xl mx-auto mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-dialogue-darkblue mb-4">Learn</h1>
            <p className="text-muted-foreground mb-8">
              Welcome to the learning section. Explore our resources to develop skills for productive political dialogue.
            </p>
          </div>
          
          {/* Lessons Section */}
          <div className="max-w-6xl mx-auto mb-16">
            <h2 className="text-2xl font-bold text-dialogue-darkblue mb-6 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-dialogue-purple" />
              Lessons
            </h2>
            
            <div className="space-y-6">
              {lessons.map((lesson) => (
                <Card key={lesson.id} className="border-dialogue-neutral hover:shadow-sm transition-shadow">
                  <Collapsible open={openLessons[lesson.id]} onOpenChange={() => toggleLesson(lesson.id)}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xl">
                          Lesson {lesson.id.slice(-1)}: {lesson.title}
                        </CardTitle>
                        <CollapsibleTrigger className="p-2 hover:bg-muted rounded-full transition-colors">
                          {openLessons[lesson.id] ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </CollapsibleTrigger>
                      </div>
                      <CardDescription>
                        {lesson.description}
                      </CardDescription>
                    </CardHeader>
                    <AnimatePresence initial={false}>
                      {openLessons[lesson.id] && (
                        <CollapsibleContent asChild>
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <CardContent>
                              <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 20, opacity: 0 }}
                                transition={{ delay: 0.1, duration: 0.3 }}
                                className="prose max-w-none mb-4"
                              >
                                <p>{lesson.content}</p>
                                
                                <motion.div 
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  transition={{ delay: 0.2, duration: 0.3 }}
                                  className="bg-dialogue-neutral p-4 rounded-md my-4 border-l-4 border-dialogue-purple"
                                >
                                  <p className="font-semibold">Key concept:</p>
                                  <p className="text-muted-foreground">
                                    An important takeaway from this lesson.
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
    </div>
  );
};

export default Learn;
