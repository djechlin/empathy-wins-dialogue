
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LoveList from '@/components/buildstory/LoveList';

const BuildStory = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container-custom py-12">
          <div className="max-w-3xl mx-auto mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-dialogue-darkblue mb-4">
              Build Your Story
            </h1>
            <p className="text-muted-foreground mb-6">
              When we vulnerably share our story, the voter opens up to us as well. These exercises will help you craft an authentic narrative.
            </p>
          </div>
          
          {/* Episodes Section */}
          <div className="mb-16">
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
