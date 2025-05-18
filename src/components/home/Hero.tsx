import React from 'react';
import { Button } from '@/components/ui/button';
const Hero = () => {
  return <section className="py-24 md:py-32 bg-background">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-dialogue-darkblue mb-8 font-light">
              Empathy Wins Elections.
            </h1>
            <p className="text-lg md:text-xl text-foreground mb-10 max-w-lg leading-relaxed">
              Persuasion happens not by talking and informing, but through creating a 
              shared space where we listen to those we disagree with. Type2Dialogue
              helps people create that space in their political conversations and
              whenever the chance arises to share our values with others.
            </p>
            <p className="text-xl font-serif italic text-dialogue-darkblue mb-12">
              Launching soon!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-dialogue-purple hover:bg-dialogue-darkblue text-white">
                Get Notified
              </Button>
              <Button size="lg" variant="outline" className="border-dialogue-purple text-dialogue-purple hover:bg-dialogue-blue">
                Learn More
              </Button>
            </div>
          </div>
          
          <div className="rounded-lg overflow-hidden shadow-xl animate-fade-in">
            <img src="/lovable-uploads/01c3e643-e913-481c-85db-4d3ca81a0318.png" alt="Two people having a conversation overlooking city at dusk" className="w-full h-full object-cover rounded-lg" />
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;