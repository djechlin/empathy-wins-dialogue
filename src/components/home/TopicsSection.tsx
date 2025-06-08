import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/ui/card';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';

const TopicsSection = () => {
  const topics = [
    {
      title: 'Healthcare Reform',
      description: 'Exploring common ground on improving healthcare access and affordability while maintaining quality.',
      participants: 843,
      tags: ['Healthcare', 'Policy', 'Economics'],
    },
    {
      title: 'Climate Solutions',
      description: 'Discussing practical approaches to addressing climate change while balancing economic concerns.',
      participants: 762,
      tags: ['Environment', 'Economy', 'Science'],
    },
    {
      title: 'Immigration Policy',
      description: 'Finding balanced approaches to immigration that respect both security and humanitarian values.',
      participants: 691,
      tags: ['Immigration', 'Security', 'Human Rights'],
    },
    {
      title: 'Economic Opportunity',
      description: 'Exploring ways to create prosperity that works for people across different communities.',
      participants: 578,
      tags: ['Economics', 'Equality', 'Jobs'],
    },
  ];

  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-lg mb-4">Current Dialogue Topics</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join conversations on today's most important issues where different perspectives are welcomed and respected.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {topics.map((topic, index) => (
            <Card key={index} className="dialogue-card h-full flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-dialogue-darkblue">{topic.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground mb-4">{topic.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {topic.tags.map((tag, idx) => (
                    <Badge key={idx} variant="outline" className="bg-dialogue-blue text-dialogue-darkblue border-dialogue-blue">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold">{topic.participants}</span> participants engaged
                </p>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="outline" className="w-full border-dialogue-purple text-dialogue-purple hover:bg-dialogue-blue">
                  Join Conversation
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button className="bg-dialogue-purple hover:bg-dialogue-darkblue">View All Topics</Button>
        </div>
      </div>
    </section>
  );
};

export default TopicsSection;
