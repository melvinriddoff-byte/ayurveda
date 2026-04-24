import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Calendar, Clock, Video, MapPin, IndianRupee, Home, CalendarDays, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';

interface BookingState {
  doctorName: string;
  doctorPhoto: string;
  hospitalName: string;
  date: string;
  time: string;
  type: 'in-person' | 'video';
  fee: number;
  notes: string;
  meetingLink?: string;
}

export default function BookingConfirmed() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useApp();
  const [copied, setCopied] = useState(false);

  if (!isAuthenticated) return <Navigate to="/signup" replace />;

  const state = location.state as BookingState | null;
  if (!state) return <Navigate to="/home" replace />;

  const { doctorName, doctorPhoto, hospitalName, date, time, type, fee, meetingLink } = state;

  const formattedDate = new Date(date).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const handleCopyLink = () => {
    if (meetingLink) {
      navigator.clipboard.writeText(meetingLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-warm flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        {/* Success animation */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className="w-20 h-20 bg-herbal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-herbal-200"
        >
          <CheckCircle2 className="w-10 h-10 text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-6"
        >
          <h1 className="font-display text-3xl font-bold text-stone-800">Booking Confirmed!</h1>
          <p className="text-stone-500 text-sm mt-2">
            Your appointment with <strong>{doctorName}</strong> is all set.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl border border-earth-100 shadow-sm overflow-hidden mb-5"
        >
          {/* Doctor strip */}
          <div className="p-4 flex items-center gap-3 border-b border-stone-100">
            <img src={doctorPhoto} alt={doctorName} className="w-12 h-12 rounded-xl object-cover" />
            <div>
              <p className="font-semibold text-stone-800 text-sm">{doctorName}</p>
              <p className="text-xs text-stone-400">{hospitalName}</p>
            </div>
          </div>

          {/* Details */}
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-saffron-50 rounded-lg flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-saffron-500" />
              </div>
              <span className="text-stone-700">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-saffron-50 rounded-lg flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-saffron-500" />
              </div>
              <span className="text-stone-700">{time}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-saffron-50 rounded-lg flex items-center justify-center shrink-0">
                {type === 'video'
                  ? <Video className="w-4 h-4 text-saffron-500" />
                  : <MapPin className="w-4 h-4 text-saffron-500" />
                }
              </div>
              <span className="text-stone-700 capitalize">{type === 'video' ? 'Video Consultation' : 'In-Person Visit'}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-saffron-50 rounded-lg flex items-center justify-center shrink-0">
                <IndianRupee className="w-4 h-4 text-saffron-500" />
              </div>
              <span className="text-stone-700">₹{fee} paid</span>
            </div>
          </div>

          {/* Booking ID */}
          <div className="px-4 pb-4">
            <div className="bg-stone-50 rounded-xl px-4 py-2.5 flex items-center justify-between">
              <div>
                <p className="text-xs text-stone-400">Booking ID</p>
                <p className="text-sm font-mono font-semibold text-stone-700">VDY-{Math.random().toString(36).slice(2, 8).toUpperCase()}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Video link */}
        {type === 'video' && meetingLink && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-herbal-50 border border-herbal-200 rounded-2xl p-4 mb-5"
          >
            <p className="text-sm font-semibold text-herbal-800 mb-1">Your Video Link is Ready</p>
            <p className="text-xs text-herbal-600 mb-3 break-all">{meetingLink}</p>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 text-xs font-medium text-herbal-700 bg-herbal-100 hover:bg-herbal-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy link'}
            </button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="grid grid-cols-2 gap-3"
        >
          <button onClick={() => navigate('/appointments')} className="btn-secondary flex items-center justify-center gap-2 py-3.5">
            <CalendarDays className="w-4 h-4" />
            My Bookings
          </button>
          <button onClick={() => navigate('/home')} className="btn-primary flex items-center justify-center gap-2 py-3.5">
            <Home className="w-4 h-4" />
            Go Home
          </button>
        </motion.div>
      </div>
    </div>
  );
}
