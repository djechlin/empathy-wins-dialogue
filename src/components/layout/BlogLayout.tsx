import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

interface BlogLayoutProps {
  children: React.ReactNode;
  title: string;
  date: string;
  readTime: string;
  category: string;
  description?: string;
}

const BlogLayout: React.FC<BlogLayoutProps> = ({ children, title, date, readTime, category, description }) => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link to="/blog">
              <Button variant="ghost" className="mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
            <div className="prose prose-lg prose-gray max-w-none">
              <header className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="secondary">{category}</Badge>
                  <span className="text-sm text-gray-500">{readTime}</span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4 font-heading">{title}</h1>
                {description && <p className="text-xl text-gray-600 mb-4">{description}</p>}
                <p className="text-sm text-gray-500 border-b border-gray-200 pb-6">{date}</p>
              </header>
              <div className="prose-headings:font-heading prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900">
                {children}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogLayout;
