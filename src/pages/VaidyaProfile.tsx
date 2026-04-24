import { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, MapPin, Clock, Languages, GraduationCap, IndianRupee, ChevronRight } from 'lucide-react';
import { getDoctorById } from '../lib/services/doctors';
import type { DoctorWithRelations } from '../lib/database.types';
import { useApp } from '../context/AppContext';

const doshaColors: Record<string, string> = {
  vata: 'bg-purple-100 text-purple-700',
  pitta: 'bg-orange-100 text-orange-700',
  kapha: 'bg-cyan-100 text-cyan-700',
};

export default function VaidyaProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useApp();
  const [doctor, setDoctor] = useState<DoctorWithRelations | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getDoctorById(id).then(setDoctor).finally(() => setLoading(false));
  }, [id]);

  if (!isAuthenticated) return <Navigate to="/signup" replace />;

  if (loading) {
    return (
      <div className="min-h-screen bg-warm flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-saffron-200 border-t-saffron-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!doctor) return <div className="p-8 text-center text-stone-400">Vaidya not found.</div>;

  return (
    <div className="min-h-screen bg-warm pb-24">
      {/* Hero */}
      <div className="relative bg-gradient-to-b from-stone-800 to-stone-900 pt-14 pb-8 px-4">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="max-w-lg mx-auto flex gap-4 items-end">
          {doctor.photo_url ? (
            <img src={doctor.photo_url} alt={doctor.name} className="w-24 h-24 rounded-2xl object-cover border-2 border-white/20 shadow-xl" />
          ) : (
            <div className="w-24 h-24 rounded-2xl border-2 border-white/20 shadow-xl bg-saffron-500 flex items-center justify-center text-white text-3xl font-bold">
              {doctor.name.charAt(0)}
            </div>
          )}
          <div className="flex-1 pb-1">
            <h1 className="font-display text-2xl font-bold text-white">{doctor.name}</h1>
            <p className="text-stone-300 text-sm mt-0.5">{doctor.title}</p>
            <div className="flex items-center gap-1 mt-1.5">
              <Star className="w-3.5 h-3.5 text-saffron-400 fill-saffron-400" />
              <span className="text-sm font-semibold text-white">{doctor.rating}</span>
              <span className="text-xs text-stone-400">({doctor.review_count})</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-3 space-y-4">
        {/* Quick stats */}
        <div className="bg-white rounded-2xl shadow-sm border border-earth-100 p-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="font-bold text-xl text-stone-800">{doctor.experience}</p>
            <p className="text-xs text-stone-400 mt-0.5">Years exp.</p>
          </div>
          <div className="text-center border-x border-stone-100">
            <p className="font-bold text-xl text-stone-800">{doctor.review_count}</p>
            <p className="text-xs text-stone-400 mt-0.5">Reviews</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-xl text-stone-800">₹{doctor.video_fee}</p>
            <p className="text-xs text-stone-400 mt-0.5">Video fee</p>
          </div>
        </div>

        {/* Hospital */}
        {doctor.hospital_name && (
          <div className="bg-white rounded-2xl border border-earth-100 p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-saffron-500" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-stone-800 text-sm">{doctor.hospital_name}</p>
              <p className="text-xs text-stone-400">Affiliated hospital</p>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </div>
        )}

        {/* About */}
        {doctor.bio && (
          <div className="bg-white rounded-2xl border border-earth-100 p-5">
            <h2 className="font-semibold text-stone-800 mb-2">About</h2>
            <p className="text-sm text-stone-600 leading-relaxed">{doctor.bio}</p>
          </div>
        )}

        {/* Specialties */}
        {(doctor.speciality_names?.length ?? 0) > 0 && (
          <div className="bg-white rounded-2xl border border-earth-100 p-5">
            <h2 className="font-semibold text-stone-800 mb-3">Specialties</h2>
            <div className="flex flex-wrap gap-2">
              {doctor.speciality_names!.map(s => (
                <span key={s} className="text-sm bg-saffron-50 text-saffron-700 border border-saffron-100 px-3 py-1 rounded-full">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Dosha expertise */}
        {doctor.dosha_expertise.length > 0 && (
          <div className="bg-white rounded-2xl border border-earth-100 p-5">
            <h2 className="font-semibold text-stone-800 mb-3">Dosha Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {doctor.dosha_expertise.map(d => (
                <span key={d} className={`text-sm px-3 py-1.5 rounded-full capitalize font-medium ${doshaColors[d] ?? 'bg-stone-100 text-stone-600'}`}>
                  {d}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {doctor.education.length > 0 && (
          <div className="bg-white rounded-2xl border border-earth-100 p-5">
            <h2 className="font-semibold text-stone-800 mb-3 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-saffron-500" />
              Education
            </h2>
            <ul className="space-y-2">
              {doctor.education.map(e => (
                <li key={e} className="text-sm text-stone-600 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-saffron-400 mt-1.5 shrink-0" />
                  {e}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Languages */}
        {doctor.languages.length > 0 && (
          <div className="bg-white rounded-2xl border border-earth-100 p-5">
            <h2 className="font-semibold text-stone-800 mb-3 flex items-center gap-2">
              <Languages className="w-5 h-5 text-saffron-500" />
              Languages
            </h2>
            <div className="flex flex-wrap gap-2">
              {doctor.languages.map(l => (
                <span key={l} className="text-sm bg-stone-100 text-stone-600 px-3 py-1 rounded-full">{l}</span>
              ))}
            </div>
          </div>
        )}

        {/* Availability */}
        <div className="bg-white rounded-2xl border border-earth-100 p-5">
          <h2 className="font-semibold text-stone-800 mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-saffron-500" />
            Available Days
          </h2>
          <div className="flex flex-wrap gap-2">
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day => (
              <span key={day} className={`text-sm px-3 py-1.5 rounded-full font-medium ${
                doctor.available_days.includes(day)
                  ? 'bg-herbal-100 text-herbal-700'
                  : 'bg-stone-100 text-stone-400'
              }`}>
                {day}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <motion.div
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        className="fixed bottom-16 left-0 right-0 px-4 pb-2 z-40"
      >
        <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-2xl border border-earth-100 p-4 flex gap-3">
          <div className="flex-1">
            <p className="text-xs text-stone-400">Consultation from</p>
            <p className="font-bold text-stone-800 text-lg flex items-center gap-0.5">
              <IndianRupee className="w-4 h-4" />{doctor.video_fee}
            </p>
          </div>
          <button
            onClick={() => navigate(`/book/${doctor.id}`)}
            className="btn-primary px-6 py-3 text-sm flex items-center gap-2"
          >
            Book Appointment
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
