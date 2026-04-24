import { useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Video, MapPin, IndianRupee } from 'lucide-react';
import { mockDoctors, TIME_SLOTS } from '../data/mockData';
import { useApp } from '../context/AppContext';
import type { AppointmentType } from '../types';

export default function BookAppointment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useApp();

  const [type, setType] = useState<AppointmentType>('in-person');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');

  if (!isAuthenticated) return <Navigate to="/signup" replace />;

  const doctor = mockDoctors.find(d => d.id === id);
  if (!doctor) return <div className="p-8 text-center text-stone-400">Vaidya not found.</div>;

  const fee = type === 'video' ? doctor.videoFee : doctor.consultationFee;

  // Generate next 7 available dates
  const availableDates: string[] = [];
  const today = new Date();
  for (let i = 1; i <= 14 && availableDates.length < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    if (doctor.availableDays.includes(dayName)) {
      availableDates.push(d.toISOString().split('T')[0]);
    }
  }

  const canBook = selectedDate && selectedTime;

  const handleConfirm = () => {
    if (!canBook) return;
    navigate('/booking-confirmed', {
      state: {
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctorPhoto: doctor.photo,
        hospitalName: doctor.hospitalName,
        date: selectedDate,
        time: selectedTime,
        type,
        fee,
        notes,
        meetingLink: type === 'video' ? 'https://meet.vaidya.in/room-' + Math.random().toString(36).slice(2, 8) : undefined,
      },
    });
  };

  return (
    <div className="min-h-screen bg-warm pb-32">
      {/* Header */}
      <div className="bg-white border-b border-stone-100 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-stone-100 text-stone-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-semibold text-stone-800">Book Appointment</h1>
            <p className="text-xs text-stone-400">{doctor.name}</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-5">
        {/* Doctor mini card */}
        <div className="bg-white rounded-2xl border border-earth-100 p-4 flex items-center gap-3">
          <img src={doctor.photo} alt={doctor.name} className="w-14 h-14 rounded-xl object-cover" />
          <div>
            <p className="font-semibold text-stone-800">{doctor.name}</p>
            <p className="text-xs text-stone-400">{doctor.title}</p>
            <p className="text-xs text-saffron-600 font-medium mt-0.5">★ {doctor.rating} · {doctor.hospitalName}</p>
          </div>
        </div>

        {/* Consultation type */}
        <div className="bg-white rounded-2xl border border-earth-100 p-5">
          <h2 className="font-semibold text-stone-800 mb-3">Consultation Type</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setType('in-person')}
              className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 transition-all ${
                type === 'in-person' ? 'border-saffron-400 bg-saffron-50' : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${type === 'in-person' ? 'bg-saffron-100' : 'bg-stone-100'}`}>
                <MapPin className={`w-5 h-5 ${type === 'in-person' ? 'text-saffron-600' : 'text-stone-500'}`} />
              </div>
              <div className="text-center">
                <p className={`text-sm font-semibold ${type === 'in-person' ? 'text-saffron-700' : 'text-stone-700'}`}>In-Person</p>
                <p className={`text-xs ${type === 'in-person' ? 'text-saffron-500' : 'text-stone-400'}`}>₹{doctor.consultationFee}</p>
              </div>
            </button>
            <button
              onClick={() => doctor.acceptsVideo && setType('video')}
              disabled={!doctor.acceptsVideo}
              className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                type === 'video' ? 'border-herbal-400 bg-herbal-50' : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${type === 'video' ? 'bg-herbal-100' : 'bg-stone-100'}`}>
                <Video className={`w-5 h-5 ${type === 'video' ? 'text-herbal-600' : 'text-stone-500'}`} />
              </div>
              <div className="text-center">
                <p className={`text-sm font-semibold ${type === 'video' ? 'text-herbal-700' : 'text-stone-700'}`}>Video Call</p>
                <p className={`text-xs ${type === 'video' ? 'text-herbal-500' : 'text-stone-400'}`}>₹{doctor.videoFee}</p>
              </div>
            </button>
          </div>
        </div>

        {/* Date picker */}
        <div className="bg-white rounded-2xl border border-earth-100 p-5">
          <h2 className="font-semibold text-stone-800 mb-3">Select Date</h2>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {availableDates.map(date => {
              const d = new Date(date);
              const isSelected = selectedDate === date;
              return (
                <button
                  key={date}
                  onClick={() => { setSelectedDate(date); setSelectedTime(''); }}
                  className={`flex-none flex flex-col items-center px-4 py-3 rounded-2xl border-2 min-w-[64px] transition-all ${
                    isSelected ? 'border-saffron-400 bg-saffron-50' : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <span className={`text-xs font-medium ${isSelected ? 'text-saffron-500' : 'text-stone-400'}`}>
                    {d.toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className={`text-lg font-bold ${isSelected ? 'text-saffron-700' : 'text-stone-700'}`}>
                    {d.getDate()}
                  </span>
                  <span className={`text-xs ${isSelected ? 'text-saffron-500' : 'text-stone-400'}`}>
                    {d.toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time slots */}
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-earth-100 p-5"
          >
            <h2 className="font-semibold text-stone-800 mb-3">Select Time</h2>
            <div className="grid grid-cols-4 gap-2">
              {TIME_SLOTS.map((slot, i) => {
                const unavailable = i % 3 === 1;
                const isSelected = selectedTime === slot;
                return (
                  <button
                    key={slot}
                    onClick={() => !unavailable && setSelectedTime(slot)}
                    disabled={unavailable}
                    className={`py-2.5 rounded-xl text-xs font-medium border transition-all ${
                      isSelected
                        ? 'border-saffron-400 bg-saffron-50 text-saffron-700'
                        : unavailable
                        ? 'border-stone-100 bg-stone-50 text-stone-300 cursor-not-allowed line-through'
                        : 'border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Notes */}
        <div className="bg-white rounded-2xl border border-earth-100 p-5">
          <h2 className="font-semibold text-stone-800 mb-3">Reason / Notes <span className="text-stone-400 font-normal text-sm">(optional)</span></h2>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            placeholder="Describe your concern briefly..."
            className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-300 resize-none"
          />
        </div>
      </div>

      {/* Sticky bottom CTA */}
      <div className="fixed bottom-16 left-0 right-0 px-4 pb-2 z-40">
        <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-2xl border border-earth-100 p-4 flex items-center gap-4">
          <div>
            <p className="text-xs text-stone-400">Total fee</p>
            <p className="font-bold text-stone-800 text-xl flex items-center gap-0.5">
              <IndianRupee className="w-4 h-4" />{fee}
            </p>
          </div>
          <button
            onClick={handleConfirm}
            disabled={!canBook}
            className="btn-primary flex-1 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!selectedDate ? 'Select a date' : !selectedTime ? 'Select a time' : 'Confirm Booking'}
          </button>
        </div>
      </div>
    </div>
  );
}
