import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/ui/button';
import { User } from '@supabase/supabase-js';
import { ArrowRight, LogIn } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface NavbarProps {
  pageTitle?: string;
  pageSummary?: string;
}

const Navbar = ({ pageTitle, pageSummary }: NavbarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  const isInChallenge = location.pathname.startsWith('/challenge');
  const isWorkbench = location.pathname === '/workbench';
  const isWorkbenchDemo = location.pathname === '/workbench/demo';
  const isWorkbenchChats = location.pathname === '/workbench/chats';

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
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Navbar: Error getting initial session:', error);
      } else {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAuthClick = () => {
    if (user) {
      supabase.auth.signOut();
    } else {
      navigate('/auth');
    }
  };
  return (
    <nav className="py-4 border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container-custom flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-sans text-[18px] font-semibold text-gray-800 tracking-tight">
            type2dialogue
          </Link>

          {pageTitle && (
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold text-gray-900">{pageTitle}</h1>
              {pageSummary && <p className="text-sm text-gray-600">{pageSummary}</p>}
            </div>
          )}

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
          ) : (isWorkbench || isWorkbenchChats) && !isWorkbenchDemo ? (
            <div className="flex items-center space-x-6">
              <Link
                to="/workbench"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isWorkbench ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Workbench
              </Link>
              <Link
                to="/workbench/chats"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isWorkbenchChats ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Chats
              </Link>
            </div>
          ) : (
            <></>
          )}
        </div>

        <div className="flex items-center gap-4">
          {(isWorkbench || isWorkbenchChats) && !isWorkbenchDemo ? (
            <>
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Logged in as {user.email}</span>
                  <Button variant="outline" onClick={handleAuthClick}>
                    Log Out
                  </Button>
                </div>
              ) : (
                <>
                  <Button variant="outline" onClick={handleAuthClick}>
                    Log In
                  </Button>
                  <Button className="bg-dialogue-purple hover:bg-dialogue-darkblue" onClick={() => navigate('/auth')}>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign Up
                  </Button>
                </>
              )}
            </>
          ) : (
            <Button asChild className="bg-dialogue-purple hover:bg-dialogue-purple/90 text-white">
              <a href="mailto:about@type2dialogue.com">Get in touch</a>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
