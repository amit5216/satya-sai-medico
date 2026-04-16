import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HeartPulse, Menu, X, Phone } from 'lucide-react';

/**
 * Public Navbar — Matches the template's clean header style.
 * Sticky with backdrop blur, minimal design.
 */
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/doctors', label: 'Doctors' },
    { path: '/medicines', label: 'Medicines' },
    { path: '/appointment', label: 'Book Appointment' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`sticky top-0 z-50 border-b transition-all duration-300 ${
      isScrolled ? 'bg-card/80 backdrop-blur-lg border-border' : 'bg-card border-border'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="p-1.5 bg-primary rounded-lg">
              <HeartPulse className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg text-foreground">Satya Sai Medico</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Link to="/admin/login" className="hidden sm:inline-flex px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sign in
            </Link>
            <a
              href="tel:+917385312823"
              className="hidden sm:inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Phone className="h-4 w-4" />
              Call Now
            </a>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-4 pb-4 pt-2 space-y-1 border-t border-border">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.path)
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/admin/login"
            className="block px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
