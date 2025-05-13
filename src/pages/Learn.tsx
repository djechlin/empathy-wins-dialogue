
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LearningCards from '@/components/learn/LearningCards';

const Learn = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container-custom py-12">
          <div className="max-w-3xl mx-auto mb-12">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-dialogue-darkblue mb-4">Learn to Have Better Political Conversations</h1>
            <p className="text-muted-foreground mb-8">
              Complete this interactive learning module to develop practical skills for engaging in productive 
              political dialogue with friends, family, and colleagues.
            </p>
          </div>
          <LearningCards />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Learn;
