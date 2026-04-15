import { useEffect, useState } from 'react';
import { FaHeartbeat, FaBaby, FaStethoscope, FaUserMd, FaNotesMedical, FaHospital } from 'react-icons/fa';
import api from '../services/api';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/services')
      .then(res => setServices(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const iconMap = [FaHeartbeat, FaBaby, FaStethoscope, FaUserMd, FaNotesMedical, FaHospital];
  const colorMap = [
    'from-primary/10 to-secondary/10 text-primary',
    'from-pink-100 to-rose-100 text-rose-500',
    'from-emerald-100 to-teal-100 text-emerald-600',
    'from-violet-100 to-purple-100 text-violet-600',
    'from-amber-100 to-orange-100 text-amber-600',
    'from-cyan-100 to-sky-100 text-cyan-600',
  ];

  const defaultServices = [
    { id: 1, name: 'Health Checkups', description: 'Comprehensive health screening packages for individuals and families. Includes blood tests, cardiac screening, diabetes check, and full body health analysis with detailed reports from experienced physicians.' },
    { id: 2, name: 'Pregnancy Care', description: 'Complete prenatal and postnatal care with regular monitoring, ultrasound scans, nutritional guidance, and expert care from our gynecology team. We ensure safe and comfortable motherhood experience.' },
    { id: 3, name: 'Delivery Services', description: 'Safe normal and cesarean delivery services with modern operation theaters, 24/7 nursing care, neonatal ICU support, and experienced obstetricians for stress-free delivery experience.' },
    { id: 4, name: 'General Consultation', description: 'Expert medical consultation for all health concerns. Our doctors provide personalized diagnosis and treatment plans with follow-up care for chronic conditions and preventive healthcare.' },
    { id: 5, name: 'Diagnostics & Lab', description: 'State-of-the-art diagnostic facility with advanced lab equipment for accurate blood tests, urine analysis, X-rays, ECG, and other diagnostic procedures with quick results.' },
    { id: 6, name: 'Pharmacy Services', description: 'In-house pharmacy stocked with all essential medicines. We also provide wholesale medicine supply at competitive prices. Genuine medicines with proper storage and handling.' },
  ];

  const displayServices = services.length > 0 ? services : defaultServices;

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-dark via-primary to-secondary py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-white">Our Services</h1>
          <p className="text-white/70 mt-4 max-w-2xl mx-auto text-lg">
            Comprehensive healthcare solutions tailored for you and your family
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-white rounded-2xl p-8 animate-pulse">
                  <div className="w-16 h-16 bg-gray-light rounded-2xl mb-6" />
                  <div className="h-6 bg-gray-light rounded w-3/4 mb-3" />
                  <div className="h-4 bg-gray-light rounded w-full mb-2" />
                  <div className="h-4 bg-gray-light rounded w-5/6" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayServices.map((service, index) => {
                const Icon = iconMap[index % iconMap.length];
                const color = colorMap[index % colorMap.length];
                return (
                  <div
                    key={service.id}
                    className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-light/50 hover:border-primary/20 hover:-translate-y-1"
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon />
                    </div>
                    <h3 className="font-heading font-semibold text-xl text-dark mb-3">{service.name}</h3>
                    <p className="text-gray text-sm leading-relaxed">{service.description}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Services;
