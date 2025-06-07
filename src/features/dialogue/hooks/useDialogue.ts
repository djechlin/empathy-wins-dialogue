import { useContext } from 'react';
import { DialogueContext } from '../types';
import { DialogueContextObject } from '../providers/dialogueContext';

export function useDialogue(): DialogueContext {
    const context = useContext(DialogueContextObject);
    if (!context) {
        throw new Error('useDialogue must be used within a DialogueProvider');
    }
    return context;
}