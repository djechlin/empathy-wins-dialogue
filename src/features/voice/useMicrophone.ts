import { useContext } from 'react';
import { MicrophoneContext, MicrophoneContextType } from './microphoneContext';

export function useMicrophone(): MicrophoneContextType {
  const context = useContext(MicrophoneContext);
  if (context === undefined) {
    throw new Error('useMicrophone must be used within a MicrophoneContextProvider');
  }
  return context;
}
