import { ToolCallHandler, VoiceProvider, useVoice as useHumeVoice, VoiceContextType } from '@humeai/voice-react';
import { ReactNode, useEffect, useState, createContext, useContext, useMemo } from 'react';
import { getHumeAccessToken } from '@/edge/getHumeAccessToken';
import { MockDialogueProvider, useMockDialogue } from './MockDialogueProvider';

// App-specific message types (no Hume types exposed)
export type DialogueMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  emotions?: Record<string, number>; // Simplified emotion scores
};

// Context for components outside the dialogue feature
type ExternalDialogueContext = {
  messages: DialogueMessage[];
  isPaused: boolean;
  togglePause: (state?: boolean) => boolean;
  status: { value: string };
};

// Context for components inside the dialogue feature
type InternalDialogueContext = ExternalDialogueContext & {
  isMuted: boolean;
  mute: () => void;
  unmute: () => void;
  fft: number[];
  micFft: Uint8Array;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  status: { value: string };
  rawMessages: VoiceContextType['messages']; // Expose raw Hume messages for internal components
};

interface DialogueProviderProps {
  configId?: string;
  children: ReactNode;
  onMessage?: (message: any) => void;
  className?: string;
  onToolCall?: ToolCallHandler;
  isMock?: boolean;
  [key: string]: any;
}

// Internal context (only accessible within dialogue/)
const InternalDialogueContext = createContext<InternalDialogueContext | null>(null);

// External context (accessible from anywhere)
const ExternalDialogueContext = createContext<ExternalDialogueContext | null>(null);

// Hook for components outside dialogue/ - only exposes messages and pause
export function useDialogue(): ExternalDialogueContext {
  const context = useContext(ExternalDialogueContext);
  if (!context) {
    throw new Error('useDialogue must be used within a DialogueProvider');
  }
  return context;
}

// Hook for components inside dialogue/ - exposes everything
export function useDialogueInternal(): InternalDialogueContext {
  const context = useContext(InternalDialogueContext);
  if (!context) {
    throw new Error('useDialogueInternal must be used within a DialogueProvider');
  }
  return context;
}

// Transform Hume message to app message
function transformHumeMessage(humeMessage: VoiceContextType['messages'][number], index: number): DialogueMessage | null {
  if (humeMessage.type !== 'user_message' && humeMessage.type !== 'assistant_message') {
    return null;
  }
  
  // Extract emotion scores if available
  const emotions = 'models' in humeMessage && humeMessage.models?.prosody?.scores 
    ? humeMessage.models.prosody.scores 
    : undefined;
  
  return {
    id: 'id' in humeMessage ? humeMessage.id || `msg-${index}` : `msg-${index}`,
    role: humeMessage.type === 'user_message' ? 'user' : 'assistant',
    content: humeMessage.message.content || '',
    timestamp: 'receivedAt' in humeMessage ? humeMessage.receivedAt : new Date(),
    emotions
  };
}

