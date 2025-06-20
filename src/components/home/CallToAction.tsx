import React from 'react';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { useNavigate } from 'react-router-dom';

const CallToAction = () => {
  const navigate = useNavigate();

  const handleStartChallenge = () => {
    navigate('/challenge');
  };

  return (
    <section className="py-16">
      <div className="container-custom">
        <Card className="bg-dialogue-darkblue text-white rounded-xl overflow-hidden shadow-xl">
          <div className="p-8 md:p-12">
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="font-serif text-4xl md:text-5xl mb-6">Ready to Start Practicing?</h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Join the movement of campaigns using empathetic dialogue training to win more conversations and elections.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-dialogue-darkblue hover:bg-dialogue-blue hover:text-white text-lg px-8 py-4"
                  onClick={handleStartChallenge}
                >
                  Start Your First Roleplay
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white hover:bg-dialogue-purple hover:border-dialogue-purple transition-colors text-lg px-8 py-4"
                >
                  Contact Sales
                </Button>
              </div>
              <p className="text-sm opacity-75 mt-4">No credit card required • Free trial available</p>
            </div>
          </div>
        </Card>

        <div className="mt-16 text-center">
          <h3 className="text-lg font-medium mb-6 text-dialogue-darkblue">Trusted by Progressive Campaigns</h3>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-70">
            <div className="w-32 h-12 bg-gray-200 rounded flex items-center justify-center text-sm text-gray-600">Campaign Partner</div>
            <div className="w-32 h-12 bg-gray-200 rounded flex items-center justify-center text-sm text-gray-600">Organization</div>
            <div className="w-32 h-12 bg-gray-200 rounded flex items-center justify-center text-sm text-gray-600">Training Org</div>
            <div className="w-32 h-12 bg-gray-200 rounded flex items-center justify-center text-sm text-gray-600">Campaign Group</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
