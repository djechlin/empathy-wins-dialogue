import { CallWorkspace as VoiceCallWorkspace } from '@/components/voice/CallWorkspace';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import { SCENARIOS } from '@/lib/scriptData';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface PracticeCardProps {
  isOpen: boolean;
}

const PracticeCard = ({ isOpen }: PracticeCardProps) => {
    return (
        <Card className="shadow-lg border-dialogue-neutral animate-fade-in">
          <CardHeader>
            <CardTitle>Introduction to Empathetic Political Dialogue</CardTitle>
            <CardDescription>
              Watch this short video to learn the basics of having productive political conversations
            </CardDescription>
          </CardHeader>
          <CardContent>
          <div className="relative h-screen">
          <VoiceCallWorkspace callId='deep-canvassing' />
          <button
            className="fixed top-4 right-4 z-50 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Exit Practice
          </button>
        </div>
          </CardContent>
        </Card>

     
    );
};

export default PracticeCard;