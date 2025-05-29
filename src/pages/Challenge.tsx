
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PracticeCard from '@/components/learn/PracticeCard';

const Challenge = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-gradient-to-b from-dialogue-blue to-white">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-dialogue-darkblue">
                Practice Challenge
              </h1>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Put your deep canvassing skills to the test with this interactive practice session.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <PracticeCard
                id="challenge-practice"
                title="Deep Canvassing Challenge"
                description="Practice your conversation skills in this challenging scenario. Apply everything you've learned about vulnerable storytelling and empathetic listening."
                defaultOpen={true}
                scenarioId="deep-canvassing"
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Challenge;
