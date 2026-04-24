import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, MapPin, Phone, Globe, BadgeCheck, Calendar, Users } from 'lucide-react';
import { mockHospitals } from '../data/mockData';
import DoctorCard from '../components/DoctorCard';

export default function HospitalProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const hospital = mockHospitals.find(h => h.id === id);

  if (!hospital) {
    return (
      <div className="min-h-screen bg-warm flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-500">Hospital not found.</p>
          <Link to="/discover" className="btn-primary mt-4 inline-block">Back to Discover</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm pb-16">
      {/* Cover */}
      <div className="relative h-56 md:h-72">
        <img src={hospital.coverImage} alt={hospital.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-stone-700 p-2 rounded-full shadow hover:bg-white transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        {hospital.verified && (
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 text-herbal-600 text-xs font-medium px-3 py-1.5 rounded-full shadow">
            <BadgeCheck className="w-4 h-4" />
            Verified & Accredited
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-10 relative">
        {/* Header card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-earth-100 p-6 mb-6"
        >
          <div className="flex gap-4 items-start">
            <img src={hospital.logo} alt={hospital.name} className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-md shrink-0" />
            <div className="flex-1">
              <h1 className="font-display text-2xl md:text-3xl font-bold text-stone-800">{hospital.name}</h1>
              <p className="text-stone-500 text-sm mt-0.5 italic">{hospital.tagline}</p>
              <div className="flex flex-wrap gap-3 mt-2">
                <div className="flex items-center gap-1 text-sm text-stone-600">
                  <MapPin className="w-4 h-4 text-saffron-500" />
                  {hospital.location}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-saffron-400 fill-saffron-400" />
                  <span className="text-sm font-semibold text-stone-700">{hospital.rating}</span>
                  <span className="text-xs text-stone-400">({hospital.reviewCount} reviews)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {hospital.accreditations.map(a => (
              <span key={a} className="text-xs bg-herbal-50 text-herbal-700 border border-herbal-100 px-2.5 py-1 rounded-full">
                {a}
              </span>
            ))}
          </div>

          <div className="grid sm:grid-cols-3 gap-3 mt-4">
            <a href={`tel:${hospital.phone}`} className="flex items-center gap-2 text-sm text-stone-600 bg-stone-50 rounded-xl px-4 py-3 hover:bg-saffron-50 hover:text-saffron-600 transition-colors">
              <Phone className="w-4 h-4 text-saffron-500" />
              {hospital.phone}
            </a>
            {hospital.website && (
              <a href={hospital.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-stone-600 bg-stone-50 rounded-xl px-4 py-3 hover:bg-saffron-50 hover:text-saffron-600 transition-colors">
                <Globe className="w-4 h-4 text-saffron-500" />
                Visit Website
              </a>
            )}
            <div className="flex items-center gap-2 text-sm text-stone-600 bg-stone-50 rounded-xl px-4 py-3">
              <Calendar className="w-4 h-4 text-saffron-500" />
              Est. {hospital.yearEstablished}
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-earth-100 p-6">
              <h2 className="font-semibold text-stone-800 mb-3">About</h2>
              <p className="text-sm text-stone-600 leading-relaxed">{hospital.description}</p>
            </div>

            <div className="bg-white rounded-2xl border border-earth-100 p-6">
              <h2 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-saffron-500" />
                Our Doctors ({hospital.doctors.length})
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {hospital.doctors.map(doctor => (
                  <DoctorCard key={doctor.id} doctor={doctor} compact />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-earth-100 p-5">
              <h3 className="font-semibold text-stone-800 mb-3">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {hospital.specialties.map(s => (
                  <span key={s} className="text-xs bg-saffron-50 text-saffron-700 border border-saffron-100 px-2.5 py-1 rounded-full">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-earth-100 p-5">
              <h3 className="font-semibold text-stone-800 mb-3">Amenities</h3>
              <ul className="space-y-2">
                {hospital.amenities.map(a => (
                  <li key={a} className="flex items-center gap-2 text-sm text-stone-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-saffron-400 shrink-0" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>

            <Link to="/discover" className="btn-primary block text-center">
              Browse All Doctors
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
