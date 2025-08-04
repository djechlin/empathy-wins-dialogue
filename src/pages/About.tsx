import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/ui/card';
import { Button } from '@/ui/button';
import { ExternalLink } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-dialogue-blue/5">
      <Navbar />

      <main className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          {/* About Daniel Section */}
          <Card className="mb-12">
            <CardContent className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-6 font-heading">About Daniel</h1>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  Daniel is a software engineer who built and sold Unroll.me as part of the original five-person team, later working on
                  fullstack development and infrastructure at Google and MongoDB. He is an experienced organizer in deep canvassing and is
                  interested in the role of empathy and vulnerability in persuasion and developing AI-based tools to improve organizing.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 font-heading">Get in Touch</h2>
              <p className="text-gray-600 mb-6">Interested in collaborating on civic tech or research projects?</p>
              <Button
                onClick={() => (window.location.href = 'mailto:daniel@type2dialogue.com')}
                className="bg-dialogue-purple hover:bg-dialogue-purple/90"
              >
                Contact Daniel
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
