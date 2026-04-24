import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, MicOff, Video, VideoOff, Phone, MessageSquare,
  MoreVertical, Volume2, Users, X, Send,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockDoctors } from '../data/mockData';

export default function VideoConsultation() {
  const { isAuthenticated, user } = useApp();
  const navigate = useNavigate();
  const doctor = mockDoctors[0];

  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState('');
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'doctor', text: 'Namaste! How are you feeling today?', time: '' },
  ]);

  if (!isAuthenticated) return <Navigate to="/signup" replace />;

  useEffect(() => {
    const t = setTimeout(() => setCallStatus('connected'), 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (callStatus !== 'connected') return;
    const t = setInterval(() => setCallDuration(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [callStatus]);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const handleEndCall = () => {
    setCallStatus('ended');
    setTimeout(() => navigate('/appointments'), 1500);
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'me', text: message, time: formatTime(callDuration) }]);
    setMessage('');
  };

  return (
    <div className="h-screen bg-stone-900 flex flex-col overflow-hidden relative">
      {/* Doctor video (full background) */}
      <div className="absolute inset-0">
        <img
          src={doctor.photo}
          alt={doctor.name}
          className={`w-full h-full object-cover transition-all duration-500 ${cameraOff ? 'blur-sm brightness-50' : 'brightness-75'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-stone-900/40" />
      </div>

      {/* Top bar */}
      <div className="relative z-10 px-4 pt-12 pb-4 flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-white">{doctor.name}</h2>
          <div className="flex items-center gap-2 mt-0.5">
            {callStatus === 'connecting' ? (
              <span className="text-xs text-stone-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                Connecting…
              </span>
            ) : callStatus === 'ended' ? (
              <span className="text-xs text-red-400">Call ended</span>
            ) : (
              <span className="text-xs text-herbal-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-herbal-400 rounded-full animate-pulse" />
                {formatTime(callDuration)}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 bg-white/10 rounded-full text-white backdrop-blur-sm hover:bg-white/20 transition-colors">
            <Volume2 className="w-5 h-5" />
          </button>
          <button className="p-2 bg-white/10 rounded-full text-white backdrop-blur-sm hover:bg-white/20 transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Patient self-view (picture-in-picture) */}
      <motion.div
        drag
        dragConstraints={{ left: -200, right: 0, top: 0, bottom: 200 }}
        className="absolute top-24 right-4 z-20 w-28 h-36 rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl cursor-move"
      >
        <div className={`w-full h-full bg-stone-700 flex flex-col items-center justify-center ${cameraOff ? 'opacity-60' : ''}`}>
          {cameraOff ? (
            <VideoOff className="w-7 h-7 text-stone-400" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-saffron-700 to-earth-700 flex items-center justify-center">
              <span className="font-display text-3xl font-bold text-white/80">{user?.name?.charAt(0)}</span>
            </div>
          )}
        </div>
        {muted && (
          <div className="absolute bottom-2 right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <MicOff className="w-3 h-3 text-white" />
          </div>
        )}
      </motion.div>

      {/* Participants count */}
      <div className="absolute top-24 left-4 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
        <Users className="w-3.5 h-3.5 text-white/70" />
        <span className="text-xs text-white/70 font-medium">2</span>
      </div>

      {/* Connecting overlay */}
      <AnimatePresence>
        {callStatus === 'connecting' && (
          <motion.div
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 bg-stone-900/70 flex flex-col items-center justify-center gap-4"
          >
            <div className="w-16 h-16 rounded-full border-4 border-saffron-200 border-t-saffron-500 animate-spin" />
            <p className="text-white font-medium">Connecting to {doctor.name}…</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call ended overlay */}
      <AnimatePresence>
        {callStatus === 'ended' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-30 bg-stone-900/80 flex flex-col items-center justify-center gap-4"
          >
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
              <Phone className="w-7 h-7 text-white rotate-[135deg]" />
            </div>
            <p className="text-white font-semibold text-lg">Call Ended</p>
            <p className="text-stone-400 text-sm">Duration: {formatTime(callDuration)}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute inset-y-0 right-0 w-72 bg-white/95 backdrop-blur-md z-30 flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between px-4 py-4 border-b border-stone-200">
              <h3 className="font-semibold text-stone-800">Chat</h3>
              <button onClick={() => setShowChat(false)} className="p-1 rounded-lg hover:bg-stone-100 text-stone-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                    msg.sender === 'me'
                      ? 'bg-saffron-500 text-white rounded-br-sm'
                      : 'bg-stone-100 text-stone-800 rounded-bl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-3 py-3 border-t border-stone-200 flex gap-2">
              <input
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message…"
                className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-300"
              />
              <button onClick={sendMessage} className="p-2 bg-saffron-500 text-white rounded-xl hover:bg-saffron-600 transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom controls */}
      <div className="relative z-10 mt-auto pb-10 px-6">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setMuted(!muted)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
              muted ? 'bg-red-500 shadow-red-500/30' : 'bg-white/20 backdrop-blur-sm hover:bg-white/30'
            }`}
          >
            {muted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
          </button>

          <button
            onClick={handleEndCall}
            className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-xl shadow-red-500/40 hover:bg-red-600 transition-colors"
          >
            <Phone className="w-7 h-7 text-white rotate-[135deg]" />
          </button>

          <button
            onClick={() => setCameraOff(!cameraOff)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
              cameraOff ? 'bg-red-500 shadow-red-500/30' : 'bg-white/20 backdrop-blur-sm hover:bg-white/30'
            }`}
          >
            {cameraOff ? <VideoOff className="w-6 h-6 text-white" /> : <Video className="w-6 h-6 text-white" />}
          </button>
        </div>

        <div className="flex items-center justify-center gap-6 mt-5">
          <button
            onClick={() => setShowChat(!showChat)}
            className="flex flex-col items-center gap-1 text-white/70 hover:text-white transition-colors relative"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs">Chat</span>
            {messages.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-saffron-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold">
                {messages.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
