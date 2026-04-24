import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Brain, CheckCircle2 } from 'lucide-react';
import { doshaQuestions, doshaDescriptions } from '../data/mockData';
import { useApp } from '../context/AppContext';
import type { DoshaType } from '../types';

type Scores = { vata: number; pitta: number; kapha: number };

export default function DoshaAssessment() {
  const [step, setStep] = useState(0); // 0 = intro, 1..N = questions, N+1 = result
  const [answers, setAnswers] = useState<Record<string, 'vata' | 'pitta' | 'kapha'>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const { updateDosha, isAuthenticated } = useApp();
  const navigate = useNavigate();

  const totalQuestions = doshaQuestions.length;
  const isIntro = step === 0;
  const isResult = step === totalQuestions + 1;
  const currentQuestion = doshaQuestions[step - 1];

  const computeResult = (): { dominant: 'vata' | 'pitta' | 'kapha'; scores: Scores } => {
    const scores: Scores = { vata: 0, pitta: 0, kapha: 0 };
    Object.values(answers).forEach(d => { scores[d]++; });
    const dominant = (Object.keys(scores) as Array<keyof Scores>).reduce((a, b) =>
      scores[a] >= scores[b] ? a : b
    );
    return { dominant, scores };
  };

  const handleNext = () => {
    if (step > 0 && step <= totalQuestions && !selectedOption) return;
    if (step > 0 && step <= totalQuestions && selectedOption) {
      setAnswers(prev => ({ ...prev, [currentQuestion.id]: selectedOption as 'vata' | 'pitta' | 'kapha' }));
    }
    setSelectedOption(null);
    setStep(s => s + 1);
  };

  const handleBack = () => {
    setSelectedOption(null);
    setStep(s => Math.max(0, s - 1));
  };

  const handleSave = () => {
    const { dominant } = computeResult();
    updateDosha(dominant as DoshaType);
    navigate('/discover');
  };

  if (isResult) {
    const { dominant, scores } = computeResult();
    const info = doshaDescriptions[dominant];
    const total = scores.vata + scores.pitta + scores.kapha;

    return (
      <div className="min-h-screen bg-warm py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-xl border border-earth-100 overflow-hidden"
          >
            <div className={`p-8 text-center ${
              dominant === 'vata' ? 'bg-gradient-to-br from-purple-500 to-purple-700' :
              dominant === 'pitta' ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
              'bg-gradient-to-br from-cyan-500 to-cyan-700'
            }`}>
              <div className="text-6xl mb-3">{info.emoji}</div>
              <h1 className="font-display text-4xl font-bold text-white">You are {info.name}</h1>
              <p className="mt-2 text-white/80 italic text-lg">"{info.tagline}"</p>
              <p className="mt-1.5 text-white/60 text-sm">{info.elements} · Dominant Dosha</p>
            </div>

            <div className="p-8">
              <p className="text-stone-600 leading-relaxed text-center mb-8">{info.description}</p>

              {/* Score bars */}
              <div className="space-y-4 mb-8">
                {(['vata', 'pitta', 'kapha'] as const).map(d => {
                  const pct = Math.round((scores[d] / total) * 100);
                  const colors = { vata: 'bg-purple-500', pitta: 'bg-orange-400', kapha: 'bg-cyan-500' };
                  return (
                    <div key={d}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium text-stone-700 capitalize">{d}</span>
                        <span className="text-stone-500">{pct}%</span>
                      </div>
                      <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className={`h-full rounded-full ${colors[d]}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recommendations */}
              <div className="bg-stone-50 rounded-2xl p-5 mb-8">
                <h3 className="font-semibold text-stone-800 mb-3">Personalised Recommendations</h3>
                <ul className="space-y-2">
                  {info.recommendations.map(r => (
                    <li key={r} className="flex items-start gap-2 text-sm text-stone-600">
                      <CheckCircle2 className="w-4 h-4 text-herbal-500 shrink-0 mt-0.5" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3">
                <button onClick={handleBack} className="btn-secondary flex-1">
                  Retake Quiz
                </button>
                <button onClick={handleSave} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  Find {info.name} Specialists
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {!isAuthenticated && (
                <p className="text-center text-xs text-stone-400 mt-4">
                  <a href="/auth?tab=signup" className="text-saffron-600 hover:underline">Sign up</a> to save your results and get personalised recommendations
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (isIntro) {
    return (
      <div className="min-h-screen bg-warm flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg w-full text-center"
        >
          <div className="w-20 h-20 bg-saffron-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Brain className="w-10 h-10 text-saffron-500" />
          </div>
          <h1 className="font-display text-4xl font-bold text-stone-800 mb-4">Discover Your Dosha</h1>
          <p className="text-stone-600 leading-relaxed mb-6">
            In Ayurveda, your <strong>Prakriti</strong> (unique constitution) is determined by the balance of three energies — <strong>Vata</strong>, <strong>Pitta</strong>, and <strong>Kapha</strong>. Understanding your dosha helps you choose the right treatments, foods, and lifestyle.
          </p>
          <p className="text-sm text-stone-500 mb-8">
            This short quiz has {totalQuestions} questions and takes about 2 minutes.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {(['vata', 'pitta', 'kapha'] as const).map(d => {
              const info = doshaDescriptions[d];
              const colors = {
                vata: 'bg-purple-50 border-purple-200 text-purple-700',
                pitta: 'bg-orange-50 border-orange-200 text-orange-700',
                kapha: 'bg-cyan-50 border-cyan-200 text-cyan-700',
              };
              return (
                <div key={d} className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${colors[d]} text-sm font-medium`}>
                  <span>{info.emoji}</span>
                  <span>{info.name}</span>
                  <span className="text-xs opacity-70">· {info.elements}</span>
                </div>
              );
            })}
          </div>
          <button onClick={handleNext} className="btn-primary text-base px-8 py-3.5 flex items-center gap-2 mx-auto">
            Begin Assessment
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    );
  }

  // Question screen
  const progress = (step / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-warm flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-stone-500 mb-2">
            <span>Question {step} of {totalQuestions}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
            <motion.div
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
              className="h-full bg-saffron-400 rounded-full"
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-3xl shadow-lg border border-earth-100 p-8"
          >
            <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">
              {currentQuestion.category}
            </span>
            <h2 className="font-display text-2xl font-bold text-stone-800 mt-2 mb-6 leading-snug">
              {currentQuestion.question}
            </h2>

            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedOption(opt.dosha)}
                  className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all text-sm ${
                    selectedOption === opt.dosha
                      ? 'border-saffron-400 bg-saffron-50 text-saffron-700 font-medium'
                      : 'border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  {opt.text}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={handleBack} className="btn-ghost flex items-center gap-1.5">
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!selectedOption}
                className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {step === totalQuestions ? 'See My Results' : 'Next'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
