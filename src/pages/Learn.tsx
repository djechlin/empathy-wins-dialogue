import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, ChevronRight, Users, Heart, Ear, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Learn = () => {
  const learningPaths = [
    {
      id: 'starting-out',
      title: 'Starting out',
      description: 'Learn the fundamentals of deep canvassing and practice with AI',
      icon: BookOpen,
      path: '/learn/starting-out',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'vulnerable-storytelling',
      title: 'Vulnerable storytelling',
      description: 'Master the art of sharing personal stories to build connection',
      icon: Heart,
      path: '/learn/vulnerable-storytelling',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      id: 'empathetic-listening',
      title: 'Eliciting the voter\'s story',
      description: 'Develop skills for drawing out personal experiences and values',
      icon: Ear,
      path: '/learn/empathetic-listening',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'when-to-keep-talking',
      title: 'When to keep talking',
      description: 'Learn to recognize moments for deeper conversation',
      icon: MessageCircle,
      path: '/learn/when-to-keep-talking',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container-custom py-12">
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-dialogue-darkblue mb-4">
              Learn Deep Canvassing
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Master the art of empathetic political conversations through structured learning paths. 
              Each module builds essential skills for meaningful dialogue.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {learningPaths.map((path) => {
                const IconComponent = path.icon;
                return (
                  <Card
                    key={path.id}
                    className="border-dialogue-neutral hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg ${path.bgColor}`}>
                          <IconComponent className={`h-6 w-6 ${path.color}`} />
                        </div>
                        <CardTitle className="text-xl">{path.title}</CardTitle>
                      </div>
                      <CardDescription className="text-base">
                        {path.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link to={path.path}>
                        <Button 
                          variant="outline" 
                          className="w-full flex justify-between items-center hover:bg-muted/50"
                        >
                          <span>Begin Learning</span>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="max-w-4xl mx-auto mt-16">
            <Card className="border-dialogue-neutral bg-dialogue-neutral/5">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Users className="h-5 w-5 text-dialogue-purple" />
                  Learning Path Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-dialogue-purple mt-2"></div>
                    <div>
                      <p className="font-medium">New to political conversations?</p>
                      <p className="text-sm text-muted-foreground">Start with "Starting out" to learn the fundamentals and practice with AI.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-dialogue-purple mt-2"></div>
                    <div>
                      <p className="font-medium">Want to build deeper connections?</p>
                      <p className="text-sm text-muted-foreground">Focus on "Vulnerable storytelling" and "Eliciting the voter's story" modules.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-dialogue-purple mt-2"></div>
                    <div>
                      <p className="font-medium">Looking to improve conversation flow?</p>
                      <p className="text-sm text-muted-foreground">"When to keep talking" will help you recognize key moments for deeper dialogue.</p>
                    </div>
                  </div>
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