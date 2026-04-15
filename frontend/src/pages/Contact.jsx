import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaClock } from 'react-icons/fa';

const Contact = () => {
  return (
    <div className="pt-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-dark via-primary to-secondary py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-white">Contact Us</h1>
          <p className="text-white/70 mt-4 max-w-2xl mx-auto text-lg">
            We're here to help. Reach out to us through any of the channels below.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Cards */}
            <div className="space-y-4">
              {/* Phone */}
              <a
                href="tel:+917385312823"
                className="flex items-center gap-5 bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-light/50 hover:border-primary/20 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-primary text-xl shrink-0 group-hover:scale-110 transition-transform">
                  <FaPhoneAlt />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-dark">Phone</h3>
                  <p className="text-primary font-medium">+91 73853 12823</p>
                  <p className="text-gray text-sm">Available 24/7 for emergencies</p>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/917385312823?text=Hello%2C%20I%20need%20help%20with%20a%20medical%20query"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-5 bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-light/50 hover:border-whatsapp/20 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-whatsapp/10 flex items-center justify-center text-whatsapp text-xl shrink-0 group-hover:scale-110 transition-transform">
                  <FaWhatsapp />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-dark">WhatsApp</h3>
                  <p className="text-whatsapp font-medium">+91 73853 12823</p>
                  <p className="text-gray text-sm">Quick responses during business hours</p>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:info@satyasaimedico.com"
                className="flex items-center gap-5 bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-light/50 hover:border-primary/20 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center text-violet-600 text-xl shrink-0 group-hover:scale-110 transition-transform">
                  <FaEnvelope />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-dark">Email</h3>
                  <p className="text-violet-600 font-medium">info@satyasaimedico.com</p>
                  <p className="text-gray text-sm">We'll respond within 24 hours</p>
                </div>
              </a>

              {/* Address */}
              <div className="flex items-center gap-5 bg-white rounded-2xl p-6 shadow-sm border border-gray-light/50">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center text-rose-500 text-xl shrink-0">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-dark">Address</h3>
                  <p className="text-gray text-sm">Satya Sai Medico, India</p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-center gap-5 bg-white rounded-2xl p-6 shadow-sm border border-gray-light/50">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-amber-600 text-xl shrink-0">
                  <FaClock />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-dark">Working Hours</h3>
                  <p className="text-gray text-sm">Mon - Sat: 9:00 AM - 9:00 PM</p>
                  <p className="text-gray text-sm">Sunday: Emergency Only</p>
                </div>
              </div>
            </div>

            {/* Map / Info Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-light/50 flex flex-col justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-6">
                  <FaMapMarkerAlt className="text-primary text-3xl" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-dark mb-3">Visit Us</h2>
                <p className="text-gray max-w-sm mx-auto mb-6">
                  Come visit Satya Sai Medico for personalized medical consultation and wholesale medicine purchases.
                </p>
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-6">
                  <h3 className="font-heading font-semibold text-dark mb-3">Why Choose Us?</h3>
                  <ul className="text-left text-sm text-gray space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-success mt-0.5">✓</span>
                      Experienced specialist doctors
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-success mt-0.5">✓</span>
                      Modern diagnostic facilities
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-success mt-0.5">✓</span>
                      Wholesale medicine at best prices
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-success mt-0.5">✓</span>
                      24/7 emergency services
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-success mt-0.5">✓</span>
                      Compassionate patient care
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
