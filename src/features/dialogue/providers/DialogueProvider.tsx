import { ReactNode } from 'react';
import { DeepgramDialogueProvider } from './DeepgramDialogueProvider';
import { HumeDialogueProvider } from './HumeDialogueProvider';
import { MockDialogueProvider } from './MockDialogueProvider';
import { DialogueMessage } from '../types';

export type DialogueSource =
  | { type: 'deepgram' }
  | { type: 'hume'; configId: string }
  | { type: 'mock' }
  | { type: 'replay'; transcript: DialogueMessage[] }
  | { type: 'text-to-ai' };

interface DialogueProviderProps {
  children: ReactNode;
  className?: string;
  source: DialogueSource;
}

export function DialogueProvider(props: DialogueProviderProps) {
  const { source, ...otherProps } = props;

  switch (source.type) {
    case 'mock':
      return <MockDialogueProvider className={props.className}>{props.children}</MockDialogueProvider>;
    case 'hume':
      return (
        <HumeDialogueProvider className={props.className} configId={source.configId} {...otherProps}>
          {props.children}
        </HumeDialogueProvider>
      );
    case 'deepgram':
      return <DeepgramDialogueProvider className={props.className}>{props.children}</DeepgramDialogueProvider>;
    case 'replay':
      throw new Error('Replay provider not implemented yet');
    default:
      throw new Error(`Unknown dialogue provider: ${source.type}`);
  }
}
