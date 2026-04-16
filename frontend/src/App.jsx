import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';

// Public Pages
import Home from './pages/Home';
import Services from './pages/Services';
import Doctors from './pages/Doctors';
import Medicines from './pages/Medicines';
import Appointment from './pages/Appointment';
import Contact from './pages/Contact';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import DoctorManagement from './pages/admin/DoctorManagement';
import PatientManagement from './pages/admin/PatientManagement';
import AppointmentManagement from './pages/admin/AppointmentManagement';
import MedicineManagement from './pages/admin/MedicineManagement';
import ServiceManagement from './pages/admin/ServiceManagement';

/**
 * ============================================================
 * APP COMPONENT — Main Application with Public + Admin Routes
 * ============================================================
 *
 * 🎓 ROUTING ARCHITECTURE:
 *
 *   /                  → Public Home page (Navbar + Footer)
 *   /services          → Public Services page
 *   /doctors           → Public Doctors page
 *   /medicines         → Public Medicines page
 *   /appointment       → Public Appointment booking
 *   /contact           → Public Contact page
 *
 *   /admin/login       → Admin Login (no sidebar, no Navbar)
 *   /admin             → Dashboard (sidebar + protected)
 *   /admin/doctors     → Doctor management (sidebar + protected)
 *   /admin/patients    → Patient management (sidebar + protected)
 *   /admin/appointments→ Appointment management (sidebar + protected)
 *   /admin/medicines   → Medicine management (sidebar + protected)
 *   /admin/services    → Service management (sidebar + protected)
 *
 * 🎓 WHY CONDITIONAL NAVBAR/FOOTER?
 * Admin pages have their OWN layout (sidebar + topbar).
 * Showing the public Navbar/Footer on admin pages would be confusing.
 * We check the current URL and conditionally render them.
 */
function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />

      {/* Show public Navbar ONLY on non-admin routes */}
      {!isAdminRoute && <Navbar />}

      <main className={!isAdminRoute ? 'min-h-screen' : ''}>
        <Routes>
          {/* ── PUBLIC ROUTES ── */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/medicines" element={<Medicines />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/contact" element={<Contact />} />

          {/* ── ADMIN LOGIN (no protection needed) ── */}
          <Route path="/admin/login" element={<Login />} />

          {/* ── ADMIN ROUTES (protected + sidebar layout) ── */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* index = default child route for /admin */}
            <Route index element={<Dashboard />} />
            <Route path="doctors" element={<DoctorManagement />} />
            <Route path="patients" element={<PatientManagement />} />
            <Route path="appointments" element={<AppointmentManagement />} />
            <Route path="medicines" element={<MedicineManagement />} />
            <Route path="services" element={<ServiceManagement />} />
          </Route>
        </Routes>
      </main>

      {/* Show public Footer ONLY on non-admin routes */}
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;
