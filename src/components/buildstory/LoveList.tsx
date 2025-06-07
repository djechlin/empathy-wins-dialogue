
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/card';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Heart, Book, Utensils, MapPin, List } from 'lucide-react';

type CategoryType = 'people' | 'hobbies' | 'food' | 'places' | 'other';

interface LoveItem {
  id: string;
  text: string;
  category: CategoryType;
}

const LoveList = () => {
  const [items, setItems] = useState<LoveItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('people');

  const handleAddItem = () => {
    if (newItem.trim() === '') return;
    
    const item: LoveItem = {
      id: Date.now().toString(),
      text: newItem.trim(),
      category: selectedCategory
    };
    
    setItems([...items, item]);
    setNewItem('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  };

  const categories: {
    id: CategoryType;
    name: string;
    icon: React.ReactNode;
  }[] = [
    { id: 'people', name: 'People', icon: <Heart className="h-5 w-5" /> },
    { id: 'hobbies', name: 'Hobbies', icon: <Book className="h-5 w-5" /> },
    { id: 'food', name: 'Food', icon: <Utensils className="h-5 w-5" /> },
    { id: 'places', name: 'Places', icon: <MapPin className="h-5 w-5" /> },
    { id: 'other', name: 'Other', icon: <List className="h-5 w-5" /> }
  ];

  return (
    <Card className="border-dialogue-neutral bg-white">
      <CardHeader>
        <CardTitle>The Love List</CardTitle>
        <CardDescription>
          List as many things you love as possible. This exercise helps you connect with voters through shared values and experiences.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-3">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={selectedCategory === category.id ? "bg-dialogue-purple hover:bg-dialogue-darkblue" : ""}
                onClick={() => setSelectedCategory(category.id)}
                size="sm"
              >
                {category.icon}
                <span>{category.name}</span>
              </Button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder={`Add something you love (${selectedCategory})...`}
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-grow"
            />
            <Button 
              onClick={handleAddItem}
              className="bg-dialogue-purple hover:bg-dialogue-darkblue"
            >
              Add
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-dialogue-darkblue">
                {category.icon}
                <h3>{category.name}</h3>
              </div>
              <ul className="space-y-1.5 min-h-[100px]">
                {items
                  .filter(item => item.category === category.id)
                  .map(item => (
                    <li 
                      key={item.id} 
                      className="px-3 py-2 bg-dialogue-neutral rounded-md text-sm animate-fade-in"
                    >
                      {item.text}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LoveList;
