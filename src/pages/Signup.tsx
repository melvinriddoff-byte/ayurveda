import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, ArrowRight, ArrowLeft, Phone, CheckCircle2, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { doshaQuestions, doshaDescriptions } from '../data/mockData';
import type { DoshaType } from '../types';
import { sendOtp, verifyOtp } from '../lib/services/auth';
import { upsertProfile } from '../lib/services/profiles';
import { supabase, SUPABASE_CONFIGURED } from '../lib/supabase';

type Step = 'welcome' | 'phone' | 'otp' | 'name' | 'dosha' | 'done';

const STEP_ORDER: Step[] = ['welcome', 'phone', 'otp', 'name', 'dosha', 'done'];


export default function Signup() {
  const [step, setStep] = useState<Step>('welcome');
  const [dir, setDir] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [name, setName] = useState('');
  const [doshaAnswers, setDoshaAnswers] = useState<Record<string, 'vata' | 'pitta' | 'kapha'>>({});
  const [doshaStep, setDoshaStep] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [dosha, setDosha] = useState<DoshaType>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { login } = useApp();
  const navigate = useNavigate();

  const go = (next: Step) => {
    const cur = STEP_ORDER.indexOf(step);
    const nxt = STEP_ORDER.indexOf(next);
    setDir(nxt > cur ? 1 : -1);
    setError('');
    setStep(next);
  };

  const handleSendOtp = async () => {
    if (phone.length !== 10) return;
    setLoading(true);
    setError('');
    try {
      await sendOtp(`+91${phone}`);
      go('otp');
    } catch (e: any) {
      setError(e.message ?? 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.some(d => !d)) return;
    setLoading(true);
    setError('');
    try {
      await verifyOtp(`+91${phone}`, otp.join(''));
      go('name');
    } catch (e: any) {
      setError(e.message ?? 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // OTP auto-focus
  useEffect(() => {
    if (step === 'otp') otpRefs.current[0]?.focus();
  }, [step]);

  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const computeDosha = (): 'vata' | 'pitta' | 'kapha' => {
    const scores = { vata: 0, pitta: 0, kapha: 0 };
    Object.values(doshaAnswers).forEach(d => { scores[d]++; });
    return (Object.keys(scores) as Array<'vata' | 'pitta' | 'kapha'>).reduce((a, b) =>
      scores[a] >= scores[b] ? a : b
    );
  };

  const handleDoshaNext = async () => {
    if (selectedOpt) {
      const q = doshaQuestions[doshaStep];
      setDoshaAnswers(prev => ({ ...prev, [q.id]: selectedOpt as 'vata' | 'pitta' | 'kapha' }));
      setSelectedOpt(null);
      if (doshaStep + 1 < doshaQuestions.length) {
        setDoshaStep(s => s + 1);
      } else {
        const result = computeDosha();
        setDosha(result);
        setLoading(true);
        try {
          if (SUPABASE_CONFIGURED) {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (authUser) {
              const profile = await upsertProfile(authUser.id, { name, phone: `+91${phone}`, dosha: result, role: 'patient' });
              login({ id: authUser.id, name: profile?.name ?? name, phone: `+91${phone}`, dosha: result });
            } else {
              login({ id: 'u-' + Date.now(), name, phone: `+91${phone}`, dosha: result });
            }
          } else {
            login({ id: 'demo-' + Date.now(), name, phone: `+91${phone}`, dosha: result });
          }
        } catch {
          login({ id: 'demo-' + Date.now(), name, phone: `+91${phone}`, dosha: result });
        } finally {
          setLoading(false);
          go('done');
        }
      }
    }
  };

  const progress = (STEP_ORDER.indexOf(step) / (STEP_ORDER.length - 1)) * 100;
  const doshaInfo = (dosha === 'vata' || dosha === 'pitta' || dosha === 'kapha') ? doshaDescriptions[dosha] : null;

  return (
    <div className="min-h-screen bg-warm flex flex-col">
      {/* Top bar */}
      {step !== 'welcome' && step !== 'done' && (
        <div className="w-full px-4 pt-5 pb-2 max-w-sm mx-auto">
          <div className="flex items-center gap-3">
            {step !== 'phone' && (
              <button
                onClick={() => go(STEP_ORDER[STEP_ORDER.indexOf(step) - 1])}
                className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="flex-1 h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
                className="h-full bg-saffron-500 rounded-full"
              />
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
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >

              {/* ── WELCOME ── */}
              {step === 'welcome' && (
                <div className="text-center">
                  <div className="w-20 h-20 bg-saffron-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <Leaf className="w-10 h-10 text-white" />
                  </div>
                  <h1 className="font-display text-4xl font-bold text-stone-800 mb-3">
                    Welcome to Vaidya
                  </h1>
                  <p className="text-stone-500 leading-relaxed mb-8">
                    Your personalised Ayurvedic care companion. Connect with certified Vaidyas, discover your dosha, and heal holistically.
                  </p>
                  <button onClick={() => go('phone')} className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base">
                    Get Started <ArrowRight className="w-5 h-5" />
                  </button>
                  <p className="text-xs text-stone-400 mt-4">By continuing you agree to our Terms &amp; Privacy Policy</p>
                </div>
              )}

              {/* ── PHONE ── */}
              {step === 'phone' && (
                <div>
                  <div className="w-14 h-14 bg-saffron-100 rounded-2xl flex items-center justify-center mb-6">
                    <Phone className="w-7 h-7 text-saffron-600" />
                  </div>
                  <h2 className="font-display text-3xl font-bold text-stone-800 mb-2">Enter your number</h2>
                  <p className="text-stone-500 text-sm mb-8">We'll send a one-time code to verify your phone</p>
                  <div className="flex items-center border-2 border-stone-200 focus-within:border-saffron-400 rounded-2xl overflow-hidden transition-colors bg-white mb-6">
                    <span className="px-4 py-4 text-stone-500 font-medium text-sm border-r border-stone-200 bg-stone-50">+91</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="98765 43210"
                      className="flex-1 px-4 py-4 text-lg font-medium text-stone-800 focus:outline-none bg-white tracking-widest"
                      autoFocus
                      onKeyDown={e => e.key === 'Enter' && phone.length === 10 && handleSendOtp()}
                    />
                  </div>
                  {!SUPABASE_CONFIGURED && (
                    <p className="text-xs text-stone-400 mb-3">Demo mode — no real SMS will be sent</p>
                  )}
                  {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                  <button
                    onClick={handleSendOtp}
                    disabled={phone.length !== 10 || loading}
                    className="btn-primary w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Send OTP <ArrowRight className="w-5 h-5" /></>}
                  </button>
                </div>
              )}

              {/* ── OTP ── */}
              {step === 'otp' && (
                <div>
                  <div className="w-14 h-14 bg-saffron-100 rounded-2xl flex items-center justify-center mb-6">
                    <span className="text-2xl">🔐</span>
                  </div>
                  <h2 className="font-display text-3xl font-bold text-stone-800 mb-2">Verify your number</h2>
                  <p className="text-stone-500 text-sm mb-2">
                    {SUPABASE_CONFIGURED ? `OTP sent to +91 ${phone}` : `Demo mode — enter any 6 digits`}
                  </p>
                  {!SUPABASE_CONFIGURED && (
                    <div className="bg-saffron-50 border border-saffron-200 rounded-xl px-3 py-2 mb-4 text-xs text-saffron-700">
                      Supabase not configured. Any 6-digit code will work.
                    </div>
                  )}

                  <div className="flex gap-3 justify-center mb-8">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={el => { otpRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(i, e.target.value)}
                        onKeyDown={e => handleOtpKey(i, e)}
                        className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all focus:outline-none ${
                          digit ? 'border-saffron-400 bg-saffron-50 text-saffron-700' : 'border-stone-200 text-stone-800 focus:border-saffron-400'
                        }`}
                      />
                    ))}
                  </div>

                  {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                  <button
                    onClick={handleVerifyOtp}
                    disabled={otp.some(d => !d) || loading}
                    className="btn-primary w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Verify <ArrowRight className="w-5 h-5" /></>}
                  </button>
                  <button onClick={() => {}} className="w-full text-center text-sm text-stone-400 hover:text-saffron-600 mt-4 transition-colors">
                    Resend OTP
                  </button>
                </div>
              )}

              {/* ── NAME ── */}
              {step === 'name' && (
                <div>
                  <div className="text-4xl mb-6">👋</div>
                  <h2 className="font-display text-3xl font-bold text-stone-800 mb-2">What's your name?</h2>
                  <p className="text-stone-500 text-sm mb-8">Your Vaidya will use this to personalise your care</p>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Arun Sharma"
                    className="w-full px-5 py-4 rounded-2xl border-2 border-stone-200 focus:border-saffron-400 text-lg font-medium text-stone-800 focus:outline-none mb-6 bg-white transition-colors"
                    autoFocus
                    onKeyDown={e => e.key === 'Enter' && name.trim() && go('dosha')}
                  />
                  <button
                    onClick={() => go('dosha')}
                    disabled={!name.trim()}
                    className="btn-primary w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
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
                        <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">
                          {doshaQuestions[doshaStep].category}
                        </span>
                        <span className="text-xs text-stone-400">{doshaStep + 1} / {doshaQuestions.length}</span>
                      </div>
                      <div className="h-1 bg-stone-200 rounded-full mb-5">
                        <motion.div
                          animate={{ width: `${((doshaStep + 1) / doshaQuestions.length) * 100}%` }}
                          className="h-full bg-saffron-400 rounded-full"
                        />
                      </div>

                      {doshaStep === 0 && (
                        <div className="mb-5">
                          <p className="text-saffron-600 text-sm font-medium mb-1">One more step, {name}!</p>
                          <h2 className="font-display text-2xl font-bold text-stone-800">Discover your Dosha</h2>
                          <p className="text-stone-500 text-xs mt-1">8 quick questions to personalise your experience</p>
                        </div>
                      )}

                      {doshaStep > 0 && (
                        <h2 className="font-display text-xl font-bold text-stone-800 mb-5 leading-snug">
                          {doshaQuestions[doshaStep].question}
                        </h2>
                      )}
                      {doshaStep === 0 && (
                        <h2 className="font-display text-lg font-bold text-stone-800 mb-5 leading-snug">
                          {doshaQuestions[0].question}
                        </h2>
                      )}

                      <div className="space-y-3 mb-6">
                        {doshaQuestions[doshaStep].options.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedOpt(opt.dosha)}
                            className={`w-full text-left px-4 py-3.5 rounded-2xl border-2 text-sm transition-all ${
                              selectedOpt === opt.dosha
                                ? 'border-saffron-400 bg-saffron-50 text-saffron-700 font-medium'
                                : 'border-stone-200 text-stone-600 hover:border-stone-300 bg-white'
                            }`}
                          >
                            {opt.text}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={handleDoshaNext}
                        disabled={!selectedOpt}
                        className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
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
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className={`w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 text-5xl shadow-xl ${
                      dosha === 'vata' ? 'bg-purple-500' :
                      dosha === 'pitta' ? 'bg-orange-400' :
                      'bg-cyan-500'
                    }`}
                  >
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

                  <button
                    onClick={() => navigate('/home')}
                    className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-base"
                  >
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
