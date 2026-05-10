import { useState } from 'react';
import { Clock, CheckCircle2, XCircle, Check, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useDataFetch } from '../../hooks/useDataFetch';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import { AdminPageHeader } from '../../components/admin/admin-header';
import { Skeleton } from '../../components/ui/skeleton';
import { EmptyState } from '../../components/ui/empty-state';
import { cn } from '../../lib/utils';

/**
 * ============================================================
 * APPOINTMENT MANAGEMENT — Status-driven card layout
 * ============================================================
 *
 * 🎓 WHY CARD LAYOUT INSTEAD OF TABLE?
 * Appointments have more context (patient, doctor, date, status,
 * actions) than fits well in a table row. Card layout allows
 * richer information display with action buttons inline.
 *
 * 🎓 INTERVIEW: "How do you handle appointment status updates?"
 * → "Status changes go through PUT /api/admin/appointments/{id}/status.
 *    The backend validates the transition (e.g., only PENDING→CONFIRMED
 *    or CONFIRMED→COMPLETED). On success, I show a toast notification
 *    and refetch the data. The UI uses filter tabs for status-based views."
 */
const AppointmentManagement = () => {
  const { data: appointments, loading, refetch } = useDataFetch('/admin/appointments');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/admin/appointments/${id}/status`, { status: newStatus });
      toast.success(`Appointment ${newStatus.toLowerCase()}`);
      refetch();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const statusConfig = {
    PENDING:   { icon: Clock,        color: 'text-primary',     bg: 'bg-primary/10',     label: 'Pending',   variant: 'default' },
    CONFIRMED: { icon: Check,        color: 'text-chart-3',     bg: 'bg-chart-3/10',     label: 'Confirmed', variant: 'warning' },
    COMPLETED: { icon: CheckCircle2, color: 'text-secondary',   bg: 'bg-secondary/10',   label: 'Completed', variant: 'success' },
    CANCELLED: { icon: XCircle,      color: 'text-destructive', bg: 'bg-destructive/10', label: 'Cancelled', variant: 'destructive' },
  };

  const filtered = statusFilter === 'ALL' ? appointments : appointments.filter(a => a.status === statusFilter);
  const sorted = [...filtered].sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));

  if (loading) {
    return (
      <div>
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="flex gap-2 mb-6">
          {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-10 w-32 rounded-lg" />)}
        </div>
        <div className="space-y-3">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        description={`${appointments.length} total appointments`}
      />

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((status) => {
          const count = status === 'ALL' ? appointments.length : appointments.filter(a => a.status === status).length;
          return (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className="gap-1.5"
            >
              {status === 'ALL' ? 'All' : statusConfig[status]?.label}
              <span className={cn(
                'px-1.5 py-0.5 rounded-full text-xs',
                statusFilter === status ? 'bg-primary-foreground/20' : 'bg-muted'
              )}>
                {count}
              </span>
            </Button>
          );
        })}
      </div>

      {/* Appointment Cards */}
      <div className="flex flex-col gap-3">
        {sorted.map((appt) => {
          const config = statusConfig[appt.status] || statusConfig.PENDING;
          const Icon = config.icon;
          return (
            <Card key={appt.id} className="hover:shadow-sm hover:border-primary/20 transition-all">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-xl ${config.bg}`}>
                      <Icon className={`h-5 w-5 ${config.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={config.variant}>{config.label}</Badge>
                        <span className="text-xs text-muted-foreground font-mono">#{appt.id}</span>
                      </div>
                      <p className="font-medium text-foreground">{appt.patient?.name || 'Unknown'}</p>
                      <p className="text-sm text-muted-foreground">
                        <span className="text-primary font-medium">{appt.doctor?.name}</span>
                        {appt.doctor?.specialization && ` · ${appt.doctor.specialization}`}
                      </p>
                      <div className="flex gap-4 mt-1.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {appt.appointmentDate}</span>
                        <span>📱 {appt.patient?.mobile || '—'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Actions */}
                  <div className="flex items-center gap-2">
                    {appt.status === 'PENDING' && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => updateStatus(appt.id, 'CONFIRMED')} className="text-primary border-primary/30 hover:bg-primary/10">
                          Confirm
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => updateStatus(appt.id, 'CANCELLED')} className="text-destructive border-destructive/30 hover:bg-destructive/10">
                          Cancel
                        </Button>
                      </>
                    )}
                    {appt.status === 'CONFIRMED' && (
                      <Button size="sm" variant="outline" onClick={() => updateStatus(appt.id, 'COMPLETED')} className="text-secondary border-secondary/30 hover:bg-secondary/10">
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {sorted.length === 0 && (
          <Card>
            <EmptyState
              icon={Calendar}
              title="No appointments found"
              description={statusFilter !== 'ALL' ? `No ${statusFilter.toLowerCase()} appointments.` : 'Appointments will appear here.'}
            />
          </Card>
        )}
      </div>
    </div>
  );
};

export default AppointmentManagement;
