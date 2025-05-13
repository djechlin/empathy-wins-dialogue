
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';

const LearningCards = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [comfortLevel, setComfortLevel] = useState([5]);
  const [friends, setFriends] = useState(['']);
  
  const handleNextCard = () => {
    if (currentCard < 2) {
      setCurrentCard(currentCard + 1);
    }
  };
  
  const handlePrevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
    }
  };
  
  const addFriend = () => {
    setFriends([...friends, '']);
  };
  
  const updateFriend = (index: number, value: string) => {
    const updatedFriends = [...friends];
    updatedFriends[index] = value;
    setFriends(updatedFriends);
  };
  
  const removeFriend = (index: number) => {
    const updatedFriends = friends.filter((_, i) => i !== index);
    setFriends(updatedFriends);
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm font-medium text-muted-foreground">Card {currentCard + 1} of 3</div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handlePrevCard} 
            disabled={currentCard === 0}
          >
            Previous
          </Button>
          <Button 
            onClick={handleNextCard} 
            disabled={currentCard === 2}
            className="bg-dialogue-purple hover:bg-dialogue-darkblue"
          >
            Next
          </Button>
        </div>
      </div>
      
      {/* Card 1: Comfort Level Slider */}
      {currentCard === 0 && (
        <Card className="shadow-lg border-dialogue-neutral animate-fade-in">
          <CardHeader>
            <CardTitle>How comfortable are you having political conversations?</CardTitle>
            <CardDescription>
              Rate your comfort level on a scale from 1 to 10
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div>
                <Slider 
                  value={comfortLevel} 
                  onValueChange={setComfortLevel}
                  max={10}
                  min={1}
                  step={1}
                  className="py-4"
                />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>1 - Very uncomfortable</span>
                  <span>10 - Very comfortable</span>
                </div>
              </div>
              <div className="text-center text-xl font-heading">
                Your comfort level: <span className="text-dialogue-purple font-bold">{comfortLevel}</span>
              </div>
              <p className="text-muted-foreground">
                Understanding your starting point helps us tailor the learning experience for you.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Card 2: YouTube Video */}
      {currentCard === 1 && (
        <Card className="shadow-lg border-dialogue-neutral animate-fade-in">
          <CardHeader>
            <CardTitle>Introduction to Empathetic Political Dialogue</CardTitle>
            <CardDescription>
              Watch this short video to learn the basics of having productive political conversations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video">
              <iframe 
                className="w-full h-full rounded-md"
                src="https://www.youtube.com/embed/zOgCdDJYF4U" 
                title="Introduction to Empathetic Political Dialogue"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <p className="mt-4 text-muted-foreground">
              This video explains key concepts and strategies for engaging in meaningful political discussions 
              with friends, family, and colleagues.
            </p>
          </CardContent>
        </Card>
      )}
      
      {/* Card 3: Friends List */}
      {currentCard === 2 && (
        <Card className="shadow-lg border-dialogue-neutral animate-fade-in">
          <CardHeader>
            <CardTitle>Who would you like to have better conversations with?</CardTitle>
            <CardDescription>
              List the people you want to connect with for meaningful political dialogue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {friends.map((friend, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={friend}
                    onChange={(e) => updateFriend(index, e.target.value)}
                    placeholder={`Friend ${index + 1}'s name`}
                    className="flex-grow"
                  />
                  {friends.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeFriend(index)}
                      className="shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              
              <Button 
                variant="outline" 
                onClick={addFriend}
                className="w-full border-dashed border-dialogue-neutral"
              >
                <Plus className="mr-2 h-4 w-4" /> Add another person
              </Button>
              
              <div className="pt-4">
                <p className="text-muted-foreground mb-4">
                  These are the people you've identified for having more productive political conversations. 
                  Once you complete this lesson, you'll have tools to engage with them effectively.
                </p>
                <Button className="w-full bg-dialogue-purple hover:bg-dialogue-darkblue">
                  Save My List
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LearningCards;
