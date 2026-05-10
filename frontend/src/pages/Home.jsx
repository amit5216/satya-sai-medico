import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HeartPulse, Calendar, Stethoscope, Pill, Shield,
  ArrowRight, Star, CheckCircle2, Clock, Users
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import api from '../services/api';

/**
 * ============================================================
 * HOME PAGE — Public-facing landing page
 * ============================================================
 *
 * 🎓 SECTIONS:
 * 1. Hero — Headline + CTA with gradient background
 * 2. Stats — Trust-building social proof bar
 * 3. Features — 4-card grid of key capabilities
 * 4. Doctors — Preview of top 3 doctors from API
 * 5. CTA — Final call to action with gradient card
 */

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
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(37,99,235,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(37,99,235,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          <div className="absolute top-20 -left-32 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
          <div className="absolute bottom-10 -right-32 w-[500px] h-[500px] bg-secondary/6 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 relative">
          <div className="text-center max-w-3xl mx-auto fade-in-up">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
              <Star className="h-4 w-4 fill-current mr-1" />
              Trusted by 10,000+ patients
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Healthcare Management Made{' '}
              <span className="text-gradient">Simple</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8">
              Book appointments, find specialist doctors, and manage your healthcare
              journey all in one place. Quality care is just a click away.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/appointment">
                <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-shadow">
                  Book an Appointment
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/doctors">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View Doctors
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section className="bg-primary text-primary-foreground py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.05)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.05)_50%,rgba(255,255,255,0.05)_75%,transparent_75%)] bg-[size:20px_20px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
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
              <Card
                key={index}
                className="hover:shadow-lg hover:border-primary/20 transition-all group cursor-default"
              >
                <CardContent className="p-6">
                  <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4 group-hover:scale-110 group-hover:bg-primary/15 transition-all">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
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
                <Card key={doctor.id} className="overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all group">
                  <div className="h-48 bg-muted flex items-center justify-center overflow-hidden">
                    {doctor.imageUrl ? (
                      <img src={`http://localhost:8080${doctor.imageUrl}`} alt={doctor.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <Stethoscope className="h-12 w-12 text-muted-foreground/30" />
                    )}
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-foreground">{doctor.name}</h3>
                    <p className="text-primary text-sm font-medium">{doctor.specialization}</p>
                    {doctor.bio && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{doctor.bio}</p>}
                  </CardContent>
                </Card>
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
          <div className="bg-primary rounded-3xl p-8 sm:p-12 text-center text-primary-foreground relative overflow-hidden">
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.08),transparent_50%)]" />
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Ready to take control of your health?
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                Join thousands of patients who trust Satya Sai Medico for their healthcare needs.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/appointment">
                  <Button size="lg" variant="secondary" className="shadow-lg">
                    Book an Appointment
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
                  <CheckCircle2 className="h-4 w-4" />
                  No registration required
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
