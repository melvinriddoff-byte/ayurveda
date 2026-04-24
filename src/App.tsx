import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';

// Signup flow
import Signup from './pages/Signup';

// Core app pages (with bottom nav)
import Home from './pages/Home';
import VaidyaProfile from './pages/VaidyaProfile';
import BookAppointment from './pages/BookAppointment';
import BookingConfirmed from './pages/BookingConfirmed';
import MyAppointments from './pages/MyAppointments';
import VideoConsultation from './pages/VideoConsultation';
import UserProfile from './pages/UserProfile';

// Info pages (with top nav + footer)
import DoshaAssessment from './pages/DoshaAssessment';
import HospitalProfile from './pages/HospitalProfile';
import Doctors from './pages/info/Doctors';
import Specialities from './pages/info/Specialities';
import About from './pages/info/About';
import Contact from './pages/info/Contact';

// App-shell pages (bottom nav routes)
const APP_ROUTES = ['/home', '/vaidya', '/book', '/booking-confirmed', '/appointments', '/consultation', '/profile'];

function isAppRoute(pathname: string) {
  return APP_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'));
}

// Layouts
function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">{children}</main>
      <BottomNav />
    </div>
  );
}

function InfoShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function VideoShell({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  if (pathname === '/consultation') return <VideoShell>{children}</VideoShell>;
  if (isAppRoute(pathname)) return <AppShell>{children}</AppShell>;
  return <InfoShell>{children}</InfoShell>;
}

function AppRoutes() {
  const { isAuthenticated } = useApp();

  return (
    <Layout>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to={isAuthenticated ? '/home' : '/signup'} replace />} />

        {/* Signup flow */}
        <Route path="/signup" element={<Signup />} />

        {/* Core app */}
        <Route path="/home" element={<Home />} />
        <Route path="/vaidya/:id" element={<VaidyaProfile />} />
        <Route path="/book/:id" element={<BookAppointment />} />
        <Route path="/booking-confirmed" element={<BookingConfirmed />} />
        <Route path="/appointments" element={<MyAppointments />} />
        <Route path="/consultation" element={<VideoConsultation />} />
        <Route path="/profile" element={<UserProfile />} />

        {/* Info pages */}
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/specialities" element={<Specialities />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Legacy / shared */}
        <Route path="/dosha-assessment" element={<DoshaAssessment />} />
        <Route path="/hospital/:id" element={<HospitalProfile />} />

        {/* 404 */}
        <Route path="*" element={
          <div className="min-h-screen bg-warm flex items-center justify-center text-center px-4">
            <div>
              <h1 className="font-display text-6xl font-bold text-saffron-300 mb-4">404</h1>
              <p className="text-stone-500 mb-6">Page not found</p>
              <a href="/" className="btn-primary inline-block">Go Home</a>
            </div>
          </div>
        } />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
