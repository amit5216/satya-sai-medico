import { useEffect, useState } from 'react';
import { HeartPulse, Baby, Stethoscope, User, FlaskConical, Building2 } from 'lucide-react';
import api from '../services/api';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/services').then(res => setServices(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const iconMap = [HeartPulse, Baby, Stethoscope, User, FlaskConical, Building2];
  const colorMap = [
    { icon: 'text-primary', bg: 'bg-primary/10' },
    { icon: 'text-chart-5', bg: 'bg-chart-5/10' },
    { icon: 'text-secondary', bg: 'bg-secondary/10' },
    { icon: 'text-chart-4', bg: 'bg-chart-4/10' },
    { icon: 'text-chart-3', bg: 'bg-chart-3/10' },
    { icon: 'text-chart-1', bg: 'bg-chart-1/10' },
  ];

  const defaultServices = [
    { id: 1, name: 'Health Checkups', description: 'Comprehensive health screening packages for individuals and families. Includes blood tests, cardiac screening, diabetes check, and full body health analysis.' },
    { id: 2, name: 'Pregnancy Care', description: 'Complete prenatal and postnatal care with regular monitoring, ultrasound scans, nutritional guidance, and expert care from our gynecology team.' },
    { id: 3, name: 'Delivery Services', description: 'Safe normal and cesarean delivery services with modern operation theaters, 24/7 nursing care, and experienced obstetricians.' },
    { id: 4, name: 'General Consultation', description: 'Expert medical consultation for all health concerns. Personalized diagnosis and treatment plans with follow-up care.' },
    { id: 5, name: 'Diagnostics & Lab', description: 'State-of-the-art diagnostic facility with advanced lab equipment for accurate blood tests, X-rays, ECG, and more.' },
    { id: 6, name: 'Pharmacy Services', description: 'In-house pharmacy stocked with essential medicines. Wholesale supply at competitive prices with genuine products.' },
  ];

  const displayServices = services.length > 0 ? services : defaultServices;

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold">Our Services</h1>
          <p className="text-primary-foreground/80 mt-4 max-w-2xl mx-auto text-lg">
            Comprehensive healthcare solutions tailored for you and your family
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-card border border-border rounded-xl p-8 animate-pulse">
                  <div className="w-14 h-14 bg-muted rounded-xl mb-6" /><div className="h-6 bg-muted rounded w-3/4 mb-3" /><div className="h-4 bg-muted rounded w-full mb-2" /><div className="h-4 bg-muted rounded w-5/6" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayServices.map((service, index) => {
                const Icon = iconMap[index % iconMap.length];
                const color = colorMap[index % colorMap.length];
                return (
                  <div key={service.id} className="bg-card border border-border rounded-2xl p-8 hover:shadow-md hover:border-primary/20 transition-all">
                    <div className={`w-14 h-14 rounded-xl ${color.bg} flex items-center justify-center mb-6`}>
                      <Icon className={`h-7 w-7 ${color.icon}`} />
                    </div>
                    <h3 className="font-semibold text-xl text-foreground mb-3">{service.name}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
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
