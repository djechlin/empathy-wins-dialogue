
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="py-4 border-b border-border bg-white sticky top-0 z-50">
      <div className="container-custom flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-dialogue-purple" />
            <Link to="/" className="font-heading font-bold text-xl text-dialogue-darkblue">
              type2dialogue
            </Link>
          </div>
          
          <Link to="/learn" className="text-foreground hover:text-dialogue-purple transition-colors">
            Learn
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" className="hidden sm:flex">
            Log In
          </Button>
          <Button className="bg-dialogue-purple hover:bg-dialogue-darkblue">
            Start Dialogue
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
