import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, ChevronRight, Bell, Shield, HelpCircle, Star, Phone, Brain, Edit2, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { doshaDescriptions } from '../data/mockData';
import { mockAppointments } from '../data/mockData';

export default function UserProfile() {
  const { user, isAuthenticated, logout, updateName } = useApp();
  const navigate = useNavigate();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || '');

  if (!isAuthenticated) return <Navigate to="/signup" replace />;

  const doshaInfo = user?.dosha && (user.dosha === 'vata' || user.dosha === 'pitta' || user.dosha === 'kapha')
    ? doshaDescriptions[user.dosha] : null;

  const completed = mockAppointments.filter(a => a.status === 'completed').length;
  const upcoming = mockAppointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length;

  const handleSaveName = () => {
    if (nameInput.trim()) updateName(nameInput.trim());
    setEditingName(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/signup');
  };

  const menuSections = [
    {
      title: 'Account',
      items: [
        { icon: Phone, label: 'Phone Number', value: user?.phone ? `+91 ${user.phone}` : 'Not set' },
        { icon: Brain, label: 'Dosha Profile', value: doshaInfo ? doshaInfo.name : 'Not taken', action: () => navigate('/dosha-assessment') },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: Bell, label: 'Notifications', value: 'Enabled' },
        { icon: Shield, label: 'Privacy & Security', value: '' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help & FAQ', value: '', action: () => navigate('/contact') },
        { icon: Star, label: 'Rate Vaidya', value: '' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-warm pb-24">
      {/* Profile header */}
      <div className="bg-white border-b border-stone-100 px-4 pt-8 pb-6">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-display font-bold text-2xl shadow-lg ${
              doshaInfo
                ? user?.dosha === 'vata' ? 'bg-purple-500' : user?.dosha === 'pitta' ? 'bg-orange-400' : 'bg-cyan-500'
                : 'bg-saffron-500'
            }`}>
              {user?.name?.charAt(0) || '?'}
            </div>
            <div className="flex-1">
              {editingName ? (
                <div className="flex items-center gap-2">
                  <input
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl border border-saffron-300 text-sm font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-saffron-300"
                    autoFocus
                    onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                  />
                  <button onClick={handleSaveName} className="p-1.5 bg-herbal-500 rounded-lg text-white">
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-xl font-bold text-stone-800">{user?.name}</h1>
                  <button onClick={() => { setNameInput(user?.name || ''); setEditingName(true); }} className="text-stone-400 hover:text-saffron-500 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              <p className="text-stone-400 text-sm">+91 {user?.phone}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { label: 'Appointments', value: mockAppointments.length },
              { label: 'Completed', value: completed },
              { label: 'Upcoming', value: upcoming },
            ].map(s => (
              <div key={s.label} className="bg-stone-50 rounded-xl p-3 text-center">
                <p className="font-bold text-lg text-stone-800">{s.value}</p>
                <p className="text-xs text-stone-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-5">
        {/* Dosha card */}
        {doshaInfo ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl p-4 flex items-center gap-3 ${
              user?.dosha === 'vata' ? 'bg-purple-50 border border-purple-200' :
              user?.dosha === 'pitta' ? 'bg-orange-50 border border-orange-200' :
              'bg-cyan-50 border border-cyan-200'
            }`}
          >
            <span className="text-3xl">{doshaInfo.emoji}</span>
            <div className="flex-1">
              <p className="font-semibold text-stone-800 text-sm">Your Dosha: {doshaInfo.name}</p>
              <p className="text-xs text-stone-500 mt-0.5">{doshaInfo.elements} · {doshaInfo.tagline}</p>
            </div>
            <button
              onClick={() => navigate('/dosha-assessment')}
              className="text-xs text-stone-400 hover:text-saffron-600 transition-colors"
            >
              Retake
            </button>
          </motion.div>
        ) : (
          <button
            onClick={() => navigate('/dosha-assessment')}
            className="w-full bg-saffron-50 border border-saffron-200 rounded-2xl p-4 flex items-center gap-3 hover:bg-saffron-100 transition-colors"
          >
            <Brain className="w-8 h-8 text-saffron-500" />
            <div className="flex-1 text-left">
              <p className="font-semibold text-stone-800 text-sm">Discover Your Dosha</p>
              <p className="text-xs text-stone-500 mt-0.5">Take the free 2-minute Prakriti quiz</p>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>
        )}

        {/* Menu sections */}
        {menuSections.map(section => (
          <div key={section.title} className="bg-white rounded-2xl border border-earth-100 overflow-hidden">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider px-4 pt-4 pb-2">{section.title}</p>
            {section.items.map((item, i) => (
              <button
                key={item.label}
                onClick={item.action}
                className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-stone-50 transition-colors ${
                  i < section.items.length - 1 ? 'border-b border-stone-100' : ''
                } ${item.action ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div className="w-9 h-9 bg-stone-100 rounded-xl flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4 text-stone-500" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-stone-800">{item.label}</p>
                  {item.value && <p className="text-xs text-stone-400 mt-0.5">{item.value}</p>}
                </div>
                {item.action && <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />}
              </button>
            ))}
          </div>
        ))}

        {/* Sign out */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 hover:bg-red-100 transition-colors"
        >
          <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center">
            <LogOut className="w-4 h-4 text-red-500" />
          </div>
          <span className="font-medium text-red-600 text-sm">Sign Out</span>
        </button>

        <p className="text-center text-xs text-stone-400 pb-2">Vaidya v1.0 · © 2026</p>
      </div>
    </div>
  );
}
