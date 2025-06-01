import { VoiceContextType } from '@humeai/voice-react';
import { useVoice } from './HumeVoiceProvider';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Phone, FileText, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toggle } from '@/components/ui/toggle';
import MicFFT from './MicFFT';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { generateReport } from '@/lib/claudeReport';
import { ConversationReport } from '@/types/conversationReport';


interface ControlPanelProps {
  onReportGenerated?: (report: ConversationReport) => void;
}

export default function ControlPanel({ onReportGenerated }: ControlPanelProps) {
  const [hasEndedCall, setHasEndedCall] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [capturedMessages, setCapturedMessages] = useState<any[]>([]);

  const { disconnect, connect, status, isMuted, unmute, mute, micFft, messages }: VoiceContextType =
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

  const generateConversationReport = async () => {
    // Use captured messages from when call ended
    console.log('capturedMessages? ', capturedMessages);
    if (!capturedMessages || capturedMessages.length === 0) {
      console.warn('No messages to analyze');
      return;
    }

    // Extract conversation transcript from captured messages
    const transcript = capturedMessages
      .filter(msg => msg.type === 'user_message' || msg.type === 'assistant_message')
      .map(msg => {
        const role = msg.message.role === 'user' ? 'Canvasser' : 'Voter';
        return `${role}: ${msg.message.content}`;
      })
      .join('\n\n');

    console.log('Generating report for transcript:', transcript);
    try {
      const generatedReport = await generateReport(transcript);
      onReportGenerated?.(generatedReport);
    } catch (error) {
      console.error('Failed to generate report:', error);
    }
  };


  const handleDisconnect = async () => {
      setCapturedMessages(messages); // Capture messages before clearing
      disconnect();
      setHasEndedCall(true);
  };

  const handleGenerateReport = async () => {
    console.log('handle generate report');
    setIsGeneratingReport(true);
    await generateConversationReport();
    setIsGeneratingReport(false);
  }

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
              onClick={handleDisconnect}
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
            {hasEndedCall ? (
              <Button
                onClick={handleGenerateReport}
                disabled={isGeneratingReport}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isGeneratingReport ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Generating Report (takes about a minute)...</span>
                  </>
                ) : (
                  <>
                    <FileText className="size-4" />
                    <span>View Results</span>
                  </>
                )}
              </Button>
            ) : (
              <Button
                className={'flex items-center gap-2 bg-green-600 hover:bg-green-700'}
                onClick={handleStartCall}
              >
                <Phone className={'size-4'} strokeWidth={2} stroke={'currentColor'} />
                <span>Start Call</span>
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}