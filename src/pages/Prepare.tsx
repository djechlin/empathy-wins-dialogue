import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import PrepareCard from '@/components/PrepareCard';
import StepNavigation from '@/components/StepNavigation';
import { Button } from '@/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { ArrowRight, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useSessionStorageState from 'use-session-storage-state';

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
      dontSayText: "Hello. Is this Frank I'm talking to? Do you have a few minutes to chat about healthcare?",
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

  const prepareSteps = [
    {
      stepNumber: 1,
      stepColor: 'green' as const,
      title: 'Frame the issue',
      description: 'Use concrete, plain-spoken language to introduce yourself and the issue. Avoid opening with statistics or data.',
      doDontExamples: [
        {
          doHeading: 'Cut to the chase',
          dontHeading: "Don't ask for permission to talk when they already are",
          voter: "Hello, who's there?",
          do: `My name is [your name], I'm here with ${currentIssue ? currentIssue.organization.replace(/<[^>]*>/g, '') : ''} to talk about ${currentIssue?.plainLanguage}.`,
          dont: currentIssue?.dontSayText || '',
        },
        {
          doHeading: 'Use everyday language about regular people',
          dontHeading: "Don't go into society's ills",
          voter: "Isn't insulin already affordable?",
          do: 'Actually, when someone here in Townsville loses their job, they have to pay hundreds of dollars out of pocket.',
          dont: 'Due to Congressional inaction, once an employee loses their employee-sponsored healthcare benefits...',
        },
      ],
    },
    {
      stepNumber: 2,
      stepColor: 'orange' as const,
      title: 'Build a connection',
      description:
        'Share a personal healthcare story to build connection, then learn about who the voter cares about. Ask about their family and when they name someone, ask more about them.',
      doDontExamples: [
        {
          doHeading: 'Open up',
          dontHeading: "Don't make it political",
          voter: "I agree with you but I don't believe in big government.",
          do: 'Yeah, I totally understand that. You know, last year, my dad had to go to the ER...',
          dont: "Last year my dad had to go to the ER and the bill was outrageous. Healthcare costs are skyrocketing because politicians won't stand up to Big Pharma and insurance companies.",
        },
        {
          doHeading: 'Dig deeper',
          dontHeading: "Don't jump into the issue when they share something personal",
          voter: "My daughter's really into all that progressive stuff, I wish she'd chill.",
          do: "Wow, your daughter's really engaged. Has she always been passionate about her interests?",
          dont: "I guess you've heard about this a lot from your daughter already, is there a reason you haven't changed your mind yet?",
        },
      ],
    },
    {
      stepNumber: 3,
      stepColor: 'blue' as const,
      title: 'Explore together',
      description:
        'Help the voter think through the issue by connecting your stories and experiences. Guide them to see new perspectives without being pushy.',
      doDontExamples: [
        {
          doHeading: 'Redirect the conversation to relationships',
          dontHeading: "Don't start debating",
          voter: 'Most people on welfare are just lazy.',
          do: "I see where you're coming from, but you mentioned a time your son didn't have insurance for a while, and he sounds really hard-working. Maybe it's important to be there for people like your son?",
          dont: "Actually that's a myth that was spread by the media going back to the 1980s.",
        },
      ],
    },
    {
      stepNumber: 4,
      stepColor: 'purple' as const,
      title: 'Ask for action',
      description: "You'll finish the conversation by asking the voter to take a specific action while you're together.",
      doDontExamples: [
        {
          doHeading: 'Ask for an action right now',
          dontHeading: "Don't ask them just to think about it",
          do: "I'm really glad we had this conversation. I want to ask, could you take your phone and call Representative Gerbil, his number is 555-4567, and tell him how you feel?",
          dont: 'Thanks for chatting. I hope you think about supporting this in the future',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <StepNavigation stepNumber={1} />

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Prepare</h1>
            <p className="text-gray-600">Your roadmap for persuasive conversation</p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-gray-600" />
                Choose your issue
              </CardTitle>
              <p className="text-gray-600 text-sm font-sans">Select the issue you'll be advocating for in this roleplay session.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
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
            </CardContent>
          </Card>

          {/* Prominent Start Roleplay section */}
          <div className="mb-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-6 text-white text-center shadow-lg">
            <h2 className="text-xl font-bold mb-2">Ready to practice?</h2>
            <p className="mb-4 text-green-50">Start your roleplay session and put these strategies into action</p>
            <Button
              onClick={() => navigate('/challenge/roleplay')}
              size="lg"
              className="px-8 bg-white text-green-600 hover:bg-green-50 font-semibold shadow-md"
            >
              Start Roleplay
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          <div className="mb-8">
            <PrepareCard {...prepareSteps[0]} />
          </div>

          <div className="space-y-4 mb-8">
            {prepareSteps.slice(1).map((step, index) => (
              <PrepareCard key={index + 1} {...step} />
            ))}
          </div>
        </div>

        {/* Floating Action Button - stays visible while scrolling */}
        <div className="fixed bottom-6 right-6 z-50 opacity-90 hover:opacity-100 transition-opacity duration-300">
          <Button
            onClick={() => navigate('/challenge/roleplay')}
            size="lg"
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold shadow-xl rounded-full hover:scale-105 transition-transform duration-200"
          >
            Start Roleplay
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Prepare;
