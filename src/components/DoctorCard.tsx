import { Link } from 'react-router-dom';
import { Star, MapPin, Video, Clock, IndianRupee } from 'lucide-react';
import type { Doctor } from '../types';

interface Props {
  doctor: Doctor;
  compact?: boolean;
}

const doshaColors: Record<string, string> = {
  vata: 'bg-purple-100 text-purple-700',
  pitta: 'bg-orange-100 text-orange-700',
  kapha: 'bg-cyan-100 text-cyan-700',
};

export default function DoctorCard({ doctor, compact = false }: Props) {
  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex gap-4">
        <img
          src={doctor.photo}
          alt={doctor.name}
          className="w-16 h-16 rounded-xl object-cover shrink-0"
        />
        <div className="min-w-0">
          <h3 className="font-semibold text-stone-800 truncate">{doctor.name}</h3>
          <p className="text-xs text-stone-500 mt-0.5">{doctor.title}</p>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3.5 h-3.5 text-saffron-400 fill-saffron-400" />
            <span className="text-sm font-medium text-stone-700">{doctor.rating}</span>
            <span className="text-xs text-stone-400">({doctor.reviewCount} reviews)</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-stone-500">
        <MapPin className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate">{doctor.hospitalName}</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {doctor.specialties.slice(0, 2).map(s => (
          <span key={s} className="text-xs bg-earth-50 text-earth-700 px-2 py-0.5 rounded-full border border-earth-100">
            {s}
          </span>
        ))}
        {doctor.specialties.length > 2 && (
          <span className="text-xs text-stone-400">+{doctor.specialties.length - 2}</span>
        )}
      </div>

      {!compact && (
        <div className="flex flex-wrap gap-1.5">
          {doctor.doshaExpertise.map(d => (
            <span key={d} className={`text-xs px-2 py-0.5 rounded-full capitalize font-medium ${d ? (doshaColors[d] || 'bg-stone-100 text-stone-600') : 'bg-stone-100 text-stone-600'}`}>
              {d}
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 text-xs text-stone-600">
        <div className="flex items-center gap-1.5 bg-stone-50 rounded-lg px-2.5 py-2">
          <Clock className="w-3.5 h-3.5 text-herbal-600" />
          <span>{doctor.experience} yrs exp.</span>
        </div>
        <div className="flex items-center gap-1.5 bg-stone-50 rounded-lg px-2.5 py-2">
          <IndianRupee className="w-3.5 h-3.5 text-herbal-600" />
          <span>From ₹{doctor.videoFee}</span>
        </div>
      </div>

      {doctor.acceptsVideo && (
        <div className="flex items-center gap-1.5 text-xs text-herbal-600">
          <Video className="w-3.5 h-3.5" />
          <span>Video consultation available</span>
        </div>
      )}

      <Link
        to={`/doctor/${doctor.id}`}
        className="btn-primary text-sm py-2.5 text-center mt-auto"
      >
        View Profile & Book
      </Link>
    </div>
  );
}
