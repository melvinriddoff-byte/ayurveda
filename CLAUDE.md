# CLAUDE.md — AyurConnect

## Commands

```bash
npm run dev          # Start dev server (Vite, localhost:5173)
npm run build        # Production build (TypeScript compile + Vite bundle)
npm run preview      # Preview production build locally
npm run lint         # ESLint
npm run typecheck    # Type-check without emitting
```

## Architecture

React 18 + TypeScript SPA built with Vite, styled with Tailwind CSS v3, animated with Framer Motion.
Routing via React Router v7. Backend is Supabase (configured but using mock data for demo).

## Project structure

```
src/
  types/index.ts          — All shared TypeScript types (User, Doctor, Hospital, Appointment, etc.)
  data/mockData.ts        — Mock hospitals, doctors, appointments, dosha quiz questions
  context/AppContext.tsx  — Global auth state (user, patient, login/logout, dosha update)
  components/
    Navbar.tsx            — Sticky top nav with auth state, mobile menu
    Footer.tsx            — Site footer
    DoctorCard.tsx        — Reusable doctor listing card
    HospitalCard.tsx      — Reusable hospital listing card
    AppointmentCard.tsx   — Appointment entry with status, prescription, follow-up
  pages/
    Landing.tsx           — Homepage: hero, features, hospital + doctor listings, CTAs
    Auth.tsx              — Sign-in / sign-up for patient or hospital roles
    DoshaAssessment.tsx   — 8-question dosha quiz with animated results + score bars
    Discover.tsx          — Searchable/filterable doctor + hospital directory
    DoctorProfile.tsx     — Full doctor page with integrated booking panel
    HospitalProfile.tsx   — Hospital page with doctor roster
    PatientDashboard.tsx  — Patient: appointments, follow-ups, dosha badge, quick actions
    HospitalRegister.tsx  — 3-step hospital onboarding form
    HospitalDashboard.tsx — Hospital: stats, doctor management, booking table
```

## Design system

Design tokens in `tailwind.config.js`:
- `saffron-*` — primary brand colour (orange/amber)
- `earth-*`   — secondary warm brown
- `herbal-*`  — accent green
- `vata`/`pitta`/`kapha` — dosha-specific accent colours

Utility classes defined in `src/index.css`:
- `.btn-primary`, `.btn-secondary`, `.btn-ghost` — button variants
- `.card` — rounded card with subtle shadow
- `.section-heading` — Playfair Display heading style
- `.text-gradient` — saffron→earth gradient text
- `.bg-warm` — warm off-white gradient background
- `.font-display` / `.font-body` — Playfair Display / Inter

Fonts: Playfair Display (headings) + Inter (body) loaded via Google Fonts in `index.html`.

## Routing

| Path | Component | Notes |
|------|-----------|-------|
| `/` | Landing | Public marketing page |
| `/auth` | Auth | Patient + hospital sign-in/up |
| `/dosha-assessment` | DoshaAssessment | Intro → 8 questions → results |
| `/discover` | Discover | Doctor/hospital search + filter |
| `/doctor/:id` | DoctorProfile | Profile + booking panel |
| `/hospital/:id` | HospitalProfile | Hospital info + doctor roster |
| `/hospital/register` | HospitalRegister | 3-step onboarding |
| `/hospital/dashboard` | HospitalDashboard | Protected (role: hospital) |
| `/patient/dashboard` | PatientDashboard | Protected (role: patient) |

## Auth & State

`AppContext` holds `user`, `patient`, `isAuthenticated`. Demo mode: clicking Sign In logs in with
`MOCK_PATIENT_USER` / `MOCK_PATIENT`. No real Supabase auth wired; swap `login()` implementation to
call `supabase.auth.signInWithPassword()` when ready.

## Supabase integration

`@supabase/supabase-js` is installed. To wire up:
1. Create a `.env.local` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
2. Create `src/lib/supabase.ts`: `export const supabase = createClient(url, key)`
3. Replace mock data calls in pages with Supabase queries
4. Wire `AppContext.login/logout` to `supabase.auth` methods

## Key conventions

- All page components are in `src/pages/`, shared UI in `src/components/`
- Types flow from `src/types/index.ts` — always import from there
- Mock data in `src/data/mockData.ts` is the source of truth until Supabase is wired
- Framer Motion: use `whileInView + viewport={{ once: true }}` for scroll animations
- Never import `App.css` — it has been removed; all styles go in `index.css` or inline Tailwind
