import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/ui/button';
import { blogPosts } from '@/data/blogPosts';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
            <></>
          )}
        </div>

        <div className="flex items-center">
          <Button 
            asChild
            className="bg-dialogue-purple hover:bg-dialogue-purple/90 text-white"
          >
            <a href="mailto:about@type2dialogue.com">
              Get in touch
            </a>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
