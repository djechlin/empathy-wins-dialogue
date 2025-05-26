
import React, { useState, useEffect } from 'react';
import { useVoice, VoiceContextType } from '@humeai/voice-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Heart, User, Dog, Package, MapPin, Trash2, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';

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

export const LoveListWidget = () => {
  const [items, setItems] = useState<LoveItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const { messages }: VoiceContextType = useVoice();

  // Listen for Hume messages containing love items
  useEffect(() => {
    if (!messages || messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];
    
    // Check if this is a tool response or JSON message containing love item data
    if (lastMessage.type === 'assistant_message' || lastMessage.type === 'tool_response') {
      try {
        const content = lastMessage.message?.content || '';
        
        // Try to parse JSON from the message content
        const jsonMatch = content.match(/\{.*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]) as LoveListMessage;
          
          if (parsed.type === 'love_item' && parsed.data) {
            const newItem: LoveItem = {
              id: Date.now().toString(),
              text: parsed.data.item,
              category: parsed.data.category
            };
            
            // Avoid duplicates
            setItems(prev => {
              const exists = prev.some(item => 
                item.text.toLowerCase() === newItem.text.toLowerCase()
              );
              return exists ? prev : [...prev, newItem];
            });
          }
        }
      } catch (error) {
        // Not a valid JSON message, ignore
        console.log('No valid love item data in message');
      }
    }
  }, [messages]);

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
                className="flex items-center gap-3 p-3 bg-grey-50 rounded-lg border hover:shadow-sm transition-shadow"
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
};
