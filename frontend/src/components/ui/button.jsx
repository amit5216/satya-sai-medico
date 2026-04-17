/**
 * ============================================================
 * BUTTON COMPONENT — Reusable with variants & sizes
 * ============================================================
 *
 * 🎓 WHY A REUSABLE BUTTON?
 * Without this, every page writes its own button styles:
 *   "bg-primary text-primary-foreground px-4 py-2.5 rounded-lg..."
 * This string appears 15+ times across the app. One design change
 * means editing 15+ files.
 *
 * With this component:
 *   <Button variant="primary" size="md">Save</Button>
 *
 * 🎓 PATTERN: Variant-based component design
 * Instead of passing raw classes, we define named variants.
 * This enforces design consistency and makes the API declarative.
 *
 * 🎓 INTERVIEW: "How do you ensure UI consistency?"
 * → "I built a variant-based component library. Each component
 *    like Button accepts a 'variant' prop that maps to predefined
 *    styles. This prevents ad-hoc styling and ensures every button
 *    in the app looks consistent. It's the same pattern used by
 *    Chakra UI, shadcn/ui, and Material UI."
 */

import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const buttonVariants = {
  variant: {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
    outline: 'border border-border bg-background hover:bg-muted hover:text-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-sm',
    ghost: 'hover:bg-muted hover:text-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  },
  size: {
    default: 'h-10 px-4 py-2',
    sm: 'h-8 rounded-md px-3 text-xs',
    lg: 'h-11 rounded-lg px-8',
    icon: 'h-9 w-9',
  },
};

/**
 * Get computed class string based on variant options.
 */
function getButtonClasses({ variant = 'default', size = 'default', className }) {
  return cn(
    // Base styles — always applied
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    // Variant styles
    buttonVariants.variant[variant],
    // Size styles
    buttonVariants.size[size],
    // Custom overrides
    className
  );
}

const Button = forwardRef(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  return (
    <button
      className={getButtonClasses({ variant, size, className })}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = 'Button';

export { Button, getButtonClasses };
