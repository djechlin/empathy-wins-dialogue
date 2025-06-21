import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dialogue-neutral py-8 mt-16">
      <div className="container-custom">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <MessageCircle className="h-6 w-6 text-dialogue-purple" />
            <span className="font-heading font-bold text-xl text-dialogue-darkblue">type2dialogue</span>
          </div>
          <p className="text-muted-foreground text-sm">Building bridges through empathetic political conversations that win elections.</p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-6 mb-6 text-sm">
          <Link to="#" className="text-muted-foreground hover:text-dialogue-purple transition-colors">
            About Us
          </Link>
          <a href="mailto:daniel@type2dialogue.com" className="text-muted-foreground hover:text-dialogue-purple transition-colors">
            Contact
          </a>
          <Link to="#" className="text-muted-foreground hover:text-dialogue-purple transition-colors">
            Privacy Policy
          </Link>
          <Link to="#" className="text-muted-foreground hover:text-dialogue-purple transition-colors">
            Terms of Service
          </Link>
          <span className="text-muted-foreground">|</span>
          <a
            href="http://type2dialogue.substack.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-dialogue-purple transition-colors"
          >
            Substack
          </a>
          <a
            href="https://x.com/type2dialogue"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-dialogue-purple transition-colors"
          >
            X
          </a>
          <a
            href="https://bsky.app/profile/type2dialogue.bsky.social"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-dialogue-purple transition-colors"
          >
            Bluesky
          </a>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} type2dialogue. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
