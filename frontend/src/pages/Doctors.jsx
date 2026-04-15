import { useEffect, useState } from 'react';
import { FaUserMd, FaCalendarDay } from 'react-icons/fa';
import api from '../services/api';

const Doctors = () => {
  const [schedule, setSchedule] = useState({});
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState('');

  const dayOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  const dayShort = { MONDAY: 'Mon', TUESDAY: 'Tue', WEDNESDAY: 'Wed', THURSDAY: 'Thu', FRIDAY: 'Fri', SATURDAY: 'Sat', SUNDAY: 'Sun' };

  useEffect(() => {
    Promise.all([
      api.get('/schedules'),
      api.get('/doctors')
    ]).then(([schedRes, docRes]) => {
      setSchedule(schedRes.data);
      setDoctors(docRes.data);
      // Set active day to today
      const today = dayOrder[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
      setActiveDay(today);
    }).catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-dark via-primary to-secondary py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-white">Doctor Schedule</h1>
          <p className="text-white/70 mt-4 max-w-2xl mx-auto text-lg">
            Find out which doctors are available on each day of the week
          </p>
        </div>
      </section>

      {/* Schedule Timetable */}
      <section className="py-16 md:py-24 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Day Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {dayOrder.map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeDay === day
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25 scale-105'
                    : 'bg-white text-gray hover:text-primary hover:bg-primary/5 border border-gray-light/50'
                }`}
              >
                <span className="hidden sm:inline">{day.charAt(0) + day.slice(1).toLowerCase()}</span>
                <span className="sm:hidden">{dayShort[day]}</span>
              </button>
            ))}
          </div>

          {/* Doctors for selected day */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-light rounded-full" />
                    <div>
                      <div className="h-5 bg-gray-light rounded w-32 mb-2" />
                      <div className="h-4 bg-gray-light rounded w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {schedule[activeDay] && schedule[activeDay].length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {schedule[activeDay].map((doc) => (
                    <div
                      key={doc.scheduleId}
                      className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-light/50 hover:border-primary/20"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                          {doc.imageUrl ? (
                            <img src={doc.imageUrl} alt={doc.doctorName} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <FaUserMd className="text-2xl text-primary" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-heading font-semibold text-dark">{doc.doctorName}</h3>
                          <p className="text-primary text-sm font-medium">{doc.specialization}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-light/50">
                  <FaCalendarDay className="text-5xl text-gray-light mx-auto mb-4" />
                  <h3 className="font-heading font-semibold text-dark text-lg">No Doctors Scheduled</h3>
                  <p className="text-gray text-sm mt-2">No doctors are available on {activeDay.charAt(0) + activeDay.slice(1).toLowerCase()}</p>
                </div>
              )}
            </>
          )}

          {/* All Doctors List */}
          {doctors.length > 0 && (
            <div className="mt-16">
              <h2 className="font-heading text-2xl font-bold text-dark mb-8 text-center">All Our Doctors</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {doctors.map((doctor) => (
                  <div key={doctor.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-light/50 hover:-translate-y-1">
                    <div className="h-40 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      {doctor.imageUrl ? (
                        <img src={doctor.imageUrl} alt={doctor.name} className="w-full h-full object-cover" />
                      ) : (
                        <FaUserMd className="text-4xl text-primary/30" />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-heading font-semibold text-dark">{doctor.name}</h3>
                      <p className="text-primary text-sm font-medium">{doctor.specialization}</p>
                      {doctor.phone && <p className="text-gray text-xs mt-1">📞 {doctor.phone}</p>}
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
