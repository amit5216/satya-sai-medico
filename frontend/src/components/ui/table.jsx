/**
 * ============================================================
 * TABLE COMPONENT — Styled table primitives
 * ============================================================
 *
 * 🎓 WHY STYLED TABLE PRIMITIVES?
 * Raw <table> elements have no styling. Rather than repeating
 * className="px-4 py-3 text-left text-sm font-medium text-muted-foreground"
 * on every <th>, we wrap them in pre-styled components.
 *
 * These are low-level building blocks. The higher-level
 * DataTable component (in admin/) composes these with
 * search, pagination, and actions.
 */

import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Table = forwardRef(({ className, ...props }, ref) => (
  <div className="w-full overflow-x-auto">
    <table
      ref={ref}
      className={cn('w-full caption-bottom text-sm', className)}
      {...props}
    />
  </div>
));
Table.displayName = 'Table';

const TableHeader = forwardRef(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn('bg-muted/50 [&_tr]:border-b', className)}
    {...props}
  />
));
TableHeader.displayName = 'TableHeader';

const TableBody = forwardRef(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0 divide-y divide-border', className)}
    {...props}
  />
));
TableBody.displayName = 'TableBody';

const TableRow = forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'bg-card hover:bg-muted/30 transition-colors',
      className
    )}
    {...props}
  />
));
TableRow.displayName = 'TableRow';

const TableHead = forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'px-4 py-3 text-left text-sm font-medium text-muted-foreground',
      className
    )}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

const TableCell = forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn('px-4 py-3 text-sm', className)}
    {...props}
  />
));
TableCell.displayName = 'TableCell';

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
