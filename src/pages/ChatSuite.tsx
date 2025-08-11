import { Button } from '@/ui/button';
import { PromptBuilderData } from '@/utils/promptBuilder';
import { Bot, MessageCircle, Pause, Play, Square, User, Users } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import Chat from './Chat';

interface ChatSuiteProps {
  attendees: PromptBuilderData[];
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
  // Suite-level chat controls
  const [organizerMode, setOrganizerMode] = useState<'human' | 'ai'>('ai');
  const [attendeeMode, setAttendeeMode] = useState<'human' | 'ai'>('ai');
  const [controlStatus, setControlStatus] = useState<'ready' | 'started' | 'paused' | 'ended'>('ready');

  // Track individual chat statuses
  const [chatStatuses, setChatStatuses] = useState<Record<string, ChatStatus>>(() =>
    attendees
      .filter((attendee) => attendee.starred)
      .reduce(
        (acc, attendee) => ({
          ...acc,
          [attendee.id]: { started: false, messageCount: 0, lastActivity: null },
        }),
        {},
      ),
  );

  const handleModeToggle = useCallback(
    (participant: 'organizer' | 'attendee', mode: 'human' | 'ai') => {
      if (controlStatus !== 'ready') return;
      if (participant === 'organizer') {
        setOrganizerMode(mode);
      } else {
        setAttendeeMode(mode);
      }
    },
    [controlStatus],
  );

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

  // Create memoized status update callbacks for each starred attendee
  const statusUpdateCallbacks = useMemo(() => {
    const callbacks: Record<string, (updates: Partial<ChatStatus>) => void> = {};
    attendees
      .filter((attendee) => attendee.starred)
      .forEach((attendee) => {
        callbacks[attendee.id] = (updates: Partial<ChatStatus>) => updateChatStatus(attendee.id, updates);
      });
    return callbacks;
  }, [attendees, updateChatStatus]);

  // Calculate suite statistics with useMemo to prevent recalculation on every render
  const { totalChats, totalMessages, activeChats } = useMemo(() => {
    const total = attendees.filter((a) => a.starred && a.system_prompt.trim() !== '').length;
    const started = Object.values(chatStatuses).filter((status) => status.started).length;
    const messages = Object.values(chatStatuses).reduce((sum, status) => sum + status.messageCount, 0);
    const active = controlStatus === 'started' ? started : 0;
    return { totalChats: total, totalMessages: messages, activeChats: active };
  }, [attendees, chatStatuses, controlStatus]);

  return (
    <div className="space-y-4">
      <h3 className="font-semibold font-sans">Chats</h3>

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
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Organizer:</span>
              <div className="flex bg-gray-200 rounded-lg p-1">
                <button
                  onClick={() => handleModeToggle('organizer', 'human')}
                  disabled={controlStatus !== 'ready'}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                    controlStatus !== 'ready'
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
                  disabled={controlStatus !== 'ready'}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                    controlStatus !== 'ready'
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
                  disabled={controlStatus !== 'ready'}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                    controlStatus !== 'ready'
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
                  disabled={controlStatus !== 'ready'}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                    controlStatus !== 'ready'
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

          <div className="flex items-center gap-2 flex-shrink-0">
            {controlStatus === 'ready' && (
              <Button onClick={handleStartAll} size="sm" className="px-3">
                <Play size={14} className="mr-1" />
                Start All
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

      {attendees
        .filter((attendee) => attendee.starred && attendee.system_prompt.trim() !== '')
        .map((attendee) => (
          <MemoizedChat
            key={attendee.id}
            attendeeDisplayName={attendee.name}
            organizerPromptText={organizerPromptText}
            organizerFirstMessage={organizerFirstMessage}
            attendeeSystemPrompt={attendee.system_prompt}
            organizerMode={organizerMode}
            attendeeMode={attendeeMode}
            controlStatus={controlStatus}
            onStatusUpdate={statusUpdateCallbacks[attendee.id]}
            defaultOpen={false}
          />
        ))}
    </div>
  );
};

export default ChatSuite;
