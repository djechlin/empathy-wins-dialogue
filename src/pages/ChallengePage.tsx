import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import ConversationReportCard from '@/features/roleplay/ConversationReportCard';
import { Roleplay } from '@/features/roleplay/Roleplay';
import { sampleReport } from '@/lib/report';
import { Button } from '@/ui/button';
import SliderCard from '@/ui/slider-card';
import { Dice3, MessagesSquare } from 'lucide-react';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

const ChallengePage = () => {
  const [showReport, setShowReport] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Persuasion Challenge | type2dialogue</title>
        <meta
          name="description"
          content="Try to persuade a swing voter to support a popular healthcare measure in this interactive challenge."
        />

        {/* Open Graph tags */}
        <meta property="og:title" content="Persuasion Challenge | type2dialogue" />
        <meta
          property="og:description"
          content="Try to persuade a swing voter to support a popular healthcare measure in this interactive challenge."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://type2dialogue.com/challenge" />
        <meta property="og:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="type2dialogue" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@type2dialogue" />
        <meta name="twitter:title" content="Persuasion Challenge | type2dialogue" />
        <meta
          name="twitter:description"
          content="Try to persuade a swing voter to support a popular healthcare measure in this interactive challenge."
        />
        <meta name="twitter:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
      </Helmet>
      <Navbar />
      <main className="flex-grow">
        <div className="bg-gradient-to-b from-dialogue-blue to-white">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-dialogue-darkblue">Can You Persuade a Swing Voter?</h1>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Persuade a skeptical voter to support a popular healthcare measure in this interactive challenge.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
              <SliderCard
                title="Rate your agreement before the challenge"
                question="I'm comfortable talking about my political beliefs with swing voters."
              />

              {!showReport ? (
                <>
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <Dice3 className="h-6 w-6 text-dialogue-darkblue" />
                        <h3 className="text-2xl font-bold text-dialogue-darkblue font-sans">Challenge Scenario</h3>
                      </div>
                    </div>
                    <Roleplay showScenarioOnly={true} />
                  </div>

                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <MessagesSquare className="h-6 w-6 text-dialogue-darkblue" />
                        <h3 className="text-2xl font-bold text-dialogue-darkblue font-sans">Roleplay</h3>
                      </div>
                    </div>
                    <Roleplay showScenarioOnly={false} />
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-dialogue-darkblue">Conversation Report</h3>
                    <Button onClick={() => setShowReport(false)} variant="outline">
                      Back to Challenge
                    </Button>
                  </div>
                  <ConversationReportCard report={sampleReport} />
                </div>
              )}
              <SliderCard
                title="Rate your agreement after completion"
                question="I'm comfortable talking about my political beliefs with swing voters."
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ChallengePage;
