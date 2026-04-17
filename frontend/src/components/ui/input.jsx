/**
 * ============================================================
 * INPUT COMPONENT — Consistent form input styling
 * ============================================================
 *
 * 🎓 WHY A REUSABLE INPUT?
 * The same input styling string appears 14+ times in our codebase:
 *   "w-full px-3 py-2.5 rounded-lg border border-input bg-background
 *    text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
 *
 * This component centralizes that styling. Any design change
 * (e.g., changing border radius) happens in ONE place.
 */

import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Input = forwardRef(({ className, type = 'text', ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm',
        'text-foreground placeholder:text-muted-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'transition-shadow',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

const Textarea = forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm',
        'text-foreground placeholder:text-muted-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'resize-none transition-shadow',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

const Label = forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      'block text-sm font-medium text-foreground mb-1.5',
      className
    )}
    {...props}
  />
));
Label.displayName = 'Label';

export { Input, Textarea, Label };
