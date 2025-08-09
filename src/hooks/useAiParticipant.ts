import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { type WorkbenchRequest, type WorkbenchResponse } from '@/integrations/supabase/types';
import { type PromptBuilderRef } from '@/components/PromptBuilder';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const useAiParticipant = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isBusy, setIsBusy] = useState(false);

  const chat = useCallback(
    async (msg: string, promptBuilder: PromptBuilderRef): Promise<string> => {
      if (isBusy || !promptBuilder) {
        throw new Error('AI participant is busy or prompt builder not available');
      }

      setIsBusy(true);

      try {
        // Add user message to history
        const userMessage: ChatMessage = { role: 'user', content: msg };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);

        // Prepare request for edge function
        const systemPrompt = promptBuilder.getFullPrompt();
        const requestBody: WorkbenchRequest = {
          messages: updatedMessages,
          systemPrompt,
        };

        // Call the workbench edge function
        const { data, error } = await supabase.functions.invoke<WorkbenchResponse>('workbench', {
          body: requestBody,
        });

        if (error) {
          throw error;
        }

        // Extract response text
        let responseText: string;
        if (data?.message) {
          responseText = data.message;
        } else if (typeof data === 'string') {
          responseText = data;
        } else {
          responseText = 'Sorry, I had trouble responding. Can you try again?';
        }

        // Add AI response to history
        const aiMessage: ChatMessage = { role: 'assistant', content: responseText };
        const finalMessages = [...updatedMessages, aiMessage];
        setMessages(finalMessages);

        return responseText;
      } catch (error) {
        console.error('Error in AI participant chat:', error);
        throw error;
      } finally {
        setIsBusy(false);
      }
    },
    [messages, isBusy],
  );

  return {
    chat,
    isBusy,
    messages,
  };
};
