
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Learn = () => {
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
