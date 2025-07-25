import {
  CheckCircle, XCircle, Info, AlertCircle, X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { cn } from '../../utils/utils';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string | undefined;
  duration?: number;
  onClose: (_id: string) => void;
}

export function Toast({
  id,
  type,
  title,
  description,
  duration = 5000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, id, onClose]);

  const icons = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
    warning: AlertCircle,
  };

  const colors = {
    success: 'toast-success',
    error: 'toast-error',
    info: 'toast-info',
    warning: 'toast-warning',
  };

  const iconColors = {
    success: 'toast-icon-success',
    error: 'toast-icon-error',
    info: 'toast-icon-info',
    warning: 'toast-icon-warning',
  };

  const Icon = icons[type];

  return (
    <div
      className={cn(
        'pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg transition-all duration-300',
        colors[type],
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
      )}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={cn('h-5 w-5', iconColors[type])} />
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium">{title}</p>
            {description && (
              <p className="mt-1 text-sm opacity-90">{description}</p>
            )}
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              className="inline-flex rounded-md hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2"
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => onClose(id), 300);
              }}
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export interface ToastContainerProps {
  toasts: ToastProps[];
  onClose: (_id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-0 right-0 z-50 flex flex-col space-y-4 p-6">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
}
