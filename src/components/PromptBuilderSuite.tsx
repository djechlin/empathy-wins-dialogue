import { forwardRef, useImperativeHandle, useRef } from 'react';
import PromptBuilder, { type PromptBuilderRef } from './PromptBuilder';

interface PromptBuilderSuiteProps {
  name: string;
  color: string;
  defaultOpen?: boolean;
  onPromptChange?: (systemPrompt: string) => void;
  onDataChange?: (data: { systemPrompt: string; firstMessage: string; displayName: string }) => void;
}

export interface PromptBuilderSuiteRef {
  getPromptBuilder: () => PromptBuilderRef | null;
}

const PromptBuilderSuite = forwardRef<PromptBuilderSuiteRef, PromptBuilderSuiteProps>(
  ({ name, color, defaultOpen, onPromptChange, onDataChange }, ref) => {
    const promptBuilderRef = useRef<PromptBuilderRef>(null);

    useImperativeHandle(ref, () => ({
      getPromptBuilder: () => promptBuilderRef.current,
    }));

    return (
      <PromptBuilder
        ref={promptBuilderRef}
        name={name}
        color={color}
        defaultOpen={defaultOpen}
        onPromptChange={onPromptChange}
        onDataChange={onDataChange}
      />
    );
  },
);

PromptBuilderSuite.displayName = 'PromptBuilderSuite';

export default PromptBuilderSuite;