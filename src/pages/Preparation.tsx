import { Button } from '@/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Label } from '@/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { ArrowRight, Heart, RotateCcw, Users, X } from 'lucide-react';
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

  const handlePersonChange = (value: string) => {
    // If the same option is selected, deselect it
    if (personType === value) {
      setPersonType('');
    } else {
      setPersonType(value);
    }
  };

  const handleEventChange = (value: string) => {
    // If the same option is selected, deselect it
    if (eventType === value) {
      setEventType('');
    } else {
      setEventType(value);
    }
  };

  const handleFeelingChange = (value: string) => {
    // If the same option is selected, deselect it
    if (selectedFeeling === value) {
      setSelectedFeeling('');
    } else {
      setSelectedFeeling(value);
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
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-2">1</div>
              <span className="text-sm font-medium text-center text-blue-600 font-sans">Conversation Strategy</span>
            </div>

            <ArrowRight className="w-6 h-6 text-gray-400" />

            {/* Step 2 - Future Step */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white border-2 border-gray-300 text-gray-400 rounded-full flex items-center justify-center font-bold text-lg mb-2">
                2
              </div>
              <span className="text-sm font-medium text-center text-gray-400 font-sans">Roleplay</span>
            </div>

            <ArrowRight className="w-6 h-6 text-gray-400" />

            {/* Step 3 - Future Step */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white border-2 border-gray-300 text-gray-400 rounded-full flex items-center justify-center font-bold text-lg mb-2">
                3
              </div>
              <span className="text-sm font-medium text-center text-gray-400 font-sans">Learn how you did</span>
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
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900 font-medium">
                    {selectedIssue === 'insulin'
                      ? "You'll be with Diabetes Advocates, talking to voters about lowering the price of insulin."
                      : "You'll be talking about the increasing wildfire risk in your area. You're focusing on increased training for wildfire fighters, which mitigates the issue here and now, and gets our government to take climate change threats more seriously."}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Key Phrases */}
        <div className="space-y-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-sans">Share your story</CardTitle>
              <p className="text-gray-600 text-sm font-sans">
                In the roleplay, you'll share a real time you were impacted by a related issue. You'll share a time someone was there for
                you, so you and the voter can relate as people, not as debaters.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>What happened?</Label>
                  <Select value={eventType} onValueChange={handleEventChange}>
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
                  <Label>Who was there for you?</Label>
                  <Select value={personType} onValueChange={handlePersonChange}>
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
                  <Label>How did you feel?</Label>
                  <Select value={selectedFeeling} onValueChange={handleFeelingChange}>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-sans">Learn their perspective</CardTitle>
              <p className="text-gray-600 text-sm font-sans">
                You'll ask the voter to share their perspective. Listening well means digging deeper, not just into their beliefs, but who
                they care about in their life.
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600 text-sm font-sans">You'll use this question to understand what matters to them personally.</p>
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

          <div className="grid md:grid-cols-2 gap-6">
            {/* Your Script Column */}
            <Card>
              <CardHeader>
                <CardTitle className="font-sans">Your script</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {canProceed() ? (
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Framing:</h4>
                        <p className="text-gray-700 font-mono text-sm">
                          "My name is [your name], I'm here with{' '}
                          {currentIssue && <span dangerouslySetInnerHTML={{ __html: currentIssue.organization }} />} to talk about{' '}
                          {currentIssue?.plainLanguage}."
                        </p>
                      </div>
                    </div>

                    <div className="text-gray-500 text-sm italic ml-9">(listen to what they say)</div>

                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Share your story:</h4>
                        <p className="text-gray-700 font-mono text-sm">
                          "One time, I {eventType} and was really worried. What happened was... My {personType} was really there for me.
                          They helped me by... and that really made me feel {selectedFeeling}. Is there a time someone was really there for
                          you?"
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Learn their perspective:</h4>
                        <p className="text-gray-700 font-mono text-sm">"How does this issue affect people you care about?"</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                        4
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Ask for action:</h4>
                        <p className="text-gray-700 font-mono text-sm">
                          "Now that we've explored the issue together, would you take your phone and tell your representative Peter Gerbil
                          how you feel, at 555-4567?"
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400 font-sans">Complete the preparation above to see your script</p>
                )}
              </CardContent>
            </Card>

            {/* Avoid These Pitfalls Column */}
            <Card>
              <CardHeader>
                <CardTitle className="font-sans text-red-600">Avoid these pitfalls</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center mb-2">
                      <X className="w-4 h-4 text-red-600 mr-2" />
                      <h4 className="font-medium text-red-900 text-sm">Don't open with statistics:</h4>
                    </div>
                    {currentIssue ? (
                      <p className="text-red-800 text-xs font-mono">{currentIssue.dontSayText}</p>
                    ) : (
                      <p className="text-red-700 text-xs">
                        "Hello. Is this Frank I'm talking to? Do you have a few minutes to chat about healthcare? According to the CDC..."
                      </p>
                    )}
                  </div>

                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center mb-2">
                      <X className="w-4 h-4 text-red-600 mr-2" />
                      <h4 className="font-medium text-red-900 text-sm">Don't make it political:</h4>
                    </div>
                    <p className="text-red-800 text-xs font-mono">
                      "One time, I got sick and was really worried. I was able to see a doctor but Congress is trying to take away access to
                      healthcare for millions of other Americans."
                    </p>
                  </div>

                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center mb-2">
                      <X className="w-4 h-4 text-red-600 mr-2" />
                      <h4 className="font-medium text-red-900 text-sm">Don't rush the ask:</h4>
                    </div>
                    <p className="text-red-800 text-xs font-mono">
                      "I'm so glad we talked! Think about calling your representative and urging them to vote NO on H.R. 123. Have a good
                      day!"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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
