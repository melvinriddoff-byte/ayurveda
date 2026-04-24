import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, ArrowRight, ArrowLeft, Mail, CheckCircle2, Sparkles, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { doshaQuestions, doshaDescriptions } from '../data/mockData';
import type { DoshaType } from '../types';
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '../lib/services/auth';
import { upsertProfile, getProfile } from '../lib/services/profiles';
import { FIREBASE_CONFIGURED } from '../lib/firebase';

type Step = 'welcome' | 'auth' | 'name' | 'dosha' | 'done';
const STEP_ORDER: Step[] = ['welcome', 'auth', 'name', 'dosha', 'done'];

export default function Signup() {
  const [step, setStep] = useState<Step>('welcome');
  const [dir, setDir] = useState(1);
  const [isSignIn, setIsSignIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [doshaAnswers, setDoshaAnswers] = useState<Record<string, 'vata' | 'pitta' | 'kapha'>>({});
  const [doshaStep, setDoshaStep] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [dosha, setDosha] = useState<DoshaType>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useApp();
  const navigate = useNavigate();

  const go = (next: Step) => {
    const cur = STEP_ORDER.indexOf(step);
    const nxt = STEP_ORDER.indexOf(next);
    setDir(nxt > cur ? 1 : -1);
    setError('');
    setStep(next);
  };

  const handleGoogleSignIn = async () => {
    if (!FIREBASE_CONFIGURED) {
      login({ id: 'demo-' + Date.now(), name: 'Demo User', phone: '', email: 'demo@vaidya.com', dosha: 'vata' });
      navigate('/home');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const fbUser = await signInWithGoogle();
      const profile = await getProfile(fbUser.uid);
      if (profile?.dosha) {
        login({ id: fbUser.uid, name: profile.name ?? fbUser.displayName ?? '', phone: profile.phone ?? '', email: fbUser.email ?? '', dosha: profile.dosha });
        navigate('/home');
      } else {
        login({ id: fbUser.uid, name: fbUser.displayName ?? '', phone: '', email: fbUser.email ?? '', dosha: 'vata' });
        setName(fbUser.displayName ?? '');
        go('name');
      }
    } catch (e: any) {
      setError(e.message ?? 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!email.trim() || !password) return;
    setLoading(true);
    setError('');
    try {
      if (!FIREBASE_CONFIGURED) {
        login({ id: 'demo-' + Date.now(), name: email.split('@')[0], phone: '', email, dosha: 'vata' });
        go('name');
        return;
      }
      const fbUser = isSignIn
        ? await signInWithEmail(email, password)
        : await signUpWithEmail(email, password);
      const profile = await getProfile(fbUser.uid);
      if (isSignIn && profile?.dosha) {
        login({ id: fbUser.uid, name: profile.name ?? '', phone: profile.phone ?? '', email: fbUser.email ?? '', dosha: profile.dosha });
        navigate('/home');
      } else {
        login({ id: fbUser.uid, name: profile?.name ?? email.split('@')[0], phone: '', email: fbUser.email ?? '', dosha: 'vata' });
        go('name');
      }
    } catch (e: any) {
      const msg = e.code === 'auth/email-already-in-use' ? 'Account already exists. Sign in instead.'
        : e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password' ? 'Incorrect email or password.'
        : e.code === 'auth/weak-password' ? 'Password must be at least 6 characters.'
        : e.message ?? 'Authentication failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDoshaNext = async () => {
    if (!selectedOpt) return;
    const q = doshaQuestions[doshaStep];
    const newAnswers = { ...doshaAnswers, [q.id]: selectedOpt as 'vata' | 'pitta' | 'kapha' };
    setDoshaAnswers(newAnswers);
    setSelectedOpt(null);
    if (doshaStep + 1 < doshaQuestions.length) {
      setDoshaStep(s => s + 1);
    } else {
      const scores = { vata: 0, pitta: 0, kapha: 0 };
      Object.values(newAnswers).forEach(d => { scores[d]++; });
      const result = (Object.keys(scores) as Array<'vata' | 'pitta' | 'kapha'>).reduce((a, b) =>
        scores[a] >= scores[b] ? a : b
      );
      setDosha(result);
      setLoading(true);
      try {
        const stored = JSON.parse(sessionStorage.getItem('vaidya_user') || 'null');
        const uid = stored?.id;
        if (uid && FIREBASE_CONFIGURED) {
          await upsertProfile(uid, { name, dosha: result, role: 'patient' });
        }
        login({ ...(stored ?? { id: 'demo-' + Date.now(), phone: '', email: '' }), name, dosha: result });
      } catch {
        // profile save failed — user is still logged in locally
      } finally {
        setLoading(false);
        go('done');
      }
    }
  };

  const progress = (STEP_ORDER.indexOf(step) / (STEP_ORDER.length - 1)) * 100;
  const doshaInfo = (dosha === 'vata' || dosha === 'pitta' || dosha === 'kapha') ? doshaDescriptions[dosha] : null;

  return (
    <div className="min-h-screen bg-warm flex flex-col">
      {step !== 'welcome' && step !== 'done' && (
        <div className="w-full px-4 pt-5 pb-2 max-w-sm mx-auto">
          <div className="flex items-center gap-3">
            {step !== 'auth' && (
              <button onClick={() => go(STEP_ORDER[STEP_ORDER.indexOf(step) - 1])}
                className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="flex-1 h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }}
                className="h-full bg-saffron-500 rounded-full" />
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step + (step === 'dosha' ? doshaStep : '')}
              custom={dir}
              variants={{ enter: d => ({ opacity: 0, x: d * 40 }), center: { opacity: 1, x: 0 }, exit: d => ({ opacity: 0, x: d * -40 }) }}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >

              {/* ── WELCOME ── */}
              {step === 'welcome' && (
                <div className="text-center">
                  <div className="w-20 h-20 bg-saffron-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <Leaf className="w-10 h-10 text-white" />
                  </div>
                  <h1 className="font-display text-4xl font-bold text-stone-800 mb-3">Welcome to Vaidya</h1>
                  <p className="text-stone-500 leading-relaxed mb-8">
                    Your personalised Ayurvedic care companion. Connect with certified Vaidyas, discover your dosha, and heal holistically.
                  </p>
                  <button onClick={() => go('auth')} className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base">
                    Get Started <ArrowRight className="w-5 h-5" />
                  </button>
                  <p className="text-xs text-stone-400 mt-4">By continuing you agree to our Terms &amp; Privacy Policy</p>
                </div>
              )}

              {/* ── AUTH ── */}
              {step === 'auth' && (
                <div>
                  <div className="w-14 h-14 bg-saffron-100 rounded-2xl flex items-center justify-center mb-6">
                    <Mail className="w-7 h-7 text-saffron-600" />
                  </div>
                  <h2 className="font-display text-3xl font-bold text-stone-800 mb-1">
                    {isSignIn ? 'Welcome back' : 'Create account'}
                  </h2>
                  <p className="text-stone-500 text-sm mb-6">
                    {isSignIn ? 'Sign in to continue your healing journey' : 'Join thousands on their Ayurvedic journey'}
                  </p>

                  {/* Google */}
                  <button onClick={handleGoogleSignIn} disabled={loading}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-2xl border-2 border-stone-200 hover:border-stone-300 bg-white text-stone-700 font-medium text-sm transition-all mb-4 disabled:opacity-50">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </button>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 h-px bg-stone-200" />
                    <span className="text-xs text-stone-400">or</span>
                    <div className="flex-1 h-px bg-stone-200" />
                  </div>

                  {/* Email */}
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full px-4 py-3.5 rounded-2xl border-2 border-stone-200 focus:border-saffron-400 text-stone-800 focus:outline-none mb-3 bg-white transition-colors"
                    onKeyDown={e => e.key === 'Enter' && handleEmailAuth()}
                  />
                  <div className="relative mb-4">
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full px-4 py-3.5 rounded-2xl border-2 border-stone-200 focus:border-saffron-400 text-stone-800 focus:outline-none bg-white transition-colors pr-12"
                      onKeyDown={e => e.key === 'Enter' && handleEmailAuth()}
                    />
                    <button type="button" onClick={() => setShowPassword(v => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                  <button onClick={handleEmailAuth} disabled={!email.trim() || !password || loading}
                    className="btn-primary w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mb-4">
                    {loading
                      ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      : <>{isSignIn ? 'Sign In' : 'Create Account'} <ArrowRight className="w-5 h-5" /></>
                    }
                  </button>

                  <p className="text-center text-sm text-stone-500">
                    {isSignIn ? "Don't have an account? " : 'Already have an account? '}
                    <button onClick={() => { setIsSignIn(v => !v); setError(''); }}
                      className="text-saffron-600 font-medium hover:underline">
                      {isSignIn ? 'Sign up' : 'Sign in'}
                    </button>
                  </p>
                </div>
              )}

              {/* ── NAME ── */}
              {step === 'name' && (
                <div>
                  <div className="text-4xl mb-6">👋</div>
                  <h2 className="font-display text-3xl font-bold text-stone-800 mb-2">What's your name?</h2>
                  <p className="text-stone-500 text-sm mb-8">Your Vaidya will use this to personalise your care</p>
                  <input type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="Arun Sharma"
                    className="w-full px-5 py-4 rounded-2xl border-2 border-stone-200 focus:border-saffron-400 text-lg font-medium text-stone-800 focus:outline-none mb-6 bg-white transition-colors"
                    autoFocus onKeyDown={e => e.key === 'Enter' && name.trim() && go('dosha')}
                  />
                  <button onClick={() => go('dosha')} disabled={!name.trim()}
                    className="btn-primary w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    Continue <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* ── DOSHA QUIZ ── */}
              {step === 'dosha' && (
                <div>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 border-4 border-saffron-200 border-t-saffron-500 rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-stone-500 text-sm">Analysing your Prakriti…</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">{doshaQuestions[doshaStep].category}</span>
                        <span className="text-xs text-stone-400">{doshaStep + 1} / {doshaQuestions.length}</span>
                      </div>
                      <div className="h-1 bg-stone-200 rounded-full mb-5">
                        <motion.div animate={{ width: `${((doshaStep + 1) / doshaQuestions.length) * 100}%` }}
                          className="h-full bg-saffron-400 rounded-full" />
                      </div>
                      {doshaStep === 0 && (
                        <div className="mb-5">
                          <p className="text-saffron-600 text-sm font-medium mb-1">One more step, {name}!</p>
                          <h2 className="font-display text-2xl font-bold text-stone-800">Discover your Dosha</h2>
                          <p className="text-stone-500 text-xs mt-1">8 quick questions to personalise your experience</p>
                        </div>
                      )}
                      <h2 className="font-display text-xl font-bold text-stone-800 mb-5 leading-snug">
                        {doshaQuestions[doshaStep].question}
                      </h2>
                      <div className="space-y-3 mb-6">
                        {doshaQuestions[doshaStep].options.map((opt, i) => (
                          <button key={i} onClick={() => setSelectedOpt(opt.dosha)}
                            className={`w-full text-left px-4 py-3.5 rounded-2xl border-2 text-sm transition-all ${
                              selectedOpt === opt.dosha
                                ? 'border-saffron-400 bg-saffron-50 text-saffron-700 font-medium'
                                : 'border-stone-200 text-stone-600 hover:border-stone-300 bg-white'
                            }`}>
                            {opt.text}
                          </button>
                        ))}
                      </div>
                      <button onClick={handleDoshaNext} disabled={!selectedOpt}
                        className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        {doshaStep === doshaQuestions.length - 1 ? 'See My Dosha' : 'Next'}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* ── DONE ── */}
              {step === 'done' && doshaInfo && (
                <div className="text-center">
                  <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className={`w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 text-5xl shadow-xl ${
                      dosha === 'vata' ? 'bg-purple-500' : dosha === 'pitta' ? 'bg-orange-400' : 'bg-cyan-500'
                    }`}>
                    {doshaInfo.emoji}
                  </motion.div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-saffron-500" />
                    <span className="text-saffron-600 text-sm font-medium">Your Prakriti revealed!</span>
                  </div>
                  <h2 className="font-display text-3xl font-bold text-stone-800 mb-1">
                    You are <span className={dosha === 'vata' ? 'text-purple-600' : dosha === 'pitta' ? 'text-orange-500' : 'text-cyan-600'}>{doshaInfo.name}</span>
                  </h2>
                  <p className="text-stone-500 text-sm mb-1">{doshaInfo.elements}</p>
                  <p className="text-stone-500 text-sm italic mb-6">"{doshaInfo.tagline}"</p>
                  <div className="bg-stone-50 rounded-2xl p-4 mb-6 text-left space-y-2">
                    {doshaInfo.recommendations.slice(0, 3).map(r => (
                      <div key={r} className="flex items-start gap-2 text-sm text-stone-600">
                        <CheckCircle2 className="w-4 h-4 text-herbal-500 shrink-0 mt-0.5" />
                        {r}
                      </div>
                    ))}
                  </div>
                  <button onClick={() => navigate('/home')}
                    className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-base">
                    Explore Vaidya <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
