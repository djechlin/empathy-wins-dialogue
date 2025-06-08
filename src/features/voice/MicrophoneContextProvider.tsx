'use client';

import { useCallback, useState, ReactNode } from 'react';
import { MicrophoneState } from './microphoneConstants';
import { MicrophoneContext, MicrophoneContextType } from './microphoneContext';

interface MicrophoneContextProviderProps {
  children: ReactNode;
}

const MicrophoneContextProvider: React.FC<MicrophoneContextProviderProps> = ({ children }) => {
  const [microphoneState, setMicrophoneState] = useState<MicrophoneState>(MicrophoneState.NotSetup);
  const [microphone, setMicrophone] = useState<MediaRecorder | null>(null);
  const [micFft, setMicFft] = useState<number[]>(Array(32).fill(0));

  const setupMicrophone = async () => {
    setMicrophoneState(MicrophoneState.SettingUp);
    const userMedia = await navigator.mediaDevices.getUserMedia({
      audio: {
        noiseSuppression: true,
        echoCancellation: true,
      },
    });

    const microphone = new MediaRecorder(userMedia);

    setMicrophoneState(MicrophoneState.Ready);
    setMicrophone(microphone);
  };

  const stopMicrophone = useCallback(() => {
    setMicrophoneState(MicrophoneState.Pausing);

    if (microphone?.state === 'recording') {
      microphone.pause();
      setMicrophoneState(MicrophoneState.Paused);
    }
  }, [microphone]);

  const startMicrophone = useCallback(() => {
    setMicrophoneState(MicrophoneState.Opening);

    if (microphone?.state === 'paused') {
      microphone.resume();
    } else {
      microphone?.start(250);
    }

    setMicrophoneState(MicrophoneState.Open);
  }, [microphone]);

  return (
    <MicrophoneContext.Provider
      value={{
        microphone,
        startMicrophone,
        stopMicrophone,
        setupMicrophone,
        microphoneState,
        micFft,
      }}
    >
      {children}
    </MicrophoneContext.Provider>
  );
};

export default MicrophoneContextProvider;
