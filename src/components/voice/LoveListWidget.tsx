
import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Heart, Trash2, Edit3, Mic, Play, Pause, Square } from 'lucide-react';
import { DeepgramVoiceProvider } from './DeepgramVoiceProvider';
import {
  DeepgramContextProvider,
  LiveConnectionState,
  LiveTranscriptionEvent,
  LiveTranscriptionEvents,
  useDeepgram,
} from "@/components/voice/DeepgramContextProvider";

import {
  MicrophoneContextProvider,
  MicrophoneEvents,
  MicrophoneState,
  useMicrophone,
} from "@/components/voice/MicrophoneContextProvider";

interface LoveItem {
  id: string;
  text: string;
}

interface LoveListInnerHandle {
  addItem: (item: string) => void;
}

export const LoveListWidget = () => {
  const innerRef = useRef<LoveListInnerHandle>(null);

  return (
    <DeepgramContextProvider>
      <MicrophoneContextProvider>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left side: Voice controls and transcript */}
        <div className="space-y-4">
          <Card className="border-dialogue-neutral bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5 text-dialogue-purple" />
                Voice Recording
              </CardTitle>
            </CardHeader>
            <CardContent>
            </CardContent>
          </Card>

          <Card className="border-dialogue-neutral bg-white">
            <CardHeader>
              <CardTitle>Live Transcript</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[300px] max-h-[400px] overflow-y-auto">
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side: Love list */}
        <LoveListWidgetInner ref={innerRef} />
      </div>
      </MicrophoneContextProvider>
    </DeepgramContextProvider>
  );
};

const LoveListWidgetInner = forwardRef<LoveListInnerHandle>((props, ref) => {
  const [items, setItems] = useState<LoveItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

    const { connection, connectToDeepgram, connectionState } = useDeepgram();
    const { setupMicrophone, microphone, startMicrophone, microphoneState } =
    useMicrophone();

  const captionTimeout = useRef<undefined | ReturnType<typeof setTimeout>>();
  const [caption, setCaption] = useState<string | undefined>("dg");

  useEffect(() => {
    setupMicrophone();
  }, []);

  useEffect(() => {
    connectToDeepgram({
        model: "nova-3",
        interim_results: true,
        smart_format: true,
        filler_words: true,
        utterance_end_ms: 3000,
      });
  }, [])

    useEffect(() => {
    if (!microphone) return;
    if (!connection) return;

    const onData = (e: BlobEvent) => {
      // iOS SAFARI FIX:
      // Prevent packetZero from being sent. If sent at size 0, the connection will close. 
      if (e.data.size > 0) {
        connection?.send(e.data);
      }
    };

    const onTranscript = (data: LiveTranscriptionEvent) => {
      const { is_final: isFinal, speech_final: speechFinal } = data;
      const thisCaption = data.channel.alternatives[0].transcript;

      if (thisCaption !== "") {
        console.log('new caption will be ' + (caption + ' ||| ' + thisCaption));
        setCaption(prev => prev + ' ' + thisCaption);
      }

      if (isFinal && speechFinal) {
        clearTimeout(captionTimeout.current);
        captionTimeout.current = setTimeout(() => {
          clearTimeout(captionTimeout.current);
        }, 3000);
      }
    };

    if (connectionState === LiveConnectionState.OPEN) {
      connection.addListener(LiveTranscriptionEvents.Transcript, onTranscript);
      microphone.addEventListener(MicrophoneEvents.DataAvailable, onData);

      startMicrophone();
    }

    return () => {
      // prettier-ignore
      connection.removeListener(LiveTranscriptionEvents.Transcript, onTranscript);
      microphone.removeEventListener(MicrophoneEvents.DataAvailable, onData);
      clearTimeout(captionTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionState]);


  const addItem = (text: string) => {
    // Check if item already exists to avoid duplicates
    const exists = items.some(item => item.text.toLowerCase() === text.toLowerCase());
    if (exists) return;

    console.log('addItem called with:', text);
    const newItem: LoveItem = {
      id: Date.now().toString(),
      text: text
    };
    console.log('Creating new item:', newItem);
    setItems(prev => {
      const newItems = [...prev, newItem];
      console.log('Updated items array:', newItems);
      return newItems;
    });
  };

  useImperativeHandle(ref, () => ({
    addItem
  }));


  const handleEdit = (item: LoveItem) => {
    setEditingId(item.id);
    setEditText(item.text);
  };

  const handleSaveEdit = () => {
    if (editingId && editText.trim()) {
      setItems(prev => prev.map(item =>
        item.id === editingId ? { ...item, text: editText.trim() } : item
      ));
    }
    setEditingId(null);
    setEditText('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <Card className="border-dialogue-neutral bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Your Love List
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 min-h-[200px]">
          {items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Heart className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Start talking about things you love!</p>
              <p className="text-sm">Say phrases like "I love..." or "I really like..."</p>
              <p>{caption}</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border hover:shadow-sm transition-shadow"
              >
                {editingId === item.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <Input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="flex-1"
                      autoFocus
                    />
                    <Button size="sm" onClick={handleSaveEdit}>Save</Button>
                    <Button size="sm" variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                  </div>
                ) : (
                  <>
                    <span className="flex-1 text-sm">{item.text}</span>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(item)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(item.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
});
