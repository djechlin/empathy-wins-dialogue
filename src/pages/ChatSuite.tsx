import { AttendeeData } from '@/components/PromptBuilderSuite';
import { cn } from '@/lib/utils';
import { Button } from '@/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/ui/collapsible';
import { Bot, ChevronRight, MessageCircle, Pause, Play, User, Users } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import Chat from './Chat';

interface ChatSuiteProps {
  attendees: AttendeeData[];
  organizerPromptText: string;
  organizerFirstMessage: string;
}

interface ChatStatus {
  started: boolean;
  messageCount: number;
  lastActivity: Date | null;
}

const MemoizedChat = React.memo(Chat);

const ChatSuite = ({ attendees, organizerPromptText, organizerFirstMessage }: ChatSuiteProps) => {
  const [openAttendees, setOpenAttendees] = useState<Record<string, boolean>>({
    [attendees[0]?.id || '1']: true,
  });

  // Suite-level chat controls
  const [organizerMode, setOrganizerMode] = useState<'human' | 'ai'>('ai');
  const [attendeeMode, setAttendeeMode] = useState<'human' | 'ai'>('ai');
  const [paused, setPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Track individual chat statuses
  const [chatStatuses, setChatStatuses] = useState<Record<string, ChatStatus>>(() =>
    attendees.reduce(
      (acc, attendee) => ({
        ...acc,
        [attendee.id]: { started: false, messageCount: 0, lastActivity: null },
      }),
      {},
    ),
  );

  const toggleAttendee = useCallback((attendeeId: string) => {
    setOpenAttendees((prev) => ({
      ...prev,
      [attendeeId]: !prev[attendeeId],
    }));
  }, []);

  const handleModeToggle = useCallback(
    (participant: 'organizer' | 'attendee', mode: 'human' | 'ai') => {
      if (hasStarted) return;
      if (participant === 'organizer') {
        setOrganizerMode(mode);
      } else {
        setAttendeeMode(mode);
      }
    },
    [hasStarted],
  );

  const handleStartAll = useCallback(() => {
    setHasStarted(true);
  }, []);

  const handlePauseToggle = useCallback(() => {
    setPaused(!paused);
  }, [paused]);

  const updateChatStatus = useCallback((chatId: string, updates: Partial<ChatStatus>) => {
    setChatStatuses((prev) => ({
      ...prev,
      [chatId]: { ...prev[chatId], ...updates },
    }));
  }, []);

  // Create memoized status update callbacks for each attendee
  const statusUpdateCallbacks = useMemo(() => {
    const callbacks: Record<string, (updates: Partial<ChatStatus>) => void> = {};
    attendees.forEach((attendee) => {
      callbacks[attendee.id] = (updates: Partial<ChatStatus>) => updateChatStatus(attendee.id, updates);
    });
    return callbacks;
  }, [attendees, updateChatStatus]);

  // Calculate suite statistics with useMemo to prevent recalculation on every render
  const { totalChats, totalMessages, activeChats } = useMemo(() => {
    const total = attendees.filter((a) => a.systemPrompt.trim() !== '').length;
    const started = Object.values(chatStatuses).filter((status) => status.started).length;
    const messages = Object.values(chatStatuses).reduce((sum, status) => sum + status.messageCount, 0);
    const active = hasStarted && !paused ? started : 0;
    return { totalChats: total, totalMessages: messages, activeChats: active };
  }, [attendees, chatStatuses, hasStarted, paused]);

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Suite Controls</h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 rounded-full">
              <Users size={14} className="text-blue-600" />
              <span className="text-blue-700 font-medium">{totalChats} chats</span>
            </div>
            {hasStarted && (
              <>
                <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
                  <div className={`w-2 h-2 rounded-full ${activeChats > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                  <span className="text-green-700 font-medium">{activeChats} active</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 rounded-full">
                  <MessageCircle size={14} className="text-purple-600" />
                  <span className="text-purple-700 font-medium">{totalMessages} messages</span>
                </div>
                {paused && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 rounded-full">
                    <Pause size={14} className="text-orange-600" />
                    <span className="text-orange-700 font-medium">paused</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Organizer:</span>
              <div className="flex bg-gray-200 rounded-lg p-1">
                <button
                  onClick={() => handleModeToggle('organizer', 'human')}
                  disabled={hasStarted}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                    hasStarted
                      ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                      : organizerMode === 'human'
                        ? 'bg-white text-gray-900 shadow-sm ring-2 ring-blue-500'
                        : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <User size={12} />
                  Human
                </button>
                <button
                  onClick={() => handleModeToggle('organizer', 'ai')}
                  disabled={hasStarted}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                    hasStarted
                      ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                      : organizerMode === 'ai'
                        ? 'bg-white text-gray-900 shadow-sm ring-2 ring-blue-500'
                        : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Bot size={12} />
                  AI
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Attendee:</span>
              <div className="flex bg-gray-200 rounded-lg p-1">
                <button
                  onClick={() => handleModeToggle('attendee', 'human')}
                  disabled={hasStarted}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                    hasStarted
                      ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                      : attendeeMode === 'human'
                        ? 'bg-white text-gray-900 shadow-sm ring-2 ring-blue-500'
                        : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <User size={12} />
                  Human
                </button>
                <button
                  onClick={() => handleModeToggle('attendee', 'ai')}
                  disabled={hasStarted}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                    hasStarted
                      ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                      : attendeeMode === 'ai'
                        ? 'bg-white text-gray-900 shadow-sm ring-2 ring-blue-500'
                        : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Bot size={12} />
                  AI
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!hasStarted && (
              <Button onClick={handleStartAll} size="sm" className="px-4">
                <Play size={16} className="mr-2" />
                Start All
              </Button>
            )}
            {hasStarted && (
              <Button onClick={handlePauseToggle} size="sm" variant={paused ? 'default' : 'outline'} className="text-xs px-3">
                {paused ? (
                  <>
                    <Play size={12} className="mr-1" />
                    Resume All
                  </>
                ) : (
                  <>
                    <Pause size={12} className="mr-1" />
                    Pause All
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      <h3 className="font-semibold">Chats</h3>

      {attendees
        .filter((attendee) => attendee.systemPrompt.trim() !== '')
        .map((attendee) => (
          <Collapsible key={attendee.id} onOpenChange={() => toggleAttendee(attendee.id)}>
            <CollapsibleTrigger asChild>
              <div className="w-full justify-start text-sm font-medium p-2 h-auto cursor-pointer hover:bg-gray-100 rounded-md flex items-center justify-between">
                <div className="flex items-center">
                  <ChevronRight className={cn('h-4 w-4 mr-2 transition-transform', openAttendees[attendee.id] ? 'rotate-90' : '')} />
                  Chat with {attendee.displayName}
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {chatStatuses[attendee.id]?.started && (
                    <>
                      <div className={`w-2 h-2 rounded-full ${hasStarted && !paused ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                      <span className="text-gray-600">{chatStatuses[attendee.id]?.messageCount || 0} msgs</span>
                    </>
                  )}
                </div>
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent className="mt-2">
              <MemoizedChat
                attendeeDisplayName={attendee.displayName}
                organizerPromptText={organizerPromptText}
                organizerFirstMessage={organizerFirstMessage}
                attendeeSystemPrompt={attendee.systemPrompt}
                organizerMode={organizerMode}
                attendeeMode={attendeeMode}
                paused={paused}
                hasStarted={hasStarted}
                onStatusUpdate={statusUpdateCallbacks[attendee.id]}
              />
            </CollapsibleContent>
          </Collapsible>
        ))}
    </div>
  );
};

export default ChatSuite;
