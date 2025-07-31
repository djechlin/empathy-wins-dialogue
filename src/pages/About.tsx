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
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 font-heading">Type2Dialogue</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Building AI-powered civic technology tools to strengthen democratic participation 
              and improve political discourse through empathetic conversation training.
            </p>
          </div>

          {/* About Section */}
          <Card className="mb-12">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-heading">Our Mission</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  Type2Dialogue focuses on developing innovative civic technology tools that help bridge political divides. 
                  Our flagship platform uses AI-powered voice technology to train political organizers and canvassers in 
                  deep canvassing techniques - an evidence-based approach to changing minds through empathetic conversation.
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Traditional canvassing often relies on surface-level interactions that fail to create meaningful change. 
                  Our technology enables realistic roleplay scenarios with AI feedback, allowing organizers to practice 
                  difficult conversations in a safe environment before engaging with real voters.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We believe technology should bring people together rather than drive them apart. Our tools are designed 
                  to strengthen democratic institutions by improving how we talk to each other about the issues that matter most.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Projects Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 font-heading">Our Tools</h2>
            <div className="grid gap-6">
              {projects.map((project, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-dialogue-purple">
                          {project.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                          <span className="text-sm text-dialogue-purple font-medium">{project.status}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{project.tech}</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => project.link.startsWith('http') ? window.open(project.link, '_blank') : window.location.href = project.link}
                      >
                        {project.link.startsWith('http') ? 'Visit Site' : 'Try Demo'}
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Research & Writing Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 font-heading">Research & Insights</h2>
            <div className="grid gap-4">
              {writings.map((post, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                        <p className="text-gray-600 text-sm">{post.description}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => window.location.href = post.link}
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 font-heading">Partner With Us</h2>
              <p className="text-gray-600 mb-6">
                Interested in using our civic technology tools for your organization or learning more about our approach? 
                Let's start a conversation.
              </p>
              <Button 
                onClick={() => window.location.href = 'mailto:daniel@type2dialogue.com'}
                className="bg-dialogue-purple hover:bg-dialogue-purple/90"
              >
                Get in Touch
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
