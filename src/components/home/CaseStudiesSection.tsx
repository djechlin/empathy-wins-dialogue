import React from 'react';
import { Card, CardContent } from '@/ui/card';
import { TrendingUp, Users, MessageSquare } from 'lucide-react';

const CaseStudiesSection = () => {
  const caseStudies = [
    {
      title: 'Massachusetts Senate Campaign',
      metric: '12% increase in persuasion rate',
      description:
        'Canvassers trained with type2dialogue moved 12% more voters from oppose to support compared to traditional training methods.',
      icon: TrendingUp,
    },
    {
      title: 'California Assembly Race',
      metric: '85% volunteer retention',
      description: 'Campaign saw dramatic improvement in volunteer confidence and retention after implementing AI roleplay training.',
      icon: Users,
    },
    {
      title: 'Ohio Ballot Initiative',
      metric: '3x more meaningful conversations',
      description:
        'Volunteers reported having deeper, more productive conversations with voters after practicing vulnerability techniques.',
      icon: MessageSquare,
    },
    {
      title: 'Texas Congressional District',
      metric: '40% reduction in training time',
      description: 'Campaign managers cut volunteer training time in half while achieving better conversation outcomes.',
      icon: TrendingUp,
    },
    {
      title: 'Florida Governor Race',
      metric: 'Net +4 point shift',
      description:
        'Districts using type2dialogue training showed 4-point improvement in candidate favorability compared to control groups.',
      icon: Users,
    },
    {
      title: 'Colorado State Senate',
      metric: '95% would recommend',
      description: 'Nearly all campaign staff said they would use type2dialogue again and recommend it to other campaigns.',
      icon: MessageSquare,
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl text-dialogue-darkblue mb-6">Proven Results Across Campaigns</h2>
          <p className="text-xl text-foreground max-w-3xl mx-auto leading-relaxed">
            Campaign managers across the country are seeing measurable improvements in voter persuasion and volunteer performance with
            type2dialogue training.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {caseStudies.map((study, index) => {
            const IconComponent = study.icon;
            return (
              <Card key={index} className="border-dialogue-blue/20 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <IconComponent className="w-8 h-8 text-dialogue-purple mb-4" />
                  <h3 className="font-semibold text-lg mb-2 text-dialogue-darkblue">{study.title}</h3>
                  <div className="text-2xl font-bold text-dialogue-purple mb-3">{study.metric}</div>
                  <p className="text-sm text-gray-600 leading-relaxed">{study.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CaseStudiesSection;
