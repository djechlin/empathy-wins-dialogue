
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LearningCards from '@/components/learn/LearningCards';

const Learn = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container-custom py-12">
          <h1 className="heading-lg text-dialogue-darkblue mb-8">Learn to Have Better Political Conversations</h1>
          <LearningCards />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Learn;
