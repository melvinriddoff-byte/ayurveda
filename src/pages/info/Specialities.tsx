import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { mockDoctors, SPECIALTIES } from '../../data/mockData';

const specialityDetails: Record<string, { icon: string; description: string; color: string }> = {
  'Panchakarma': {
    icon: '🫧',
    description: 'The five-fold purification therapy that eliminates toxins and deeply rejuvenates the body, mind, and spirit.',
    color: 'bg-blue-50 border-blue-100',
  },
  'Rasayana (Rejuvenation)': {
    icon: '✨',
    description: 'Anti-ageing and vitality-enhancing treatments using ancient herbal formulations to restore youthful energy.',
    color: 'bg-purple-50 border-purple-100',
  },
  'Kayachikitsa (General Medicine)': {
    icon: '💊',
    description: 'Classical Ayurvedic internal medicine addressing metabolic disorders, chronic diseases, and systemic conditions.',
    color: 'bg-saffron-50 border-saffron-100',
  },
  'Shalya Tantra (Surgery)': {
    icon: '🔪',
    description: 'Ancient surgical procedures and wound management combining herbal treatments with minimally invasive techniques.',
    color: 'bg-red-50 border-red-100',
  },
  'Stri Roga (Gynecology)': {
    icon: '🌸',
    description: "Women's health care including hormonal balance, fertility support, prenatal care, and menstrual disorders.",
    color: 'bg-pink-50 border-pink-100',
  },
  'Kaumarabhritya (Pediatrics)': {
    icon: '👶',
    description: 'Specialised Ayurvedic care for infants and children, from newborn care to adolescent health management.',
    color: 'bg-yellow-50 border-yellow-100',
  },
  'Manasaroga (Psychiatry)': {
    icon: '🧠',
    description: 'Mental health treatments using Sattvavajaya Chikitsa (psychotherapy), herbs, and meditative practices.',
    color: 'bg-indigo-50 border-indigo-100',
  },
  'Shalakya (ENT & Ophthalmology)': {
    icon: '👁️',
    description: 'Treatments for eye, ear, nose, and throat conditions using classical Ayurvedic procedures like Nasya and Netra Tarpana.',
    color: 'bg-teal-50 border-teal-100',
  },
  'Agada Tantra (Toxicology)': {
    icon: '🧪',
    description: 'Detoxification and antidote therapies for toxic conditions, food poisoning, and environmental exposures.',
    color: 'bg-orange-50 border-orange-100',
  },
  'Nidana (Diagnostics)': {
    icon: '🔍',
    description: 'Comprehensive Ayurvedic diagnosis using pulse reading (Nadi Pariksha), tongue analysis, and other classical methods.',
    color: 'bg-stone-50 border-stone-200',
  },
  'Marma Therapy': {
    icon: '⚡',
    description: 'Energy point therapy targeting 107 vital points in the body to restore pranic flow and treat pain and neurological disorders.',
    color: 'bg-amber-50 border-amber-100',
  },
  'Yoga & Naturopathy': {
    icon: '🧘',
    description: 'Integrated yoga therapy, pranayama, and naturopathic treatments complementing Ayurvedic protocols for holistic wellness.',
    color: 'bg-herbal-50 border-herbal-100',
  },
};

export default function Specialities() {
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SPECIALTIES.map((spec, i) => {
            const detail = specialityDetails[spec] || { icon: '🌿', description: '', color: 'bg-stone-50 border-stone-200' };
            const doctorCount = mockDoctors.filter(d => d.specialties.includes(spec)).length;

            return (
              <motion.div
                key={spec}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/doctors?specialty=${encodeURIComponent(spec)}`}
                  className={`block rounded-2xl border p-6 hover:shadow-md hover:-translate-y-0.5 transition-all ${detail.color}`}
                >
                  <div className="text-4xl mb-4">{detail.icon}</div>
                  <h3 className="font-semibold text-stone-800 mb-2 leading-snug">{spec}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed mb-4">{detail.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-400 font-medium">
                      {doctorCount} Vaidya{doctorCount !== 1 ? 's' : ''} available
                    </span>
                    <span className="flex items-center gap-1 text-xs text-saffron-600 font-medium">
                      Explore <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Dosha-speciality link */}
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