// Wrapper for real Hume voice provider
function HumeDialogueWrapper({ children }: { children: ReactNode }) {
  const humeContext = useHumeVoice();
  
  // Debug Hume context only on changes
  useEffect(() => {
    console.log('Hume context status changed:', humeContext.status.value);
    if (humeContext.error) {
      console.log('Hume context error:', humeContext.error);
    }
    if (humeContext.isSocketError) {
      console.log('Hume context socket error:', humeContext.isSocketError);
    }
  }, [humeContext.status.value, humeContext.error, humeContext.isSocketError]);
  
  const messages = useMemo(() => 
    humeContext.messages
      .map((msg, index) => transformHumeMessage(msg, index))
      .filter((msg): msg is DialogueMessage => msg !== null),
    [humeContext.messages]
  );

  const togglePause = useMemo(() => (state?: boolean) => {
    const targetState = state !== undefined ? state : !humeContext.isPaused;
    if (targetState) {
      humeContext.pauseAssistant();
      humeContext.mute();
    } else {
      humeContext.resumeAssistant();
      humeContext.unmute();
    }
    return targetState;
  }, [humeContext.isPaused, humeContext.pauseAssistant, humeContext.resumeAssistant, humeContext.mute, humeContext.unmute]);

  const externalContext: ExternalDialogueContext = useMemo(() => ({
    messages,
    isPaused: humeContext.isPaused,
    togglePause,
    status: humeContext.status
  }), [messages, humeContext.isPaused, togglePause, humeContext.status]);

  const internalContext: InternalDialogueContext = useMemo(() => ({
    ...externalContext,
    isMuted: humeContext.isMuted,
    mute: () => humeContext.mute(),
    unmute: () => humeContext.unmute(),
    fft: humeContext.fft || [],
    micFft: humeContext.micFft || new Uint8Array(0),
    isConnected: humeContext.status.value === 'connected',
    connect: () => humeContext.connect(),
    disconnect: () => humeContext.disconnect(),
    status: humeContext.status,
    rawMessages: humeContext.messages
  }), [externalContext, humeContext.isMuted, humeContext.mute, humeContext.unmute, humeContext.fft, humeContext.micFft, humeContext.status, humeContext.connect, humeContext.disconnect, humeContext.messages]);

  return (
    <ExternalDialogueContext.Provider value={externalContext}>
      <InternalDialogueContext.Provider value={internalContext}>
        {children}
      </InternalDialogueContext.Provider>
    </ExternalDialogueContext.Provider>
  );
}

// Wrapper for mock dialogue provider
function MockDialogueWrapper({ children }: { children: ReactNode }) {
  const mockContext = useMockDialogue();
  
  const messages = useMemo(() => 
    mockContext.messages
      .map((msg, index) => transformHumeMessage(msg, index))
      .filter((msg): msg is DialogueMessage => msg !== null),
    [mockContext.messages]
  );

  const togglePause = useMemo(() => (state?: boolean) => {
    const targetState = state !== undefined ? state : !mockContext.isPaused;
    if (targetState) {
      mockContext.pauseAssistant();
      mockContext.mute();
    } else {
      mockContext.resumeAssistant();
      mockContext.unmute();
    }
    return targetState;
  }, [mockContext.isPaused, mockContext.pauseAssistant, mockContext.resumeAssistant, mockContext.mute, mockContext.unmute]);

  const externalContext: ExternalDialogueContext = useMemo(() => ({
    messages,
    isPaused: mockContext.isPaused,
    togglePause,
    status: mockContext.status
  }), [messages, mockContext.isPaused, togglePause, mockContext.status]);

  const internalContext: InternalDialogueContext = useMemo(() => ({
    ...externalContext,
    isMuted: mockContext.isMuted,
    mute: () => mockContext.mute(),
    unmute: () => mockContext.unmute(),
    fft: mockContext.fft || [],
    micFft: mockContext.micFft || new Uint8Array(0),
    isConnected: mockContext.status.value === 'connected',
    connect: () => mockContext.connect(),
    disconnect: () => mockContext.disconnect(),
    status: mockContext.status,
    rawMessages: mockContext.messages
  }), [externalContext, mockContext.isMuted, mockContext.mute, mockContext.unmute, mockContext.fft, mockContext.micFft, mockContext.status, mockContext.connect, mockContext.disconnect, mockContext.messages]);

  return (
    <ExternalDialogueContext.Provider value={externalContext}>
      <InternalDialogueContext.Provider value={internalContext}>
        {children}
      </InternalDialogueContext.Provider>
    </ExternalDialogueContext.Provider>
  );
}

function RealHumeDialogueProvider({
  children,
  configId,
  onMessage,
  className,
  onToolCall,
  ...otherProps
}: DialogueProviderProps) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getToken() {
      try {
        const token = await getHumeAccessToken();
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
        <HumeDialogueWrapper>{children}</HumeDialogueWrapper>
      </VoiceProvider>
    </div>
  );
}

export function DialogueProvider(props: DialogueProviderProps) {
  const { isMock = false, ...otherProps } = props;

  if (isMock) {
    return (
      <MockDialogueProvider className={props.className}>
        <MockDialogueWrapper>{props.children}</MockDialogueWrapper>
      </MockDialogueProvider>
    );
  } else {
    return <RealHumeDialogueProvider {...otherProps} />;
  }
}