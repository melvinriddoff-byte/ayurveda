import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Video, Star, MapPin, SlidersHorizontal, X } from 'lucide-react';
import { getDoctors } from '../../lib/services/doctors';
import { getSpecialities } from '../../lib/services/specialities';
import type { DoctorWithRelations, Speciality } from '../../lib/database.types';

const doshaColors: Record<string, string> = {
  vata: 'bg-purple-100 text-purple-700',
  pitta: 'bg-orange-100 text-orange-700',
  kapha: 'bg-cyan-100 text-cyan-700',
};

export default function Doctors() {
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [doshaFilter, setDoshaFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [doctors, setDoctors] = useState<DoctorWithRelations[]>([]);
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDoctors(), getSpecialities()])
      .then(([docs, specs]) => { setDoctors(docs); setSpecialities(specs); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return doctors.filter(d => {
      const matchSearch = !search ||
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        (d.hospital_name ?? '').toLowerCase().includes(search.toLowerCase());
      const matchSpecialty = !specialty || d.speciality_names?.includes(specialty);
      const matchDosha = !doshaFilter || d.dosha_expertise.includes(doshaFilter);
      return matchSearch && matchSpecialty && matchDosha;
    });
  }, [search, specialty, doshaFilter, doctors]);

  const hasFilters = search || specialty || doshaFilter;

  return (
    <div className="min-h-screen bg-warm py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-4xl font-bold text-stone-800">Our Vaidyas</h1>
          <p className="mt-2 text-stone-500">Certified Ayurvedic practitioners ready to guide your healing</p>
        </motion.div>

        {/* Search bar */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, hospital..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-saffron-300 text-sm"
            />
            {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"><X className="w-4 h-4" /></button>}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
              showFilters || hasFilters ? 'border-saffron-400 bg-saffron-50 text-saffron-600' : 'border-stone-200 bg-white text-stone-600'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {hasFilters && <span className="w-2 h-2 rounded-full bg-saffron-500" />}
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            className="bg-white rounded-2xl border border-stone-200 p-5 mb-5 grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-stone-600 block mb-1.5">Specialty</label>
              <select value={specialty} onChange={e => setSpecialty(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-300 bg-white">
                <option value="">All Specialties</option>
                {specialities.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-stone-600 block mb-1.5">Dosha Expertise</label>
              <select value={doshaFilter} onChange={e => setDoshaFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-300 bg-white">
                <option value="">All Doshas</option>
                <option value="vata">Vata 🌬️</option>
                <option value="pitta">Pitta 🔥</option>
                <option value="kapha">Kapha 🌊</option>
              </select>
            </div>
            {hasFilters && (
              <div className="sm:col-span-2 flex justify-end">
                <button onClick={() => { setSearch(''); setSpecialty(''); setDoshaFilter(''); }}
                  className="text-sm text-red-500 flex items-center gap-1">
                  <X className="w-4 h-4" /> Clear all
                </button>
              </div>
            )}
          </motion.div>
        )}

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-earth-100 p-5 animate-pulse">
                <div className="flex gap-4 mb-4">
                  <div className="w-16 h-16 bg-stone-200 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-3 bg-stone-200 rounded w-3/4" />
                    <div className="h-3 bg-stone-200 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <p className="text-sm text-stone-500 mb-5">{filtered.length} Vaidya{filtered.length !== 1 ? 's' : ''} found</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((doc, i) => (
                <motion.div key={doc.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link to={`/vaidya/${doc.id}`} className="card p-5 block hover:border-saffron-200 hover:-translate-y-0.5 transition-all">
                    <div className="flex gap-4 mb-4">
                      {doc.photo_url ? (
                        <img src={doc.photo_url} alt={doc.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-saffron-100 flex items-center justify-center text-saffron-600 font-bold text-xl shrink-0">
                          {doc.name.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="font-semibold text-stone-800 truncate">{doc.name}</h3>
                        <p className="text-xs text-stone-400 mt-0.5">{doc.title}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3.5 h-3.5 text-saffron-400 fill-saffron-400" />
                          <span className="text-sm font-medium text-stone-700">{doc.rating}</span>
                          <span className="text-xs text-stone-400">({doc.review_count})</span>
                        </div>
                      </div>
                    </div>

                    {doc.hospital_name && (
                      <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-3">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{doc.hospital_name}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {doc.speciality_names?.slice(0, 2).map(s => (
                        <span key={s} className="text-xs bg-earth-50 text-earth-700 border border-earth-100 px-2 py-0.5 rounded-full">{s.split(' ')[0]}</span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {doc.dosha_expertise.map(d => (
                        <span key={d} className={`text-xs px-2 py-0.5 rounded-full capitalize font-medium ${doshaColors[d] ?? ''}`}>{d}</span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                      <div className="text-sm">
                        <span className="font-bold text-stone-800">₹{doc.video_fee}</span>
                        <span className="text-stone-400 text-xs"> / session</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        {doc.accepts_video && (
                          <span className="flex items-center gap-1 text-herbal-600 bg-herbal-50 px-2 py-1 rounded-full">
                            <Video className="w-3 h-3" /> Video
                          </span>
                        )}
                        <span className="text-stone-400">{doc.experience} yrs</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-20 text-stone-400">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-lg font-medium">No Vaidyas found</p>
                <button onClick={() => { setSearch(''); setSpecialty(''); setDoshaFilter(''); }} className="text-saffron-600 text-sm mt-2 hover:underline">
                  Clear filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
