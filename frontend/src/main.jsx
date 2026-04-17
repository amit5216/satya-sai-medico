import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

/**
 * ============================================================
 * MAIN ENTRY POINT — React Application
 * ============================================================
 *
 * COMPONENT TREE:
 *   StrictMode         → Development warnings
 *     BrowserRouter    → Enables client-side routing
 *       ThemeProvider  → Dark/light mode state + class toggle
 *         AuthProvider → Global auth state (JWT token, user info)
 *           App        → Routes + Layout
 *           Toaster    → Global toast notifications
 *
 * 🎓 PROVIDER ORDER MATTERS:
 * 1. BrowserRouter → outermost (routing context)
 * 2. ThemeProvider → before auth (theme doesn't depend on auth)
 * 3. AuthProvider  → innermost (may use navigation in future)
 *
 * 🎓 WHY TOASTER AT ROOT?
 * Toast notifications can be triggered from ANY component (login
 * errors, CRUD success messages, etc.). Placing <Toaster /> at
 * root ensures it's always rendered and catches all toast calls.
 *
 * 🎓 WHY AuthProvider INSIDE BrowserRouter?
 * AuthProvider might use useNavigate() in the future for
 * auto-redirect on token expiry. useNavigate() only works
 * inside a Router context.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--card)',
                color: 'var(--card-foreground)',
                border: '1px solid var(--border)',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
              },
              success: {
                iconTheme: { primary: '#10B981', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#EF4444', secondary: '#fff' },
              },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
