import { useCallback } from 'react';

export const useHumanParticipant = () => {
  const chat = useCallback(async (msg: string): Promise<string> => {
    // For human participants, just return the message as-is
    // This maintains the same interface as AI participant
    return msg;
  }, []);

  return {
    chat,
    isBusy: false,
  };
};
