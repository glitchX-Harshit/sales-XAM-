import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Cursor from './components/Cursor';
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

gsap.registerPlugin(ScrollTrigger);

// Temporary placeholder for the upcoming sections
const SectionPlaceholder = ({ title, id }) => (
  <section id={id} className="container" style={{ padding: '15vh 0', borderBottom: '1px solid var(--color-border)', textAlign: 'center' }}>
    <h2 className="font-serif" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{title}</h2>
    <p style={{ color: 'var(--color-gray)' }}>Section details to be implemented.</p>
  </section>
);

function App() {

  useEffect(() => {
    // Basic smooth scroll setup or any global GSAP config
  }, []);

  return (
    <>
      <Cursor />

      <main>
        <Navbar />

        {/* 1. Hero Section */}
        <Hero />

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
