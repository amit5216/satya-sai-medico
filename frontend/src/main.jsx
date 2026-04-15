import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

/**
 * ============================================================
 * MAIN ENTRY POINT — React Application
 * ============================================================
 *
 * WHAT'S HAPPENING HERE:
 * 1. createRoot() — Creates a React root on the DOM element with id="root"
 * 2. StrictMode — Helps find potential problems during development
 *    (double-renders components to detect side effects)
 * 3. BrowserRouter — Enables client-side routing (SPA navigation)
 *    Without this, react-router-dom won't work.
 *
 * WHY BrowserRouter HERE (not in App.jsx)?
 * The router must wrap the ENTIRE app so that all components
 * can use routing hooks like useNavigate(), useParams(), etc.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
