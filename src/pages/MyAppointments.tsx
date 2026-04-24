import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, Video, MapPin, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getMyAppointments, cancelAppointment } from '../lib/services/appointments';
import type { AppointmentWithRelations, AppointmentStatus } from '../lib/database.types';

const tabs: { key: AppointmentStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'confirmed', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'pending', label: 'Pending' },
];

const statusConfig: Record<AppointmentStatus, { label: string; classes: string }> = {
  pending: { label: 'Pending', classes: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  confirmed: { label: 'Confirmed', classes: 'bg-herbal-50 text-herbal-700 border-herbal-200' },
  completed: { label: 'Completed', classes: 'bg-stone-100 text-stone-500 border-stone-200' },
  cancelled: { label: 'Cancelled', classes: 'bg-red-50 text-red-600 border-red-200' },
};

export default function MyAppointments() {
  const { user, isAuthenticated } = useApp();
  const [activeTab, setActiveTab] = useState<AppointmentStatus | 'all'>('all');
  const [appointments, setAppointments] = useState<AppointmentWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getMyAppointments(user.id)
      .then(setAppointments)
      .finally(() => setLoading(false));
  }, [user]);

  if (!isAuthenticated) return <Navigate to="/signup" replace />;

  const filtered = activeTab === 'all'
    ? appointments
    : appointments.filter(a => a.status === activeTab);

  const handleCancel = async (id: string) => {
    await cancelAppointment(id);
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
  };

  return (
    <div className="min-h-screen bg-warm pb-24">
      <div className="bg-white border-b border-stone-100 px-4 py-5 sticky top-0 z-40">
        <div className="max-w-lg mx-auto">
          <h1 className="font-display text-2xl font-bold text-stone-800 mb-4">My Appointments</h1>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex-none px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeTab === t.key
                    ? 'bg-saffron-500 text-white'
                    : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-earth-100 p-4 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-14 h-14 bg-stone-200 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-stone-200 rounded w-2/3" />
                    <div className="h-3 bg-stone-200 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <CalendarDays className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <p className="text-stone-400 font-medium">No appointments found</p>
            <Link to="/doctors" className="text-saffron-600 text-sm font-medium hover:underline mt-2 block">
              Book your first appointment
            </Link>
          </div>
        ) : (
          filtered.map((appt, i) => {
            const status = statusConfig[appt.status];
            const formattedDate = new Date(appt.date).toLocaleDateString('en-IN', {
              weekday: 'short', day: 'numeric', month: 'short',
            });

            return (
              <motion.div
                key={appt.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl border border-earth-100 overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    {appt.doctor_photo ? (
                      <img src={appt.doctor_photo} alt={appt.doctor_name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-saffron-100 flex items-center justify-center shrink-0 text-saffron-600 font-bold text-lg">
                        {appt.doctor_name?.charAt(0) ?? '?'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-stone-800 text-sm">{appt.doctor_name || 'Doctor'}</p>
                          <p className="text-xs text-stone-400 truncate">{appt.hospital_name}</p>
                        </div>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border shrink-0 ${status.classes}`}>
                          {status.label}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-3 mt-2">
                        <span className="flex items-center gap-1 text-xs text-stone-500">
                          <CalendarDays className="w-3.5 h-3.5 text-saffron-400" />
                          {formattedDate}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-stone-500">
                          {appt.type === 'video'
                            ? <Video className="w-3.5 h-3.5 text-herbal-500" />
                            : <MapPin className="w-3.5 h-3.5 text-saffron-400" />
                          }
                          {appt.time} · {appt.type === 'video' ? 'Video' : 'In-Person'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {appt.notes && (
                    <p className="text-xs text-stone-500 mt-3 bg-stone-50 rounded-xl px-3 py-2 line-clamp-2">
                      {appt.notes}
                    </p>
                  )}

                  {appt.prescription && (
                    <div className="mt-3 bg-herbal-50 border border-herbal-100 rounded-xl p-3">
                      <p className="text-xs font-semibold text-herbal-700 mb-1">Prescription</p>
                      <p className="text-xs text-herbal-600 leading-relaxed">{appt.prescription}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
                    <span className="text-sm font-bold text-stone-700">₹{appt.fee}</span>
                    <div className="flex items-center gap-2">
                      {appt.follow_up_date && (
                        <span className="text-xs text-stone-400">
                          Follow-up: {new Date(appt.follow_up_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      )}
                      {appt.meeting_link && appt.status === 'confirmed' && (
                        <a
                          href={appt.meeting_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-herbal-600 font-medium bg-herbal-50 px-2.5 py-1.5 rounded-lg hover:bg-herbal-100 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Join Call
                        </a>
                      )}
                      {appt.status === 'pending' || appt.status === 'confirmed' ? (
                        <button
                          onClick={() => handleCancel(appt.id)}
                          className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
