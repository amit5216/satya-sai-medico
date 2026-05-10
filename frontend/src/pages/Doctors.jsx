import { useEffect, useState } from 'react';
import { Stethoscope, Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { EmptyState } from '../components/ui/empty-state';
import { cn } from '../lib/utils';
import api from '../services/api';

/**
 * ============================================================
 * DOCTORS PAGE — Schedule + doctor directory
 * ============================================================
 */
const Doctors = () => {
  const [schedule, setSchedule] = useState({});
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState('');

  const dayOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  const dayShort = { MONDAY: 'Mon', TUESDAY: 'Tue', WEDNESDAY: 'Wed', THURSDAY: 'Thu', FRIDAY: 'Fri', SATURDAY: 'Sat', SUNDAY: 'Sun' };

  useEffect(() => {
    Promise.all([api.get('/schedules'), api.get('/doctors')])
      .then(([schedRes, docRes]) => {
        setSchedule(schedRes.data);
        setDoctors(docRes.data);
        const today = dayOrder[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
        setActiveDay(today);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h1 className="text-3xl md:text-5xl font-bold">Doctor Schedule</h1>
          <p className="text-primary-foreground/80 mt-4 max-w-2xl mx-auto text-lg">
            Find out which doctors are available on each day of the week
          </p>
        </div>
      </section>

      {/* Schedule */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Day Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {dayOrder.map((day) => (
              <Button
                key={day}
                variant={activeDay === day ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveDay(day)}
              >
                <span className="hidden sm:inline">{day.charAt(0) + day.slice(1).toLowerCase()}</span>
                <span className="sm:hidden">{dayShort[day]}</span>
              </Button>
            ))}
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Skeleton className="w-14 h-14 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {schedule[activeDay] && schedule[activeDay].length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {schedule[activeDay].map((doc) => (
                    <Card key={doc.scheduleId} className="hover:shadow-md hover:border-primary/20 transition-all group">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform overflow-hidden">
                            {doc.imageUrl ? (
                              <img src={doc.imageUrl} alt={doc.doctorName} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              <Stethoscope className="h-6 w-6 text-primary" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{doc.doctorName}</h3>
                            <p className="text-primary text-sm font-medium">{doc.specialization}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <EmptyState
                    icon={CalendarIcon}
                    title="No Doctors Scheduled"
                    description={`No doctors available on ${activeDay.charAt(0) + activeDay.slice(1).toLowerCase()}`}
                  />
                </Card>
              )}
            </>
          )}

          {/* All Doctors */}
          {doctors.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">All Our Doctors</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {doctors.map((doctor) => (
                  <Card key={doctor.id} className="overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all group">
                    <div className="h-40 bg-muted flex items-center justify-center overflow-hidden">
                      {doctor.imageUrl ? (
                        <img src={doctor.imageUrl} alt={doctor.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <Stethoscope className="h-10 w-10 text-muted-foreground/30" />
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-foreground">{doctor.name}</h3>
                      <p className="text-primary text-sm font-medium">{doctor.specialization}</p>
                      {doctor.phone && <p className="text-muted-foreground text-xs mt-1">📞 {doctor.phone}</p>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Doctors;
