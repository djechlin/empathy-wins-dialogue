import { ReactNode, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { DialogueMessage } from '../types';
import { HumeDialogueProvider } from './HumeDialogueProvider';
import { MockDialogueProvider } from './MockDialogueProvider';
import { ReplayProvider } from './ReplayProvider';

export type DialogueSource =
  | { type: 'deepgram' }
  | { type: 'hume'; configId: string }
  | { type: 'mock' }
  | { type: 'replay'; transcript: DialogueMessage[] }
  | { type: 'text-to-ai' };

interface DialogueProviderProps {
  children: ReactNode;
  className?: string;
  initialMessage?: DialogueMessage;
}

export function DialogueProvider(props: DialogueProviderProps) {
  const [searchParams] = useSearchParams();

  const { source, isFromQuery } = useMemo(() => {
    const sourceType = searchParams.get('source');
    const isFromQuery = !!sourceType;

    switch (sourceType) {
      case 'hume': {
        const configId = searchParams.get('source.configId');
        return {
          source: {
            type: 'hume',
            configId: configId || '3f136570-42d4-4afd-b319-866e2fd76474', // fallback to default
          },
          isFromQuery,
        };
      }
      case 'deepgram':
        return { source: { type: 'deepgram' }, isFromQuery };
      case 'mock':
        return { source: { type: 'mock' }, isFromQuery };
      case 'replay': {
        return { source: { type: 'replay', transcript: [] }, isFromQuery };
      }
      case 'text-to-ai':
        return { source: { type: 'text-to-ai' }, isFromQuery };
      default:
        // Default to hume with default config
        return {
          source: {
            type: 'hume',
            configId: '3f136570-42d4-4afd-b319-866e2fd76474',
          },
          isFromQuery: false,
        };
    }
  }, [searchParams]);

  useEffect(() => {
    if (isFromQuery) {
      toast(`Using source: ${JSON.stringify(source)}`);
    }
  }, [isFromQuery, source]);

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
    case 'replay':
      return (
        <ReplayProvider className={props.className} initialMessage={props.initialMessage}>
          {props.children}
        </ReplayProvider>
      );
    default:
      throw new Error(`Unknown dialogue provider: ${source.type}`);
  }
}
