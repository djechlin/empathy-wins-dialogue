import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Textarea } from '@/ui/textarea';
import { Bot, Pause, Play, Send, User } from 'lucide-react';
import React from 'react';

interface Message {
  id: string;
  sender: 'organizer' | 'attendee';
  content: string;
  timestamp: Date;
}

interface ConversationProps {
  // State props
  attendeeDisplayName: string;
  conversationHistory: Message[];
  paused: boolean;
  organizerHumanOrAi: 'human' | 'ai';
  attendeeHumanOrAi: 'human' | 'ai';
  speaker: 'organizer' | 'attendee';
  userTextInput: string;
  isAwaitingAiResponse: boolean;

  // Event handlers
  onTogglePause: () => void;
  onModeToggle: (participant: 'organizer' | 'attendee', mode: 'human' | 'ai') => void;
  onStartConversation: () => void;
  onUserTextInputChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onSendMessage: () => void;

  // Refs
  inputRef: React.RefObject<HTMLTextAreaElement>;
  messagesEndRef: React.RefObject<HTMLDivElement>;

  // Helper functions
  hasStarted: () => boolean;
}

const AiThinking = ({ participant }: { participant: 'organizer' | 'attendee' }) => (
  <div className={`flex ${participant === 'organizer' ? 'justify-end' : 'justify-start'}`}>
    <div
      className={`max-w-xs px-4 py-2 rounded-lg border border-gray-200 ${participant === 'organizer' ? 'bg-purple-100' : 'bg-orange-100'}`}
    >
      <div className="flex items-center gap-2 mb-1">
        <Bot size={12} className="text-gray-400" />
        <span className="text-xs text-gray-600">{participant === 'organizer' ? 'Organizer' : 'Attendee'} AI thinking...</span>
      </div>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  </div>
);

const Conversation = ({
  attendeeDisplayName,
  conversationHistory,
  paused,
  organizerHumanOrAi,
  attendeeHumanOrAi,
  speaker,
  userTextInput,
  isAwaitingAiResponse,
  onTogglePause,
  onModeToggle,
  onStartConversation,
  onUserTextInputChange,
  onKeyPress,
  onSendMessage,
  inputRef,
  messagesEndRef,
  hasStarted,
}: ConversationProps) => {
  const currentSpeakerHumanOrAi = speaker === 'organizer' ? organizerHumanOrAi : attendeeHumanOrAi;

  return (
    <Card className="h-full flex flex-col">
        <div className="border-b px-4 py-3 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Chat with {attendeeDisplayName}</h2>
            {hasStarted() && (
              <Button onClick={onTogglePause} size="sm" variant={paused ? 'default' : 'outline'} className="text-xs px-3">
                {paused ? (
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
            )}
          </div>

          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Organizer:</span>
              <div className="flex bg-gray-200 rounded-lg p-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (conversationHistory.length === 0) {
                      onModeToggle('organizer', 'human');
                    }
                  }}
                  disabled={conversationHistory.length > 0}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                    conversationHistory.length > 0
                      ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                      : organizerHumanOrAi === 'human'
                        ? 'bg-white text-gray-900 shadow-sm ring-2 ring-blue-500'
                        : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <User size={12} />
                  Human
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (conversationHistory.length === 0) {
                      onModeToggle('organizer', 'ai');
                    }
                  }}
                  disabled={conversationHistory.length > 0}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                    conversationHistory.length > 0
                      ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                      : organizerHumanOrAi === 'ai'
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
                  onClick={(e) => {
                    e.stopPropagation();
                    if (conversationHistory.length === 0) {
                      onModeToggle('attendee', 'human');
                    }
                  }}
                  disabled={conversationHistory.length > 0}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                    conversationHistory.length > 0
                      ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                      : attendeeHumanOrAi === 'human'
                        ? 'bg-white text-gray-900 shadow-sm ring-2 ring-blue-500'
                        : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <User size={12} />
                  Human
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (conversationHistory.length === 0) {
                      onModeToggle('attendee', 'ai');
                    }
                  }}
                  disabled={conversationHistory.length > 0}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                    conversationHistory.length > 0
                      ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                      : attendeeHumanOrAi === 'ai'
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

          {!hasStarted() && (
            <div className="mt-2">
              <Button onClick={onStartConversation} size="sm" className="px-4">
                <Play size={16} className="mr-2" />
                Start
              </Button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {conversationHistory.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'organizer' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'organizer' ? 'bg-purple-200 text-gray-900' : 'bg-orange-200 text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.sender === 'organizer' ? <User size={12} /> : <Bot size={12} />}
                  <span className="text-xs opacity-75">{message.sender === 'organizer' ? 'Organizer' : 'Attendee'}</span>
                </div>
                <p className="text-sm">{message.content}</p>
                <p className="text-xs mt-1 text-gray-600">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}

          {/* Show waiting indicator for next expected response */}
          {hasStarted() &&
            speaker &&
            currentSpeakerHumanOrAi === 'human' &&
            !isAwaitingAiResponse &&
            (() => {
              return (
                <div className={`flex ${speaker === 'organizer' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg border-2 border-dashed ${
                      speaker === 'organizer' ? 'border-purple-300 bg-purple-50' : 'border-orange-300 bg-orange-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <User size={12} className={speaker === 'organizer' ? 'text-purple-400' : 'text-orange-400'} />
                      <span className="text-xs text-gray-500">{speaker === 'organizer' ? 'Organizer' : 'Attendee'}</span>
                    </div>
                    <p className="text-sm italic text-gray-500">Waiting for human...</p>
                  </div>
                </div>
              );
            })()}

          {isAwaitingAiResponse && <AiThinking participant={speaker} />}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t p-4">
          <div className="flex space-x-2">
            <Textarea
              ref={inputRef}
              value={userTextInput}
              onChange={(e) => onUserTextInputChange(e.target.value)}
              onKeyPress={onKeyPress}
              placeholder={
                paused
                  ? 'Conversation is paused'
                  : organizerHumanOrAi === 'ai' && attendeeHumanOrAi === 'ai'
                    ? 'Both participants are in AI mode - conversation runs automatically'
                    : speaker === 'organizer'
                      ? 'Type your message as the organizer...'
                      : 'Type your message as the attendee...'
              }
              className={`flex-1 min-h-[40px] max-h-[120px] resize-none ${
                paused || (organizerHumanOrAi === 'ai' && attendeeHumanOrAi === 'ai') ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''
              }`}
              disabled={paused || isAwaitingAiResponse || (organizerHumanOrAi === 'ai' && attendeeHumanOrAi === 'ai')}
            />
            <Button
              onClick={onSendMessage}
              disabled={
                paused || !userTextInput.trim() || isAwaitingAiResponse || (organizerHumanOrAi === 'ai' && attendeeHumanOrAi === 'ai')
              }
              className={`px-4 ${
                paused || (organizerHumanOrAi === 'ai' && attendeeHumanOrAi === 'ai')
                  ? 'bg-gray-400 cursor-not-allowed'
                  : speaker === 'organizer'
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-orange-600 hover:bg-orange-700 text-white'
              }`}
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      </Card>
  );
};

export default Conversation;
