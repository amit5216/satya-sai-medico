/**
 * ============================================================
 * UTILITY FUNCTIONS — cn() for Tailwind class merging
 * ============================================================
 *
 * 🎓 WHY cn()?
 * When building reusable components with Tailwind, you often need
 * to merge default classes with custom overrides. Example:
 *
 *   <Button className="bg-red-500" />
 *
 * Without cn(), both bg-primary AND bg-red-500 would apply,
 * causing unpredictable results. tailwind-merge intelligently
 * resolves conflicts (bg-red-500 wins over bg-primary).
 *
 * clsx handles conditional classes:
 *   cn("px-4", isLarge && "px-8", className)
 *
 * 🎓 INTERVIEW: "How do you handle dynamic Tailwind classes?"
 * → "I use a cn() utility combining clsx for conditional logic
 *    and tailwind-merge for conflict resolution. This is the
 *    standard pattern used by shadcn/ui and most modern React
 *    component libraries."
 */

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
