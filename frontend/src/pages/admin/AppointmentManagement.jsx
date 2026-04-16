import { useEffect, useState } from 'react';
import { Clock, CheckCircle2, XCircle, Check, ArrowUpRight } from 'lucide-react';
import api from '../../services/api';

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => { fetchAppointments(); }, []);

  const fetchAppointments = async () => {
    try { const res = await api.get('/admin/appointments'); setAppointments(res.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, newStatus) => {
    try { await api.put(`/admin/appointments/${id}/status`, { status: newStatus }); fetchAppointments(); }
    catch (err) { alert('Failed to update status'); }
  };

  const statusConfig = {
    PENDING: { icon: Clock, color: 'text-primary', bg: 'bg-primary/10', label: 'Pending' },
    CONFIRMED: { icon: Check, color: 'text-chart-3', bg: 'bg-chart-3/10', label: 'Confirmed' },
    COMPLETED: { icon: CheckCircle2, color: 'text-secondary', bg: 'bg-secondary/10', label: 'Completed' },
    CANCELLED: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Cancelled' },
  };

  const filtered = statusFilter === 'ALL' ? appointments : appointments.filter(a => a.status === statusFilter);
  const sorted = [...filtered].sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));

  if (loading) return <div className="flex justify-center h-64 items-center"><div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">{appointments.length} total appointments</p>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((status) => {
          const count = status === 'ALL' ? appointments.length : appointments.filter(a => a.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                statusFilter === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-foreground hover:bg-muted'
              }`}
            >
              {status === 'ALL' ? 'All' : statusConfig[status]?.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Appointment List */}
      <div className="flex flex-col gap-3">
        {sorted.map((appt) => {
          const config = statusConfig[appt.status] || statusConfig.PENDING;
          const Icon = config.icon;
          return (
            <div key={appt.id} className="bg-card border border-border rounded-xl p-5 hover:shadow-sm hover:border-primary/20 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${config.bg}`}>
                    <Icon className={`h-5 w-5 ${config.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                        {config.label}
                      </span>
                      <span className="text-xs text-muted-foreground">#{appt.id}</span>
                    </div>
                    <p className="font-medium text-foreground">{appt.patient?.name || 'Unknown'}</p>
                    <p className="text-sm text-muted-foreground">
                      <span className="text-primary font-medium">{appt.doctor?.name}</span>
                      {appt.doctor?.specialization && ` · ${appt.doctor.specialization}`}
                    </p>
                    <div className="flex gap-4 mt-1.5 text-xs text-muted-foreground">
                      <span>📅 {appt.appointmentDate}</span>
                      <span>📱 {appt.patient?.mobile || '—'}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {appt.status === 'PENDING' && (
                    <>
                      <button onClick={() => updateStatus(appt.id, 'CONFIRMED')} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors">Confirm</button>
                      <button onClick={() => updateStatus(appt.id, 'CANCELLED')} className="px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive/20 transition-colors">Cancel</button>
                    </>
                  )}
                  {appt.status === 'CONFIRMED' && (
                    <button onClick={() => updateStatus(appt.id, 'COMPLETED')} className="px-3 py-1.5 rounded-lg bg-secondary/10 text-secondary text-xs font-medium hover:bg-secondary/20 transition-colors">Complete</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {sorted.length === 0 && (
          <div className="text-center py-12 text-muted-foreground bg-card border border-border rounded-xl">No appointments found.</div>
        )}
      </div>
    </div>
  );
};

export default AppointmentManagement;
