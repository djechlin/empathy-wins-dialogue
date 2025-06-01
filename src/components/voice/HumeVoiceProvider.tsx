
import { ToolCallHandler, VoiceProvider, useVoice as useHumeVoice, VoiceContextType } from '@humeai/voice-react';
import { ReactNode, useEffect, useState, createContext, useContext } from 'react';
import { getHumeAccessToken } from '@/lib/getHumeAccessToken';
import { MockVoiceProvider, useMockVoice } from './MockVoiceProvider';

interface HumeVoiceProviderProps {
  configId?: string;
  children: ReactNode;
  onMessage?: (message: any) => void;
  className?: string;
  onToolCall?: ToolCallHandler;
  isMock?: boolean;
  [key: string]: any; // Allow other VoiceProvider props to pass through
}

// Create a unified context
const UnifiedVoiceContext = createContext<VoiceContextType | null>(null);

// Always call the same hook
export function useVoice() {
  const context = useContext(UnifiedVoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a HumeVoiceProvider');
  }
  return context;
}

// Wrapper that connects real Hume provider to unified context
function RealVoiceWrapper({ children }: { children: ReactNode }) {
  const voiceContext = useHumeVoice();

  return (
    <UnifiedVoiceContext.Provider value={voiceContext}>
      {children}
    </UnifiedVoiceContext.Provider>
  );
}

// Wrapper that connects mock provider to unified context
function MockVoiceWrapper({ children }: { children: ReactNode }) {
  const voiceContext = useMockVoice();

  return (
    <UnifiedVoiceContext.Provider value={voiceContext}>
      {children}
    </UnifiedVoiceContext.Provider>
  );
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
        <RealVoiceWrapper>{children}</RealVoiceWrapper>
      </VoiceProvider>
    </div>
  );
}

export function HumeVoiceProvider(props: HumeVoiceProviderProps) {
  const { isMock = false, ...otherProps } = props;

  console.log('HumeVoiceProvider: Mock mode', isMock);

  if (isMock) {
    return (
      <MockVoiceProvider className={props.className}>
        <MockVoiceWrapper>{props.children}</MockVoiceWrapper>
      </MockVoiceProvider>
    );
  } else {
    return <RealHumeVoiceProvider {...otherProps} />;
  }
}
