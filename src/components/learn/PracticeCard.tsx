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

          <VoiceCallWorkspace callId='deep-canvassing' />
    );
};

export default PracticeCard;