
import { ToolCallHandler, VoiceProvider } from '@humeai/voice-react';
import { ReactNode, useEffect, useState } from 'react';
import { getHumeAccessToken } from '@/lib/getHumeAccessToken';

interface AuthenticatingVoiceProviderProps {
  configId?: string;
  children: ReactNode;
  onMessage?: (message: any) => void;
  className?: string;
  onToolCall?: ToolCallHandler;
  [key: string]: any; // Allow other VoiceProvider props to pass through
}

export function AuthenticatingVoiceProvider({
  children,
  configId,
  onMessage,
  className,
  onToolCall,
  ...otherProps
}: AuthenticatingVoiceProviderProps) {
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
      <VoiceProvider onToolCall={onToolCall}
        auth={{ type: 'accessToken', value: accessToken }}
        configId={configId}
        onMessage={onMessage}
        {...otherProps}
      >
        {children}
      </VoiceProvider>
    </div>
  );
}
