import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { AssemblyAI } from 'assemblyai';
import { getAssemblyAccessToken } from '@/lib/getAssemblyAccessToken';

interface AssemblyVoiceContextType {
  isConnected: boolean;
  isRecording: boolean;
  transcript: string;
  error: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  clearTranscript: () => void;
}

const AssemblyVoiceContext = createContext<AssemblyVoiceContextType | null>(null);

export const useAssemblyVoice = () => {
  const context = useContext(AssemblyVoiceContext);
  if (!context) {
    throw new Error('useAssemblyVoice must be used within AssemblyVoiceProvider');
  }
  return context;
};

interface AssemblyVoiceProviderProps {
  children: React.ReactNode;
  onTranscript?: (transcript: string) => void;
}

export const AssemblyVoiceProvider: React.FC<AssemblyVoiceProviderProps> = ({ 
  children, 
  onTranscript 
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const clientRef = useRef<AssemblyAI | null>(null);
  const realtimeServiceRef = useRef<any | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      
      // Get Assembly AI access token
      const token = await getAssemblyAccessToken();
      
      // Initialize AssemblyAI client
      const client = new AssemblyAI({
        apiKey: token,
      });
      clientRef.current = client;
      
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
        }
      });
      streamRef.current = stream;
      
      // Start real-time transcription
      const realtimeService = client.realtime.transcriber({
        sampleRate: 16000,
      });
      
      realtimeServiceRef.current = realtimeService;
      
      realtimeService.on('open', () => {
        console.log('Connected to Assembly AI');
        setIsConnected(true);
        setIsRecording(true);
      });
      
      realtimeService.on('transcript', (transcript) => {
        if (transcript.message_type === 'FinalTranscript') {
          const newTranscript = transcript.text;
          setTranscript(prev => prev + newTranscript + ' ');
          onTranscript?.(newTranscript);
        }
      });
      
      realtimeService.on('error', (error) => {
        console.error('AssemblyAI error:', error);
        setError('Transcription error occurred');
      });
      
      realtimeService.on('close', () => {
        console.log('Disconnected from Assembly AI');
        setIsConnected(false);
        setIsRecording(false);
      });
      
      // Connect to the real-time service
      await realtimeService.connect();
      
      // Set up audio processing
      const audioContext = new AudioContext({ sampleRate: 16000 });
      const mediaStreamSource = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      
      processor.onaudioprocess = (event) => {
        const inputBuffer = event.inputBuffer;
        const inputData = inputBuffer.getChannelData(0);
        
        // Convert Float32Array to Int16Array for AssemblyAI
        const int16Data = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          int16Data[i] = Math.max(-32768, Math.min(32767, inputData[i] * 32768));
        }
        
        // Send audio data to AssemblyAI
        if (realtimeService && isConnected) {
          realtimeService.sendAudio(int16Data.buffer);
        }
      };
      
      mediaStreamSource.connect(processor);
      processor.connect(audioContext.destination);
      
    } catch (err) {
      console.error('Error starting recording:', err);
      setError(err instanceof Error ? err.message : 'Failed to start recording');
    }
  }, [onTranscript, isConnected]);

  const stopRecording = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (realtimeServiceRef.current) {
      realtimeServiceRef.current.close();
      realtimeServiceRef.current = null;
    }
    
    setIsRecording(false);
    setIsConnected(false);
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, [stopRecording]);

  const value: AssemblyVoiceContextType = {
    isConnected,
    isRecording,
    transcript,
    error,
    startRecording,
    stopRecording,
    clearTranscript,
  };

  return (
    <AssemblyVoiceContext.Provider value={value}>
      {children}
    </AssemblyVoiceContext.Provider>
  );
};