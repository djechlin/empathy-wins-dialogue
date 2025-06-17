
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/home/Hero';
import CaseStudiesSection from '@/components/home/CaseStudiesSection';
import CampaignManagerSection from '@/components/home/CampaignManagerSection';
import CallToAction from '@/components/home/CallToAction';
import Footer from '@/components/layout/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <CaseStudiesSection />
        <CampaignManagerSection />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
