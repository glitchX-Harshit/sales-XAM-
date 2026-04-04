import { useEffect, useRef } from 'react';
import { Ear, Zap, Shield, Layers, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Features.css';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
    { value: 4, suffix: '×', label: 'Faster detect' },
    { value: 94, suffix: '%', label: 'Coverage' },
    { value: 22, suffix: '%', label: 'Close rate' },
];

const Features = () => {
    const sectionRef = useRef(null);
    const gridRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.feat-header > *', {
                y: 30,
                opacity: 0,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: '.feat-header',
                    start: 'top 80%',
                }
            });

            gsap.from('.feat-card', {
                y: 50,
                opacity: 0,
                stagger: 0.15,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.feat-bento',
                    start: 'top 75%',
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="features-section" id="features" ref={sectionRef}>
            <div className="container">
                <div className="feat-header">
                    <span className="feat-eyebrow">The Engine</span>
                    <h2 className="feat-title">
                        Everything you need <br />
                        <span className="hero-gradient-text">to close faster.</span>
                    </h2>
                </div>

                <div className="feat-bento" ref={gridRef}>
                    <div className="feat-card span-2 interactive group">
                        <div className="feat-content">
                            <div className="feat-icon-ring"><Ear size={20} /></div>
                            <h3>Real-time Intent Detection</h3>
                            <p>Our proprietary engine listens for subtle acoustic cues and semantic shifts to detect objections before they're even fully voiced.</p>
                        </div>
                        <div className="feat-card-footer">
                            <span className="feat-link">Explore Detection <ArrowRight size={14} /></span>
                        </div>
                    </div>

                    <div className="feat-card interactive group">
                        <div className="feat-icon-ring"><Zap size={20} /></div>
                        <h3>Zero Scramble</h3>
                        <p>Stay calm under pressure. Suggestions appear instantly, giving you the perfect script for any curveball.</p>
                    </div>

                    <div className="feat-card interactive group">
                        <div className="feat-icon-ring"><Shield size={20} /></div>
                        <h3>Winning Playbook</h3>
                        <p>Curated from millions of top-performing calls to ensure you always have the best rebuttal.</p>
                    </div>

                    <div className="feat-card span-2 interactive group">
                        <div className="feat-content">
                            <div className="feat-icon-ring"><Layers size={20} /></div>
                            <h3>Seamless Integration</h3>
                            <p>Connect with your favorite tools in seconds. No complex setup, no browser extensions. It just works where you do.</p>
                        </div>
                        <div className="feat-apps-minimal">
                            {['Zoom', 'Meet', 'Teams', 'CRM'].map(app => (
                                <div className="feat-app-dot" key={app}>
                                    <span className="dot"></span>
                                    {app}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;

