import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Leaf, LogOut, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Doctors', href: '/doctors' },
    { label: 'Specialities', href: '/specialities' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/signup');
    setMobileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-earth-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to={isAuthenticated ? '/home' : '/'} className="flex items-center gap-2">
            <div className="w-9 h-9 bg-saffron-500 rounded-xl flex items-center justify-center shadow-md">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-stone-800">Vaidya</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.href
                    ? 'bg-saffron-50 text-saffron-600'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-earth-100 hover:border-saffron-200 hover:bg-saffron-50 transition-all">
                  <div className="w-7 h-7 rounded-full bg-saffron-100 flex items-center justify-center text-saffron-600 font-semibold text-sm">
                    {user?.name?.charAt(0) || <User className="w-4 h-4" />}
                  </div>
                  <span className="text-sm font-medium text-stone-700">{user?.name?.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout} className="p-2 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Sign out">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link to="/signup" className="btn-primary text-sm py-2">Get Started</Link>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100 transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-earth-100 bg-white overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(link => (
                <Link key={link.href} to={link.href} onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-stone-700 hover:bg-saffron-50 hover:text-saffron-600 transition-colors">
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 pb-1 border-t border-stone-100 space-y-2">
                {isAuthenticated ? (
                  <>
                    <Link to="/profile" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-stone-700">Profile</Link>
                    <button onClick={handleLogout} className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50">Sign out</button>
                  </>
                ) : (
                  <Link to="/signup" onClick={() => setMobileOpen(false)} className="btn-primary block text-center text-sm py-2.5">Get Started</Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
