import { cn } from '../../utils/utils';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

function Divider({ orientation = 'horizontal', className }: DividerProps) {
  return (
    <div
      aria-orientation={orientation}
      className={cn(
        'bg-border',
        orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full',
        className,
      )}
      role="separator"
    />
  );
}

export default Divider;
