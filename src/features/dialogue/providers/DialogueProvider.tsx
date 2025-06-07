import { ReactNode } from 'react';
import { MockDialogueProvider } from './MockDialogueProvider';
import { DeepgramDialogueProvider } from './DeepgramDialogueProvider';
import { HumeDialogueProvider } from './HumeDialogueProvider';
import { DialogueMessage } from '../types';

export type DialogueProviderType = 'deepgram' | 'hume' | 'mock';
interface DialogueProviderProps {
  children: ReactNode;
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
          className={props.className}
          {...otherProps}
        >
          {props.children}
        </HumeDialogueProvider>
      );
    case 'deepgram':
      return (
        <DeepgramDialogueProvider
          className={props.className}
        >
          {props.children}
        </DeepgramDialogueProvider>
      );
    default:
      throw new Error(`Unknown dialogue provider: ${provider}`);
  }
}