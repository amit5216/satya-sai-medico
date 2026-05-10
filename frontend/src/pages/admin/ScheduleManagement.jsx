import { useState, useEffect } from 'react';
import { CalendarDays, Plus, Trash2, Stethoscope } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Label } from '../../components/ui/input';
import { Dialog, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '../../components/ui/dialog';
import { AdminPageHeader } from '../../components/admin/admin-header';
import { Card, CardContent } from '../../components/ui/card';
import { EmptyState } from '../../components/ui/empty-state';
import { Skeleton } from '../../components/ui/skeleton';

/**
 * ============================================================
 * SCHEDULE MANAGEMENT — Assign doctors to days of the week
 * ============================================================
 */
const ScheduleManagement = () => {
  const [schedule, setSchedule] = useState({});
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);

  const dayOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  const dayLabel = { MONDAY: 'Monday', TUESDAY: 'Tuesday', WEDNESDAY: 'Wednesday', THURSDAY: 'Thursday', FRIDAY: 'Friday', SATURDAY: 'Saturday', SUNDAY: 'Sunday' };

  const fetchData = () => {
    setLoading(true);
    Promise.all([api.get('/schedules'), api.get('/admin/doctors')])
      .then(([schedRes, docRes]) => {
        setSchedule(schedRes.data);
        setDoctors(docRes.data);
      })
      .catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const toggleDay = (day) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctorId || selectedDays.length === 0) {
      toast.error('Select a doctor and at least one day');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/admin/schedules', {
        doctorId: Number(selectedDoctorId),
        days: selectedDays,
      });
      toast.success('Schedule saved successfully');
      setShowModal(false);
      setSelectedDoctorId('');
      setSelectedDays([]);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save schedule');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEntry = async (scheduleId) => {
    if (!window.confirm('Remove this schedule entry?')) return;
    try {
      await api.delete(`/admin/schedules/${scheduleId}`);
      toast.success('Schedule entry removed');
      fetchData();
    } catch {
      toast.error('Failed to remove schedule');
    }
  };

  // Count total entries
  const totalEntries = Object.values(schedule).flat().length;

  if (loading) {
    return (
      <div>
        <Skeleton className="h-10 w-full max-w-xs mb-6" />
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="rounded-xl border border-border bg-card p-6">
              <Skeleton className="h-6 w-24 mb-4" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-10 w-40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        description={`${totalEntries} schedule entries across ${Object.keys(schedule).filter(k => schedule[k]?.length > 0).length} days`}
        actions={
          <Button onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4" /> Assign Doctor
          </Button>
        }
      />

      {/* Day-wise schedule cards */}
      {totalEntries > 0 ? (
        <div className="space-y-4">
          {dayOrder.map(day => {
            const entries = schedule[day] || [];
            if (entries.length === 0) return null;
            return (
              <Card key={day}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="default">{dayLabel[day]}</Badge>
                    <span className="text-sm text-muted-foreground">{entries.length} doctor{entries.length > 1 ? 's' : ''}</span>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {entries.map(doc => (
                      <div key={doc.scheduleId} className="flex items-center justify-between bg-muted/50 rounded-lg px-4 py-3 group">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                            <Stethoscope className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{doc.doctorName}</p>
                            <p className="text-xs text-muted-foreground">{doc.specialization}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteEntry(doc.scheduleId)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <EmptyState
            icon={CalendarDays}
            title="No schedules yet"
            description="Assign doctors to days of the week to show availability on the public page."
            action={
              <Button onClick={() => setShowModal(true)} size="sm">
                <Plus className="h-4 w-4" /> Assign Doctor
              </Button>
            }
          />
        </Card>
      )}

      {/* Assign Doctor Dialog */}
      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <DialogHeader onClose={() => setShowModal(false)}>
          <DialogTitle>Assign Doctor to Days</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <DialogBody className="space-y-5">
            <div>
              <Label>Select Doctor *</Label>
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 appearance-none"
              >
                <option value="">Choose a doctor...</option>
                {doctors.map(doc => (
                  <option key={doc.id} value={doc.id}>{doc.name} — {doc.specialization}</option>
                ))}
              </select>
            </div>

            <div>
              <Label>Select Days *</Label>
              <p className="text-xs text-muted-foreground mb-3">Click on the days this doctor is available</p>
              <div className="flex flex-wrap gap-2">
                {dayOrder.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                      selectedDays.includes(day)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-foreground border-input hover:border-primary/50'
                    }`}
                  >
                    {dayLabel[day]}
                  </button>
                ))}
              </div>
              {selectedDays.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Selected: {selectedDays.map(d => dayLabel[d]).join(', ')}
                </p>
              )}
            </div>
          </DialogBody>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting ? 'Saving...' : 'Assign Schedule'}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
};

export default ScheduleManagement;
