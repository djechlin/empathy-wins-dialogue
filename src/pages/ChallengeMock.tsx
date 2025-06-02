
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ChallengeWorkspace } from '@/components/voice/ChallengeWorkspace';
import ConversationReport from '@/components/voice/ConversationReport';
import { Button } from '@/components/ui/button';
import { sampleReport } from '@/lib/report';
import SliderCard from '@/components/ui/slider-card';
import type { Challenge } from '@/types';

const ChallengeMockPage = () => {
  const [showReport, setShowReport] = useState(false);

  const challenges: Challenge[] = [
    {
      id: 'healthcare',
      title: 'Expand healthcare',
      voterAction: 'Your home state of Kentucky is debating HB16, which expands maternal healthcare benefits into the first year of childhood.',
      script: [
        {
          name: 'first script item',
          items: [{
            text: 'first item text',
          }]
        }
      ],
      humePersona: '2befee5d-0661-403a-98d7-65e515f05e22'
    },
    {
      id: 'climate',
      title: 'Protect the climate',
      voterAction: 'Your home state of Washington is considering a program to increase grizzly bear populations, which is really good for the environment, but understandably has some citizens a little concerned.',
      disabled: true,
    },
    {
      id: 'lgbt',
      title: 'Support LGBT rights',
      disabled: true,
    },
    {
      id: 'voting',
      title: 'Increase midterm turnout',
      disabled: true
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-gradient-to-b from-dialogue-blue to-white">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-dialogue-darkblue">
                Can You Persuade a Swing Voter?
              </h1>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Put your deep canvassing skills to the test with this interactive practice session using mock conversations.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
              <SliderCard
                id="pre-challenge-empathy"
                title="Before You Start"
                question="I'm interested in having more empathetic conversations with people who disagree with me about political topics."
              />

              {!showReport ? (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-dialogue-darkblue">
                      Deep Canvassing Challenge
                    </h3>
                    {window.location.hostname === 'localhost' && (
                      <Button
                        onClick={() => setShowReport(true)}
                        variant="outline"
                        className="text-sm"
                      >
                        View Sample Report
                      </Button>
                    )}
                  </div>
                  <p className="text-gray-600 mb-6">
                    {challenges[0].voterAction}. Apply everything you've learned about vulnerable storytelling and empathetic listening.
                  </p>
                  <ChallengeWorkspace challenge={challenges[0]} isMock={true} />
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


export default ChallengeMockPage;
