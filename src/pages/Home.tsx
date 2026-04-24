import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Video, Stethoscope, Sparkles, Bell } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { doshaDescriptions } from '../data/mockData';
import { getDoctors } from '../lib/services/doctors';
import { getHospitals } from '../lib/services/hospitals';
import { getMyAppointments } from '../lib/services/appointments';
import type { DoctorWithRelations } from '../lib/database.types';
import type { Hospital } from '../lib/database.types';
import type { AppointmentWithRelations } from '../lib/database.types';

const doshaColors: Record<string, string> = {
  vata: 'from-purple-400 to-purple-600',
  pitta: 'from-orange-400 to-orange-600',
  kapha: 'from-cyan-400 to-cyan-600',
};

export default function Home() {
  const { user, isAuthenticated } = useApp();
  const [search, setSearch] = useState('');
  const [doctors, setDoctors] = useState<DoctorWithRelations[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [upcoming, setUpcoming] = useState<AppointmentWithRelations[]>([]);

  useEffect(() => {
    getDoctors().then(setDoctors).catch(() => {});
    getHospitals().then(setHospitals).catch(() => {});
  }, []);

  useEffect(() => {
    if (!user) return;
    getMyAppointments(user.id)
      .then(data => setUpcoming(data.filter(a => a.status === 'confirmed' || a.status === 'pending')))
      .catch(() => {});
  }, [user]);

  if (!isAuthenticated) return <Navigate to="/signup" replace />;

  const doshaInfo = user?.dosha && (user.dosha === 'vata' || user.dosha === 'pitta' || user.dosha === 'kapha')
    ? doshaDescriptions[user.dosha] : null;

  const filtered = search
    ? doctors.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.speciality_names?.some(s => s.toLowerCase().includes(search.toLowerCase()))
      )
    : doctors;

  const featured = filtered.slice(0, 4);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen bg-warm pb-24">
      {/* Header */}
      <div className="bg-white px-4 pt-6 pb-4 sticky top-0 z-40 border-b border-stone-100">
        <div className="max-w-lg mx-auto flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-stone-400 font-medium">{greeting} 🙏</p>
            <h1 className="font-display text-xl font-bold text-stone-800">{user?.name?.split(' ')[0]}</h1>
          </div>
          <button className="relative p-2 rounded-xl bg-stone-100 hover:bg-stone-200 transition-colors">
            <Bell className="w-5 h-5 text-stone-600" />
          </button>
        </div>
        <div className="max-w-lg mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search Vaidyas, specialities..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-stone-100 border-0 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-300 transition-all"
          />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-6">
        {/* Dosha card */}
        {doshaInfo && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-3xl p-5 bg-gradient-to-br ${doshaColors[user?.dosha as string] || 'from-saffron-400 to-earth-500'} text-white shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-xs font-medium mb-1">Your Prakriti</p>
                <h2 className="font-display text-2xl font-bold">{doshaInfo.emoji} {doshaInfo.name} Dosha</h2>
                <p className="text-white/80 text-sm mt-1">{doshaInfo.elements}</p>
              </div>
              <Link
                to="/doctors"
                className="bg-white/20 hover:bg-white/30 text-white text-xs font-medium px-3 py-2 rounded-xl transition-colors flex items-center gap-1"
              >
                Find Vaidyas <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        )}

        {/* Quick actions */}
        <div>
          <h2 className="font-semibold text-stone-800 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/doctors" className="card p-4 flex items-center gap-3 hover:border-saffron-200 hover:bg-saffron-50 transition-all group">
              <div className="w-10 h-10 bg-saffron-100 rounded-xl flex items-center justify-center group-hover:bg-saffron-200 transition-colors shrink-0">
                <Stethoscope className="w-5 h-5 text-saffron-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-800">Book Visit</p>
                <p className="text-xs text-stone-400">In-person</p>
              </div>
            </Link>
            <Link to="/consultation" className="card p-4 flex items-center gap-3 hover:border-herbal-200 hover:bg-herbal-50 transition-all group">
              <div className="w-10 h-10 bg-herbal-100 rounded-xl flex items-center justify-center group-hover:bg-herbal-200 transition-colors shrink-0">
                <Video className="w-5 h-5 text-herbal-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-800">Video Call</p>
                <p className="text-xs text-stone-400">Consult online</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Upcoming appointments */}
        {upcoming.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-stone-800">Upcoming</h2>
              <Link to="/appointments" className="text-xs text-saffron-600 font-medium flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {upcoming.slice(0, 2).map(appt => (
                <div key={appt.id} className="card p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-saffron-100 flex items-center justify-center shrink-0 text-saffron-600 font-bold">
                    {appt.doctor_name?.charAt(0) ?? '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stone-800 text-sm truncate">{appt.doctor_name || 'Doctor'}</p>
                    <p className="text-xs text-stone-500 truncate">{appt.hospital_name}</p>
                    <p className="text-xs text-saffron-600 font-medium mt-0.5">
                      {new Date(appt.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} · {appt.time}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${
                    appt.type === 'video' ? 'bg-herbal-50 text-herbal-600' : 'bg-saffron-50 text-saffron-600'
                  }`}>
                    {appt.type === 'video' ? '📹' : '🏥'} {appt.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Featured Vaidyas */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-stone-800">Top Vaidyas</h2>
            <Link to="/doctors" className="text-xs text-saffron-600 font-medium flex items-center gap-1">
              See all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {featured.map((doc, i) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/vaidya/${doc.id}`} className="card p-4 block hover:border-saffron-200 transition-all">
                  {doc.photo_url ? (
                    <img src={doc.photo_url} alt={doc.name} className="w-full aspect-square object-cover rounded-xl mb-3" />
                  ) : (
                    <div className="w-full aspect-square bg-saffron-100 rounded-xl mb-3 flex items-center justify-center text-saffron-500 text-2xl font-bold">
                      {doc.name.charAt(0)}
                    </div>
                  )}
                  <p className="font-semibold text-stone-800 text-sm leading-tight">{doc.name}</p>
                  <p className="text-xs text-stone-400 mt-0.5 truncate">{doc.speciality_names?.[0] ?? doc.title ?? ''}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-medium text-saffron-600">★ {doc.rating}</span>
                    <span className="text-xs text-stone-400">₹{doc.video_fee}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Hospitals */}
        {hospitals.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-stone-800">Top Hospitals</h2>
            </div>
            <div className="space-y-3">
              {hospitals.slice(0, 2).map(h => (
                <Link key={h.id} to={`/hospital/${h.id}`} className="card p-4 flex items-center gap-3 hover:border-saffron-200 transition-all">
                  {h.logo_url ? (
                    <img src={h.logo_url} alt={h.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-earth-100 flex items-center justify-center shrink-0 text-earth-600 font-bold">
                      {h.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stone-800 text-sm truncate">{h.name}</p>
                    <p className="text-xs text-stone-400 truncate">{h.city}, {h.state}</p>
                    <p className="text-xs text-saffron-600 font-medium mt-0.5">★ {h.rating}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-400 shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Dosha tip */}
        {doshaInfo && (
          <div className="bg-white rounded-2xl border border-earth-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-saffron-500" />
              <span className="text-sm font-semibold text-stone-800">Today's {doshaInfo.name} Tip</span>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed">{doshaInfo.recommendations[0]}</p>
          </div>
        )}
      </div>
    </div>
  );
}
