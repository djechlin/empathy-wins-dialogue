import { supabase } from '@/integrations/supabase/client';
import { WorkbenchResponse } from '@/types/edge-function-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface ParticipantMessage {
  role: 'user' | 'assistant';
  content: string;
}

function toPersona(index: 0 | 1) {
  return index === 0 ? 'organizer' : 'attendee';
}

const getAiResponse = async (updatedMessages: ParticipantMessage[], systemPrompt: string): Promise<string> => {
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

const getDemoAiResponse = async (organizerId: string, messages: ParticipantMessage[] = []): Promise<string> => {
  const { data, error } = await supabase.functions.invoke<WorkbenchResponse>('workbench', {
    body: {
      demo: {
        organizerId,
        messages,
      },
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

type ParticipantProps = {
  mode: 'human' | 'ai';
  persona: 'organizer' | 'attendee';
  systemPrompt: string;
  getTextInput?: () => Promise<string>;
} & (
  | { organizerFirstMessage: string; organizerId?: undefined }
  | { organizerFirstMessage: null; organizerId: string }
  | { organizerFirstMessage: null; organizerId?: undefined }
);

const useParticipant = ({ mode: humanOrAi, organizerFirstMessage, systemPrompt, getTextInput, organizerId }: ParticipantProps) => {
  const [messages, setMessages] = useState<ParticipantMessage[]>([]);
  const [isBusy, setIsBusy] = useState(false);

  const chat = useCallback(
    async (msg: string | null): Promise<string> => {
      console.log('useParticipant.chat called:', { msg, messagesLength: messages.length, organizerFirstMessage, organizerId, humanOrAi });

      // Handle first message
      if (msg === null && messages.length === 0) {
        if (organizerFirstMessage) {
          console.log('Returning organizer first message:', organizerFirstMessage);
          setMessages([{ role: 'assistant' as const, content: organizerFirstMessage }]);
          return organizerFirstMessage;
        } else if (organizerId && humanOrAi === 'ai') {
          console.log('Demo mode: using demo edge function for first message');
          setIsBusy(true);
          try {
            const responseText = await getDemoAiResponse(organizerId, []);
            setMessages([{ role: 'assistant' as const, content: responseText }]);
            return responseText;
          } finally {
            setIsBusy(false);
          }
        }
      }

      if (msg === null) {
        throw new Error('No message provided');
      }
      if (isBusy) {
        throw new Error('Participant is busy');
      }

      setIsBusy(true);

      try {
        const updatedMessages = [...messages, { role: 'user' as const, content: msg }];
        setMessages(updatedMessages);

        let responseText: string;

        if (humanOrAi === 'ai') {
          if (organizerId) {
            responseText = await getDemoAiResponse(organizerId, updatedMessages);
          } else {
            responseText = await getAiResponse(updatedMessages, systemPrompt);
          }
        } else {
          responseText = await getTextInput();
        }

        setMessages((prev) => [...prev, { role: 'assistant' as const, content: responseText }]);
        return responseText;
      } finally {
        setIsBusy(false);
      }
    },
    [messages, isBusy, systemPrompt, humanOrAi, getTextInput, organizerFirstMessage, organizerId],
  );

  return {
    chat,
    isBusy,
  };
};

export type Message = {
  id: string;
  senderIndex: 0 | 1;
  timestamp;
  sender: 'organizer' | 'attendee';
  content: string;
};

export type ControlStatus = 'ready' | 'started' | 'paused' | 'ended';

type State = {
  queue: (Message | null)[]; // null for first message
  history: Message[];
  controlStatus: ControlStatus;
  thinking: ParticipantProps | null;
  speaker: ParticipantProps;
  chatId: string | null;
};

let counter = 1;

// Database operations for chat tracking
const createChat = async (
  organizerMode: 'ai' | 'human',
  attendeeMode: 'ai' | 'human',
  organizerPromptId: string | null,
  attendeePromptId: string | null,
  organizerSystemPrompt: string,
  organizerFirstMessage: string,
  attendeeSystemPrompt: string,
): Promise<string> => {
  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('chats')
    .insert({
      user_id: user.id,
      organizer_mode: organizerMode,
      organizer_prompt_id: organizerPromptId,
      attendee_mode: attendeeMode,
      attendee_prompt_id: attendeePromptId,
      organizer_system_prompt: organizerSystemPrompt,
      organizer_first_message: organizerFirstMessage,
      attendee_system_prompt: attendeeSystemPrompt,
    })
    .select('id')
    .single();

  if (error) {
    throw error;
  }

  return data.id;
};

const endChat = async (chatId: string): Promise<void> => {
  const { error } = await supabase.from('chats').update({ ended_at: new Date().toISOString() }).eq('id', chatId);

  if (error) {
    throw error;
  }
};

const insertMessage = async (chatId: string, persona: 'organizer' | 'attendee', message: string): Promise<void> => {
  const { error } = await supabase.from('chat_messages').insert({
    chat_id: chatId,
    persona,
    message,
  });

  if (error) {
    throw error;
  }
};

export const useChat = (pp: [ParticipantProps, ParticipantProps]) => {
  const location = useLocation();
  const isDemoMode = location.pathname.includes('/demo');
  const [state, setState] = useState<State>({
    queue: [null],
    history: [],
    controlStatus: 'ready',
    thinking: null,
    speaker: pp[0],
    chatId: null,
  });
  const participant0 = useParticipant(pp[0]);
  const participant1 = useParticipant(pp[1]);
  const participants = useMemo(() => [participant0, participant1], [participant0, participant1]);
  useEffect(() => {
    if (state.controlStatus !== 'started' || state.queue.length === 0) {
      return;
    }
    const next = state.queue[0];
    const nextReceiver = next === null ? 0 : ((1 - next.senderIndex) as 0 | 1);
    // dequeue step
    setState((prev) => ({ ...prev, queue: prev.queue.slice(1), thinking: pp[nextReceiver], speaker: pp[nextReceiver] }));
    setTimeout(async () => {
      const content: string = await participants[nextReceiver].chat(next?.content || null);
      const response: Message = {
        id: (counter++).toString(),
        content,
        senderIndex: nextReceiver,
        sender: toPersona(nextReceiver),
        timestamp: new Date(),
      };
      // queue step
      setState((prev) => ({ ...prev, history: [...prev.history, response], queue: [...prev.queue, response], thinking: null }));

      // Insert message into database (skip in demo mode)
      if (!isDemoMode && state.chatId) {
        try {
          await insertMessage(state.chatId, response.sender, response.content);
        } catch (error) {
          console.error('Failed to insert message:', error);
        }
      }
    }, 0);
  }, [state.controlStatus, state.queue, participants, pp, isDemoMode, state.chatId]);

  const start = useCallback(async () => {
    setState((prev) => {
      if (prev.controlStatus === 'ready') {
        // Create chat in database (skip in demo mode)
        if (!isDemoMode && !prev.chatId) {
          (async () => {
            try {
              const chatId = await createChat(
                pp[0].mode,
                pp[1].mode,
                pp[0].organizerId || null,
                null, // attendee prompt ID not available
                pp[0].systemPrompt,
                pp[0].organizerFirstMessage || '',
                pp[1].systemPrompt,
              );
              setState((current) => ({ ...current, chatId }));
            } catch (error) {
              console.error('Failed to create chat:', error);
            }
          })();
        }
        return { ...prev, controlStatus: 'started' };
      } else if (prev.controlStatus === 'paused') {
        return { ...prev, controlStatus: 'started' };
      }
      return prev;
    });
  }, [isDemoMode, pp]);
  const pause = useCallback(() => {
    setState((prev) => {
      if (prev.controlStatus === 'started') {
        return { ...prev, controlStatus: 'paused' };
      }
      return prev;
    });
  }, []);

  const end = useCallback(async () => {
    setState((prev) => {
      // End chat in database (skip in demo mode)
      if (!isDemoMode && prev.chatId) {
        (async () => {
          try {
            await endChat(prev.chatId!);
          } catch (error) {
            console.error('Failed to end chat:', error);
          }
        })();
      }
      return { ...prev, controlStatus: 'ended' };
    });
  }, [isDemoMode]);

  return { start, pause, end, history: state.history, thinking: state.thinking, speaker: state.speaker };
};
