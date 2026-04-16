import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HeartPulse, Calendar, Stethoscope, Pill, Shield,
  ArrowRight, Star, CheckCircle2, Clock, Users
} from 'lucide-react';
import api from '../services/api';

const features = [
  { icon: Calendar, title: 'Easy Appointments', description: 'Book appointments with top doctors in just a few clicks' },
  { icon: Stethoscope, title: 'Expert Doctors', description: 'Access to qualified specialists across multiple departments' },
  { icon: Pill, title: 'Medicine Catalog', description: 'Browse and inquire about medicines from our extensive catalog' },
  { icon: Shield, title: 'Secure & Private', description: 'Your health data is protected with enterprise-grade security' },
];

const stats = [
  { value: '50+', label: 'Expert Doctors' },
  { value: '10k+', label: 'Happy Patients' },
  { value: '24/7', label: 'Support' },
  { value: '500+', label: 'Medicines' },
];

const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get('/doctors').then(res => setDoctors(res.data)).catch(() => {});
    api.get('/services').then(res => setServices(res.data)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(37,99,235,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(37,99,235,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
              <Star className="h-4 w-4 fill-current" />
              Trusted by 10,000+ patients
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Healthcare Management Made{' '}
              <span className="text-primary">Simple</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8">
              Book appointments, find specialist doctors, and manage your healthcare
              journey all in one place. Quality care is just a click away.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/appointment" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Book an Appointment
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/doctors" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-border text-foreground px-6 py-3 rounded-lg font-medium hover:bg-muted transition-colors">
                View Doctors
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold">{stat.value}</p>
                <p className="text-primary-foreground/80 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything you need for better healthcare
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools you need to manage your health effectively.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-card border border-border rounded-2xl hover:shadow-md hover:border-primary/20 transition-all"
              >
                <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Doctors Preview Section ── */}
      {doctors.length > 0 && (
        <section className="py-20 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Our Expert Doctors</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Meet our team of experienced specialists dedicated to providing you the best care.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.slice(0, 3).map((doctor) => (
                <div key={doctor.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md hover:border-primary/20 transition-all">
                  <div className="h-48 bg-muted flex items-center justify-center">
                    {doctor.imageUrl ? (
                      <img src={doctor.imageUrl} alt={doctor.name} className="w-full h-full object-cover" />
                    ) : (
                      <Stethoscope className="h-12 w-12 text-muted-foreground/30" />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-foreground">{doctor.name}</h3>
                    <p className="text-primary text-sm font-medium">{doctor.specialization}</p>
                    {doctor.bio && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{doctor.bio}</p>}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/doctors" className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all">
                View All Doctors <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA Section ── */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-3xl p-8 sm:p-12 text-center text-primary-foreground">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Ready to take control of your health?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Join thousands of patients who trust Satya Sai Medico for their healthcare needs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/appointment" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/90 transition-colors">
                Book an Appointment
                <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
                <CheckCircle2 className="h-4 w-4" />
                No registration required
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
