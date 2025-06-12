

import { Button } from '@/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Label } from '@/ui/label';
import { RadioGroup, RadioGroupItem } from '@/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { ArrowRight, Heart, RotateCcw, Users, Check, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Preparation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultIssue = searchParams.get('issue') || '';

  const [selectedIssue, setSelectedIssue] = useState(defaultIssue);
  const [personType, setPersonType] = useState('');
  const [eventType, setEventType] = useState('');
  const [selectedFeeling, setSelectedFeeling] = useState('');

  const issueDetails = {
    insulin: {
      title: 'Healthcare - Insulin Affordability',
      plainLanguage: 'affordable insulin for people with diabetes',
      organization: 'Diabetes Advocates<sup>†</sup>',
      dontSayText: 'Hello. Is this Frank I\'m talking to? Do you have a few minutes to chat about healthcare? According to the CDC an estimated 38.4 million Americans suffer from diabetes...',
    },
    climate: {
      title: 'Climate - Wildfire Management',
      plainLanguage: 'protecting our communities from wildfires',
      organization: 'Against Wildfires<sup>†</sup>',
      dontSayText: 'Hello. Is this Frank I\'m talking to? Do you have a few minutes to chat about the devastating impacts of climate change? In 2024, global carbon dioxide emission reached 41.6 billion tons...',
    },
  };

  const personOptions = ['mom', 'dad', 'brother', 'sister', 'son', 'daughter', 'relative', 'friend'];

  const eventOptions = ['got sick', 'got injured', 'had to see the doctor', 'went to the ER', 'had surgery', 'needed medicine'];

  const emotionOptions = ['relieved', 'scared', 'comforted', 'loved', 'happy', 'glad', 'grateful'];

  const currentIssue = selectedIssue ? issueDetails[selectedIssue as keyof typeof issueDetails] : null;

  const handleIssueClick = (value: string) => {
    // If the same button is clicked, deselect it
    if (selectedIssue === value) {
      setSelectedIssue('');
    } else {
      setSelectedIssue(value);
    }
  };

  const handleStartRoleplay = () => {
    navigate(`/roleplay?issue=${selectedIssue}&person=${personType}&event=${encodeURIComponent(eventType)}&feeling=${selectedFeeling}`);
  };

  const canProceed = () => {
    return selectedIssue && personType && eventType && selectedFeeling;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Progress Flow */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-6">
            {/* Step 1 - Current Step */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-2">
                1
              </div>
              <span className="text-sm font-medium text-center text-blue-600">
                Prepare your story
              </span>
            </div>

            <ArrowRight className="w-6 h-6 text-gray-400" />

            {/* Step 2 - Future Step */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white border-2 border-gray-300 text-gray-400 rounded-full flex items-center justify-center font-bold text-lg mb-2">
                2
              </div>
              <span className="text-sm font-medium text-center text-gray-400">
                Roleplay
              </span>
            </div>

            <ArrowRight className="w-6 h-6 text-gray-400" />

            {/* Step 3 - Future Step */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white border-2 border-gray-300 text-gray-400 rounded-full flex items-center justify-center font-bold text-lg mb-2">
                3
              </div>
              <span className="text-sm font-medium text-center text-gray-400">
                Learn how you did
              </span>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Conversation Strategy</h1>
          <p className="text-gray-600">Your roadmap for persuasive conversation</p>
        </div>

        {/* Visual Flow */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
          <CardContent className="p-8">
            <div className="flex items-center justify-center space-x-6 mb-6">
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg mb-2">
                  1
                </div>
                <span className="text-sm font-medium text-center">
                  Frame
                  <br />
                  Issue
                </span>
              </div>

              <ArrowRight className="w-6 h-6 text-blue-400" />

              {/* Step 2 - Loop */}
              <div className="flex flex-col items-center relative">
                <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg mb-2">
                  2
                </div>
                <span className="text-sm font-medium text-center">
                  Connection
                  <br />
                  Loop
                </span>
                <div className="absolute -bottom-8 flex items-center space-x-2 text-xs">
                  <Heart className="w-4 h-4 text-orange-500" />
                  <RotateCcw className="w-4 h-4 text-orange-500" />
                  <Users className="w-4 h-4 text-orange-500" />
                </div>
              </div>

              <ArrowRight className="w-6 h-6 text-blue-400" />

              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-lg mb-2">
                  3
                </div>
                <span className="text-sm font-medium text-center">
                  Explore
                  <br />
                  Together
                </span>
              </div>

              <ArrowRight className="w-6 h-6 text-blue-400" />

              {/* Step 4 */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-lg mb-2">
                  4
                </div>
                <span className="text-sm font-medium text-center">
                  Ask for
                  <br />
                  Support
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Issue Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Step 1: Frame the Issue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-4 block">Choose your issue:</Label>
              <div className="flex gap-3">
                <button
                  onClick={() => handleIssueClick('insulin')}
                  className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                    selectedIssue === 'insulin'
                      ? 'border-blue-500 bg-blue-500 text-white shadow-md'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  Healthcare
                </button>
                <button
                  onClick={() => handleIssueClick('climate')}
                  className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                    selectedIssue === 'climate'
                      ? 'border-green-500 bg-green-500 text-white shadow-md'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-green-300 hover:bg-green-50'
                  }`}
                >
                  Climate
                </button>
              </div>
              {selectedIssue && (
                <p className="text-xs text-gray-600 mt-2">
                  {selectedIssue === 'insulin' 
                    ? 'Help families afford life-saving diabetes medication'
                    : 'Protect communities from increasing wildfire risks'
                  }
                </p>
              )}
            </div>

            {/* Script Preview */}
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center mb-2">
                <Check className="w-5 h-5 text-green-600 mr-2" />
                <h4 className="font-medium text-green-900">Your opening line:</h4>
              </div>
              {currentIssue ? (
                <>
                  <p className="text-green-800 text-lg font-mono">
                    "My name is [your name], I'm here with <span dangerouslySetInnerHTML={{ __html: currentIssue.organization }} /> to talk about {currentIssue.plainLanguage}."
                  </p>
                  <p className="text-green-700 mt-3 text-xs"><sup>†</sup> fictitious</p>
                </>
              ) : (
                <p className="text-green-700 text-base">
                  Select an issue to see how to frame it
                </p>
              )}
            </div>

            {/* Don't Say This */}
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center mb-2">
                <X className="w-5 h-5 text-red-600 mr-2" />
                <h4 className="font-medium text-red-900">Don't say this:</h4>
              </div>
              {currentIssue ? (
                <p className="text-red-800 text-sm font-mono">
                  {currentIssue.dontSayText}
                </p>
              ) : (
                <p className="text-red-700 text-base">
                  Select an issue to see what NOT to say
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Key Phrases */}
        <div className="space-y-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>💝 Your Story Opening</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>Who was there for you?</Label>
                  <Select value={personType} onValueChange={setPersonType}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select someone..." />
                    </SelectTrigger>
                    <SelectContent>
                      {personOptions.map((person) => (
                        <SelectItem key={person} value={person}>
                          {person}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>What happened?</Label>
                  <Select value={eventType} onValueChange={setEventType}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select what happened..." />
                    </SelectTrigger>
                    <SelectContent>
                      {eventOptions.map((event) => (
                        <SelectItem key={event} value={event}>
                          {event}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>How did you feel?</Label>
                  <Select value={selectedFeeling} onValueChange={setSelectedFeeling}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select feeling..." />
                    </SelectTrigger>
                    <SelectContent>
                      {emotionOptions.map((emotion) => (
                        <SelectItem key={emotion} value={emotion}>
                          {emotion}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {personType && eventType && selectedFeeling && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-lg font-mono">
                    "You know, one time my {personType} {eventType}. In that moment I really felt {selectedFeeling}..."
                  </p>
                  <p className="text-green-600 mt-2 text-sm">Then you'll ask: "Is there a time someone was really there for you?"</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">🤝 How to Start Eliciting:</h3>
              <p className="text-lg text-gray-700 font-mono">"Is there a time someone was really there for you?"</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">🔍 Start Exploring:</h3>
              <p className="text-lg text-gray-700 font-mono">"How does this issue affect people you care about?"</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">🎯 Tie It Together:</h3>
              <p className="text-lg text-gray-700 font-mono">"Does that change how you feel about {currentIssue ? currentIssue.title.toLowerCase() : 'this issue'}?"</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button onClick={handleStartRoleplay} disabled={!canProceed()} size="lg" className="px-8">
            Start Roleplay
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          {!canProceed() && <p className="text-gray-500 mt-2">Please complete your story above to begin</p>}
        </div>
      </div>
    </div>
  );
};

export default Preparation;

