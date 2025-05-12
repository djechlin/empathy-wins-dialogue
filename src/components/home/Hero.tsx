
import React from 'react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="heading-xl text-dialogue-darkblue mb-6">
              Building Bridges Through Empathetic Political Dialogue
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg">
              Helping people have meaningful political conversations that foster understanding, 
              build connections, and ultimately win elections through authentic engagement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-dialogue-purple hover:bg-dialogue-darkblue text-white"
              >
                Start a Dialogue
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-dialogue-purple text-dialogue-purple hover:bg-dialogue-blue"
              >
                How It Works
              </Button>
            </div>
          </div>
          
          <div className="rounded-lg overflow-hidden shadow-xl animate-fade-in">
            <img 
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80" 
              alt="People engaged in dialogue" 
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
