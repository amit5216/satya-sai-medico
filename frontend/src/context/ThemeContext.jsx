/**
 * ============================================================
 * THEME CONTEXT — Dark Mode Support
 * ============================================================
 *
 * 🎓 HOW DARK MODE WORKS:
 * 1. We store the user's preference in localStorage
 * 2. On load, check: localStorage → system preference → default light
 * 3. We add/remove the 'dark' class on <html>
 * 4. CSS variables in index.css change automatically via .dark {}
 * 5. Tailwind's @custom-variant dark picks up the class
 *
 * 🎓 WHY CLASS-BASED (not media query)?
 * Media query approach (@media (prefers-color-scheme: dark))
 * only follows the OS setting. Class-based gives users a manual
 * toggle AND respects system preference as default.
 *
 * 🎓 INTERVIEW: "How did you implement dark mode?"
 * → "I use class-based dark mode with a ThemeContext. On mount,
 *    it checks localStorage for a saved preference, falling back
 *    to the OS prefers-color-scheme. The 'dark' class is toggled
 *    on the <html> element, and all components use CSS variables
 *    that swap values under .dark {}. This gives users manual
 *    control while respecting system defaults."
 */

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

function getInitialTheme() {
  // Check localStorage first
  const stored = localStorage.getItem('theme');
  if (stored === 'dark' || stored === 'light') return stored;

  // Fall back to system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';

  return 'light';
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeContext;
