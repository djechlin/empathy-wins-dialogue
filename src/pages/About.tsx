import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/ui/card';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-8">About</h1>

              <div className="prose prose-lg max-w-none">
                <p className="text-lg leading-relaxed">
                  Type2Dialogue is a startup founded by Daniel Echlin for the purpose of improving political discourse. 
                  Our present focus is improving the efficacy of the canvassing experience, primarily by training canvassers 
                  to use deep canvassing techniques. The training makes use of AI to implement a voice roleplay and generate 
                  detailed feedback, a capability that did not exist a few years ago and enables us to train canvassers 
                  anytime, anywhere.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;