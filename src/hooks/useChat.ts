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

// Base type for all participants
type BaseParticipantProps = {
  persona: 'organizer' | 'attendee';
  promptId?: string | null;
  systemPrompt: string;
};

// Human organizer with first message from UI
type HumanOrganizerProps = BaseParticipantProps & {
  mode: 'human';
  persona: 'organizer';
  organizerFirstMessage: string;
  getTextInput: () => Promise<string>;
};

// Human attendee (never has first message)
type HumanAttendeeProps = BaseParticipantProps & {
  mode: 'human';
  persona: 'attendee';
  organizerFirstMessage: null;
  getTextInput: () => Promise<string>;
};

// AI organizer with prompt from UI
type AiOrganizerFromUiProps = BaseParticipantProps & {
  mode: 'ai';
  persona: 'organizer';
  organizerFirstMessage: string;
  promptLocation: 'ui';
};

// AI organizer with prompt from database
type AiOrganizerFromDatabaseProps = BaseParticipantProps & {
  mode: 'ai';
  persona: 'organizer';
  organizerFirstMessage: null;
  promptLocation: 'database';
  organizerId: string;
};

// AI attendee (always from UI)
type AiAttendeeProps = BaseParticipantProps & {
  mode: 'ai';
  persona: 'attendee';
  organizerFirstMessage: null;
  promptLocation: 'ui';
};

type ParticipantProps = HumanOrganizerProps | HumanAttendeeProps | AiOrganizerFromUiProps | AiOrganizerFromDatabaseProps | AiAttendeeProps;

const useParticipant = (props: ParticipantProps) => {
  const { mode: humanOrAi, systemPrompt } = props;
  const getTextInput = props.mode === 'human' ? props.getTextInput : undefined;
  const organizerFirstMessage = 'organizerFirstMessage' in props ? props.organizerFirstMessage : null;
  const promptLocation = props.mode === 'ai' && 'promptLocation' in props ? props.promptLocation : null;
  const organizerId = props.mode === 'ai' && 'organizerId' in props ? props.organizerId : null;
  const [messages, setMessages] = useState<ParticipantMessage[]>([]);
  const [isBusy, setIsBusy] = useState(false);

  const chat = useCallback(
    async (msg: string | null): Promise<string> => {
      console.log('use participant callback', msg, messages.length);
      if (msg === null && messages.length === 0) {
        if (organizerFirstMessage) {
          console.log('first');
          setMessages([{ role: 'assistant' as const, content: organizerFirstMessage }]);
          return organizerFirstMessage;
        } else if (promptLocation === 'database' && humanOrAi === 'ai') {
          if (!organizerId) throw new Error('organizerId required for database prompts');
          console.log('heyyy');
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
          if (promptLocation === 'database') {
            if (!organizerId) throw new Error('organizerId required for database prompts');
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
    [messages, isBusy, systemPrompt, humanOrAi, getTextInput, organizerFirstMessage, organizerId, promptLocation],
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
const createChat = async (organizerPrompt: string, attendeePrompt: string): Promise<string> => {
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
      organizer_mode: 'ai',
      organizer_prompt_id: null,
      attendee_mode: 'ai',
      attendee_prompt_id: null,
      organizer_system_prompt: organizerPrompt,
      organizer_first_message: '',
      attendee_system_prompt: attendeePrompt,
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
      setState((prev) => ({ ...prev, history: [...prev.history, response], queue: [...prev.queue, response], thinking: null }));

      if (state.chatId) {
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
        if (!prev.chatId) {
          (async () => {
            try {
              const chatId = await createChat(pp[0].systemPrompt, pp[1].systemPrompt);
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
  }, [pp]);
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
      // End chat in database
      if (prev.chatId) {
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
  }, []);

  return { start, pause, end, history: state.history, thinking: state.thinking, speaker: state.speaker };
};
