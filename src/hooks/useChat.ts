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

  let responseText: string;
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

  let responseText: string;
  if (data?.message) {
    responseText = data.message;
  } else if (typeof data === 'string') {
    responseText = data;
  } else {
    responseText = 'Sorry, I had trouble responding. Can you try again?';
  }

  return responseText;
};

type BaseParticipantProps = {
  persona: 'organizer' | 'attendee';
  mode: 'human' | 'ai';
  displayName: string;
  organizerFirstMessage?: string;
  organizerId?: string;
  attendeeId?: string;
  systemPrompt?: string;
  promptLocation?: 'database' | 'local';
};

type HumanOrganizerProps = BaseParticipantProps & {
  mode: 'human';
  persona: 'organizer';
  getTextInput: () => Promise<string>;
};

type HumanAttendeeProps = BaseParticipantProps & {
  mode: 'human';
  persona: 'attendee';
  getTextInput: () => Promise<string>;
};

type AiOrganizerFromUiProps = BaseParticipantProps & {
  mode: 'ai';
  persona: 'organizer';
  organizerFirstMessage: string;
  organizerId: string;
  systemPrompt: string;
  promptLocation: 'local';
};

type AiOrganizerFromDatabaseProps = BaseParticipantProps & {
  mode: 'ai';
  persona: 'organizer';
  organizerId: string;
  promptLocation: 'database';
};

type AiAttendeeProps = BaseParticipantProps & {
  mode: 'ai';
  persona: 'attendee';
  attendeeId: string;
  systemPrompt: string;
};

export type ParticipantProps =
  | HumanOrganizerProps
  | HumanAttendeeProps
  | AiOrganizerFromUiProps
  | AiOrganizerFromDatabaseProps
  | AiAttendeeProps;

const useParticipant = (props: ParticipantProps) => {
  const { mode } = props;
  const getTextInput = mode === 'human' ? props.getTextInput : undefined;
  const organizerFirstMessage = 'organizerFirstMessage' in props ? props.organizerFirstMessage : null;
  const promptLocation = props.mode === 'ai' && 'promptLocation' in props ? props.promptLocation : null;
  const systemPrompt = props.systemPrompt;
  const organizerId = props.mode === 'ai' && 'organizerId' in props ? props.organizerId : undefined;
  const [messages, setMessages] = useState<ParticipantMessage[]>([]);

  const chat = useCallback(
    async (msg: string | null): Promise<string> => {
      if (msg === null && messages.length === 0) {
        if (mode === 'ai' && promptLocation === 'local') {
          setMessages([{ role: 'assistant' as const, content: organizerFirstMessage }]);
          return organizerFirstMessage;
        } else if (promptLocation === 'database') {
          const responseText = await getDemoAiResponse(organizerId, []);
          setMessages([{ role: 'assistant' as const, content: responseText }]);
          return responseText;
        }
      }

      const updatedMessages = [...messages, { role: 'user' as const, content: msg }];
      setMessages(updatedMessages);

      let responseText: string;
      if (mode === 'human') {
        responseText = await getTextInput();
      } else if (promptLocation === 'database') {
        responseText = await getDemoAiResponse(organizerId, updatedMessages);
      } else {
        responseText = await getAiResponse(updatedMessages, systemPrompt);
      }

      setMessages((prev) => [...prev, { role: 'assistant' as const, content: responseText }]);
      return responseText;
    },
    [messages, mode, getTextInput, organizerFirstMessage, organizerId, promptLocation, systemPrompt],
  );

  return {
    chat,
  };
};

export type Message = {
  id: string;
  senderIndex: 0 | 1;
  timestamp: Date;
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

const createChat = async (
  organizerPrompt: string,
  attendeePrompt: string,
  organizerMode: 'human' | 'ai' = 'ai',
  attendeeMode: 'human' | 'ai' = 'ai',
  organizerPromptId?: string | null,
  attendeePromptId?: string | null,
): Promise<string> => {
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
      organizer_prompt_id: organizerPromptId || null,
      attendee_mode: attendeeMode,
      attendee_prompt_id: attendeePromptId || null,
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
  const { error } = await supabase.from('chats').update({ ended_at: new Date().toISOString() }).eq('id', chatId).is('ended_at', null);

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
      setState((prev) => {
        if (response.sender === 'attendee' && response.content.includes('{{DONE}}')) {
          const newState = { ...prev, history: [...prev.history, response], thinking: null, controlStatus: 'ended' as ControlStatus };

          insertMessage(newState.chatId, response.sender, response.content).catch((error) => {
            console.error('Failed to insert message:', error);
          });

          // Only end the chat if it hasn't been ended already
          if (newState.chatId && prev.controlStatus !== 'ended') {
            (async () => {
              try {
                await endChat(newState.chatId!);
              } catch (error) {
                console.error('Failed to end chat:', error);
              }
            })();
          }

          return newState;
        }

        const newState = { ...prev, history: [...prev.history, response], queue: [...prev.queue, response], thinking: null };
        return newState;
      });
    }, 0);
  }, [state.controlStatus, state.queue, participants, pp, isDemoMode, state.chatId]);

  const start = useCallback(async () => {
    setState((prev) => {
      if (prev.controlStatus === 'ready') {
        if (!prev.chatId) {
          (async () => {
            try {
              const chatResult = await createChat(
                pp[0].systemPrompt,
                pp[1].systemPrompt,
                pp[0].mode,
                pp[1].mode,
                pp[0].organizerId,
                pp[1].attendeeId,
              );
              setState((current) => ({ ...current, chatId: chatResult, controlStatus: 'started' }));
            } catch (error) {
              console.error('Failed to create chat:', error);
              setState((current) => ({ ...current, controlStatus: 'started' }));
            }
          })();
          return prev;
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
      if (prev.chatId && prev.controlStatus !== 'ended') {
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

  return {
    start,
    pause,
    end,
    history: state.history,
    thinking: state.thinking,
    speaker: state.speaker,
    controlStatus: state.controlStatus,
    chatId: state.chatId,
  };
};
