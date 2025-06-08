import { cn } from '@/lib/utils';
import { fadeInUp } from '@/ui/motionConstants';
import { AnimatePresence, motion } from 'framer-motion';
import { ComponentRef, forwardRef } from 'react';
import ExpressionChipBar from '../../components/ExpressionChipBar';
import { useDialogue } from './hooks/useDialogue';
import { DialogueMessage } from './types';

const MessageList = forwardRef<ComponentRef<typeof motion.div>, Record<never, never>>(function MessageList(_, ref) {
  const dialogue = useDialogue();
  const messages: DialogueMessage[] = dialogue.messages;

  return (
    <motion.div layoutScroll className={'flex-1 rounded-md overflow-y-auto p-4'} ref={ref}>
      <motion.div className={'w-full flex flex-col gap-4 pb-24'}>
        <AnimatePresence mode={'popLayout'}>
          {messages.map((msg, index) => {
            return (
              <motion.div
                key={msg.role + index}
                className={cn('w-[80%]', 'bg-card', 'border border-border rounded', msg.role === 'user' ? 'ml-auto' : '')}
                {...fadeInUp}
              >
                <div className={cn('text-xs capitalize font-medium leading-none opacity-50 pt-4 px-3')}>
                  {msg.role === 'user' ? 'Canvasser' : msg.role === 'assistant' ? 'Voter' : msg.role}
                </div>
                <div className={'pb-3 px-3'}>{msg.content}</div>
                <ExpressionChipBar values={{ ...msg.emotions }} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
});

export default MessageList;
