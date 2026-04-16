import { useEffect, useState } from 'react';
import { Stethoscope, Calendar as CalendarIcon } from 'lucide-react';
import api from '../services/api';

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
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeDay === day
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-foreground hover:bg-muted'
                }`}
              >
                <span className="hidden sm:inline">{day.charAt(0) + day.slice(1).toLowerCase()}</span>
                <span className="sm:hidden">{dayShort[day]}</span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="bg-card border border-border rounded-xl p-6 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-muted rounded-full" />
                    <div><div className="h-5 bg-muted rounded w-32 mb-2" /><div className="h-4 bg-muted rounded w-24" /></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {schedule[activeDay] && schedule[activeDay].length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {schedule[activeDay].map((doc) => (
                    <div key={doc.scheduleId} className="bg-card border border-border rounded-xl p-6 hover:shadow-md hover:border-primary/20 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
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
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-card border border-border rounded-xl">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground text-lg">No Doctors Scheduled</h3>
                  <p className="text-muted-foreground text-sm mt-2">No doctors available on {activeDay.charAt(0) + activeDay.slice(1).toLowerCase()}</p>
                </div>
              )}
            </>
          )}

          {/* All Doctors */}
          {doctors.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">All Our Doctors</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {doctors.map((doctor) => (
                  <div key={doctor.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md hover:border-primary/20 transition-all">
                    <div className="h-40 bg-muted flex items-center justify-center">
                      {doctor.imageUrl ? (
                        <img src={doctor.imageUrl} alt={doctor.name} className="w-full h-full object-cover" />
                      ) : (
                        <Stethoscope className="h-10 w-10 text-muted-foreground/30" />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground">{doctor.name}</h3>
                      <p className="text-primary text-sm font-medium">{doctor.specialization}</p>
                      {doctor.phone && <p className="text-muted-foreground text-xs mt-1">📞 {doctor.phone}</p>}
                    </div>
                  </div>
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
