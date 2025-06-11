
import { Button } from '@/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Label } from '@/ui/label';
import { RadioGroup, RadioGroupItem } from '@/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { ArrowRight, Heart, RotateCcw, Users } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Preparation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultIssue = searchParams.get('issue') || 'insulin';

  const [selectedIssue, setSelectedIssue] = useState(defaultIssue);
  const [personType, setPersonType] = useState('');
  const [eventType, setEventType] = useState('');
  const [selectedFeeling, setSelectedFeeling] = useState('');

  const issueDetails = {
    insulin: {
      title: 'Healthcare - Insulin Affordability',
      plainLanguage: 'affordable insulin for people with diabetes',
      organization: 'Diabetes Advocates',
    },
    climate: {
      title: 'Climate - Wildfire Management',
      plainLanguage: 'protecting our communities from wildfires',
      organization: 'Safe Climate Advocates',
    },
  };

  const personOptions = ['mom', 'dad', 'brother', 'sister', 'son', 'daughter', 'relative', 'friend'];

  const eventOptions = ['got sick', 'got injured', 'had to see the doctor', 'went to the ER', 'had surgery', 'needed medicine'];

  const emotionOptions = ['relieved', 'scared', 'comforted', 'loved', 'happy', 'glad', 'grateful'];

  const currentIssue = issueDetails[selectedIssue as keyof typeof issueDetails];

  const handleStartRoleplay = () => {
    navigate(`/roleplay?issue=${selectedIssue}&person=${personType}&event=${encodeURIComponent(eventType)}&feeling=${selectedFeeling}`);
  };

  const canProceed = () => {
    return personType && eventType && selectedFeeling;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Conversation Strategy</h1>
          <p className="text-gray-600">Your roadmap for persuasive conversation</p>
        </div>

        {/* Issue Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Step 1: Frame the Issue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-4 block">Choose your issue:</Label>
              <RadioGroup value={selectedIssue} onValueChange={setSelectedIssue} className="space-y-3">
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="insulin" id="insulin" />
                  <Label htmlFor="insulin" className="flex-1 cursor-pointer">
                    <div className="font-medium">Healthcare - Insulin Affordability</div>
                    <div className="text-sm text-gray-600">Help families afford life-saving diabetes medication</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="climate" id="climate" />
                  <Label htmlFor="climate" className="flex-1 cursor-pointer">
                    <div className="font-medium">Climate - Wildfire Management</div>
                    <div className="text-sm text-gray-600">Protect communities from increasing wildfire risks</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Script Preview */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Your opening line:</h4>
              <p className="text-blue-800 italic text-lg">
                "My name is [your name], I'm here with {currentIssue.organization} to talk about {currentIssue.plainLanguage}."
              </p>
            </div>
          </CardContent>
        </Card>

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
                  <p className="text-green-700 italic text-lg">
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
              <p className="text-lg text-gray-700 italic">"Is there a time someone was really there for you?"</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">🔍 Start Exploring:</h3>
              <p className="text-lg text-gray-700 italic">"How does this issue affect people you care about?"</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">🎯 Tie It Together:</h3>
              <p className="text-lg text-gray-700 italic">"Does that change how you feel about {currentIssue.title.toLowerCase()}?"</p>
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
