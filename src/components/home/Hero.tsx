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
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-dialogue-darkblue mb-8 font-light">Civic tech for dialogue.</h1>
            <p className="text-lg md:text-xl font-serif text-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Type2Dialogue provides AI-enabled tools for organizers doing the hardest kind of work—changing minds, building commitment, and mobilizing action.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-dialogue-purple hover:bg-dialogue-darkblue text-white text-lg px-8 py-4"
                onClick={handleStartChallenge}
              >
                Start Your First Roleplay
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
