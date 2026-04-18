/**
 * ============================================================
 * SPINNER COMPONENT — Animated loading indicator
 * ============================================================
 */

import { cn } from '../../lib/utils';

function Spinner({ className, size = 'md' }) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-4',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div
      className={cn(
        'rounded-full border-primary/30 border-t-primary animate-spin',
        sizes[size],
        className
      )}
    />
  );
}

/**
 * Full-page centered spinner with optional message.
 */
function PageSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <Spinner size="md" />
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );
}

export { Spinner, PageSpinner };
