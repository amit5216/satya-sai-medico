/**
 * ============================================================
 * ADMIN HEADER — Page header for admin pages
 * ============================================================
 *
 * Provides consistent page headers across all admin CRUD pages.
 * Includes title, description, and optional action buttons.
 *
 * Usage:
 *   <AdminPageHeader
 *     title="Doctors"
 *     description="12 total doctors"
 *     actions={<Button><Plus /> Add Doctor</Button>}
 *   />
 */

import { cn } from '../../lib/utils';

function AdminPageHeader({ title, description, actions, className }) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6',
        className
      )}
    >
      <div>
        {title && (
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        )}
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export { AdminPageHeader };
