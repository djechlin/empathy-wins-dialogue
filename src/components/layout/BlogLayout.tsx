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
    <div>
      <Navbar />
      <main>
        <div>
          <div>
            <Link to="/blog">
              <Button variant="ghost">
                <ArrowLeft />
                Back to Blog
              </Button>
            </Link>
            <div className="prose prose-lg max-w-none">
              <header>
                <div>
                  <Badge variant="secondary">{category}</Badge>
                  <span>{readTime}</span>
                </div>
                <h1>{title}</h1>
                {description && <p>{description}</p>}
                <p>{date}</p>
              </header>
              {children}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogLayout;
