import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/ui/tabs';
import { Button } from '@/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/ui/accordion';
import { BookOpen, BookCheck, ChevronRight, List, ListCheck } from 'lucide-react';
import { Progress } from '@/ui/progress';

const LearnChapter = () => {
  const { chapterId } = useParams();
  const [activeLesson, setActiveLesson] = useState('lesson1');
  const [progress, setProgress] = useState(0);

  // This would come from your database in a real app
  const chapterData = {
    id: 'chapter1',
    title: 'Understanding Different Perspectives',
    description: 'Learn how to recognize and appreciate different viewpoints in political conversations',
    lessons: [
      {
        id: 'lesson1',
        title: 'The Importance of Perspective Taking',
        description: 'Understanding why seeing other viewpoints matters',
        completed: false,
      },
      {
        id: 'lesson2',
        title: 'Identifying Value Differences',
        description: 'Recognizing the underlying values in opposing positions',
        completed: false,
      },
      {
        id: 'lesson3',
        title: 'Building Bridges Through Questions',
        description: 'Using thoughtful questions to connect across differences',
        completed: false,
      },
    ],
  };

  const handleLessonComplete = (lessonId: string) => {
    // Update progress (in a real app, this would persist to a database)
    const newProgress = Math.min(100, progress + 100 / chapterData.lessons.length);
    setProgress(newProgress);

    // Auto-advance to next lesson if available
    const currentIndex = chapterData.lessons.findIndex((lesson) => lesson.id === lessonId);
    if (currentIndex < chapterData.lessons.length - 1) {
      setActiveLesson(chapterData.lessons[currentIndex + 1].id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container-custom py-12">
          {/* Chapter Header */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <a href="/learn" className="hover:text-dialogue-purple">
                Learn
              </a>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">{chapterData.title}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-dialogue-darkblue mb-4">{chapterData.title}</h1>
            <p className="text-muted-foreground mb-6">{chapterData.description}</p>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm mb-2">
                <span>Chapter Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>

          {/* Chapter Content */}
          <div className="max-w-4xl mx-auto">
            <Tabs value={activeLesson} onValueChange={setActiveLesson}>
              <TabsList className="w-full grid grid-cols-3 mb-8">
                {chapterData.lessons.map((lesson) => (
                  <TabsTrigger key={lesson.id} value={lesson.id} className="flex items-center gap-2">
                    <span className="hidden sm:inline">Lesson {lesson.id.slice(-1)}: </span>
                    <span className="truncate">{lesson.title}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Lesson Contents */}
              {chapterData.lessons.map((lesson) => (
                <TabsContent key={lesson.id} value={lesson.id} className="space-y-8 animate-fade-in">
                  <div className="bg-white rounded-lg border p-6 shadow-sm">
                    <h2 className="text-2xl font-bold mb-4">
                      Lesson {lesson.id.slice(-1)}: {lesson.title}
                    </h2>
                    <p className="text-muted-foreground mb-6">{lesson.description}</p>

                    {/* Lesson Content Sections */}
                    <div className="space-y-6">
                      <section>
                        <h3 className="text-xl font-semibold mb-3">Key Concepts</h3>
                        <div className="prose max-w-none">
                          <p>
                            This section would contain the actual lesson content with text, images, and interactive elements. It would
                            explain the key concepts in detail.
                          </p>

                          <div className="bg-dialogue-neutral p-4 rounded-md my-4 border-l-4 border-dialogue-purple">
                            <p className="font-semibold">Remember:</p>
                            <p className="text-muted-foreground">
                              A key insight or important takeaway would go here to emphasize a crucial point from the lesson.
                            </p>
                          </div>
                        </div>
                      </section>

                      <section>
                        <h3 className="text-xl font-semibold flex items-center gap-2 mb-3">
                          <List className="h-5 w-5 text-dialogue-purple" />
                          Practice Exercises
                        </h3>

                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="exercise1">
                            <AccordionTrigger className="text-left">Exercise 1: Identifying Different Perspectives</AccordionTrigger>
                            <AccordionContent>
                              <div className="prose max-w-none">
                                <p>This would contain an interactive exercise for users to practice the concepts learned in this lesson.</p>
                                <div className="mt-4 p-4 bg-muted rounded-md">
                                  <p className="font-medium">Your task:</p>
                                  <p>Read the following scenario and identify the different perspectives presented.</p>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>

                          <AccordionItem value="exercise2">
                            <AccordionTrigger className="text-left">Exercise 2: Reflection Questions</AccordionTrigger>
                            <AccordionContent>
                              <div className="prose max-w-none">
                                <p>Reflection questions would go here to help users internalize the lesson material.</p>
                                <ul className="mt-2 space-y-2">
                                  <li>Question 1 about the lesson content?</li>
                                  <li>Question 2 about applying the concepts?</li>
                                  <li>Question 3 about personal experience?</li>
                                </ul>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </section>

                      <section>
                        <h3 className="text-xl font-semibold flex items-center gap-2 mb-3">
                          <ListCheck className="h-5 w-5 text-dialogue-purple" />
                          Key Takeaways
                        </h3>

                        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                          <li>First important takeaway from this lesson</li>
                          <li>Second important concept to remember</li>
                          <li>Third actionable insight to apply in conversations</li>
                        </ul>
                      </section>
                    </div>

                    {/* Complete Lesson Button */}
                    <div className="mt-8 pt-4 border-t">
                      <Button
                        onClick={() => handleLessonComplete(lesson.id)}
                        className="w-full sm:w-auto bg-dialogue-purple hover:bg-dialogue-darkblue"
                      >
                        <BookCheck className="mr-2 h-4 w-4" />
                        Complete Lesson {lesson.id.slice(-1)}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LearnChapter;
