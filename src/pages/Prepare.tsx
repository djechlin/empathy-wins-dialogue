import DoDont from '@/components/DoDont';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import NumberCircle from '@/components/NumberCircle';
import { Button } from '@/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/ui/tabs';
import { ArrowRight } from 'lucide-react';
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
      title: `Frame the ${selectedIssue === 'insulin' ? 'healthcare' : 'climate'} issue`,
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
          voter: selectedIssue === 'insulin' ? "Isn't insulin already affordable?" : "Aren't we already doing enough about climate change?",
          do:
            selectedIssue === 'insulin'
              ? 'Actually, when someone here in Townsville loses their job, they have to pay hundreds of dollars out of pocket.'
              : "Actually, my neighbor had to evacuate their home twice last year because of flooding. It's really affecting people right here.",
          dont:
            selectedIssue === 'insulin'
              ? 'Due to Congressional inaction, once an employee loses their employee-sponsored healthcare benefits...'
              : "Due to fossil fuel companies' influence, global carbon dioxide emissions reached 41.6 billion tons in 2024...",
        },
      ],
    },
    {
      stepNumber: 2,
      stepColor: 'orange' as const,
      title: 'Build a connection',
      description:
        'Share a personal story to build connection, then learn about who the voter cares about. Ask about their family and when they name someone, ask more about them.',
      doDontExamples: [
        {
          doHeading: 'Open up',
          dontHeading: "Don't make it political",
          voter: "I agree with you but I don't believe in big government.",
          do:
            selectedIssue === 'insulin'
              ? 'Yeah, I totally understand that. You know, last year, my dad had to go to the ER...'
              : 'Yeah, I totally understand that. You know, last summer, my family had to evacuate because of the wildfire...',
          dont:
            selectedIssue === 'insulin'
              ? "Last year my dad had to go to the ER and the bill was outrageous. Healthcare costs are skyrocketing because politicians won't stand up to Big Pharma and insurance companies."
              : "Last summer my family had to evacuate because of the wildfire and it was devastating. Climate change is accelerating because politicians won't stand up to fossil fuel companies.",
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
          voter: selectedIssue === 'insulin' ? 'Most people on welfare are just lazy.' : "The climate's always changing.",
          do:
            selectedIssue === 'insulin'
              ? "I see where you're coming from, but you mentioned a time your son didn't have insurance for a while, and he sounds really hard-working. Maybe it's important to be there for people like your son?"
              : "I see where you're coming from, but you mentioned your daughter's apartment flooded last year, and that must have been really scary for you as a parent. Maybe it's important to protect people like your daughter?",
          dont:
            selectedIssue === 'insulin'
              ? "Actually that's a myth that was spread by the media going back to the 1980s."
              : "Actually, yes, but the rate of recent change is unprecedented. Since the Industrial Revolution, global temperatures have risen 1.1°C, and we're seeing extreme weather events increase dramatically...",
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
          do:
            selectedIssue === 'insulin'
              ? "I'm really glad we had this conversation. I want to ask, could you take your phone and call Representative Gerbil, his number is 555-4567, and tell him you support the state bill to cap insulin costs?"
              : "I'm really glad we had this conversation. I want to ask, could you take your phone and call Representative Gerbil, his number is 555-4567, and tell him you support the state bill to train wildfire fighters?",
          dont: 'Thanks for chatting. I hope you think about supporting this in the future.',
        },
        {
          doHeading: 'Respect however far they came toward your position',
          dontHeading: "Don't ruin your connection by being pushy",
          voter: "This is a lot to think about, I'll maybe call later.",
          do: 'Thank you so much for considering it. I really enjoyed talking with you.',
          dont: "If you do it now then you won't have to worry about it later.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Prepare for your roleplay</h1>
          <div className="mb-8 text-center">
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto mb-4">
              A persuasion conversation starts with framing the issue in everyday terms, then building a connection before diving into the
              issue.
            </p>
            <div className="text-md text-gray-600 mb-4">
              <p className="mb-3">First, select your issue:</p>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => setSelectedIssue('insulin')}
                  variant={selectedIssue === 'insulin' ? 'blue' : 'blue-outline'}
                  size="default"
                >
                  Healthcare
                </Button>
                <Button
                  onClick={() => setSelectedIssue('climate')}
                  variant={selectedIssue === 'climate' ? 'green' : 'green-outline'}
                  size="default"
                >
                  Climate
                </Button>
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto">
            <Tabs defaultValue="0" className="w-full">
              <TabsList className="grid w-full grid-cols-4 h-auto p-2 bg-white shadow-sm">
                {prepareSteps.map((step, index) => (
                  <TabsTrigger
                    key={index}
                    value={index.toString()}
                    className="flex flex-col items-center text-center p-4 h-32 data-[state=active]:bg-blue-50 data-[state=active]:border-blue-200 data-[state=active]:border-2"
                  >
                    <NumberCircle number={step.stepNumber} color={step.stepColor} />
                    <span className="text-xs font-medium mt-2 leading-tight">{step.title}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {prepareSteps.map((step, index) => (
                <TabsContent key={index} value={index.toString()} className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <NumberCircle number={step.stepNumber} color={step.stepColor} />
                        {step.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {step.doDontExamples.map((example, exampleIndex) => (
                          <DoDont
                            key={exampleIndex}
                            doHeading={example.doHeading}
                            dontHeading={example.dontHeading}
                            voter={example.voter}
                            do={example.do}
                            dont={example.dont}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <div className="mt-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-6 text-white text-center shadow-lg">
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
        </div>

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
