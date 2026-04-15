import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Services from './pages/Services';
import Doctors from './pages/Doctors';
import Medicines from './pages/Medicines';
import Appointment from './pages/Appointment';
import Contact from './pages/Contact';

/**
 * ============================================================
 * APP COMPONENT — Main Application Layout
 * ============================================================
 * 
 * Structure:
 *   <Navbar />       ← Always visible at top
 *   <Routes>         ← Page content changes based on URL
 *   <Footer />       ← Always visible at bottom
 */
function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/medicines" element={<Medicines />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
