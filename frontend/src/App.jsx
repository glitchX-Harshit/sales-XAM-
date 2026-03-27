import { useState } from 'react';
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

function App() {
    const [view, setView] = useState('landing'); // 'landing' | 'dashboard' | 'signup' | 'login'

    const navigateTo = (v) => {
        setView(v)
        window.scrollTo(0, 0);
        if (v === 'landing') {
            document.body.style.overflow = '';
        } else {
            document.body.style.overflow = 'hidden';
        }
    };

    return (
        <div className="app-root">
            {/* DASHBOARD VIEW */}
            {view === 'dashboard' && (
                <Dashboard onExit={() => navigateTo('landing')} />
            )}

            {/* SIGNUP VIEW */}
            {view === 'signup' && (
                <Signup 
                    onBack={() => navigateTo('landing')} 
                    onGetStarted={() => navigateTo('dashboard')} 
                    onLogin={() => navigateTo('login')}
                />
            )}

            {/* LOGIN VIEW */}
            {view === 'login' && (
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

                <Hero onGetStarted={() => navigateTo('dashboard')} />
                <Features />
                <HowItWorks />
                <Integrations />
                <ObjectionHandling />
                <ResponseSuggestion />
                <UseCases />
                <Testimonials />
                <Pricing />
                <Footer />
            </main>
        </div>
    );
}

export default App;
