import React from 'react';
import { Card, CardContent } from '@/ui/card';
import { TrendingUp, Users, MessageSquare } from 'lucide-react';

const CaseStudiesSection = () => {
  const caseStudies = [
    {
      title: 'Pennsylvania 2020 Presidential',
      metric: '+3.1 votes per 100 calls',
      description:
        "Deep canvassing phone program by People's Action achieved overall addition of 3.1 votes for each 100 calls towards Biden's vote margin, larger than 2016 margin in key battleground states.",
      citation: 'Deep Canvass Institute 2021-2023 Impact Report',
      icon: TrendingUp,
    },
    {
      title: 'Philadelphia 2022 Elections',
      metric: '15% higher turnout',
      description:
        "Changing the Conversation Together's deep canvassing resulted in Philadelphia voters turning out at 15% higher rate than their neighbors in crucial Senate and gubernatorial races.",
      citation: 'Philadelphia Citizen, 2024',
      icon: Users,
    },
    {
      title: 'Transgender Rights Study',
      metric: '3+ month durability',
      description:
        "Broockman & Kalla's landmark study found 10-minute deep canvass conversations substantially reduced transphobia for 3+ months, with effects greater than national attitude shifts from 1998-2012.",
      citation: 'Broockman & Kalla, Science, 2016',
      icon: MessageSquare,
    },
    {
      title: 'Immigration Attitudes Research',
      metric: '+4% pro-immigrant support',
      description:
        'Berkeley study of 6,800 voters found deep canvassing increased pro-immigrant policy support from 29% to 33%, with effects lasting 4+ months.',
      citation: 'Broockman & Kalla, American Political Science Review, 2016',
      icon: TrendingUp,
    },
    {
      title: '2022 Election Lies Experiment',
      metric: '+4.2% mail-in voting support',
      description:
        'Broockman-Kalla experiment in Missouri, Idaho, and Georgia found deep canvassing increased mail-in voting support by 4.2 percentage points and reduced fraud beliefs by 1.9 points.',
      citation: 'Deep Canvass Institute Impact Report, 2023',
      icon: Users,
    },
    {
      title: 'Philadelphia 2020 Presidential',
      metric: '10% increased turnout',
      description:
        "Changing the Conversation Together's Philadelphia deep canvassing resulted in voters participating at 10% higher rate than comparable neighbors in Biden's Pennsylvania victory.",
      citation: 'Philadelphia Citizen, 2024',
      icon: MessageSquare,
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl text-dialogue-darkblue mb-6">Evidence-Based Deep Canvassing</h2>
          <p className="text-xl text-foreground max-w-3xl mx-auto leading-relaxed">
            Academic research and real campaign results demonstrate the measurable impact of deep canvassing techniques on voter persuasion
            and turnout.
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
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">{study.description}</p>
                  <p className="text-xs text-gray-500 italic">{study.citation}</p>
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
