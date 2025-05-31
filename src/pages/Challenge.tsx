
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CallWorkspace } from '@/components/voice/CallWorkspace';
import ConversationReport from '@/components/voice/ConversationReport';
import { Button } from '@/components/ui/button';
import { sampleReport } from '@/lib/report';

const Challenge = () => {
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [showReport, setShowReport] = useState(false);

  const topics = [
    'Protect healthcare',
    'Climate resilience (hard)',
    'LGBT rights',
    'Voter turnout (hard)',
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
                Put your deep canvassing skills to the test with this interactive practice session.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {!showReport ? (
                <>
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-center text-dialogue-darkblue">
                      Choose your topic:
                    </h2>
                    <div className="flex flex-wrap justify-center gap-3">
                      {topics.map((topic) => (
                        <Button
                          key={topic}
                          variant={selectedTopic === topic ? "default" : "outline"}
                          onClick={() => setSelectedTopic(topic)}
                          className={selectedTopic === topic ? "bg-dialogue-purple hover:bg-dialogue-darkblue" : ""}
                        >
                          {topic}
                        </Button>
                      ))}
                    </div>
                  </div>

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
                      Practice your conversation skills in this challenging scenario. Apply everything you've learned about vulnerable storytelling and empathetic listening.
                    </p>
                    <CallWorkspace scenarioId="deep-canvassing" />
                  </div>
                </>
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
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Challenge;
