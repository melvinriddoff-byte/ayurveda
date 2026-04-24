import { Link, useLocation } from 'react-router-dom';
import { Home, Stethoscope, CalendarDays, User } from 'lucide-react';

const tabs = [
  { href: '/home', icon: Home, label: 'Home' },
  { href: '/doctors', icon: Stethoscope, label: 'Vaidyas' },
  { href: '/appointments', icon: CalendarDays, label: 'Bookings' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-stone-200 safe-area-bottom">
      <div className="flex items-stretch max-w-lg mx-auto">
        {tabs.map(tab => {
          const active = pathname === tab.href || (tab.href === '/doctors' && pathname.startsWith('/vaidya'));
          return (
            <Link
              key={tab.href}
              to={tab.href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors ${
                active ? 'text-saffron-600' : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              <tab.icon className={`w-5 h-5 transition-all ${active ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span className={`text-[10px] font-medium ${active ? 'text-saffron-600' : 'text-stone-400'}`}>
                {tab.label}
              </span>
              {active && <span className="absolute bottom-0 w-8 h-0.5 bg-saffron-500 rounded-full" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
