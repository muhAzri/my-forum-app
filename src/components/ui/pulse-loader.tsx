import { cn } from '../../lib/utils';

interface PulseLoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function PulseLoader({ className, size = 'md' }: PulseLoaderProps) {
  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
  };

  return (
    <div className={cn('flex space-x-1', className)}>
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={cn(
            'rounded-full bg-primary-600 animate-pulse',
            sizeClasses[size],
          )}
          style={{
            animationDelay: `${index * 0.2}s`,
            animationDuration: '1s',
          }}
        />
      ))}
    </div>
  );
}

interface TypingLoaderProps {
  className?: string;
  text?: string;
}

export function TypingLoader({ className, text = 'Loading' }: TypingLoaderProps) {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <span className="text-gray-600">{text}</span>
      <div className="flex space-x-1">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="h-1 w-1 rounded-full bg-gray-400 animate-bounce"
            style={{
              animationDelay: `${index * 0.2}s`,
              animationDuration: '1.2s',
            }}
          />
        ))}
      </div>
    </div>
  );
}

interface LoadingCardProps {
  title: string;
  description: string;
  progress?: number;
  className?: string;
}

export function LoadingCard({ title, description, progress, className }: LoadingCardProps) {
  return (
    <div className={cn(
      'bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center',
      className,
    )}
    >
      <div className="mb-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mb-4">
          <PulseLoader className="text-white" size="lg" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>

      {progress !== undefined && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}