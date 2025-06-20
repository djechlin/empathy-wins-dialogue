import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/ui/button';
import { LogIn, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { blogPosts } from '@/data/blogPosts';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);

  const isInChallenge = location.pathname.startsWith('/challenge');

  const getCurrentStep = () => {
    if (location.pathname === '/challenge/prepare') return 1;
    if (location.pathname === '/challenge/roleplay') return 2;
    if (location.pathname === '/challenge/competencies') return 3;
    return 1;
  };

  const steps = [
    { number: 1, label: 'Prepare', path: '/challenge/prepare' },
    { number: 2, label: 'Roleplay', path: '/challenge/roleplay' },
    { number: 3, label: 'Learn how you did', path: '/challenge/competencies' },
  ];

  useEffect(() => {
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleAuthClick = () => {
    if (user) {
      supabase.auth.signOut();
    } else {
      navigate('/auth');
    }
  };

  return (
    <nav className="py-4 border-b border-border bg-white sticky top-0 z-50">
      <div className="container-custom flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-sans text-[18px] font-semibold text-gray-800 tracking-tight">
            type2dialogue
          </Link>

          {isInChallenge ? (
            <div className="flex items-center space-x-6">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <Link to={step.path} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 ${
                        step.number === getCurrentStep() ? 'bg-blue-600 text-white' : 'bg-white border-2 border-gray-300 text-gray-400'
                      } rounded-full flex items-center justify-center font-bold text-sm mb-1`}
                    >
                      {step.number}
                    </div>
                    <span
                      className={`text-xs font-medium text-center font-sans ${step.number === getCurrentStep() ? 'text-blue-600' : 'text-gray-400'}`}
                    >
                      {step.label}
                    </span>
                  </Link>
                  {index < steps.length - 1 && <ArrowRight className="w-4 h-4 text-gray-400 ml-4" />}
                </div>
              ))}
            </div>
          ) : (
            <>
              <Link to="/learn" className="text-foreground hover:text-dialogue-purple transition-colors">
                Learn
              </Link>
              <Link to="/challenge" className="text-foreground hover:text-dialogue-purple transition-colors">
                Challenge
              </Link>
              <div className="relative group">
                <Link to="/blog" className="text-foreground hover:text-dialogue-purple transition-colors">
                  Blog
                </Link>
                <div className="absolute top-full left-0 bg-white border border-gray-200 shadow-lg rounded-md py-2 min-w-[320px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {blogPosts.map((post) => (
                    <Link key={post.id} to={`/blog/${post.id}`} className="block px-4 py-3 hover:bg-gray-50 transition-colors">
                      <div className="font-medium text-gray-900 text-sm mb-1 leading-tight">{post.title}</div>
                      <div className="text-xs text-gray-500">
                        <span>{post.readTime}</span>
                      </div>
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <Link to="/blog" className="block px-4 py-2 text-sm text-dialogue-purple hover:text-dialogue-darkblue font-medium">
                      View all posts →
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" className="hidden sm:flex" onClick={handleAuthClick}>
            {user ? 'Log Out' : 'Log In'}
          </Button>
          <Button className="bg-dialogue-purple hover:bg-dialogue-darkblue" onClick={() => navigate('/auth')}>
            <LogIn className="mr-2 h-4 w-4" />
            {user ? 'Dashboard' : 'Sign Up'}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
