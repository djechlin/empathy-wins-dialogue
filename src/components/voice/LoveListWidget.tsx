
import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useVoice, VoiceContextType, ToolCallHandler } from '@humeai/voice-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Heart, User, Dog, Package, MapPin, Trash2, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import ControlPanel from './ControlPanel';
import { AuthenticatingVoiceProvider } from './AuthenticatingVoiceProvider';
import { HUME_PERSONAS } from '../../lib/scriptData';

type CategoryType = 'person' | 'pet' | 'things' | 'experiences';

interface LoveItem {
  id: string;
  text: string;
  category: CategoryType;
}

interface LoveListMessage {
  type: 'love_item';
  data: {
    item: string;
    category: CategoryType;
  };
}

interface LoveListInnerHandle {
  addItem: (item: HumeLovedItem) => void;
}

const categoryIcons = {
  person: <User className="h-4 w-4" />,
  pet: <Dog className="h-4 w-4" />,
  things: <Package className="h-4 w-4" />,
  experiences: <MapPin className="h-4 w-4" />
};

const categoryColors = {
  person: 'bg-blue-100 text-blue-800 border-blue-200',
  pet: 'bg-green-100 text-green-800 border-green-200',
  things: 'bg-purple-100 text-purple-800 border-purple-200',
  experiences: 'bg-orange-100 text-orange-800 border-orange-200'
};

type HumeLovedItem = {
  category: string;
  item: string;
}

export const LoveListWidget = () => {
  const innerRef = useRef<LoveListInnerHandle>(null);

  const handleToolCall: ToolCallHandler = async (toolCall, send) => {
    console.log('Tool call received:', toolCall);
    console.log('Tool call name:', toolCall.name);
    console.log('Tool call parameters:', toolCall.parameters);

    if (toolCall.name === 'streaming_love_list_with_category' && toolCall.parameters) {
      try {
        console.log('Parsing parameters...');
        const parameters = JSON.parse(toolCall.parameters)['love_list'] as HumeLovedItem[];
        console.log('Parsed parameters:', parameters);
        console.log('innerRef.current exists:', !!innerRef.current);
        
        parameters.forEach((item, index) => {
          console.log(`Adding item ${index}:`, item);
          innerRef.current?.addItem(item);
        });
        
        console.log('Items added successfully');
        
        // Send trivial success response (required but not used by voice assistant)
        return send.success({});
      } catch (error) {
        console.error('Error parsing parameters:', error);
        return send.error({
          error: 'Parse error',
          code: 'PARSE_ERROR',
          level: 'error',
          content: String(error)
        });
      }
    }
    
    console.log('Unknown tool call:', toolCall.name);
    // Send trivial error for unknown tool calls
    return send.error({
      error: 'Unknown tool',
      code: 'UNKNOWN',
      level: 'info',
      content: ''
    });
  };

  return (
    <AuthenticatingVoiceProvider
      configId={HUME_PERSONAS['love-list']}
      onMessage={() => {}}
      onToolCall={handleToolCall}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      <ControlPanel />
      <LoveListWidgetInner ref={innerRef} />
    </AuthenticatingVoiceProvider>
  );
};

const LoveListWidgetInner = forwardRef<LoveListInnerHandle>((props, ref) => {
  const [items, setItems] = useState<LoveItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const addItem = (lovedItem: HumeLovedItem) => {
    console.log('addItem called with:', lovedItem);
    const newItem: LoveItem = {
      id: Date.now().toString(),
      text: lovedItem.item,
      category: lovedItem.category as CategoryType
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
              <p className="text-sm">They'll appear here as you mention them.</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border hover:shadow-sm transition-shadow"
              >
                <div className={cn(
                  "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border",
                  categoryColors[item.category]
                )}>
                  {categoryIcons[item.category]}
                  <span className="capitalize">{item.category}</span>
                </div>

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
