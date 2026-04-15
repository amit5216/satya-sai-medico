import { useEffect, useState } from 'react';
import { FaCalendarCheck, FaUserMd, FaCheckCircle } from 'react-icons/fa';
import api from '../services/api';

const Appointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    doctorId: '',
    patientName: '',
    patientMobile: '',
    appointmentDate: '',
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
        // Validation errors — show first error
        setError(Object.values(data).join(', '));
      } else {
        setError(data?.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Min date = today
  const today = new Date().toISOString().split('T')[0];

  if (success) {
    return (
      <div className="pt-20 min-h-screen bg-light flex items-center justify-center">
        <div className="bg-white rounded-2xl p-10 shadow-lg border border-gray-light/50 text-center max-w-md mx-4">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-success text-4xl" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-dark">Appointment Booked!</h2>
          <p className="text-gray mt-3">
            Your appointment has been successfully submitted. Our team will confirm it shortly.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="mt-6 bg-gradient-to-r from-primary to-secondary text-white font-semibold px-6 py-3 rounded-full hover:shadow-lg transition-all duration-200"
          >
            Book Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-dark via-primary to-secondary py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-white">Book Appointment</h1>
          <p className="text-white/70 mt-4 max-w-2xl mx-auto text-lg">
            Schedule a consultation with our expert doctors in just a few clicks
          </p>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16 md:py-24 bg-light">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-gray-light/50">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-primary text-xl">
                <FaCalendarCheck />
              </div>
              <div>
                <h2 className="font-heading font-bold text-xl text-dark">Appointment Details</h2>
                <p className="text-gray text-sm">Fill in the details below to book</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Doctor Select */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-1.5">Select Doctor *</label>
                <select
                  name="doctorId"
                  value={form.doctorId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-light bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm appearance-none"
                >
                  <option value="">Choose a doctor...</option>
                  {doctors.map(doc => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} — {doc.specialization}
                    </option>
                  ))}
                </select>
              </div>

              {/* Patient Name */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-1.5">Your Name *</label>
                <input
                  type="text"
                  name="patientName"
                  value={form.patientName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-light bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
                />
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-1.5">Mobile Number *</label>
                <input
                  type="tel"
                  name="patientMobile"
                  value={form.patientMobile}
                  onChange={handleChange}
                  required
                  maxLength={10}
                  pattern="[0-9]{10}"
                  placeholder="10-digit mobile number"
                  className="w-full px-4 py-3 rounded-xl border border-gray-light bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-1.5">Preferred Date *</label>
                <input
                  type="date"
                  name="appointmentDate"
                  value={form.appointmentDate}
                  onChange={handleChange}
                  required
                  min={today}
                  className="w-full px-4 py-3 rounded-xl border border-gray-light bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="bg-danger/10 text-danger text-sm px-4 py-3 rounded-xl border border-danger/20">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3.5 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Booking...
                  </span>
                ) : (
                  'Book Appointment'
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Appointment;
