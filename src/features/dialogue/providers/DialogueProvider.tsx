import { ReactNode } from 'react';
import { DeepgramDialogueProvider } from './DeepgramDialogueProvider';
import { HumeDialogueProvider } from './HumeDialogueProvider';
import { MockDialogueProvider } from './MockDialogueProvider';

export type DialogueSource = 'deepgram' | 'hume' | 'mock';
interface DialogueProviderProps {
  children: ReactNode;
  className?: string;
  source: DialogueSource;
}

export function DialogueProvider(props: DialogueProviderProps) {
  const { source, ...otherProps } = props;

  switch (source) {
    case 'mock':
      return <MockDialogueProvider className={props.className}>{props.children}</MockDialogueProvider>;
    case 'hume':
      return (
        <HumeDialogueProvider className={props.className} {...otherProps}>
          {props.children}
        </HumeDialogueProvider>
      );
    case 'deepgram':
      return <DeepgramDialogueProvider className={props.className}>{props.children}</DeepgramDialogueProvider>;
    default:
      throw new Error(`Unknown dialogue provider: ${source}`);
  }
}
