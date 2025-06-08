import React from 'react';
import { Card, CardContent, CardFooter } from '@/ui/card';
import { Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote:
        "type2dialogue helped me understand perspectives I'd been dismissing for years. It's changed how I approach political conversations completely.",
      name: 'Sarah J.',
      location: 'Ohio',
      type: 'Community Organizer',
    },
    {
      quote:
        "I was skeptical at first, but this process actually works. Our campaign reached voters we'd never connected with before using these dialogue techniques.",
      name: 'Marcus T.',
      location: 'Pennsylvania',
      type: 'Campaign Manager',
    },
    {
      quote:
        "The structured dialogue approach gave me tools to have conversations with family members I'd been avoiding for years. We still disagree, but now we can talk.",
      name: 'Priya L.',
      location: 'Arizona',
      type: 'Voter',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-dialogue-blue to-dialogue-neutral">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-lg mb-4">Success Stories</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See how type2dialogue is transforming political conversations and impacting electoral outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white border-none shadow-lg h-full flex flex-col">
              <CardContent className="pt-8 flex-grow">
                <div className="mb-4">
                  <Quote className="h-8 w-8 text-dialogue-purple opacity-70" />
                </div>
                <p className="italic text-foreground mb-6">"{testimonial.quote}"</p>
              </CardContent>
              <CardFooter className="border-t border-border pt-4">
                <div>
                  <p className="font-semibold text-dialogue-darkblue">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.type} • {testimonial.location}
                  </p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/3">
              <div className="rounded-full overflow-hidden border-4 border-dialogue-blue w-48 h-48 mx-auto">
                <img
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
                  alt="Electoral Success Story"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="md:w-2/3">
              <h3 className="heading-sm mb-3 text-dialogue-darkblue">Electoral Impact</h3>
              <p className="text-lg mb-4">
                "By using type2dialogue's framework, our campaign increased voter outreach effectiveness by 37%. We connected with voters
                across the political spectrum and won in a district that hadn't changed parties in 12 years."
              </p>
              <p className="font-semibold text-dialogue-purple">- Jennifer Rodriguez, Campaign Director, 10th District</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
