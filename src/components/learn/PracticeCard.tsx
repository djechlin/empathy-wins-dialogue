import { CallWorkspace as VoiceCallWorkspace } from '@/components/voice/CallWorkspace';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import {ScenarioId } from '@/lib/scriptData';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface PracticeCardProps {
  isOpen: boolean;
  scenarioId: ScenarioId;
}

const PracticeCard = ({ isOpen, scenarioId }: PracticeCardProps) => {
    return (

          <VoiceCallWorkspace callId={scenarioId} />
    );
};

export default PracticeCard;