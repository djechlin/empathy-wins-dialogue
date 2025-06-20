export interface BlogPost {
  id: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 'the-name-type2dialogue',
    title: 'The Name Type2Dialogue',
    description:
      'Why meaningful political conversations require System 2 thinking and how cognitive dissonance exploration happens in deliberate, slow thinking.',
    date: 'December 2024',
    readTime: '9 min read',
  },
  {
    id: 'turning-out-the-base',
    title: 'What Every Activist Should Know About Turning Out the Base',
    description: 'Why mobilizing your supporters often yields better returns than persuading swing voters.',
    date: 'December 2024',
    readTime: '7 min read',
  },
  {
    id: 'swing-voters',
    title: "What's Really Going On With Swing Voters?",
    description: 'The complex reality behind the mythical persuadables who supposedly decide elections.',
    date: 'December 2024',
    readTime: '6 min read',
  },
  {
    id: 'cognitive-dissonance',
    title: "The Role of Cognitive Dissonance in Changing One's Mind",
    description: 'Understanding how psychological safety enables productive conversations through cognitive dissonance.',
    date: 'December 2024',
    readTime: '8 min read',
  },
];
