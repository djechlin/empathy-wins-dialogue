import { createContext, ReactNode, useState, useCallback } from 'react';
import { DialogueMessage } from '../types';

interface ConversationSessionContextType {
  messages: DialogueMessage[];
  addMessage: (message: DialogueMessage) => void;
  setMessages: (messages: DialogueMessage[]) => void;
  clearSession: () => void;
  hasMessages: boolean;
}

export const ConversationSessionContext = createContext<ConversationSessionContextType | undefined>(undefined);

interface ConversationSessionProviderProps {
  children: ReactNode;
}

/**
 * ConversationSessionProvider maintains conversation state across page navigation
 * within a single session. This allows users to move between roleplay and report
 * pages without losing their conversation data.
 */
export function ConversationSessionProvider({ children }: ConversationSessionProviderProps) {
  const [messages, setMessages] = useState<DialogueMessage[]>([]);

  const addMessage = useCallback((message: DialogueMessage) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const clearSession = useCallback(() => {
    setMessages([]);
  }, []);

  const hasMessages = messages.length > 0;

  const value = {
    messages,
    addMessage,
    setMessages,
    clearSession,
    hasMessages,
  };

  return <ConversationSessionContext.Provider value={value}>{children}</ConversationSessionContext.Provider>;
}
