import { supabase } from '@/integrations/supabase/client';
import { type WorkbenchResponse } from '@/integrations/supabase/types';
import { useCallback, useState } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Helper function for AI response logic
const getAiResponse = async (updatedMessages: ChatMessage[], systemPrompt: string): Promise<string> => {
  const { data, error } = await supabase.functions.invoke<WorkbenchResponse>('workbench', {
    body: {
      messages: updatedMessages,
      systemPrompt,
    },
  });

  if (error) {
    throw error;
  }

  let responseText;
  if (data?.message) {
    responseText = data.message;
  } else if (typeof data === 'string') {
    responseText = data;
  } else {
    responseText = 'Sorry, I had trouble responding. Can you try again?';
  }

  return responseText;
};

// only need firstMessage for organizers
export const useParticipant = (
  humanOrAi: 'human' | 'ai',
  firstMessage: string | null,
  systemPrompt: string,
  getTextInput?: () => Promise<string>,
) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isBusy, setIsBusy] = useState(false);

  const chat = useCallback(
    async (msg: string | null): Promise<string> => {
      if (messages.length === 0) {
        return firstMessage;
      }
      if (msg === null) {
        throw new Error('No message provided');
      }
      if (isBusy) {
        throw new Error('Participant is busy');
      }

      setIsBusy(true);

      try {
        // Add user message to conversation history
        const updatedMessages = [...messages, { role: 'user' as const, content: msg }];
        setMessages(updatedMessages);

        let responseText: string;

        if (humanOrAi === 'ai') {
          responseText = await getAiResponse(updatedMessages, systemPrompt);
        } else {
          responseText = await getTextInput();
        }

        // Add response to conversation history
        setMessages((prev) => [...prev, { role: 'assistant' as const, content: responseText }]);
        return responseText;
      } finally {
        setIsBusy(false);
      }
    },
    [messages, isBusy, systemPrompt, humanOrAi, getTextInput, firstMessage],
  );

  return {
    chat,
    isBusy,
  };
};
