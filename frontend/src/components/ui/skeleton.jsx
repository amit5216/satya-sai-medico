/**
 * ============================================================
 * SKELETON COMPONENT — Loading placeholder
 * ============================================================
 *
 * 🎓 WHY SKELETONS INSTEAD OF SPINNERS?
 * Spinners show "something is loading" but give no hint about
 * WHAT is loading. Skeletons mimic the shape of the actual content,
 * reducing perceived load time by up to 30% (Google UX research).
 *
 * Usage:
 *   <Skeleton className="h-4 w-48" />      → Text line
 *   <Skeleton className="h-32 w-full" />    → Card
 *   <Skeleton className="h-8 w-8 rounded-full" /> → Avatar
 *
 * 🎓 INTERVIEW: "How do you handle loading states?"
 * → "I use skeleton screens instead of spinners. They match the
 *    layout of the actual content, so the page doesn't 'jump'
 *    when data loads. This reduces perceived latency and improves
 *    Cumulative Layout Shift (CLS) — a Core Web Vital metric."
 */

import { cn } from '../../lib/utils';

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-muted',
        className
      )}
      {...props}
    />
  );
}

/**
 * Pre-built skeleton variants for common patterns
 */
function CardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-start justify-between">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <Skeleton className="h-5 w-16" />
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-7 w-20" />
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
  );
}

function TableRowSkeleton({ columns = 4 }) {
  return (
    <tr className="bg-card">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
}

function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-4 py-3 text-left">
                <Skeleton className="h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div>
      {/* Stat cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      {/* Two-column panels skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <Skeleton className="h-6 w-36 mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export { Skeleton, CardSkeleton, TableRowSkeleton, TableSkeleton, DashboardSkeleton };
