
import { ToolCallHandler, VoiceProvider, useVoice as useHumeVoice } from '@humeai/voice-react';
import { ReactNode, useEffect, useState } from 'react';
import { getHumeAccessToken } from '@/lib/getHumeAccessToken';
import { MockVoiceProvider, useMockVoice } from './MockVoiceProvider';

interface HumeVoiceProviderProps {
  configId?: string;
  children: ReactNode;
  onMessage?: (message: any) => void;
  className?: string;
  onToolCall?: ToolCallHandler;
  [key: string]: any; // Allow other VoiceProvider props to pass through
}

// Hook that switches between real and mock voice
export function useVoice() {
  const urlParams = new URLSearchParams(window.location.search);
  const isMock = urlParams.get('mock') === 'true';
  
  if (isMock) {
    return useMockVoice();
  } else {
    return useHumeVoice();
  }
}

function RealHumeVoiceProvider({
  children,
  configId,
  onMessage,
  className,
  onToolCall,
  ...otherProps
}: HumeVoiceProviderProps) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getToken() {
      console.log('getting token...');
      try {
        const token = await getHumeAccessToken();
        console.log('setting token...', token);
        setAccessToken(token);
      } catch (err) {
        console.error('Failed to fetch Hume token:', err);
        setError('Could not get Hume access token');
      }
    }
    getToken();
  }, []);

  if (error) {
    return <div className="p-8 text-red-500">Error: {error || 'Failed to load voice connection'}</div>;
  }

  if (accessToken === null) {
    return <div className="p-8">Loading voice connection...</div>;
  }

  return (
    <div className={className}>
      <VoiceProvider 
        onToolCall={onToolCall}
        auth={{ type: 'accessToken', value: accessToken }}
        configId={configId}
        onMessage={onMessage}
        debug={true}
        {...otherProps}
      >
        {children}
      </VoiceProvider>
    </div>
  );
}

export function HumeVoiceProvider(props: HumeVoiceProviderProps) {
  const urlParams = new URLSearchParams(window.location.search);
  const isMock = urlParams.get('mock') === 'true';
  
  console.log('HumeVoiceProvider: Mock mode', isMock);
  
  if (isMock) {
    return <MockVoiceProvider className={props.className}>{props.children}</MockVoiceProvider>;
  } else {
    return <RealHumeVoiceProvider {...props} />;
  }
}
