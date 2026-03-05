import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Ear, MessageSquareShare, Zap, Shield, Video } from 'lucide-react';
import './Features.css';

gsap.registerPlugin(ScrollTrigger);

const Features = () => {
    const sectionRef = useRef(null);
    const cardsRef = useRef([]);
    cardsRef.current = [];

    const addToRefs = (el) => {
        if (el && !cardsRef.current.includes(el)) {
            cardsRef.current.push(el);
        }
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(cardsRef.current,
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 75%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="features-section" ref={sectionRef} id="features">
            <div className="container">
                <h2 className="section-title text-center">
                    Listen. Detect. <span className="text-orange">Close.</span>
                </h2>

                <p className="section-subtitle text-center">
                    Everything you need to eliminate hesitation and handle objections instantly.
                </p>

                <div className="bento-grid">
                    <div className="bento-card span-2 interactive bg-black dark-text" ref={addToRefs}>
                        <div className="bento-content">
                            <div className="feature-icon bg-orange">
                                <Ear size={24} color="#fff" />
                            </div>
                            <h3>Detect Objections 4x Faster</h3>
                            <p>Monitors prospect tonality and keywords instantly to spot hesitations before they fully articulate them. Stop them before they derail the deal.</p>
                        </div>
                        <div className="bento-visual visual-pulse">
                            <div className="pulse-ring"></div>
                            <span>"I need to think about it..."</span>
                        </div>
                    </div>

                    <div className="bento-card interactive" ref={addToRefs}>
                        <div className="feature-icon bg-black">
                            <Zap size={24} color="#fff" />
                        </div>
                        <h3>Handle Pressure</h3>
                        <p>Reduces cognitive load so you stay present and confident.</p>
                    </div>

                    <div className="bento-card interactive" ref={addToRefs}>
                        <div className="feature-icon bg-black">
                            <Shield size={24} color="#fff" />
                        </div>
                        <h3>Battle-Tested</h3>
                        <p>Over 10,000+ winning scripts baked right into the AI.</p>
                    </div>

                    <div className="bento-card span-2 interactive align-center" ref={addToRefs}>
                        <div className="bento-content" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                            <div className="feature-icon bg-orange" style={{ margin: '0 auto 1.5rem' }}>
                                <Video size={24} color="#fff" />
                            </div>
                            <h3>Works where you work</h3>
                            <p>Seamless integration with Zoom, Google Meet, and Microsoft Teams. No plugins, no hassle. Just speak and close.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
