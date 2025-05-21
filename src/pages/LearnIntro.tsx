
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LearningCards from '@/components/learn/LearningCards';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, ChevronRight, BookCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LearnIntro = () => {
  const chapters = [
    {
      id: 'chapter1',
      title: 'Understanding Different Perspectives',
      description: 'Learn how to recognize and appreciate different viewpoints in political conversations',
      lessonsCount: 3,
      progress: 0
    },
    {
      id: 'chapter2',
      title: 'Active Listening Techniques',
      description: 'Master the art of truly hearing others during challenging political discussions',
      lessonsCount: 3,
      progress: 0
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container-custom py-12">
          <div className="max-w-3xl mx-auto mb-12">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link to="/learn" className="hover:text-dialogue-purple">Learn</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">Introduction</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-dialogue-darkblue mb-4">Learn - Intro</h1>
            <p className="text-muted-foreground mb-8">
              Complete this interactive learning module to develop practical skills for engaging in productive 
              political dialogue with friends, family, and colleagues.
            </p>
          </div>
          
          {/* Learning Assessment and Setup */}
          <div className="max-w-3xl mx-auto mb-16">
            <LearningCards />
          </div>
          
          {/* Chapter Cards Section */}
          <div className="max-w-4xl mx-auto mt-16 pt-8 border-t">
            <h2 className="text-2xl font-bold text-dialogue-darkblue mb-6 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-dialogue-purple" />
              Learning Chapters
            </h2>
            
            <p className="text-muted-foreground mb-8">
              After completing your initial assessment above, work through these structured learning chapters
              to develop your political conversation skills.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {chapters.map((chapter) => (
                <Card key={chapter.id} className="border-dialogue-neutral hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">
                      {chapter.title}
                    </CardTitle>
                    <CardDescription>
                      {chapter.lessonsCount} lessons
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6">
                      {chapter.description}
                    </p>
                    <Link to={`/learn/${chapter.id}`}>
                      <Button variant="outline" className="w-full mt-2 flex justify-between items-center">
                        <span>Start Chapter</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LearnIntro;
