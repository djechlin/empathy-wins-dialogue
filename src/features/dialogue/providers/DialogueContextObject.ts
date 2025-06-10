import { createContext } from 'react';
import { DialogueContext } from '../types';

export const DialogueContextObject = createContext<DialogueContext | null>(null);
