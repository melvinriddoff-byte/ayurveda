import { Link } from 'react-router-dom';
import { Star, MapPin, Users, BadgeCheck } from 'lucide-react';
import type { Hospital } from '../types';

interface Props {
  hospital: Hospital;
}

export default function HospitalCard({ hospital }: Props) {
  return (
    <div className="card overflow-hidden">
      <div className="relative h-40">
        <img
          src={hospital.coverImage}
          alt={hospital.name}
          className="w-full h-full object-cover"
        />
        {hospital.verified && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-herbal-600 text-xs font-medium px-2 py-1 rounded-full shadow-sm">
            <BadgeCheck className="w-3.5 h-3.5" />
            Verified
          </div>
        )}
        <div className="absolute -bottom-5 left-4">
          <img
            src={hospital.logo}
            alt={`${hospital.name} logo`}
            className="w-12 h-12 rounded-xl border-2 border-white object-cover shadow-md"
          />
        </div>
      </div>

      <div className="pt-7 pb-5 px-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-stone-800 leading-snug">{hospital.name}</h3>
            <div className="flex items-center gap-1 mt-0.5 text-xs text-stone-500">
              <MapPin className="w-3 h-3" />
              <span>{hospital.city}, {hospital.state}</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="flex items-center gap-1 justify-end">
              <Star className="w-3.5 h-3.5 text-saffron-400 fill-saffron-400" />
              <span className="text-sm font-semibold text-stone-700">{hospital.rating}</span>
            </div>
            <p className="text-xs text-stone-400">{hospital.reviewCount} reviews</p>
          </div>
        </div>

        <p className="text-xs text-stone-500 mt-2.5 line-clamp-2 leading-relaxed">
          {hospital.tagline}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {hospital.specialties.slice(0, 3).map(s => (
            <span key={s} className="text-xs bg-saffron-50 text-saffron-700 px-2 py-0.5 rounded-full border border-saffron-100">
              {s}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-100">
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <Users className="w-3.5 h-3.5" />
            <span>{hospital.doctors.length} doctors</span>
          </div>
          <span className="text-xs text-stone-400">Est. {hospital.yearEstablished}</span>
        </div>

        <Link
          to={`/hospital/${hospital.id}`}
          className="btn-secondary text-sm py-2 text-center block mt-3"
        >
          View Hospital
        </Link>
      </div>
    </div>
  );
}
