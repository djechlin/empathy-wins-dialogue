import DosDonts from '@/components/DosDonts';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Label } from '@/ui/label';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useSessionStorageState from 'use-session-storage-state';

const StepIndicator = ({ number, color, label, isLast }: { number: number; color: string; label: string; isLast?: boolean }) => (
  <>
    <div className="flex flex-col items-center">
      <div className={`w-12 h-12 ${color} text-white rounded-full flex items-center justify-center font-bold text-lg mb-2`}>{number}</div>
      <span className="text-sm font-medium text-center">{label}</span>
    </div>
    {!isLast && <ArrowRight className="w-6 h-6 text-blue-400" />}
  </>
);

const Prepare = () => {
  const navigate = useNavigate();

  const [selectedIssue, setSelectedIssue] = useSessionStorageState('selected-issue', {
    defaultValue: 'insulin',
  });

  const issueDetails = {
    insulin: {
      title: 'Healthcare - Insulin Affordability',
      plainLanguage: 'affordable insulin for people with diabetes',
      organization: 'Diabetes Advocates<sup>†</sup>',
      dontSayText:
        "Hello. Is this Frank I'm talking to? Do you have a few minutes to chat about healthcare? According to the CDC an estimated 38.4 million Americans suffer from diabetes...",
    },
    climate: {
      title: 'Climate - Wildfire Management',
      plainLanguage: 'protecting our communities from wildfires',
      organization: 'Against Wildfires<sup>†</sup>',
      dontSayText:
        "Hello. Is this Frank I'm talking to? Do you have a few minutes to chat about the devastating impacts of climate change? In 2024, global carbon dioxide emission reached 41.6 billion tons...",
    },
  };

  const currentIssue = selectedIssue ? issueDetails[selectedIssue as keyof typeof issueDetails] : null;

  const handleStartRoleplay = () => {
    // Save selected issue to sessionStorage before navigating
    sessionStorage.setItem('selectedIssue', selectedIssue);
    navigate('/challenge/roleplay');
  };

  const canProceed = () => {
    return selectedIssue;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex items-center justify-center space-x-6">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-2">1</div>
              <span className="text-sm font-medium text-center text-blue-600 font-sans">Prepare</span>
            </div>

            <ArrowRight className="w-6 h-6 text-gray-400" />

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white border-2 border-gray-300 text-gray-400 rounded-full flex items-center justify-center font-bold text-lg mb-2">
                2
              </div>
              <span className="text-sm font-medium text-center text-gray-400 font-sans">Roleplay</span>
            </div>

            <ArrowRight className="w-6 h-6 text-gray-400" />

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white border-2 border-gray-300 text-gray-400 rounded-full flex items-center justify-center font-bold text-lg mb-2">
                3
              </div>
              <span className="text-sm font-medium text-center text-gray-400 font-sans">Learn how you did</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Prepare</h1>
            <p className="text-gray-600">Your roadmap for persuasive conversation</p>
          </div>

          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
            <CardContent className="p-8">
              <div className="flex items-center justify-center space-x-6 mb-6">
                <StepIndicator number={1} color="bg-blue-500" label="Frame Issue" />
                <StepIndicator number={2} color="bg-orange-500" label="Build Connection" />
                <StepIndicator number={3} color="bg-green-500" label="Explore Together" />
                <StepIndicator number={4} color="bg-purple-500" label="Ask for Action" isLast={true} />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Frame the Issue</CardTitle>
              <p className="text-gray-600 text-sm font-sans">
                Use concrete, plain-spoken language to introduce yourself and the issue. Avoid opening with statistics or data.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-4 block">Choose your issue:</Label>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setSelectedIssue('insulin')}
                    variant={selectedIssue === 'insulin' ? 'blue' : 'blue-outline'}
                    size="sm"
                  >
                    Healthcare
                  </Button>
                  <Button
                    onClick={() => setSelectedIssue('climate')}
                    variant={selectedIssue === 'climate' ? 'green' : 'green-outline'}
                    size="sm"
                  >
                    Climate
                  </Button>
                </div>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900 font-medium">
                    {selectedIssue === 'insulin'
                      ? "You'll be with Diabetes Advocates, talking to voters about lowering the price of insulin."
                      : "You'll be talking about the increasing wildfire risk in your area. You're focusing on increased training for wildfire fighters, which mitigates the issue here and now, and gets our government to take climate change threats more seriously."}
                  </p>
                </div>
              </div>

              <DosDonts
                doHeading="Cut to the chase"
                dontHeading="Don't go on a lecture"
                doVoter="Hello, who's there?"
                doCanvasser={`My name is [your name], I'm here with ${currentIssue ? currentIssue.organization.replace(/<[^>]*>/g, '') : ''} to talk about ${currentIssue?.plainLanguage}.`}
                dontVoter="Hello, who's there?"
                dontCanvasser={currentIssue?.dontSayText || ''}
              />
            </CardContent>
          </Card>

          <div className="space-y-4 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-sans">Build a connection</CardTitle>
                <p className="text-gray-600 text-sm font-sans">
                  Share a personal healthcare story to build connection, then learn about who the voter cares about. Ask about their family
                  and when they name someone, ask more about them.
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <DosDonts
                    doHeading="Open up"
                    dontHeading="Don't make it political"
                    doVoter="I agree with you but I don't believe in big government."
                    doCanvasser="Yeah, I totally understand that. You know, last year, my dad had to go to the ER..."
                    dontVoter="Is there a time someone was really there for you?"
                    dontCanvasser="Last year my dad had to go to the ER and the bill was outrageous. Healthcare costs are skyrocketing because politicians won't stand up to Big Pharma and insurance companies."
                  />

                  <DosDonts
                    doHeading="Dig deeper"
                    dontHeading="Don't jump into the issue when they share something personal"
                    doVoter="My daughter's really into all that progressive stuff, I wish she'd chill."
                    doCanvasser="Wow, your daughter's really engaged. Has she always been passionate about her interests?"
                    dontVoter="My daughter's really into all that progressive stuff, I wish she'd chill."
                    dontCanvasser="I guess you've heard about this a lot from your daughter already, is there a reason you haven't changed your mind yet?"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-sans">Explore together</CardTitle>
                <p className="text-gray-600 text-sm font-sans">
                  Help the voter think through the issue by connecting your stories and experiences. Guide them to see new perspectives
                  without being pushy.
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <DosDonts
                  doHeading="Good to say"
                  dontHeading="Not as good"
                  doCanvasser="It sounds like we both really care about the people we love. Does that change how you think about this issue at all?"
                  dontCanvasser="So you can see why we need to support this policy, right? It's obvious that everyone benefits."
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-sans">Ask for action</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-600 text-sm font-sans">You'll ask them to take a specific action while you're together.</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button onClick={handleStartRoleplay} disabled={!canProceed()} size="lg" className="px-8">
              Start Roleplay
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            {!canProceed() && <p className="text-gray-500 mt-2">Please select an issue above to begin</p>}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Prepare;
