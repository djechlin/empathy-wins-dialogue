import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useStopwatch } from 'react-timer-hook';
import { DialogueContext, DialogueMessage } from '../types';
import { DialogueContextObject } from './DialogueContextObject';

const lucasReplayText = `Voter: Hello? Is someone at my door?

Canvasser: Hi. My name is Lucas, and I'm interested in talking with you more about health care in America.

Voter: Oh, healthcare? I don't know if I have much to say about that. I'm Frank, by the way.What organization are you with?

Canvasser: I'm with Americans with diabetes.

Canvasser: And we're interested in capping the price of insulin so that, citizens pay less money for lifesaving medication.

Canvasser: Which costs big companies only a dollar to make.

Canvasser: But sells for two hundred dollars.

Voter: Oh, I see. Well, I don't have diabetes myself, so I haven't really thought much about insulin prices.  Sounds like there's quite a markup there, but isn't that how most medications work? Companies spend money on research and then charge more to make their profit back.  I tend to think the government getting involved just makes things more expensive in the long run with all the bureaucracy.

Canvasser: Yeah. I I think I I understand where you're coming from. Definitely government regulation can cause prices to go up. Certainly for new medication research. But insulin's been around for a hundred years. Actually, the inventor of insulin sold the patent for one dollar. So that everyone could have access to this medication. And what has happened is these companies have taken this very, very cheap to make product that sells for a dollar in Mexico and are charging people two hundred, three hundred dollars here.

Voter: Hmm, I didn't know that about insulin being that old or that the inventor sold it for so little. That does make it seem different than new medications still under research. So it's that much cheaper in Mexico? That's pretty wild. I guess I can see why people would be upset about that.  But I'm still not sure what the government could do that wouldn't just create more problems. You know how these things go.

Canvasser: I do know how these things go. And, certainly, when the government gets involved, it can cause problems. I mean, my brother has diabetes actually right now, and it's pretty difficult for him if he doesn't his health insurance doesn't cover his insulin. He's just out of luck. And I think that we should make sure that I think one of the things government can do well is it can make sure that companies don't rip off American citizens.

Canvasser: Given the price difference between Mexico and the US for the same drug, you can see that or at least for my brother, it can see that he's having to pay way more than others are. I didn't realize your brother has diabetes. That must be tough for him. Is he managing okay?  Does he have to pay those high prices you mentioned?

Canvasser: Yeah. He is, he's doing better, certainly. But and right now, because of his insurance plan, he doesn't have to pay as much. But if he didn't have health insurance like many people don't, or if he had a worse health insurance plan, like he was working for you know, Target, then he he would be in trouble.

Voter: Well, I'm glad he has decent insurance now. I can see how that would be really stressful otherwise. His mom was worried sick. Do you think a lot of people are in that situation with insulin? Having to choose between medicine and other necessities?  I'm curious - does your brother ever struggle with affording his insulin?  How does that affect him and your family?

Canvasser: Oh, I'm I'm sorry to hear about your nephew. Yeah. I I mean, certainly, I think not being able to afford life saving medication because you've gotten laid off or because you're you know, your job changes is is terrible.

Canvasser: My brother, like I said, doesn't struggle now because of his current job situation, but I think he is worried that if he changes jobs in the future, or, you know, gets laid off unexpectedly, that could all change, and then he could be in real trouble.

Voter: That's a real worry to live with, isn't it? I can see how that would create a lot of stress. My nephew was only without his medication for about a month, but my sister was beside herself with worry.  It's not right that people have to worry about basic health needs just because of job changes. What do you think would help people like your brother have more security? Is that what this insulin price cap idea would do?

Canvasser: Yeah. Exactly. So if we were to cap the price of insulin from, say, two hundred dollars to thirty dollars even though my brother would be paying the same amount right now, if he was fired, or or, you know, he just was between jobs. He would just be able to afford it out of pocket rather than having to pay these exorbitant prices.

Canvasser: Oh, and your nephew too. Right? Wouldn't your, your sister wouldn't have had to worry about him because they could have just afforded it because it wouldn't have been outrageously expensive.

Voter: You're right, it would have made a huge difference for them.

Voter: My sister was trying to help him pay for it, but she's a single mom and it was just too much on top of her other bills. That was a really stressful time for our whole family. I hadn't really thought about it that way before - how a price cap could be like a safety net for people between jobs. That makes a lot of sense. What are you folks actually doing to try to make this happen? Is there something specific you're asking people to do?

Canvasser: Yeah. So I'm I'm glad you asked. Right now, there's some legislation in congress that is being voted on within a month. And we're trying to get people to call their representatives to tell them to vote for it so that it will significantly increase the likelihood that it passes.

Voter: That makes sense. You know, after hearing about how this could help people like my nephew and your brother, I think I would be willing to make that call.

Canvasser: Would that be something you'd be willing to do? Who would I need to contact exactly?  Do you have the information for who my representative is? You know what? I think I would be willing to do that. After thinking about what my nephew and sister went through, and knowing your brother faces the same worry, it just seems like the right thing to do. Do you have the number I should call?  And what exactly should I say when I call?

Canvasser: Yeah. I have the number right here. Let me give you a card.

Canvasser: When you call, you'll just talk to one of the staffers at the representative's office. You just tell them your name. You'll tell them your ZIP ZIP code so that they know your constituent, and then you can you can just tell them your concern. So in this case, you know, tell them that you support proposition twenty eight and, that you hope that your senator, senator White House will also vote for it.`;

