import { useDialogueInternal } from './providers/DialogueProvider';
import { Button } from '@/ui/button';
import { Mic, MicOff, Phone, Clock, Pause, Play } from 'lucide-react';
import { Toggle } from '@/ui/toggle';
import MicFFT from '@/ui/MicFFT';
import { useState, useEffect } from 'react';

interface StepInfo {
  stepIndex: number;
  stepId: string;
  timeInStep: number;
  timeRemaining: number;
}

interface StepConfig {
  id: string;
  title: string;
  duration: number;
  icon: string;
  subtitle: string;
}

interface VoiceControlPanelProps {
  onPauseChange?: (isPaused: boolean) => void;
}

function VoiceControlPanel({ onPauseChange }: VoiceControlPanelProps) {
  const dialogueContext = useDialogueInternal();
  const { disconnect, connect, status, isMuted, unmute, mute, micFft, isPaused, togglePause } = dialogueContext;

  const [isConnecting, setIsConnecting] = useState(false);

  // Stop the connecting state when we actually connect
  useEffect(() => {
    if (status.value === 'connected' && isConnecting) {
      console.log('Connection successful, stopping loading state');
      setIsConnecting(false);
    }
  }, [status.value, isConnecting]);

  const handleStartCall = async () => {
    setIsConnecting(true);
    try {
      console.log('Attempting to connect to voice...', { currentStatus: status.value });

      // Check and request microphone permissions first
      try {
        console.log('Requesting microphone permissions...');
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('Microphone permissions granted');
        stream.getTracks().forEach(track => track.stop()); // Stop the test stream
      } catch (micError) {
        console.error('Microphone permission denied:', micError);
        setIsConnecting(false);
        return;
      }

      await connect();
      console.log('Connect promise resolved', { newStatus: status.value });
      // Don't set isConnecting to false here - let the useEffect handle it based on status
    } catch (error) {
      console.error('Failed to connect to voice:', error);
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    disconnect();
  };

  const handlePauseToggle = () => {
    const newPausedState = togglePause();
    onPauseChange?.(newPausedState);
  };

  if (status.value !== 'connected') {
    return (
      <Button
        className={'flex items-center gap-2 bg-dialogue-darkblue hover:bg-dialogue-darkblue/90'}
        onClick={handleStartCall}
        disabled={isConnecting}
      >
        <Phone className={'size-4'} strokeWidth={2} stroke={'currentColor'} />
        <span>{isConnecting ? 'Starting...' : 'Begin Roleplay'}</span>
      </Button>
    );
  }

  return (
    <>
      <Toggle
        pressed={!isMuted}
        onPressedChange={() => isMuted ? unmute() : mute()}>
        {isMuted ? <MicOff className={'size-4'} /> : <Mic className={'size-4'} />}
      </Toggle>

      <Toggle
        pressed={isPaused}
        onPressedChange={handlePauseToggle}
      >
        {isPaused ? <Play className={'size-4'} /> : <Pause className={'size-4'} />}
      </Toggle>

      <div className={'relative grid h-8 w-48 shrink grow-0'}>
        <MicFFT fft={Array.from(micFft)} className={'fill-current'} />
      </div>

      <Button
        className="flex items-center gap-1"
        onClick={handleDisconnect}
        variant="outline"
      >
        <span>
          <Phone className={'size-4 opacity-50'} strokeWidth={2} stroke={'currentColor'} />
        </span>
        <span>End Roleplay</span>
      </Button>
    </>
  );
}

interface ControlPanelProps {
  isTimerActive?: boolean;
  timeElapsed?: number;
  onTimeChange?: (timeElapsed: number) => void;
  currentStepInfo?: StepInfo;
  currentStep?: StepConfig;
}

export default function ControlPanel({ isTimerActive = false, timeElapsed = 0, onTimeChange, currentStepInfo, currentStep }: ControlPanelProps) {
  const { status } = useDialogueInternal();

  // Internal timer state
  const [internalTimeElapsed, setInternalTimeElapsed] = useState(0);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  // Use external time if provided, otherwise use internal
  const currentTime = timeElapsed || internalTimeElapsed;

  useEffect(() => {
    if (!isTimerActive) {
      setInternalTimeElapsed(0);
    }
  }, [isTimerActive]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerActive && !isTimerPaused && currentTime < 360) { // 6:00 minutes = 360 seconds
      interval = setInterval(() => {
        const newTime = currentTime + 1;
        setInternalTimeElapsed(newTime);
        onTimeChange?.(newTime);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, isTimerPaused, currentTime, onTimeChange]);

  const handlePauseChange = (voiceIsPaused: boolean) => {
    setIsTimerPaused(voiceIsPaused);
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={
          'p-4 bg-card border border-border rounded-lg shadow-sm flex items-center gap-4'
        }
      >
        <VoiceControlPanel onPauseChange={handlePauseChange} />

        {status.value === 'connected' && (
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-gray-500" />
            <span className="text-sm font-medium">
              {currentStepInfo && currentStep ? (
                `${Math.floor(currentStepInfo.timeInStep / 60)}:${(Math.floor(currentStepInfo.timeInStep) % 60).toString().padStart(2, '0')}/${Math.floor(currentStep.duration / 60)}:${(currentStep.duration % 60).toString().padStart(2, '0')}`
              ) : (
                `${Math.floor(currentTime / 60)}:${(currentTime % 60).toString().padStart(2, '0')}/6:00`
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}