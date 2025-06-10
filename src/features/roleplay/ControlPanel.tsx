import { Button } from '@/ui/button';
import MicFFT from '@/ui/MicFFT';
import { Toggle } from '@/ui/toggle';
import { Clock, Pause, Phone, Play } from 'lucide-react';
import { useDialogue } from '@/features/dialogue/hooks/useDialogue';

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

function VoiceControlPanel() {
  const dialogueContext = useDialogue();
  const { disconnect, connect, status, micFft, togglePause } = dialogueContext;

  if (status !== 'connected' && status !== 'paused') {
    return (
      <Button
        className={'flex items-center gap-2 bg-dialogue-darkblue hover:bg-dialogue-darkblue/90'}
        onClick={connect}
        disabled={status !== 'not-started'}
      >
        <Phone className={'size-4'} strokeWidth={2} stroke={'currentColor'} />
        <span>{status == 'connecting' ? 'Starting...' : 'Begin Roleplay'}</span>
      </Button>
    );
  }

  return (
    <>
      <Toggle pressed={status === 'paused'} onPressedChange={() => togglePause()}>
        {status === 'paused' ? <Play className={'size-4'} /> : <Pause className={'size-4'} />}
      </Toggle>

      <div className={'relative grid h-8 w-48 shrink grow-0'}>
        <MicFFT fft={Array.from(micFft)} className={'fill-current'} />
      </div>

      <Button className="flex items-center gap-1" onClick={disconnect} variant="outline">
        <span>
          <Phone className={'size-4 opacity-50'} strokeWidth={2} stroke={'currentColor'} />
        </span>
        <span>End Roleplay</span>
      </Button>
    </>
  );
}

interface ControlPanelProps {
  currentStepInfo?: StepInfo;
  currentStep?: StepConfig;
}

export default function ControlPanel({ currentStepInfo, currentStep }: ControlPanelProps) {
  const { status, timeElapsed } = useDialogue();

  return (
    <div className="flex items-center justify-center">
      <div className={'p-4 bg-card border border-border rounded-lg shadow-sm flex items-center gap-4'}>
        <VoiceControlPanel />

        {(status === 'connected' || status === 'paused') && (
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-gray-500" />
            <span className="text-sm font-medium">
              {currentStepInfo && currentStep
                ? `${Math.floor(currentStepInfo.timeInStep / 60)}:${(Math.floor(currentStepInfo.timeInStep) % 60).toString().padStart(2, '0')}/${Math.floor(currentStep.duration / 60)}:${(currentStep.duration % 60).toString().padStart(2, '0')}`
                : `${Math.floor(timeElapsed / 60)}:${(timeElapsed % 60).toString().padStart(2, '0')}/6:00`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
