import { ReactNode } from 'react';
import { MockDialogueProvider } from './MockDialogueProvider';
import { DeepgramDialogueProvider } from './DeepgramDialogueProvider';
import { HumeDialogueProvider } from './HumeDialogueProvider';
import { DialogueMessage } from '../types';

export type DialogueProviderType = 'deepgram' | 'hume' | 'mock';
interface DialogueProviderProps {
  children: ReactNode;
  onMessage?: (message: DialogueMessage) => void;
  className?: string;
  provider: DialogueProviderType;
}


export function DialogueProvider(props: DialogueProviderProps) {
  const { provider, ...otherProps } = props;

  switch (provider) {
    case 'mock':
      return (
        <MockDialogueProvider className={props.className}>
          {props.children}
        </MockDialogueProvider>
      );
    case 'hume':
      return (
        <HumeDialogueProvider
          onMessage={props.onMessage}
          className={props.className}
          {...otherProps}
        >
          {props.children}
        </HumeDialogueProvider>
      );
    case 'deepgram':
      return (
        <DeepgramDialogueProvider
          onMessage={props.onMessage}
          className={props.className}
        >
          {props.children}
        </DeepgramDialogueProvider>
      );
    default:
      throw new Error(`Unknown dialogue provider: ${provider}`);
  }
}