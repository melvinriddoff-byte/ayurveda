import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageSquare, Send, CheckCircle2, Clock } from 'lucide-react';

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'hello@vaidya.in', href: 'mailto:hello@vaidya.in' },
  { icon: Phone, label: 'Phone', value: '+91 80 4612 3456', href: 'tel:+918046123456' },
  { icon: MapPin, label: 'Address', value: '12, Sadashivanagar, Bengaluru 560080, Karnataka', href: '#' },
  { icon: Clock, label: 'Support Hours', value: 'Mon–Sat, 9 AM – 7 PM IST', href: undefined },
];

const faqs = [
  { q: 'How do I book my first appointment?', a: 'Sign up, complete your Dosha assessment, browse Vaidyas, and use the Book button on any doctor profile.' },
  { q: 'Are video consultations secure?', a: 'Yes. All video sessions use end-to-end encrypted connections and your data is never shared without consent.' },
  { q: 'Can I cancel or reschedule?', a: 'Yes. You can cancel or reschedule up to 4 hours before the appointment from your bookings dashboard.' },
  { q: 'How do hospitals join Vaidya?', a: 'Click "For Hospitals" in the nav and complete our 3-step onboarding. Our team verifies within 48 hours.' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-warm py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-stone-800">Get in Touch</h1>
          <p className="mt-4 text-stone-500 text-lg max-w-lg mx-auto">
            Have a question, feedback, or need help? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Contact form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="bg-white rounded-3xl border border-earth-100 shadow-sm p-8">
              {submitted ? (
                <div className="text-center py-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-16 h-16 bg-herbal-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle2 className="w-8 h-8 text-herbal-600" />
                  </motion.div>
                  <h3 className="font-display text-2xl font-bold text-stone-800 mb-2">Message Sent!</h3>
                  <p className="text-stone-500 text-sm mb-6">
                    Thank you for reaching out. We'll respond within 24 hours.
                  </p>
                  <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                    className="btn-secondary text-sm">
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-saffron-100 rounded-xl flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-saffron-600" />
                    </div>
                    <h2 className="font-semibold text-stone-800 text-lg">Send us a message</h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-stone-600 block mb-1.5">Name *</label>
                        <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                          placeholder="Arun Sharma"
                          className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-300" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-stone-600 block mb-1.5">Email *</label>
                        <input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                          placeholder="you@example.com"
                          className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-300" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-stone-600 block mb-1.5">Subject *</label>
                      <input required value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                        placeholder="How can we help?"
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-300" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-stone-600 block mb-1.5">Message *</label>
                      <textarea required rows={5} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                        placeholder="Tell us more…"
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-300 resize-none" />
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 disabled:opacity-70">
                      {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send className="w-4 h-4" /> Send Message</>}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>

          {/* Info + FAQs */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
            {/* Contact info */}
            <div className="bg-white rounded-3xl border border-earth-100 p-6 space-y-4">
              <h2 className="font-semibold text-stone-800 mb-1">Contact Information</h2>
              {contactInfo.map(item => (
                <a key={item.label} href={item.href || '#'} className={`flex items-start gap-3 group ${item.href && item.href !== '#' ? 'cursor-pointer' : 'cursor-default'}`}>
                  <div className="w-10 h-10 bg-saffron-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-saffron-100 transition-colors">
                    <item.icon className="w-4 h-4 text-saffron-600" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 font-medium">{item.label}</p>
                    <p className="text-sm text-stone-700 group-hover:text-saffron-600 transition-colors">{item.value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* FAQs */}
            <div className="bg-white rounded-3xl border border-earth-100 p-6">
              <h2 className="font-semibold text-stone-800 mb-5">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map(faq => (
                  <div key={faq.q} className="border-b border-stone-100 pb-4 last:border-0 last:pb-0">
                    <p className="font-medium text-stone-800 text-sm mb-1.5">{faq.q}</p>
                    <p className="text-sm text-stone-500 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
