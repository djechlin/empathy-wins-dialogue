'use client';

import { ReactNode, useCallback, useState } from 'react';
import { MicrophoneState } from './microphoneConstants';
import { MicrophoneContext } from './microphoneContext';

interface MicrophoneContextProviderProps {
  children: ReactNode;
}

// micFft is clearly done wrong and not doing anything here
const MicrophoneContextProvider: React.FC<MicrophoneContextProviderProps> = ({ children }) => {
  const [microphoneState, setMicrophoneState] = useState<MicrophoneState>(MicrophoneState.NotSetup);
  const [microphone, setMicrophone] = useState<MediaRecorder | null>(null);

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
        micFft: Array(32).fill(0),
      }}
    >
      {children}
    </MicrophoneContext.Provider>
  );
};

export default MicrophoneContextProvider;
