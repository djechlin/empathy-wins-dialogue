import { supabase } from '@/integrations/supabase/client';
import { WorkbenchResponse } from '@/types/edge-function-types';
import { useCallback, useEffect, useMemo, useState } from 'react';

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
};

let counter = 1;

export const useChat = (pp: [ParticipantProps, ParticipantProps]) => {
  const [state, setState] = useState<State>({ queue: [null], history: [], controlStatus: 'ready', thinking: null, speaker: pp[0] });
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
    }, 0);
  }, [state.controlStatus, state.queue, participants, pp]);

  const start = useCallback(async () => {
    setState((prev) => {
      if (prev.controlStatus === 'ready' || prev.controlStatus === 'paused') {
        return { ...prev, controlStatus: 'started' };
      }
      return prev;
    });
  }, []);
  const pause = useCallback(() => {
    setState((prev) => {
      if (prev.controlStatus === 'started') {
        return { ...prev, controlStatus: 'paused' };
      }
      return prev;
    });
  }, []);

  const end = useCallback(() => {
    setState((prev) => {
      return { ...prev, controlStatus: 'ended' };
    });
  }, []);

  return { start, pause, end, history: state.history, thinking: state.thinking, speaker: state.speaker };
};
