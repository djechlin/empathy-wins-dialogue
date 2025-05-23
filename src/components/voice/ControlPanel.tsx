import { useVoice, VoiceContextType } from '@humeai/voice-react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toggle } from '@/components/ui/toggle';
import MicFFT from './MicFFT';
import { cn } from '@/lib/utils';

export default function ControlPanel() {
  const { disconnect, connect, status, isMuted, unmute, mute, micFft }: VoiceContextType =
    useVoice();

  const handleStartCall = () => {
    connect()
      .then(() => {
        console.log('Voice connection established');
      })
      .catch((error) => {
        console.error('Failed to connect to voice:', error);
      });
  };

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 w-full p-4 flex items-center justify-center',
        'bg-gradient-to-t from-card via-card/90 to-card/0'
      )}
    >
      <AnimatePresence mode="wait">
        {status.value === 'connected' ? (
          <motion.div
            key="connected"
            initial={{
              y: '100%',
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: '100%',
              opacity: 0,
            }}
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

            <div className={'relative grid h-8 w-48 shrink grow-0'}>
              <MicFFT fft={micFft} className={'fill-current'} />
            </div>

            <Button
              className={'flex items-center gap-1'}
              onClick={disconnect}
              variant={'destructive'}
            >
              <span>
                <Phone className={'size-4 opacity-50'} strokeWidth={2} stroke={'currentColor'} />
              </span>
              <span>End Call</span>
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="disconnected"
            initial={{
              y: '100%',
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: '100%',
              opacity: 0,
            }}
            className={
              'p-4 bg-card border border-border rounded-lg shadow-sm flex items-center gap-4'
            }
          >
            <Button
              className={'flex items-center gap-2 bg-green-600 hover:bg-green-700'}
              onClick={handleStartCall}
            >
              <Phone className={'size-4'} strokeWidth={2} stroke={'currentColor'} />
              <span>Start Call</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}