
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageCircle, LogIn } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    // Check for existing session
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
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

  return <nav className="py-4 border-b border-border bg-white sticky top-0 z-50">
      <div className="container-custom flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-sans text-[18px] font-semibold text-gray-800 tracking-tight">
            type2dialogue
          </Link>

          <Link to="/learn" className="text-foreground hover:text-dialogue-purple transition-colors">
            Learn
          </Link>
          <Link to="/challenge" className="text-foreground hover:text-dialogue-purple transition-colors">
            Challenge
          </Link>
          <Link to="/blog" className="text-foreground hover:text-dialogue-purple transition-colors">
            Blog
          </Link>
          <Link to="/challenge/mock" className="text-white hover:text-gray-200 transition-colors">
            Mock
          </Link>
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
    </nav>;
};

export default Navbar;
