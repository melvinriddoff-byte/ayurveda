import { Calendar, Clock, Video, MapPin, FileText, ExternalLink } from 'lucide-react';
import type { Appointment } from '../types';

interface Props {
  appointment: Appointment;
}

const statusConfig = {
  pending: { label: 'Pending', classes: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  confirmed: { label: 'Confirmed', classes: 'bg-herbal-50 text-herbal-700 border-herbal-200' },
  completed: { label: 'Completed', classes: 'bg-stone-50 text-stone-600 border-stone-200' },
  cancelled: { label: 'Cancelled', classes: 'bg-red-50 text-red-600 border-red-200' },
};

export default function AppointmentCard({ appointment }: Props) {
  const status = statusConfig[appointment.status];
  const formattedDate = new Date(appointment.date).toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <div className="card p-5">
      <div className="flex gap-4">
        <img
          src={appointment.doctorPhoto}
          alt={appointment.doctorName}
          className="w-14 h-14 rounded-xl object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <h4 className="font-semibold text-stone-800">{appointment.doctorName}</h4>
              <p className="text-xs text-stone-500 mt-0.5">{appointment.hospitalName}</p>
            </div>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${status.classes}`}>
              {status.label}
            </span>
          </div>

          <div className="flex flex-wrap gap-3 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-stone-600">
              <Calendar className="w-3.5 h-3.5 text-saffron-500" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-stone-600">
              <Clock className="w-3.5 h-3.5 text-saffron-500" />
              <span>{appointment.time}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-stone-600">
              {appointment.type === 'video' ? (
                <Video className="w-3.5 h-3.5 text-herbal-500" />
              ) : (
                <MapPin className="w-3.5 h-3.5 text-herbal-500" />
              )}
              <span className="capitalize">{appointment.type === 'video' ? 'Video Call' : 'In-Person'}</span>
            </div>
          </div>

          {appointment.notes && (
            <div className="mt-3 flex items-start gap-1.5 text-xs text-stone-500 bg-stone-50 rounded-lg px-3 py-2">
              <FileText className="w-3.5 h-3.5 shrink-0 mt-0.5 text-stone-400" />
              <p className="line-clamp-2">{appointment.notes}</p>
            </div>
          )}

          {appointment.prescription && (
            <div className="mt-2 p-3 bg-herbal-50 border border-herbal-100 rounded-lg">
              <p className="text-xs font-medium text-herbal-700 mb-1">Prescription</p>
              <p className="text-xs text-herbal-600 leading-relaxed">{appointment.prescription}</p>
            </div>
          )}

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-100">
            <span className="text-xs font-semibold text-stone-700">₹{appointment.fee}</span>
            <div className="flex gap-2">
              {appointment.followUpDate && (
                <span className="text-xs text-stone-400">
                  Follow-up: {new Date(appointment.followUpDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
              )}
              {appointment.meetingLink && appointment.status === 'confirmed' && (
                <a
                  href={appointment.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-herbal-600 font-medium hover:text-herbal-700"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Join Call
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
