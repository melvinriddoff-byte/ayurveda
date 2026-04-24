import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { getSpecialities } from '../../lib/services/specialities';
import type { Speciality } from '../../lib/database.types';

const fallbackColors = [
  'bg-blue-50 border-blue-100',
  'bg-purple-50 border-purple-100',
  'bg-saffron-50 border-saffron-100',
  'bg-red-50 border-red-100',
  'bg-pink-50 border-pink-100',
  'bg-yellow-50 border-yellow-100',
  'bg-indigo-50 border-indigo-100',
  'bg-teal-50 border-teal-100',
  'bg-orange-50 border-orange-100',
  'bg-stone-50 border-stone-200',
  'bg-amber-50 border-amber-100',
  'bg-herbal-50 border-herbal-100',
];

export default function Specialities() {
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSpecialities().then(setSpecialities).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-warm py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="font-display text-4xl font-bold text-stone-800">Specialities</h1>
          <p className="mt-2 text-stone-500 max-w-2xl">
            Ayurveda's eight classical branches address every aspect of human health.
            Explore our range of specialised treatments.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-stone-200 p-6 animate-pulse">
                <div className="w-10 h-10 bg-stone-200 rounded-xl mb-4" />
                <div className="h-4 bg-stone-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-stone-200 rounded w-full mb-1" />
                <div className="h-3 bg-stone-200 rounded w-4/5" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {specialities.map((spec, i) => {
              const colorClass = fallbackColors[i % fallbackColors.length];
              return (
                <motion.div
                  key={spec.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={`/doctors?specialty=${encodeURIComponent(spec.name)}`}
                    className={`block rounded-2xl border p-6 hover:shadow-md hover:-translate-y-0.5 transition-all ${colorClass}`}
                  >
                    <div className="text-4xl mb-4">{spec.icon ?? '🌿'}</div>
                    <h3 className="font-semibold text-stone-800 mb-2 leading-snug">{spec.name}</h3>
                    {spec.description && (
                      <p className="text-sm text-stone-500 leading-relaxed mb-4">{spec.description}</p>
                    )}
                    <div className="flex items-center justify-end">
                      <span className="flex items-center gap-1 text-xs text-saffron-600 font-medium">
                        Explore <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-gradient-to-r from-saffron-500 to-earth-500 rounded-3xl p-8 text-white text-center"
        >
          <h2 className="font-display text-3xl font-bold mb-3">Not sure which speciality you need?</h2>
          <p className="text-saffron-100 mb-6 max-w-lg mx-auto">
            Take our Dosha assessment to discover your unique Prakriti and get personalised speciality recommendations.
          </p>
          <Link to="/dosha-assessment" className="inline-flex items-center gap-2 bg-white text-saffron-600 font-semibold px-6 py-3 rounded-xl hover:bg-saffron-50 transition-colors">
            Take the Dosha Quiz
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
