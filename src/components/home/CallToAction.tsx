
import React from 'react';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';

const CallToAction = () => {
  return (
    <section className="py-16">
      <div className="container-custom">
        <Card className="bg-dialogue-darkblue text-white rounded-xl overflow-hidden shadow-xl">
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
              <div className="lg:col-span-3">
                <h2 className="heading-lg mb-6">Ready to Transform Political Conversations?</h2>
                <p className="text-lg opacity-90 mb-6 max-w-lg">
                  Join type2dialogue today and be part of a movement creating meaningful political 
                  dialogue that bridges divides and builds electoral success.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className="bg-white text-dialogue-darkblue hover:bg-dialogue-blue transition-colors"
                  >
                    Start a Dialogue
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-white border-white hover:bg-dialogue-purple hover:border-dialogue-purple transition-colors"
                  >
                    Join Training
                  </Button>
                </div>
              </div>
              <div className="lg:col-span-2">
                <div className="bg-white p-6 rounded-lg shadow-inner">
                  <h3 className="font-heading font-semibold text-dialogue-darkblue mb-4 text-xl">
                    Join Our Newsletter
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Get weekly insights on bridging political divides and building electoral success.
                  </p>
                  <div className="space-y-4">
                    <input 
                      type="email" 
                      placeholder="Your email address" 
                      className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-dialogue-purple"
                    />
                    <Button className="w-full bg-dialogue-purple hover:bg-dialogue-darkblue">
                      Subscribe
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        <div className="mt-16 text-center">
          <h3 className="heading-sm mb-6 text-dialogue-darkblue">Trusted by Organizations Nationwide</h3>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-70">
            <div className="w-32 h-12 bg-gray-300 rounded flex items-center justify-center">Partner 1</div>
            <div className="w-32 h-12 bg-gray-300 rounded flex items-center justify-center">Partner 2</div>
            <div className="w-32 h-12 bg-gray-300 rounded flex items-center justify-center">Partner 3</div>
            <div className="w-32 h-12 bg-gray-300 rounded flex items-center justify-center">Partner 4</div>
            <div className="w-32 h-12 bg-gray-300 rounded flex items-center justify-center">Partner 5</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
