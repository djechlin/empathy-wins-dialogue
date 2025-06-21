import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dialogue-neutral py-12 mt-16">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="h-6 w-6 text-dialogue-purple" />
              <span className="font-heading font-bold text-xl text-dialogue-darkblue">type2dialogue</span>
            </div>
            <p className="text-muted-foreground mb-4">Building bridges through empathetic political conversations that win elections.</p>
          </div>

          <div>
            <h3 className="font-heading font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-muted-foreground hover:text-dialogue-purple transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-dialogue-purple transition-colors">
                  Topics
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-dialogue-purple transition-colors">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-dialogue-purple transition-colors">
                  Electoral Impact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-muted-foreground hover:text-dialogue-purple transition-colors">
                  Dialogue Guide
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-dialogue-purple transition-colors">
                  Research
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-dialogue-purple transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-dialogue-purple transition-colors">
                  Workshops
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-muted-foreground hover:text-dialogue-purple transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-dialogue-purple transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-dialogue-purple transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-dialogue-purple transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} type2dialogue. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="http://type2dialogue.substack.com/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-dialogue-purple">
              Substack
            </a>
            <a href="https://x.com/type2dialogue" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-dialogue-purple">
              Twitter/X
            </a>
            <a href="https://bsky.app/profile/type2dialogue.bsky.social" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-dialogue-purple">
              Bluesky
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
