import { useContext } from 'react';
import { DialogueContextObject } from '../providers/DialogueContextObject';
import { DialogueContext } from '../types';

export function useDialogue(): DialogueContext {
  const context = useContext(DialogueContextObject);
  if (!context) {
    throw new Error('useDialogue must be used within a DialogueProvider');
  }
  return context;
}
