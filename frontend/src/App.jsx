import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Cursor from './components/Cursor';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Integrations from './components/Integrations';
import ObjectionHandling from './components/ObjectionHandling';
import ResponseSuggestion from './components/ResponseSuggestion';
import UseCases from './components/UseCases';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import Signup from './components/Signup';
import Login from './components/Login';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [loaded, setLoaded] = useState(false);
    const [view, setView] = useState('landing'); // 'landing' | 'dashboard' | 'signup' | 'login'

    const navigateTo = (v) => {
        setView(v);
        if (v === 'landing') {
            document.body.style.overflow = '';
            setTimeout(() => ScrollTrigger.refresh(), 100);
        } else {
            document.body.style.overflow = 'hidden';
            // Wait for scroll to lock to top if moving to standalone full pages like dashboard or signup
            window.scrollTo(0, 0);
        }
    };

  useEffect(() => {
    // Prevent scroll while loading
    if (!loaded) document.body.style.overflow = 'hidden';
    else {
      document.body.style.overflow = '';
      // Recalculate all scroll positions after loader exit
      ScrollTrigger.refresh();
    }
  }, [loaded]);

  return (
    <>
      <Cursor />
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}

      {/* DASHBOARD VIEW */}
      {view === 'dashboard' && loaded && (
        <Dashboard onExit={() => navigateTo('landing')} />
      )}

      {/* SIGNUP VIEW */}
      {view === 'signup' && loaded && (
        <Signup 
            onBack={() => navigateTo('landing')} 
            onGetStarted={() => navigateTo('dashboard')} 
            onLogin={() => navigateTo('login')}
        />
      )}

      {/* LOGIN VIEW */}
      {view === 'login' && loaded && (
        <Login 
            onBack={() => navigateTo('landing')} 
            onGetStarted={() => navigateTo('dashboard')} 
            onSignup={() => navigateTo('signup')}
        />
      )}

      {/* LANDING VIEW */}
      <main style={{ display: (view === 'dashboard' || view === 'signup' || view === 'login') ? 'none' : 'block' }}>
        <Navbar 
            onGetStarted={() => navigateTo('dashboard')} 
            onSignup={() => navigateTo('signup')}
            onLogin={() => navigateTo('login')}
        />

        {/* 1. Hero Section */}
        <Hero onGetStarted={() => navigateTo('dashboard')} />

        {/* 2. Features / "4x Faster" Section (Reusing our bento grid for now) */}
        <Features />

        {/* 3. How it Works */}
        <HowItWorks />

        {/* 4. Integrations */}
        <Integrations />

        {/* 5. Objection Handling */}
        <ObjectionHandling />

        {/* 6. Response Suggestion */}
        <ResponseSuggestion />

        {/* 7. Use Cases */}
        <UseCases />

        {/* 8. Testimonials */}
        <Testimonials />

        {/* 9. Pricing */}
        <Pricing />

        {/* 10. Final Footer */}
        <Footer />
      </main>
    </>
  );
}

export default App;
