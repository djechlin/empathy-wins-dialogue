
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LoveList from '@/components/buildstory/LoveList';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const BuildStory = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-muted/30">
        <div className="container-custom py-12">
          <div className="max-w-3xl mx-auto mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-dialogue-darkblue mb-4">
              Build Your Story
            </h1>
          </div>
          
          {/* Introduction Card */}
          <Card className="mb-8 border-dialogue-neutral bg-white shadow-sm max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-dialogue-darkblue">Your Personal Narrative</CardTitle>
              <CardDescription className="text-muted-foreground text-base">
                When we vulnerably share our story, the voter opens up to us as well. These exercises will help you craft an authentic narrative.
              </CardDescription>
            </CardHeader>
          </Card>
          
          {/* Episodes Section */}
          <div className="mb-16 max-w-3xl mx-auto">
            <h2 className="font-heading text-2xl font-semibold text-dialogue-darkblue mb-6">
              Episode 1: The Love List
            </h2>
            <LoveList />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BuildStory;
