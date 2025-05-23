import { expressionColors, isExpressionColor } from '@/lib/expressionColors';
import { expressionLabels } from '@/lib/expressionLabels';
import { motion } from 'framer-motion';
import { CSSProperties } from 'react';

export default function ExpressionChipBar({ values }: { values: Record<string, number> }) {
  const getTop3Expressions = (data: Record<string, number>): [string, number][] => {
    return Object.entries(data)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  };

  const clamp = (value: number, min: number, max: number): number => {
    return Math.min(Math.max(value, min), max);
  };

  const top3 = getTop3Expressions(values);

  return (
    <div className={'text-xs p-3 w-full border-t border-border flex flex-col md:flex-row gap-3'}>
      {top3.map(([key, value]) => (
        <div key={key} className={'w-full overflow-hidden'}>
          <div className={'flex items-center justify-between gap-1 font-mono pb-1'}>
            <div className={'font-medium truncate'}>{expressionLabels[key]}</div>
            <div className={'tabular-nums opacity-50'}>{value.toFixed(2)}</div>
          </div>
          <div
            className={'relative h-1'}
            style={
              {
                '--bg': isExpressionColor(key) ? expressionColors[key] : 'var(--bg)',
              } as CSSProperties
            }
          >
            <div
              className={'absolute top-0 left-0 size-full rounded-full opacity-10 bg-[var(--bg)]'}
            />
            <motion.div
              className={'absolute top-0 left-0 h-full bg-[var(--bg)] rounded-full'}
              initial={{ width: 0 }}
              animate={{
                width: `${clamp(value, 0, 1) * 100}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
