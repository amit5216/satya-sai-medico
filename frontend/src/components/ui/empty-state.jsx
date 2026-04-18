/**
 * ============================================================
 * EMPTY STATE COMPONENT — When there's no data to display
 * ============================================================
 *
 * 🎓 WHY DEDICATED EMPTY STATES?
 * A blank table or "No data found" text feels broken.
 * A proper empty state with an icon, message, and action
 * guides the user toward the next step.
 */

import { cn } from '../../lib/utils';
import { Inbox } from 'lucide-react';

function EmptyState({
  icon: Icon = Inbox,
  title = 'No data found',
  description = 'Try adjusting your search or filters.',
  action,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-4 text-center',
        className
      )}
    >
      <div className="p-4 bg-muted rounded-2xl mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-sm">{description}</p>
      {action && action}
    </div>
  );
}

export { EmptyState };
