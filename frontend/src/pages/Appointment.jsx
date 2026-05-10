import { useEffect, useState } from 'react';
import { Calendar, CheckCircle2, ArrowRight, Shield, RefreshCw } from 'lucide-react';
import api from '../services/api';

/**
 * Appointment Booking with OTP Verification Flow:
 *
 * Step 1: Fill form (name, mobile, doctor, date)
 * Step 2: OTP sent to mobile → patient enters 6-digit OTP
 * Step 3: OTP verified → appointment booked → success screen
 */
const Appointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState('form'); // 'form' | 'otp' | 'success'
  const [error, setError] = useState('');
  const [otpSending, setOtpSending] = useState(false);
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [devOtp, setDevOtp] = useState('');
  const [form, setForm] = useState({
    doctorId: '', patientName: '', patientMobile: '', appointmentDate: ''
  });

  useEffect(() => {
    api.get('/doctors').then(res => setDoctors(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.doctorId || !form.patientName || !form.patientMobile || !form.appointmentDate) {
      setError('All fields are required');
      return;
    }

    setOtpSending(true);
    try {
      const res = await api.post('/otp/send', { mobile: form.patientMobile });
      setDevOtp(res.data.devOtp || '');  // DEV: capture OTP from response
      setStep('otp');
      setCountdown(60); // 60 second cooldown
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP. Please try again.');
    } finally {
      setOtpSending(false);
    }
  };

  // Step 2: Verify OTP & Book
  const handleVerifyAndBook = async (e) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setSubmitting(true);
    try {
      // Verify OTP first
      const verifyRes = await api.post('/otp/verify', {
        mobile: form.patientMobile,
        otp: otp
      });

      if (!verifyRes.data.verified) {
        setError(verifyRes.data.message || 'Invalid OTP');
        setSubmitting(false);
        return;
      }

      // OTP verified — now book appointment
      await api.post('/appointments', {
        doctorId: Number(form.doctorId),
        patientName: form.patientName,
        patientMobile: form.patientMobile,
        appointmentDate: form.appointmentDate,
      });

      setStep('success');
      setForm({ doctorId: '', patientName: '', patientMobile: '', appointmentDate: '' });
      setOtp('');
    } catch (err) {
      const data = err.response?.data;
      if (typeof data === 'object' && !data.message) setError(Object.values(data).join(', '));
      else setError(data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setOtpSending(true);
    setError('');
    try {
      await api.post('/otp/send', { mobile: form.patientMobile });
      setCountdown(60);
    } catch (err) {
      setError('Failed to resend OTP');
    } finally {
      setOtpSending(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  // ── Success Screen ──
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-card border border-border rounded-2xl p-10 text-center max-w-md mx-4">
          <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-secondary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Appointment Booked!</h2>
          <p className="text-muted-foreground mt-3">
            Your appointment has been successfully submitted. Our team will confirm it shortly.
          </p>
          <button onClick={() => { setStep('form'); }}
            className="mt-6 bg-primary text-primary-foreground font-medium px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
            Book Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold">Book Appointment</h1>
          <p className="text-primary-foreground/80 mt-4 max-w-2xl mx-auto text-lg">
            Schedule a consultation with our expert doctors in just a few clicks
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Step Progress */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className={`flex items-center gap-2 text-sm font-medium ${step === 'form' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step === 'form' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>1</div>
              Details
            </div>
            <div className="w-12 h-px bg-border" />
            <div className={`flex items-center gap-2 text-sm font-medium ${step === 'otp' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step === 'otp' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>2</div>
              Verify
            </div>
            <div className="w-12 h-px bg-border" />
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">3</div>
              Done
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 md:p-10">

            {/* ── Step 1: Appointment Form ── */}
            {step === 'form' && (
              <>
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-xl text-foreground">Appointment Details</h2>
                    <p className="text-muted-foreground text-sm">Fill in the details to book your appointment</p>
                  </div>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Select Doctor *</label>
                    <select name="doctorId" value={form.doctorId} onChange={handleChange} required
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 appearance-none">
                      <option value="">Choose a doctor...</option>
                      {doctors.map(doc => <option key={doc.id} value={doc.id}>{doc.name} — {doc.specialization}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Your Name *</label>
                    <input type="text" name="patientName" value={form.patientName} onChange={handleChange} required placeholder="Enter your full name"
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/50" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Mobile Number *</label>
                    <input type="tel" name="patientMobile" value={form.patientMobile} onChange={handleChange} required maxLength={10} pattern="[0-9]{10}" placeholder="10-digit mobile number"
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/50" />
                    <p className="text-xs text-muted-foreground mt-1">An OTP will be sent to this number for verification</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Preferred Date *</label>
                    <input type="date" name="appointmentDate" value={form.appointmentDate} onChange={handleChange} required min={today}
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/50" />
                  </div>

                  {error && (
                    <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg border border-destructive/20">
                      {error}
                    </div>
                  )}

                  <button type="submit" disabled={otpSending}
                    className="w-full bg-primary text-primary-foreground font-medium py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {otpSending ? (
                      <><div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> Sending OTP...</>
                    ) : (
                      <>Verify & Continue <ArrowRight className="h-4 w-4" /></>
                    )}
                  </button>
                </form>
              </>
            )}

            {/* ── Step 2: OTP Verification ── */}
            {step === 'otp' && (
              <>
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-xl text-foreground">Verify Mobile Number</h2>
                    <p className="text-muted-foreground text-sm">
                      Enter the 6-digit OTP sent to <span className="font-medium text-foreground">****{form.patientMobile.slice(-4)}</span>
                    </p>
                  </div>
                </div>

                {devOtp && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3 rounded-lg mb-4">
                    <span className="font-semibold">🔧 Dev Mode:</span> Your OTP is <span className="font-mono font-bold text-lg">{devOtp}</span>
                    <span className="block text-xs mt-1 text-amber-600">(SMS disabled — remove devOtp in production)</span>
                  </div>
                )}

                <form onSubmit={handleVerifyAndBook} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Enter OTP</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }}
                      placeholder="6-digit OTP"
                      maxLength={6}
                      autoFocus
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-center text-2xl tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-ring/50"
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <button type="button" onClick={() => { setStep('form'); setOtp(''); setError(''); }}
                      className="text-muted-foreground hover:text-foreground transition-colors">
                      ← Change number
                    </button>
                    <button type="button" onClick={handleResendOtp} disabled={countdown > 0 || otpSending}
                      className="flex items-center gap-1 text-primary hover:text-primary/80 disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors">
                      <RefreshCw className="h-3 w-3" />
                      {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                    </button>
                  </div>

                  {error && (
                    <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg border border-destructive/20">
                      {error}
                    </div>
                  )}

                  <button type="submit" disabled={submitting || otp.length !== 6}
                    className="w-full bg-primary text-primary-foreground font-medium py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {submitting ? (
                      <><div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> Verifying & Booking...</>
                    ) : (
                      <>Verify & Book Appointment <CheckCircle2 className="h-4 w-4" /></>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Appointment;
