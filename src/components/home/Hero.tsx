import { Button } from '@/ui/button';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const handleStartChallenge = () => {
    navigate('/challenge');
  };

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-dialogue-darkblue mb-8 font-light">Civic tech for persuasion.</h1>
            <p className="text-lg md:text-xl font-serif text-foreground mb-8 max-w-lg leading-relaxed">
              AI-enabled tools for organizers doing the hardest kind of work—changing minds, building commitment, and mobilizing action.
            </p>
            <div className="bg-dialogue-blue/10 border border-dialogue-blue/20 rounded-lg p-6 mb-8">
              <p className="text-dialogue-darkblue font-medium mb-2">✓ Practice with realistic voter scenarios</p>
              <p className="text-dialogue-darkblue font-medium mb-2">✓ Get real-time coaching feedback</p>
              <p className="text-dialogue-darkblue font-medium">✓ Build skills that increase voter persuasion</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-dialogue-purple hover:bg-dialogue-darkblue text-white text-lg px-8 py-4"
                onClick={handleStartChallenge}
              >
                Start Your First Roleplay
              </Button>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden shadow-xl animate-fade-in">
            <img
              src="/lovable-uploads/01c3e643-e913-481c-85db-4d3ca81a0318.png"
              alt="Two people having a conversation overlooking city at dusk"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
