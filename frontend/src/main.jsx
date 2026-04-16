import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
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
 *       AuthProvider   → Global auth state (JWT token, user info)
 *         App          → Routes + Layout
 *
 * 🎓 WHY AuthProvider WRAPS App?
 * AuthProvider uses React Context to share auth state.
 * It must wrap ALL components that need auth access.
 * Since both public pages (Navbar login link) and admin pages
 * (ProtectedRoute, AdminLayout) need auth, we wrap at the top.
 *
 * 🎓 WHY AuthProvider INSIDE BrowserRouter?
 * AuthProvider might use useNavigate() in the future for
 * auto-redirect on token expiry. useNavigate() only works
 * inside a Router context.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
