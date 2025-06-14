import { useContext } from 'react';
import { ConversationSessionContext } from '../providers/ConversationSessionProvider';

export function useConversationSession() {
  const context = useContext(ConversationSessionContext);
  if (context === undefined) {
    throw new Error('useConversationSession must be used within a ConversationSessionProvider');
  }
  return context;
}