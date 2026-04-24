import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-saffron-500 rounded-xl flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">Vaidya</span>
            </Link>
            <p className="text-sm text-stone-400 leading-relaxed">
              Bridging ancient Ayurvedic wisdom with modern healthcare access.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Find a Vaidya', href: '/doctors' },
                { label: 'Specialities', href: '/specialities' },
                { label: 'Book Appointment', href: '/doctors' },
                { label: 'Video Consultation', href: '/consultation' },
              ].map(l => (
                <li key={l.href}>
                  <Link to={l.href} className="text-stone-400 hover:text-saffron-400 transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'About Vaidya', href: '/about' },
                { label: 'Contact Us', href: '/contact' },
                { label: 'Privacy Policy', href: '#' },
                { label: 'Terms of Service', href: '#' },
              ].map(l => (
                <li key={l.label}>
                  <Link to={l.href} className="text-stone-400 hover:text-saffron-400 transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-stone-400"><Mail className="w-4 h-4 text-saffron-400 shrink-0" />info@vaidya.com</li>
              <li className="flex items-center gap-2 text-stone-400"><Phone className="w-4 h-4 text-saffron-400 shrink-0" />+91 8891182030</li>
              <li className="flex items-center gap-2 text-stone-400"><MapPin className="w-4 h-4 text-saffron-400 shrink-0" />Thrissur, Keralam</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-stone-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2026 Vaidya. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
