import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface TimerProps {
  isActive: boolean;
  maxSeconds?: number;
  onTimeChange?: (timeElapsed: number) => void;
}

export function Timer({
  isActive,
  maxSeconds = 300,
  onTimeChange,
}: TimerProps) {
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setTimeElapsed(0);
    }
  }, [isActive]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeElapsed < maxSeconds) {
      interval = setInterval(() => {
        setTimeElapsed((time) => {
          const newTime = time + 1;
          onTimeChange?.(newTime);
          return newTime;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeElapsed, maxSeconds, onTimeChange]);

  const minutes = Math.floor(timeElapsed / 60);
  const seconds = timeElapsed % 60;
  const maxMinutes = Math.floor(maxSeconds / 60);
  const maxSecondsDisplay = maxSeconds % 60;

  return (
    <div className="flex items-center gap-2 p-4 bg-white border-b">
      <Clock className="size-4 text-gray-500" />
      <span className="text-sm font-medium">
        {minutes}:{seconds.toString().padStart(2, "0")}/{maxMinutes}:
        {maxSecondsDisplay.toString().padStart(2, "0")}
      </span>
    </div>
  );
}
