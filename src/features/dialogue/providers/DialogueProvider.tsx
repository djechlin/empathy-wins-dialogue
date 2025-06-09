import { ReactNode, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
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
}

export function DialogueProvider(props: DialogueProviderProps) {
  const [searchParams] = useSearchParams();

  const source = useMemo((): DialogueSource => {
    const sourceType = searchParams.get('source');

    switch (sourceType) {
      case 'hume': {
        const configId = searchParams.get('source.configId');
        return {
          type: 'hume',
          configId: configId || '3f136570-42d4-4afd-b319-866e2fd76474', // fallback to default
        };
      }
      case 'deepgram':
        return { type: 'deepgram' };
      case 'mock':
        return { type: 'mock' };
      case 'replay': {
        return { type: 'replay', transcript: [] };
      }
      case 'text-to-ai':
        return { type: 'text-to-ai' };
      default:
        // Default to hume with default config
        return {
          type: 'hume',
          configId: '3f136570-42d4-4afd-b319-866e2fd76474',
        };
    }
  }, [searchParams]);

  const { ...otherProps } = props;

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
