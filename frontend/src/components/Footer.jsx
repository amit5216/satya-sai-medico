import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaFacebook, FaInstagram, FaHeart } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white/80">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-heading font-bold text-lg">
                S
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-white">Satya Sai</h3>
                <p className="text-[0.65rem] text-primary-light font-semibold tracking-wider uppercase -mt-1">Medico</p>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Your trusted healthcare partner providing comprehensive medical services
              and wholesale pharmaceutical solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { path: '/', label: 'Home' },
                { path: '/services', label: 'Our Services' },
                { path: '/doctors', label: 'Doctor Schedule' },
                { path: '/medicines', label: 'Medicines' },
                { path: '/appointment', label: 'Book Appointment' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-white/60 hover:text-primary-light transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4 text-sm uppercase tracking-wider">Services</h4>
            <ul className="space-y-2">
              {['Health Checkups', 'Pregnancy Care', 'Delivery Services', 'General Consultation', 'Wholesale Medicines'].map((service) => (
                <li key={service}>
                  <span className="text-sm text-white/60">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <FaPhoneAlt className="text-primary-light text-sm mt-0.5 shrink-0" />
                <a href="tel:+917385312823" className="text-sm text-white/60 hover:text-primary-light transition-colors">
                  +91 73853 12823
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FaEnvelope className="text-primary-light text-sm mt-0.5 shrink-0" />
                <a href="mailto:info@satyasaimedico.com" className="text-sm text-white/60 hover:text-primary-light transition-colors">
                  info@satyasaimedico.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-primary-light text-sm mt-0.5 shrink-0" />
                <span className="text-sm text-white/60">
                  Satya Sai Medico, India
                </span>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-5">
              <a href="https://wa.me/917385312823" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-whatsapp/20 text-white/60 hover:text-whatsapp transition-all duration-200">
                <FaWhatsapp size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-500/20 text-white/60 hover:text-blue-400 transition-all duration-200">
                <FaFacebook size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-pink-500/20 text-white/60 hover:text-pink-400 transition-all duration-200">
                <FaInstagram size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/40">
            © {currentYear} Satya Sai Medico. All rights reserved.
          </p>
          <p className="text-xs text-white/40 flex items-center gap-1">
            Made with <FaHeart className="text-danger text-[0.6rem]" /> for better healthcare
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
