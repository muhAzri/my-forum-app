import { useEffect, useState } from 'react';

import { cn } from '../../lib/utils';

interface ProgressBarProps {
  className?: string;
  duration?: number;
}

export function ProgressBar({ className, duration = 3000 }: ProgressBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 100;
        }
        return prev + (100 / (duration / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration]);

  return (
    <div className={cn('w-full bg-gray-200 rounded-full h-2', className)}>
      <div
        className="bg-primary-600 h-2 rounded-full transition-all duration-100 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

interface SmartProgressBarProps {
  className?: string;
  message?: string;
}

export function SmartProgressBar({ className, message = 'Loading...' }: SmartProgressBarProps) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);

  const stages = [
    { progress: 20, message: 'Connecting to server...' },
    { progress: 40, message: 'Fetching data...' },
    { progress: 70, message: 'Processing response...' },
    { progress: 90, message: 'Almost ready...' },
    { progress: 100, message: 'Complete!' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const currentStage = stages[stage];
        if (prev >= (currentStage?.progress ?? 0) && stage < stages.length - 1) {
          setStage((s) => s + 1);
        }

        if (prev >= 100) {
          return 100;
        }

        return prev + Math.random() * 3 + 1;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [stage]);

  return (
    <div className={cn('w-full max-w-md mx-auto', className)}>
      <div className="mb-2">
        <p className="text-sm text-gray-600">{stages[stage]?.message ?? message}</p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <div className="mt-1 text-right">
        <span className="text-xs text-gray-500">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}