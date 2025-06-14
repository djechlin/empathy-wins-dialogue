import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Badge } from '@/ui/badge';

const Blog = () => {
  const blogPosts = [
    {
      id: 'the-name-type2dialogue',
      title: 'The Name Type2Dialogue',
      description:
        'Why meaningful political conversations require System 2 thinking and how cognitive dissonance exploration happens in deliberate, slow thinking.',
      date: 'December 2024',
      category: '',
      readTime: '9 min read',
    },
    {
      id: 'turning-out-the-base',
      title: 'What Every Activist Should Know About Turning Out the Base',
      description: 'Why mobilizing your supporters often yields better returns than persuading swing voters.',
      date: 'December 2024',
      category: '',
      readTime: '7 min read',
    },
    {
      id: 'swing-voters',
      title: "What's Really Going On With Swing Voters?",
      description: 'The complex reality behind the mythical persuadables who supposedly decide elections.',
      date: 'December 2024',
      category: 'Politics',
      readTime: '6 min read',
    },
    {
      id: 'cognitive-dissonance',
      title: "The Role of Cognitive Dissonance in Changing One's Mind",
      description: 'Understanding how psychological safety enables productive conversations through cognitive dissonance.',
      date: 'December 2024',
      category: '',
      readTime: '8 min read',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Insights on empathetic dialogue, political persuasion, and the psychology of meaningful conversations.
            </p>
          </header>

          <div className="grid gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{post.category}</Badge>
                    <span className="text-sm text-gray-500">{post.readTime}</span>
                  </div>
                  <CardTitle className="text-2xl">
                    <Link to={`/blog/${post.id}`} className="hover:text-dialogue-purple transition-colors">
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-base">{post.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{post.date}</span>
                    <Link to={`/blog/${post.id}`} className="text-dialogue-purple hover:text-dialogue-darkblue font-medium">
                      Read more →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
