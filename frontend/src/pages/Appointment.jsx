import { useEffect, useState } from 'react';
import { Calendar, Stethoscope, CheckCircle2, ArrowRight, User, Phone, CalendarDays } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input, Label } from '../components/ui/input';
import { Skeleton } from '../components/ui/skeleton';
import api from '../services/api';

/**
 * ============================================================
 * APPOINTMENT BOOKING — Public-facing form
 * ============================================================
 *
 * 🎓 FLOW:
 * 1. User selects a doctor from dropdown
 * 2. Enters name, mobile, preferred date
 * 3. Submits → POST /api/appointments
 * 4. Success → shows confirmation card
 *
 * 🎓 INTERVIEW: "How does the appointment booking work?"
 * → "The public appointment form sends a POST to /api/appointments.
 *    No authentication needed. The backend creates a Patient record
 *    if the mobile number is new, then creates an Appointment with
 *    PENDING status. Admin can then CONFIRM or CANCEL from the dashboard."
 */
const Appointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    doctorId: '', patientName: '', patientMobile: '', appointmentDate: '',
  });

  useEffect(() => {
    api.get('/doctors')
      .then(res => setDoctors(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/appointments', {
        doctorId: Number(form.doctorId),
        patientName: form.patientName,
        patientMobile: form.patientMobile,
        appointmentDate: form.appointmentDate,
      });
      setSuccess(true);
      setForm({ doctorId: '', patientName: '', patientMobile: '', appointmentDate: '' });
    } catch (err) {
      const data = err.response?.data;
      if (typeof data === 'object' && !data.message) {
        setError(Object.values(data).join(', '));
      } else {
        setError(data?.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  // Success View
  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-4 w-full fade-in-up">
          <Card className="text-center">
            <CardContent className="p-10">
              <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-10 w-10 text-secondary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Appointment Booked!</h2>
              <p className="text-muted-foreground mt-3">
                Your appointment has been successfully submitted. Our team will confirm it shortly.
              </p>
              <Button
                onClick={() => setSuccess(false)}
                className="mt-6"
              >
                Book Another
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h1 className="text-3xl md:text-5xl font-bold">Book Appointment</h1>
          <p className="text-primary-foreground/80 mt-4 max-w-2xl mx-auto text-lg">
            Schedule a consultation with our expert doctors in just a few clicks
          </p>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16 md:py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8 md:p-10">
              {/* Form Header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <CalendarDays className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-xl text-foreground">Appointment Details</h2>
                  <p className="text-muted-foreground text-sm">Fill in the details below to book</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Doctor Select */}
                <div>
                  <Label htmlFor="doctorId">Select Doctor *</Label>
                  {loading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <select
                      id="doctorId"
                      name="doctorId"
                      value={form.doctorId}
                      onChange={handleChange}
                      required
                      className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 transition-shadow"
                    >
                      <option value="">Choose a doctor...</option>
                      {doctors.map(doc => (
                        <option key={doc.id} value={doc.id}>
                          {doc.name} — {doc.specialization}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Patient Name */}
                <div>
                  <Label htmlFor="patientName">Your Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="patientName"
                      name="patientName"
                      value={form.patientName}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Mobile */}
                <div>
                  <Label htmlFor="patientMobile">Mobile Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="patientMobile"
                      type="tel"
                      name="patientMobile"
                      value={form.patientMobile}
                      onChange={handleChange}
                      required
                      maxLength={10}
                      pattern="[0-9]{10}"
                      placeholder="10-digit mobile number"
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Date */}
                <div>
                  <Label htmlFor="appointmentDate">Preferred Date *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="appointmentDate"
                      type="date"
                      name="appointmentDate"
                      value={form.appointmentDate}
                      onChange={handleChange}
                      required
                      min={today}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg border border-destructive/20 fade-in">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-11"
                >
                  {submitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Booking...
                    </>
                  ) : (
                    <>
                      Book Appointment
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Appointment;