function parseLucasReplay(): DialogueMessage[] {
  const lines = lucasReplayText.split('\n').filter((line) => line.trim());
  const messages: DialogueMessage[] = [];

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('Voter:')) {
      messages.push({
        id: `msg-${index}`,
        role: 'assistant',
        content: trimmedLine.replace('Voter:', '').trim(),
        timestamp: new Date(Date.now() + index * 1000),
      });
    } else if (trimmedLine.startsWith('Canvasser:')) {
      messages.push({
        id: `msg-${index}`,
        role: 'user',
        content: trimmedLine.replace('Canvasser:', '').trim(),
        timestamp: new Date(Date.now() + index * 1000),
      });
    }
  });

  return messages;
}

interface ReplayProviderProps {
  children: ReactNode;
  className?: string;
  initialMessage?: DialogueMessage;
}

export function ReplayProvider({ children, className, initialMessage }: ReplayProviderProps) {
  const [messages] = useState<DialogueMessage[]>(() => (initialMessage ? [initialMessage] : []));
  const [isConnected, setIsConnected] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const { seconds: secondsElapsed, pause, start, isRunning } = useStopwatch({ autoStart: false });

  const replayMessages = useMemo(() => parseLucasReplay(), []);

  useEffect(() => {
    // Simulate connection after a short delay
    const timer = setTimeout(() => {
      setIsConnected(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handle message playback
  useEffect(() => {
    if (!hasStarted || !isRunning || currentMessageIndex >= replayMessages.length) return;

    const delay = 2000; // 2 seconds between messages
    const timer = setTimeout(() => {
      setCurrentMessageIndex((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [hasStarted, isRunning, currentMessageIndex, replayMessages.length]);

  const replayContext: DialogueContext = useMemo(
    () => ({
      messages: hasStarted ? [...messages, ...replayMessages.slice(0, currentMessageIndex + 1)] : messages,
      isPaused: !isRunning,
      togglePause: (state?: boolean) => {
        const newState = state !== undefined ? state : isRunning;
        if (newState) {
          pause();
        } else {
          start();
        }
        return newState;
      },
      status: isConnected ? 'connected' : 'connecting',
      connect: async () => {
        setIsConnected(true);
        setHasStarted(true);
        start();
      },
      disconnect: () => {
        setIsConnected(false);
        setHasStarted(false);
        setCurrentMessageIndex(0);
        pause();
      },
      micFft: Array(32)
        .fill(0)
        .map(() => Math.random() * 0.5),
      timeElapsed: secondsElapsed,
      initialMessage,
    }),
    [messages, isConnected, isRunning, pause, start, secondsElapsed, initialMessage, hasStarted, replayMessages, currentMessageIndex],
  );

  return (
    <div className={className}>
      <DialogueContextObject.Provider value={replayContext}>{children}</DialogueContextObject.Provider>
    </div>
  );
}
