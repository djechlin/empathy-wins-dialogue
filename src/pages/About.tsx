import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/ui/card';
import { Button } from '@/ui/button';
import { ExternalLink, MessageCircle, Code, Users, FileText, Vote } from 'lucide-react';

const About = () => {
  const projects = [
    {
      title: "Type2Dialogue",
      description: "AI-powered deep canvassing training platform for improving political discourse and election efficacy.",
      tech: "React, TypeScript, Supabase, Hume AI",
      link: "https://type2dialogue.com",
      icon: <MessageCircle className="w-6 h-6" />,
      status: "Live"
    },
    {
      title: "Political Conversation Training",
      description: "Voice-based roleplay system with AI feedback for training political canvassers in empathetic dialogue techniques.",
      tech: "AI Voice Agents, Edge Functions",
      link: "/challenge",
      icon: <Users className="w-6 h-6" />,
      status: "Beta"
    }
  ];

  const writings = [
    {
      title: "Cognitive Dissonance in Political Dialogue",
      description: "Understanding how cognitive dissonance affects political conversations and voter persuasion.",
      link: "/blog/cognitive-dissonance"
    },
    {
      title: "The Type 2 Dialogue Approach",
      description: "A framework for empathetic political conversations that build bridges rather than walls.",
      link: "/blog/the-name-type-2-dialogue"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          {/* About Daniel Section */}
          <Card className="mb-12">
            <CardContent className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-6 font-heading">About Daniel</h1>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  Daniel is an experienced Google engineer and experienced organizer in deep canvassing. He is interested in the role of empathy and vulnerability in persuasion and developing AI-based tools to improve organizing.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 font-heading">Get in Touch</h2>
              <p className="text-gray-600 mb-6">
                Interested in learning more about type2dialogue or collaborating on civic technology projects? 
                Feel free to reach out.
              </p>
              <Button 
                onClick={() => window.location.href = 'mailto:daniel@type2dialogue.com'}
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
