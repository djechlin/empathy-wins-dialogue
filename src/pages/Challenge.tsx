import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ChallengeWorkspace } from '@/components/voice/ChallengeWorkspace';
import ConversationReport from '@/components/voice/ConversationReport';
import { Button } from '@/components/ui/button';
import { sampleReport } from '@/lib/report';
import SliderCard from '@/components/ui/slider-card';

const ChallengePage = () => {
  const [showReport, setShowReport] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Persuasion Challenge | type2dialogue</title>
        <meta name="description" content="Put your deep canvassing skills to the test with this interactive practice session. Can you persuade a swing voter through empathetic dialogue?" />

        {/* Open Graph tags */}
        <meta property="og:title" content="Persuasion Challenge | type2dialogue" />
        <meta property="og:description" content="Put your deep canvassing skills to the test with this interactive practice session. Can you persuade a swing voter through empathetic dialogue?" />
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
        <meta name="twitter:description" content="Put your deep canvassing skills to the test with this interactive practice session. Can you persuade a swing voter through empathetic dialogue?" />
        <meta name="twitter:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
      </Helmet>
      <Navbar />
      <main className="flex-grow">
        <div className="bg-gradient-to-b from-dialogue-blue to-white">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-dialogue-darkblue">
                Can You Persuade a Swing Voter?
              </h1>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Put your deep canvassing skills to the test with this interactive practice session.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
              <SliderCard
                id="pre-challenge-empathy"
                title="Before You Start"
                question="I'm interested in having more empathetic sations with people who disagree with me about political topics."
              />

              {!showReport ? (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-dialogue-darkblue">
                      Persuasion Challenge
                    </h3>
                  </div>
                  <ChallengeWorkspace />
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-dialogue-darkblue">
                      Conversation Report
                    </h3>
                    <Button
                      onClick={() => setShowReport(false)}
                      variant="outline"
                    >
                      Back to Challenge
                    </Button>
                  </div>
                  <ConversationReport report={sampleReport} />
                </div>
              )}

              <SliderCard
                id="post-challenge-empathy"
                title="After the Challenge"
                question="I'm interested in having more empathetic conversations with people who disagree with me about political topics."
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
