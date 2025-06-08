'use client';

import { createContext } from 'react';
import { MicrophoneState } from './microphoneConstants';

export interface MicrophoneContextType {
  microphone: MediaRecorder | null;
  startMicrophone: () => void;
  stopMicrophone: () => void;
  setupMicrophone: () => void;
  microphoneState: MicrophoneState | null;
  micFft: number[];
}

export const MicrophoneContext = createContext<MicrophoneContextType | undefined>(undefined);
