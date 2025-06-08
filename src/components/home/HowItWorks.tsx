
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { MessageCircle, Users, TrendingUp } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <MessageCircle className="h-10 w-10 text-dialogue-purple" />,
      title: 'Structured Conversation',
      description: 'Follow our proven dialogue framework designed to foster understanding rather than debate.'
    },
    {
      icon: <Users className="h-10 w-10 text-dialogue-purple" />,
      title: 'Empathetic Listening',
      description: 'Practice active listening to truly understand different perspectives without judgment.'
    },
    {
      icon: <TrendingUp className="h-10 w-10 text-dialogue-purple" />,
      title: 'Electoral Impact',
      description: 'Turn understanding into action by connecting dialogue to electoral outcomes that matter.'
    }
  ];

  return (
    <section className="py-16 bg-dialogue-neutral" id="how-it-works">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-lg mb-4">How type2dialogue Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our proven methodology breaks down barriers and creates space for genuine political dialogue,
            transforming how we engage with differing viewpoints.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
              <Card className="dialogue-card h-full flex flex-col">
                <CardHeader className="pb-4">
                  <div className="mb-4">{step.icon}</div>
                  <CardTitle className="text-dialogue-darkblue">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="text-base">{step.description}</CardDescription>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <iframe 
            className="rounded-lg shadow-lg max-w-3xl mx-auto w-full aspect-video"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
            title="How type2dialogue transforms political conversations" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
