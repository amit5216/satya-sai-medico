/**
 * ============================================================
 * useDebounce — Debounce hook for search input
 * ============================================================
 *
 * 🎓 WHY DEBOUNCE?
 * When a user types in a search field, filtering runs on every
 * keystroke. For large datasets, this causes lag.
 *
 * Debouncing waits for the user to STOP typing (e.g., 300ms)
 * before executing the filter. This reduces unnecessary work.
 *
 * Usage:
 *   const debouncedSearch = useDebounce(searchQuery, 300);
 *   // Use debouncedSearch for filtering instead of searchQuery
 *
 * 🎓 INTERVIEW: "How do you optimize search in React?"
 * → "I use a useDebounce hook that delays processing until the
 *    user stops typing. Combined with useMemo for the filtered
 *    results, this prevents unnecessary re-renders and keeps
 *    the UI responsive even with large datasets."
 */

import { useState, useEffect } from 'react';

function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export { useDebounce };
