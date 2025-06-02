import { VoiceContextType } from '@humeai/voice-react';
import { useVoice } from './HumeVoiceProvider';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Phone, Clock, Pause, Play } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import MicFFT from './MicFFT';
import { cn } from '@/lib/utils';
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

interface ControlPanelProps {
  onReportGenerated?: (report: ConversationReport) => void;
  isTimerActive?: boolean;
  timeElapsed?: number;
  onTimeChange?: (timeElapsed: number) => void;
  currentStepInfo?: StepInfo;
  currentStep?: StepConfig;
}

export default function ControlPanel({ onReportGenerated, isTimerActive = false, timeElapsed = 0, onTimeChange, currentStepInfo, currentStep }: ControlPanelProps) {

  const { disconnect, connect, status, isMuted, unmute, mute, micFft, messages, isPaused, pauseAssistant, resumeAssistant }: VoiceContextType =
    useVoice();

  // Internal timer state
  const [internalTimeElapsed, setInternalTimeElapsed] = useState(0);

  // Use external time if provided, otherwise use internal
  const currentTime = timeElapsed || internalTimeElapsed;

  useEffect(() => {
    if (!isTimerActive) {
      setInternalTimeElapsed(0);
    }
  }, [isTimerActive]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerActive && !isPaused && currentTime < 300) { // 5 minutes = 300 seconds
      interval = setInterval(() => {
        const newTime = currentTime + 1;
        setInternalTimeElapsed(newTime);
        onTimeChange?.(newTime);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, isPaused, currentTime, onTimeChange]);

  const handleStartCall = () => {
    connect()
      .then(() => {
        console.log('Voice connection established');
      })
      .catch((error) => {
        console.error('Failed to connect to voice:', error);
      });
  };

  const handleDisconnect = async () => {
      disconnect();
  };

  return (
    <div className="flex items-center justify-center">
        {status.value === 'connected' ? (
          <div
            className={
              'p-4 bg-card border border-border rounded-lg shadow-sm flex items-center gap-4'
            }
          >
            <Toggle
              pressed={!isMuted}
              onPressedChange={() => {
                if (isMuted) {
                  unmute();
                } else {
                  mute();
                }
              }}
            >
              {isMuted ? <MicOff className={'size-4'} /> : <Mic className={'size-4'} />}
            </Toggle>

            <Toggle
              pressed={isPaused}
              onPressedChange={() => {
                if (isPaused) {
                  resumeAssistant();
                } else {
                  pauseAssistant();
                }
              }}
            >
              {isPaused ? <Play className={'size-4'} /> : <Pause className={'size-4'} />}
            </Toggle>

            <div className={'relative grid h-8 w-48 shrink grow-0'}>
              <MicFFT fft={micFft} className={'fill-current'} />
            </div>

            <div className="flex items-center gap-4">
              <Button
                className={cn(
                  'flex items-center gap-1',
                  currentTime >= 300 && 'bg-dialogue-darkblue hover:bg-dialogue-darkblue/90 text-white'
                )}
                onClick={handleDisconnect}
                variant={currentTime >= 300 ? 'default' : 'secondary'}
              >
                <span>
                  <Phone className={'size-4 opacity-50'} strokeWidth={2} stroke={'currentColor'} />
                </span>
                <span>End Roleplay</span>
              </Button>
              
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-gray-500" />
                <span className="text-sm font-medium">
                  {currentStepInfo && currentStep ? (
                    `${Math.floor(currentStepInfo.timeInStep / 60)}:${(Math.floor(currentStepInfo.timeInStep) % 60).toString().padStart(2, '0')}/${Math.floor(currentStep.duration / 60)}:${(currentStep.duration % 60).toString().padStart(2, '0')}`
                  ) : (
                    `${Math.floor(currentTime / 60)}:${(currentTime % 60).toString().padStart(2, '0')}/5:00`
                  )}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={
              'p-4 bg-card border border-border rounded-lg shadow-sm flex items-center gap-4'
            }
          >
            <Button
              className={'flex items-center gap-2 bg-dialogue-darkblue hover:bg-dialogue-darkblue/90'}
              onClick={handleStartCall}
            >
              <Phone className={'size-4'} strokeWidth={2} stroke={'currentColor'} />
              <span>Begin Roleplay</span>
            </Button>
          </div>
        )}
    </div>
  );
}