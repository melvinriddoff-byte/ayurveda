import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Heart, Shield, Users, ArrowRight, Star } from 'lucide-react';

const values = [
  { icon: Leaf, title: 'Rooted in Tradition', desc: 'We honour 5,000 years of Ayurvedic wisdom and work only with practitioners trained in classical lineages.' },
  { icon: Shield, title: 'Verified & Accredited', desc: 'Every hospital and practitioner on Vaidya is NABH-verified. Your safety and trust are our first priority.' },
  { icon: Heart, title: 'Personalised Care', desc: 'We match you to the right Vaidya based on your unique Prakriti — not a one-size-fits-all algorithm.' },
  { icon: Users, title: 'Community of Healers', desc: 'A growing network of 850+ certified Vaidyas across India committed to authentic, compassionate care.' },
];

const team = [
  { name: 'Dr. Ananya Krishnan', role: 'Chief Medical Officer', photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop' },
  { name: 'Rohan Mehta', role: 'Co-founder & CEO', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' },
  { name: 'Priya Nair', role: 'Head of Patient Experience', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop' },
  { name: 'Vikram Patel', role: 'CTO', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop' },
];

const stats = [
  { value: '120+', label: 'Registered Hospitals' },
  { value: '850+', label: 'Certified Vaidyas' },
  { value: '50,000+', label: 'Patients Served' },
  { value: '4.8★', label: 'Average Rating' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-stone-900 py-24 px-4 text-center">
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.12 } } }}>
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-saffron-500/20 text-saffron-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Leaf className="w-4 h-4" />
            Our Story
          </motion.div>
          <motion.h1 variants={fadeUp} className="font-display text-5xl md:text-6xl font-bold text-white max-w-3xl mx-auto leading-tight">
            Bridging ancient wisdom with modern access
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-6 text-stone-400 text-lg max-w-xl mx-auto leading-relaxed">
            Vaidya was founded with one belief: authentic Ayurvedic care should be accessible to every person, regardless of where they live.
          </motion.p>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="bg-saffron-500 py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <motion.div key={s.label} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <p className="font-display text-3xl font-bold text-white">{s.value}</p>
              <p className="text-saffron-100 text-sm mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-4 bg-warm">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-stone-800 mb-6">Our Mission</h2>
            <p className="text-stone-600 text-lg leading-relaxed mb-4">
              In a world of fragmented, reactive healthcare, Ayurveda offers something rare: a complete science of life that addresses not just symptoms, but the root cause of disease in the context of a person's unique constitution.
            </p>
            <p className="text-stone-600 leading-relaxed">
              Vaidya exists to make this ancient wisdom accessible — connecting patients with genuine, qualified Vaidyas who practise in the classical tradition, and giving them the tools to understand and work with their own body.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="font-display text-3xl md:text-4xl font-bold text-stone-800 text-center mb-12">
            What we stand for
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div key={v.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="card p-6 text-center">
                <div className="w-12 h-12 bg-saffron-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-6 h-6 text-saffron-600" />
                </div>
                <h3 className="font-semibold text-stone-800 mb-2">{v.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4 bg-warm">
        <div className="max-w-5xl mx-auto">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="font-display text-3xl md:text-4xl font-bold text-stone-800 text-center mb-12">
            Meet the team
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div key={member.name} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="text-center">
                <img src={member.photo} alt={member.name} className="w-24 h-24 rounded-2xl object-cover mx-auto mb-3 shadow-md" />
                <p className="font-semibold text-stone-800 text-sm">{member.name}</p>
                <p className="text-xs text-stone-400 mt-0.5">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-stone-900 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <Star className="w-8 h-8 text-saffron-400 mx-auto mb-4" />
          <h2 className="font-display text-3xl font-bold text-white mb-4">Ready to start your healing journey?</h2>
          <p className="text-stone-400 mb-8 max-w-md mx-auto">Join over 50,000 patients who have found balance and wellness with the help of Vaidya.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/signup" className="btn-primary flex items-center gap-2">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/doctors" className="btn-secondary !border-stone-600 !text-stone-300 hover:!bg-stone-800">
              Browse Vaidyas
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
