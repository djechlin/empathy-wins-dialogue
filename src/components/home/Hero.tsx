import { Button } from '@/ui/button';
import { Card, CardContent } from '@/ui/card';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, FileText, BookOpen, MessagesSquare } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();

  const handleStartChallenge = () => {
    navigate('/challenge');
  };

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-dialogue-darkblue mb-8 font-light">Civic tech for dialogue.</h1>
            <p className="text-lg md:text-xl font-serif text-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Type2Dialogue provides AI-enabled tools for organizers doing the hardest kind of work—changing minds, building commitment, and mobilizing action.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="border-dialogue-blue/20 hover:shadow-lg transition-all cursor-pointer" onClick={handleStartChallenge}>
                <CardContent className="p-6 text-center">
                  <MessagesSquare className="w-12 h-12 text-dialogue-purple mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2 text-dialogue-darkblue">Voter persuasion roleplay</h3>
                  <p className="text-sm text-foreground/70">Practice deep canvassing conversations with AI-powered realistic voter scenarios</p>
                </CardContent>
              </Card>

              <Card className="border-dialogue-blue/20 hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/text')}>
                <CardContent className="p-6 text-center">
                  <MessageSquare className="w-12 h-12 text-dialogue-purple mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2 text-dialogue-darkblue">Mobilize a friend chat roleplay</h3>
                  <p className="text-sm text-foreground/70">Practice persuasive conversations to mobilize friends and family</p>
                </CardContent>
              </Card>

              <Card className="border-dialogue-blue/20 hover:shadow-lg transition-all cursor-pointer" onClick={() => window.open('https://type2dialogue.substack.com', '_blank')}>
                <CardContent className="p-6 text-center">
                  <BookOpen className="w-12 h-12 text-dialogue-purple mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2 text-dialogue-darkblue">Misinformation or disagreement?</h3>
                  <p className="text-sm text-foreground/70">type2dialogue's substack, focusing on persuasion and information</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
