import { Outlet } from 'react-router-dom';
import { ConversationSessionProvider } from '@/features/dialogue/providers/ConversationSessionProvider';

/**
 * ChallengeLayout wraps all challenge-related routes with the ConversationSessionProvider
 * to maintain conversation state across roleplay and report pages.
 */
export default function ChallengeLayout() {
  return (
    <ConversationSessionProvider>
      <Outlet />
    </ConversationSessionProvider>
  );
}
