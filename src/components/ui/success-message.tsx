import { CheckCircle } from 'lucide-react';

import { cn } from '../../lib/utils';

interface SuccessMessageProps {
  title: string;
  description?: string;
  className?: string;
}

export function SuccessMessage({ title, description, className }: SuccessMessageProps) {
  return (
    <div className={cn(
      'bg-green-50 border border-green-200 rounded-lg p-4 animate-scale-in',
      className,
    )}
    >
      <div className="flex items-start">
        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
        <div className="ml-3">
          <h3 className="text-sm font-medium text-green-800">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-green-700">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}