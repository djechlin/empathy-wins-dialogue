
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
import nlp from 'compromise';
import { commonHobbies } from '@/data/hobbies';

// Create a Set for O(1) lookup of hobbies
const hobbySet = new Set(commonHobbies.map(hobby => hobby.toLowerCase()));

interface LoveItem {
  id: string;
  text: string;
}

interface LoveListInnerHandle {
  addItem: (item: string) => void;
}

const LoveListWidgetOuter = () => {
  const innerRef = useRef<LoveListInnerHandle>(null);

  return (
    <DeepgramContextProvider>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LoveListWidgetInner ref={innerRef} />
      </div>
    </DeepgramContextProvider>
  );
};

const LoveListWidgetInner = forwardRef<LoveListInnerHandle>((props, ref) => {
  const [items, setItems] = useState<LoveItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

    const { connection, connectToDeepgram, connectionState } = useDeepgram();

  const captionTimeout = useRef<undefined | ReturnType<typeof setTimeout>>();
  const [caption, setCaption] = useState<string>("");
  const [interimCaption, setInterimCaption] = useState<string>("");
  
  // Track detected entities for goal system
  const [detectedPeople, setDetectedPeople] = useState<Set<string>>(new Set());
  const [detectedPlaces, setDetectedPlaces] = useState<Set<string>>(new Set());
  const [detectedHobbies, setDetectedHobbies] = useState<Set<string>>(new Set());
  
  // Goal tracking
  const totalThings = detectedPlaces.size + detectedHobbies.size;
  const isGoalMet = totalThings >= 10 && detectedPeople.size >= 3;

  // Function to render text with colored entities using compromise.js
  const renderTextWithEntities = (text: string) => {
    if (!text || text.trim() === "") {
      return text;
    }

    try { 
      const doc = nlp(text);

      const people = doc.people().out('array');
      const places = doc.places().out('array');

      const textWords = text.toLowerCase().split(/[ .,?!]+/);
      const foundHobbies = textWords.filter(word => hobbySet.has(word));

      // Create a mapping of positions to replace
      const replacements: { original: string; replacement: React.ReactNode; }[] = [];

      // Add people replacements (purple)
      people.forEach((person: string, index: number) => {
        replacements.push({
          original: person,
          replacement: <span key={`person-${index}`} className="text-purple-600 font-semibold">{person}</span>
        });
      });

      // Add places replacements (blue)
      places.forEach((place: string, index: number) => {
        replacements.push({
          original: place,
          replacement: <span key={`place-${index}`} className="text-blue-600 font-semibold">{place}</span>
        });
      });

      // Add hobbies/activities replacements (green)
      foundHobbies.forEach((hobby: string, index: number) => {
        console.log('replacing the hobby: ', hobby);
        replacements.push({
          original: hobby,
          replacement: <span key={`hobby-${index}`} className="text-green-600 font-semibold">{hobby}</span>
        });
      });

      if (replacements.length === 0) {
        return text;
      }

      // Split text and replace entities
      let currentText = text;

      // Sort replacements by length (longest first) to avoid partial replacements
      replacements.sort((a, b) => b.original.length - a.original.length);

      // Process each replacement
      for (const replacement of replacements) {
        const parts = currentText.split(replacement.original);
        if (parts.length > 1) {
          const newResult: React.ReactNode[] = [];
          parts.forEach((part, i) => {
            if (i > 0) {
              newResult.push(replacement.replacement);
            }
            newResult.push(part);
          });
          currentText = newResult.join('|||REPLACEMENT|||'); // Placeholder for reconstruction
        }
      }

      // For simplicity, let's rebuild using React fragments
      const elements: React.ReactNode[] = [];
      const words = text.split(' ');

      words.forEach((word, i) => {
        let isReplaced = false;

        // Check if this word is a person
        for (let j = 0; j < people.length; j++) {
          if (word.toLowerCase().includes(people[j].toLowerCase()) || people[j].toLowerCase().includes(word.toLowerCase())) {
            elements.push(<span key={`person-${i}`} className="text-purple-600 font-semibold">{word}</span>);
            isReplaced = true;
            break;
          }
        }

        // Check if this word is a place
        if (!isReplaced) {
          for (let j = 0; j < places.length; j++) {
            if (word.toLowerCase().includes(places[j].toLowerCase()) || places[j].toLowerCase().includes(word.toLowerCase())) {
              elements.push(<span key={`place-${i}`} className="text-blue-600 font-semibold">{word}</span>);
              isReplaced = true;
              break;
            }
          }
        }

        // Check if this word is a hobby/activity using direct lookup
        if (!isReplaced && hobbySet.has(word.toLowerCase())) {
          elements.push(<span key={`hobby-${i}`} className="text-green-600 font-semibold">{word}</span>);
          isReplaced = true;
        }

        if (!isReplaced) {
          elements.push(word);
        }

        // Add space between words (except for the last word)
        if (i < words.length - 1) {
          elements.push(' ');
        }
      });

      return elements;

    } catch (error) {
      console.error('Error processing text with compromise:', error);
      return text;
    }
  };

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
    if (!connection) return;

    const onTranscript = (data: LiveTranscriptionEvent) => {
      const { is_final: isFinal, speech_final: speechFinal } = data;
      const thisCaption = data.channel.alternatives[0].transcript;

      console.log('transcript data:', { isFinal, speechFinal, text: thisCaption });

      if (thisCaption !== "") {
        if (isFinal) {
          setCaption(prev => prev + ' ' + thisCaption);
          setInterimCaption(""); // Clear interim since it's now final
          
          // Extract entities from the final caption and update state
          try {
            const doc = nlp(thisCaption);
            const people = doc.people().out('array');
            const places = doc.places().out('array');
            const textWords = thisCaption.toLowerCase().split(/[ .,?!]+/);
            const foundHobbies = textWords.filter(word => hobbySet.has(word));
            
            if (people.length > 0) {
              setDetectedPeople(prev => new Set([...prev, ...people.map(p => p.toLowerCase())]));
            }
            if (places.length > 0) {
              setDetectedPlaces(prev => new Set([...prev, ...places.map(p => p.toLowerCase())]));
            }
            if (foundHobbies.length > 0) {
              setDetectedHobbies(prev => new Set([...prev, ...foundHobbies]));
            }
          } catch (error) {
            console.error('Error extracting entities:', error);
          }
        } else {
          setInterimCaption(thisCaption);
        }
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
    }

    return () => {
      connection.removeListener(LiveTranscriptionEvents.Transcript, onTranscript);
      clearTimeout(captionTimeout.current);
    };
  }, [connection, connectionState]);


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
    <Card className={`border-dialogue-neutral bg-white transition-all duration-300 ${isGoalMet ? 'border-purple-500 border-2 shadow-lg' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Voice Discovery Challenge
          </div>
          <div className="text-sm font-normal text-gray-600">
            {isGoalMet ? (
              <span className="text-purple-600 font-semibold">🎉 Goal Complete!</span>
            ) : (
              <span>
                People: {detectedPeople.size}/3 | Things: {totalThings}/10
              </span>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Side: Collected Words */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-gray-700">Discovered Words</h3>
            
            {/* People */}
            <div>
              <h4 className="text-xs font-medium text-purple-600 mb-2">People ({detectedPeople.size}/3)</h4>
              <div className="flex flex-wrap gap-1">
                {Array.from(detectedPeople).map((person, i) => (
                  <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    {person}
                  </span>
                ))}
                {detectedPeople.size === 0 && (
                  <span className="text-xs text-gray-400 italic">Say names of people you love...</span>
                )}
              </div>
            </div>

            {/* Places */}
            <div>
              <h4 className="text-xs font-medium text-blue-600 mb-2">Places ({detectedPlaces.size})</h4>
              <div className="flex flex-wrap gap-1">
                {Array.from(detectedPlaces).map((place, i) => (
                  <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {place}
                  </span>
                ))}
                {detectedPlaces.size === 0 && (
                  <span className="text-xs text-gray-400 italic">Mention places you love...</span>
                )}
              </div>
            </div>

            {/* Hobbies */}
            <div>
              <h4 className="text-xs font-medium text-green-600 mb-2">Activities ({detectedHobbies.size})</h4>
              <div className="flex flex-wrap gap-1">
                {Array.from(detectedHobbies).map((hobby, i) => (
                  <span key={i} className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    {hobby}
                  </span>
                ))}
                {detectedHobbies.size === 0 && (
                  <span className="text-xs text-gray-400 italic">Talk about activities you enjoy...</span>
                )}
              </div>
            </div>

            {isGoalMet && (
              <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-purple-700 font-medium">🎉 Congratulations!</p>
                <p className="text-xs text-purple-600">You've shared at least 3 people and 10 things you love!</p>
              </div>
            )}
          </div>

          {/* Right Side: Raw Transcript */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-gray-700">Live Transcript</h3>
            <div className="min-h-[300px] max-h-[400px] overflow-y-auto p-3 bg-gray-50 rounded-lg border">
              {caption ? (
                <div className="text-sm">
                  {renderTextWithEntities(caption)}
                  {interimCaption && (
                    <span className="text-gray-400 italic"> {interimCaption}</span>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Mic className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Start talking about things you love!</p>
                  <p className="text-xs">Names, places, and activities will be highlighted as you speak.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export const LoveListWidget = LoveListWidgetOuter;