/**
 * ============================================================
 * BADGE COMPONENT — Status indicators with variants
 * ============================================================
 *
 * 🎓 USAGE:
 *   <Badge variant="success">Active</Badge>
 *   <Badge variant="destructive">Inactive</Badge>
 *   <Badge variant="warning">Pending</Badge>
 *
 * Replaces all inline status badge styling across the app.
 */

import { cn } from '../../lib/utils';

const badgeVariants = {
  default: 'bg-primary/10 text-primary border-primary/20',
  secondary: 'bg-secondary/10 text-secondary border-secondary/20',
  destructive: 'bg-destructive/10 text-destructive border-destructive/20',
  success: 'bg-secondary/10 text-secondary border-secondary/20',
  warning: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  outline: 'bg-transparent text-foreground border-border',
};

function Badge({ className, variant = 'default', children, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
        badgeVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
