import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SCENARIOS } from '@/lib/scriptData';

const choices = Object.entries(SCENARIOS).map(([id, option]) => ({
  id,
  title: option.title,
  description: option.description,
}));

interface StartCallProps {
  onCallStart?: (callId: string) => void;
}

export default function ScenarioLinkGrid({ onCallStart }: StartCallProps) {
  return (
    <AnimatePresence>
      <motion.div
        className="w-full flex flex-col gap-4"
        initial="initial"
        animate="enter"
        exit="exit"
        variants={{
          initial: { opacity: 0 },
          enter: { opacity: 1 },
          exit: { opacity: 0 },
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {choices.map((choice) => (
            <motion.div
              key={choice.id}
              className="flex flex-col bg-card rounded-lg p-6 border border-border hover:bg-accent/10 hover:border-accent transition-colors duration-300 group shadow-sm"
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <h3 className="text-lg font-semibold mb-3 group-hover:text-accent transition-colors duration-300">
                {choice.title}
              </h3>
              <div className="text-sm space-y-2 mb-4 flex-grow">
                {choice.description.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
              <Link
                to={`/call/${choice.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
                onClick={(e) => {
                  if (onCallStart) {
                    e.preventDefault();
                    onCallStart(choice.id);
                  }
                }}
              >
                <Button
                  variant="default"
                  className="w-full mt-auto flex items-center justify-center gap-2"
                >
                  <Phone className="size-4 opacity-80" strokeWidth={2} stroke="currentColor" />
                  <span>Start Practice</span>
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}