import React from 'react';
import { Button } from '@/ui/button';
import { Card, CardContent } from '@/ui/card';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, MessageSquare, TrendingUp } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const CampaignManagerSection = () => {
  const navigate = useNavigate();
  const { elementRef, isVisible } = useScrollAnimation();

  const handleStartChallenge = () => {
    navigate('/challenge');
  };

  return (
    <section
      ref={elementRef}
      className={`py-16 bg-gradient-to-br from-dialogue-blue/5 to-dialogue-purple/5 animate-on-scroll ${isVisible ? 'animate-in-view' : ''}`}
    >
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl text-dialogue-darkblue mb-6">Train Your Team to Win More Conversations</h2>
          <p className="text-xl text-foreground max-w-3xl mx-auto leading-relaxed">
            Campaign managers use type2dialogue to scale effective canvassing training. Your volunteers practice with AI before they knock
            on real doors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center border-dialogue-blue/20">
            <CardContent className="p-6">
              <GraduationCap className="w-12 h-12 text-dialogue-purple mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Training for Canvassers</h3>
              <p className="text-sm text-gray-600">Comprehensive modules to prepare volunteers for effective door-to-door conversations</p>
            </CardContent>
          </Card>

          <Card className="text-center border-dialogue-blue/20">
            <CardContent className="p-6">
              <MessageSquare className="w-12 h-12 text-dialogue-purple mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Coaching for Activists</h3>
              <p className="text-sm text-gray-600">Personalized guidance for activists and citizens to improve political dialogue skills</p>
            </CardContent>
          </Card>

          <Card className="text-center border-dialogue-blue/20">
            <CardContent className="p-6">
              <TrendingUp className="w-12 h-12 text-dialogue-purple mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Better Results</h3>
              <p className="text-sm text-gray-600">Improve persuasion rates and voter engagement on the ground</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="font-serif text-2xl mb-4">Try Your First Roleplay</h3>
              <p className="text-lg opacity-90 mb-6">
                Practice deep canvassing with our voice assistant in a realistic voter conversation.
              </p>
              <Button
                size="lg"
                className="bg-white text-green-600 hover:bg-green-50 font-semibold shadow-md text-lg px-8 py-4"
                onClick={handleStartChallenge}
              >
                Start Roleplay
              </Button>
              <p className="text-sm opacity-75 mt-3">10 minutes • No signup required</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CampaignManagerSection;
