import { Button } from '@/ui/button';
import { Switch } from '@/ui/switch';
import { PromptBuilderData } from '@/utils/promptBuilder';
import { MessageCircle, Pause, Play, Square, Users } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import Chat from './Chat';

interface ChatSuiteProps {
  attendees: PromptBuilderData[];
  coaches: PromptBuilderData[];
  scouts: PromptBuilderData[];
  organizerPromptText: string;
  organizerFirstMessage: string;
  hasValidOrganizer?: boolean;
}

interface ChatStatus {
  started: boolean;
  messageCount: number;
  lastActivity: Date | null;
}

const MemoizedChat = React.memo(Chat);

const ChatSuite = ({
  attendees,
  coaches,
  scouts,
  organizerPromptText,
  organizerFirstMessage,
  hasValidOrganizer = false,
}: ChatSuiteProps) => {
  // Suite-level chat controls - organizer is always AI, attendees vary by chat
  const organizerMode = 'ai'; // Fixed as AI
  const [controlStatus, setControlStatus] = useState<'ready' | 'started' | 'paused' | 'ended'>('ready');
  const [reuseChatsWithSameAIs, setReuseChatsWithSameAIs] = useState<boolean>(true);

  // Track individual chat statuses (including Human chat)
  const [chatStatuses, setChatStatuses] = useState<Record<string, ChatStatus>>(() => {
    const aiChats = attendees
      .filter((attendee) => attendee.starred)
      .reduce(
        (acc, attendee) => ({
          ...acc,
          [attendee.id]: { started: false, messageCount: 0, lastActivity: null },
        }),
        {},
      );

    // Add Human chat
    return {
      ...aiChats,
      human: { started: false, messageCount: 0, lastActivity: null },
    };
  });

  // No mode toggle needed - modes are fixed per chat

  const handleStartAll = useCallback(() => {
    setControlStatus('started');
  }, []);

  const handlePauseToggle = useCallback(() => {
    if (controlStatus === 'started') {
      setControlStatus('paused');
    } else if (controlStatus === 'paused') {
      setControlStatus('started');
    }
  }, [controlStatus]);

  const handleFinish = useCallback(() => {
    setControlStatus('ended');
  }, []);

  const updateChatStatus = useCallback((chatId: string, updates: Partial<ChatStatus>) => {
    setChatStatuses((prev) => ({
      ...prev,
      [chatId]: { ...prev[chatId], ...updates },
    }));
  }, []);

  // Create memoized status update callbacks for each chat (AI attendees + Human)
  const statusUpdateCallbacks = useMemo(() => {
    const callbacks: Record<string, (updates: Partial<ChatStatus>) => void> = {};
    attendees
      .filter((attendee) => attendee.starred)
      .forEach((attendee) => {
        callbacks[attendee.id] = (updates: Partial<ChatStatus>) => updateChatStatus(attendee.id, updates);
      });
    // Add Human chat callback
    callbacks.human = (updates: Partial<ChatStatus>) => updateChatStatus('human', updates);
    return callbacks;
  }, [attendees, updateChatStatus]);

  // Calculate suite statistics with useMemo to prevent recalculation on every render
  const { totalChats, totalMessages, activeChats } = useMemo(() => {
    const aiChats = attendees.filter((a) => a.starred && a.system_prompt.trim() !== '').length;
    const total = aiChats + 1; // +1 for Human chat
    const started = Object.values(chatStatuses).filter((status) => status.started).length;
    const messages = Object.values(chatStatuses).reduce((sum, status) => sum + status.messageCount, 0);
    const active = controlStatus === 'started' ? started : 0;
    return { totalChats: total, totalMessages: messages, activeChats: active };
  }, [attendees, chatStatuses, controlStatus]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold font-sans">Chats</h3>
        <div className="flex items-center gap-2">
          <label htmlFor="reuse-chats-toggle" className="text-sm text-gray-600">
            Re-use chats with exact same AIs
          </label>
          <Switch id="reuse-chats-toggle" checked={reuseChatsWithSameAIs} onCheckedChange={setReuseChatsWithSameAIs} />
        </div>
      </div>

      <div className="bg-gray-50 border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 rounded-full">
              <Users size={14} className="text-blue-600" />
              <span className="text-blue-700 font-medium">{totalChats} chats</span>
            </div>
            {controlStatus !== 'ready' && (
              <>
                <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
                  <div className={`w-2 h-2 rounded-full ${activeChats > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                  <span className="text-green-700 font-medium">{activeChats} active</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 rounded-full">
                  <MessageCircle size={14} className="text-purple-600" />
                  <span className="text-purple-700 font-medium">{totalMessages} messages</span>
                </div>
                {controlStatus === 'paused' && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 rounded-full">
                    <Pause size={14} className="text-orange-600" />
                    <span className="text-orange-700 font-medium">paused</span>
                  </div>
                )}
                {controlStatus === 'ended' && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-red-100 rounded-full">
                    <Square size={14} className="text-red-600" />
                    <span className="text-red-700 font-medium">ended</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0"></div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {controlStatus === 'ready' && (
              <Button onClick={handleStartAll} size="sm" className="px-3" disabled={!hasValidOrganizer}>
                <Play size={14} className="mr-1" />
                {'Start All'}
              </Button>
            )}
            {(controlStatus === 'started' || controlStatus === 'paused') && (
              <>
                <Button
                  onClick={handlePauseToggle}
                  size="sm"
                  variant={controlStatus === 'paused' ? 'default' : 'outline'}
                  className="text-xs px-2"
                >
                  {controlStatus === 'paused' ? (
                    <>
                      <Play size={12} className="mr-1" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause size={12} className="mr-1" />
                      Pause
                    </>
                  )}
                </Button>
                <Button onClick={handleFinish} size="sm" variant="destructive" className="text-xs px-2">
                  <Square size={12} className="mr-1" />
                  Finish
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* AI Attendee Chats */}
      {attendees
        .filter((attendee) => attendee.starred && attendee.system_prompt.trim() !== '')
        .map((attendee) => (
          <MemoizedChat
            key={attendee.id}
            attendeePb={attendee}
            organizerPb={{
              name: 'Organizer',
              system_prompt: organizerPromptText,
              firstMessage: organizerFirstMessage,
              id: 'organizer',
              starred: true,
              persona: 'organizer',
            }}
            organizerMode={organizerMode}
            attendeeMode="ai"
            controlStatus={controlStatus}
            onStatusUpdate={statusUpdateCallbacks[attendee.id]}
            coaches={coaches}
            scouts={scouts}
            defaultOpen={false}
          />
        ))}

      {/* Fixed Human Chat */}
      <MemoizedChat
        key="human"
        attendeePb={{ name: 'Human', system_prompt: '', firstMessage: '', id: 'human', starred: true, persona: 'attendee' }}
        organizerPb={{
          name: 'Organizer',
          system_prompt: organizerPromptText,
          firstMessage: organizerFirstMessage,
          id: 'organizer',
          starred: true,
          persona: 'organizer',
        }}
        organizerMode={organizerMode}
        attendeeMode="human"
        controlStatus={controlStatus}
        onStatusUpdate={statusUpdateCallbacks.human}
        coaches={coaches}
        scouts={scouts}
        defaultOpen={false}
      />

      {/* Active Coaches Cards - Moved to bottom */}
      {coaches.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">Active Coaches:</div>
          <div className="flex flex-wrap gap-2">
            {coaches.map((coach) => (
              <div key={coach.id} className="bg-red-100 border border-red-200 rounded-lg px-3 py-2 text-sm">
                <div className="font-medium text-red-800">{coach.name}</div>
                <div className="text-xs text-red-600 truncate max-w-[200px]">
                  {coach.system_prompt.length > 50 ? `${coach.system_prompt.substring(0, 47)}...` : coach.system_prompt || 'No prompt set'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Scouts Cards */}
      {scouts.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">Active Scouts:</div>
          <div className="flex flex-wrap gap-2">
            {scouts.map((scout) => (
              <div key={scout.id} className="bg-purple-50 border border-purple-200 rounded-lg px-3 py-2 text-sm">
                <div className="font-medium text-purple-800">{scout.name}</div>
                <div className="text-xs text-purple-600 truncate max-w-[200px]">
                  {scout.system_prompt.length > 50 ? `${scout.system_prompt.substring(0, 47)}...` : scout.system_prompt || 'No prompt set'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSuite;
