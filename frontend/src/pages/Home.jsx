import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeartbeat, FaUserMd, FaCalendarCheck, FaPills, FaPhoneAlt, FaWhatsapp, FaArrowRight, FaStethoscope, FaBaby, FaCheckCircle } from 'react-icons/fa';
import api from '../services/api';

const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get('/doctors').then(res => setDoctors(res.data)).catch(() => {});
    api.get('/services').then(res => setServices(res.data)).catch(() => {});
  }, []);

  // Default services to show if none exist in DB yet
  const defaultServices = [
    { id: 1, name: 'Health Checkups', description: 'Comprehensive health screening packages for all age groups with modern diagnostic equipment.', icon: <FaHeartbeat /> },
    { id: 2, name: 'Pregnancy Care', description: 'Complete prenatal and postnatal care with experienced gynecologists and modern facilities.', icon: <FaBaby /> },
    { id: 3, name: 'Delivery Services', description: 'Safe and comfortable delivery services with 24/7 emergency support and expert staff.', icon: <FaStethoscope /> },
    { id: 4, name: 'General Consultation', description: 'Expert medical consultation for all health concerns with personalized treatment plans.', icon: <FaUserMd /> },
  ];

  const displayServices = services.length > 0
    ? services.slice(0, 4).map((s, i) => ({ ...s, icon: [<FaHeartbeat />, <FaBaby />, <FaStethoscope />, <FaUserMd />][i % 4] }))
    : defaultServices;

  return (
    <div className="overflow-hidden">
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-primary-dark via-primary to-secondary overflow-hidden">
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full animate-pulse" />
          <div className="absolute top-1/2 -left-20 w-60 h-60 bg-white/5 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute -bottom-20 right-1/3 w-40 h-40 bg-white/5 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                <FaHeartbeat className="text-accent-light" />
                Trusted Healthcare Partner
              </div>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Your Health,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-light to-accent">
                  Our Priority
                </span>
              </h1>
              <p className="text-lg text-white/70 max-w-lg mb-8 leading-relaxed">
                Welcome to Satya Sai Medico — providing comprehensive medical care,
                expert doctors, and wholesale pharmaceutical solutions for your complete wellness.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/appointment"
                  className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                >
                  <FaCalendarCheck />
                  Book Appointment
                </Link>
                <a
                  href="tel:+917385312823"
                  className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition-all duration-200"
                >
                  <FaPhoneAlt />
                  Call Us
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10">
                <div>
                  <p className="font-heading text-3xl font-bold text-white">10+</p>
                  <p className="text-sm text-white/50">Years Experience</p>
                </div>
                <div>
                  <p className="font-heading text-3xl font-bold text-white">5000+</p>
                  <p className="text-sm text-white/50">Happy Patients</p>
                </div>
                <div>
                  <p className="font-heading text-3xl font-bold text-white">20+</p>
                  <p className="text-sm text-white/50">Expert Doctors</p>
                </div>
              </div>
            </div>

            {/* Right side — illustration card */}
            <div className="hidden md:flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center shadow-xl">
                      <FaHeartbeat className="text-white text-4xl" />
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-white mb-2">24/7 Care</h3>
                    <p className="text-white/60 text-sm">Emergency services available round the clock</p>
                  </div>
                </div>
                {/* Floating cards */}
                <div className="absolute -top-4 -left-4 bg-white rounded-2xl p-3 shadow-xl animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                      <FaCheckCircle className="text-success" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-dark">Verified Doctors</p>
                      <p className="text-[0.6rem] text-gray">All specialists</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-3 shadow-xl animate-bounce" style={{ animationDuration: '4s' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FaPills className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-dark">Wholesale Medicines</p>
                      <p className="text-[0.6rem] text-gray">Best prices</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SERVICES SECTION ==================== */}
      <section className="py-16 md:py-24 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">What We Offer</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark mt-2">Our Services</h2>
            <p className="text-gray mt-3 max-w-2xl mx-auto">
              Comprehensive healthcare services designed to keep you and your family healthy and happy.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayServices.map((service) => (
              <div
                key={service.id}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-light/50 hover:border-primary/20 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-primary text-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="font-heading font-semibold text-lg text-dark mb-2">{service.name}</h3>
                <p className="text-sm text-gray leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all duration-200"
            >
              View All Services <FaArrowRight className="text-sm" />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== DOCTORS SECTION ==================== */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Team</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark mt-2">Expert Doctors</h2>
            <p className="text-gray mt-3 max-w-2xl mx-auto">
              Meet our team of experienced specialists dedicated to providing you the best care.
            </p>
          </div>

          {doctors.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.slice(0, 3).map((doctor) => (
                <div key={doctor.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-light/50">
                  <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    {doctor.imageUrl ? (
                      <img src={doctor.imageUrl} alt={doctor.name} className="w-full h-full object-cover" />
                    ) : (
                      <FaUserMd className="text-5xl text-primary/30" />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading font-semibold text-lg text-dark">{doctor.name}</h3>
                    <p className="text-primary text-sm font-medium">{doctor.specialization}</p>
                    {doctor.bio && <p className="text-gray text-sm mt-2 line-clamp-2">{doctor.bio}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {['Gynecologist', 'General Physician', 'Pediatrician'].map((spec, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-light/50">
                  <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    <FaUserMd className="text-5xl text-primary/30" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading font-semibold text-lg text-dark">Specialist Doctor</h3>
                    <p className="text-primary text-sm font-medium">{spec}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/doctors"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all duration-200"
            >
              View Doctor Schedule <FaArrowRight className="text-sm" />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== WHOLESALE MEDICINES CTA ==================== */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary-dark to-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <span className="text-accent-light font-semibold text-sm uppercase tracking-wider">Wholesale Partner</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mt-2">Wholesale Medicines</h2>
              <p className="text-white/70 mt-4 leading-relaxed">
                We are a trusted wholesale medicine supplier. Get the best prices on pharmaceutical products.
                Contact us on WhatsApp for instant price quotes.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  to="/medicines"
                  className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                >
                  <FaPills />
                  Browse Medicines
                </Link>
                <a
                  href="https://wa.me/917385312823?text=Hello%2C%20I%20am%20interested%20in%20wholesale%20medicine%20prices"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-whatsapp text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                >
                  <FaWhatsapp />
                  WhatsApp Us
                </a>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="w-80 h-64 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <FaPills className="text-white/20 text-8xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== BOOK APPOINTMENT CTA ==================== */}
      <section className="py-16 md:py-24 bg-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Don't Wait</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark mt-2">
            Book Your Appointment Today
          </h2>
          <p className="text-gray mt-4 max-w-2xl mx-auto">
            Schedule a consultation with our expert doctors. Quick, easy, and hassle-free booking.
            Just select your doctor, pick a date, and you're done!
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link
              to="/appointment"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-semibold px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              <FaCalendarCheck />
              Book Now
            </Link>
            <a
              href="tel:+917385312823"
              className="inline-flex items-center gap-2 border-2 border-primary text-primary font-semibold px-8 py-3.5 rounded-full hover:bg-primary hover:text-white transition-all duration-200"
            >
              <FaPhoneAlt />
              +91 73853 12823
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
