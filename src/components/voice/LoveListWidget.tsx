
import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Heart, Trash2, Edit3, Mic, Play, Pause, Square } from 'lucide-react';
import { AssemblyVoiceProvider, useAssemblyVoice } from './AssemblyVoiceProvider';

interface LoveItem {
  id: string;
  text: string;
}

interface LoveListInnerHandle {
  addItem: (item: string) => void;
}

export const LoveListWidget = () => {
  const innerRef = useRef<LoveListInnerHandle>(null);

  const handleTranscript = (transcript: string) => {
    // Simple pattern matching to detect love items
    // This is a basic implementation - could be enhanced with NLP
    const lovePatterns = [
      /i love ([^.!?]+)/gi,
      /i really like ([^.!?]+)/gi,
      /i enjoy ([^.!?]+)/gi,
      /i'm passionate about ([^.!?]+)/gi,
      /([^.!?]+) means a lot to me/gi,
      /([^.!?]+) makes me happy/gi
    ];

    lovePatterns.forEach(pattern => {
      const matches = transcript.matchAll(pattern);
      for (const match of matches) {
        if (match[1] && match[1].trim()) {
          innerRef.current?.addItem(match[1].trim());
        }
      }
    });
  };

  return (
    <AssemblyVoiceProvider onTranscript={handleTranscript}>
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
              <AssemblyControlPanel />
            </CardContent>
          </Card>
          
          <Card className="border-dialogue-neutral bg-white">
            <CardHeader>
              <CardTitle>Live Transcript</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[300px] max-h-[400px] overflow-y-auto">
                <AssemblyTranscript />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right side: Love list */}
        <LoveListWidgetInner ref={innerRef} />
      </div>
    </AssemblyVoiceProvider>
  );
};

const LoveListWidgetInner = forwardRef<LoveListInnerHandle>((props, ref) => {
  const [items, setItems] = useState<LoveItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

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

const AssemblyControlPanel = () => {
  const { isConnected, isRecording, error, startRecording, stopRecording } = useAssemblyVoice();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          variant={isRecording ? "destructive" : "default"}
          className="flex items-center gap-2"
          disabled={isConnected && !isRecording}
        >
          {isRecording ? (
            <>
              <Square className="h-4 w-4" />
              Stop Recording
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Start Recording
            </>
          )}
        </Button>
        
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${
            isConnected ? 'bg-green-500' : 'bg-gray-300'
          }`} />
          <span className="text-sm text-muted-foreground">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
      
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

const AssemblyTranscript = () => {
  const { transcript, clearTranscript } = useAssemblyVoice();

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Transcript</span>
        <Button
          onClick={clearTranscript}
          variant="ghost"
          size="sm"
          disabled={!transcript}
        >
          Clear
        </Button>
      </div>
      <div className="bg-gray-50 p-3 rounded min-h-[200px] max-h-[300px] overflow-y-auto">
        {transcript ? (
          <p className="text-sm whitespace-pre-wrap">{transcript}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Start recording to see the transcript here...
          </p>
        )}
      </div>
    </div>
  );
};
