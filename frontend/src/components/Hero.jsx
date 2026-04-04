import { useEffect, useRef } from 'react';
import { Download, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import './Hero.css';

const Hero = ({ onGetStarted }) => {
    const heroRef = useRef(null);
    const titleRef = useRef(null);
    const cardRef = useRef(null);
    const revealRefs = useRef([]);
    revealRefs.current = [];

    const addToRefs = (el) => {
        if (el && !revealRefs.current.includes(el)) {
            revealRefs.current.push(el);
        }
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Initial reveal
            const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } });
            
            tl.from('.hero-meta-row', { y: 20, opacity: 0, duration: 0.8 }, 0.2)
              .from('.hero-t1', { y: 40, opacity: 0, stagger: 0.1 }, 0.4)
              .from('.hero-t3', { y: 30, opacity: 0 }, 0.6)
              .from('.hero-bottom-bar', { y: 20, opacity: 0 }, 0.8)
              .from(cardRef.current, { x: 100, opacity: 0, scale: 0.9, duration: 1.5 }, 0.5);

            // Floating animation for card
            gsap.to(cardRef.current, {
                y: '+=20',
                duration: 2.5,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true
            });
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="hero" ref={heroRef}>
            <div className="hero-bg">
                <div className="hero-blob"></div>
                <div className="hero-noise"></div>
            </div>

            <div className="container hero-inner">
                <div className="hero-content">
                    <div className="hero-meta-row">
                        <div className="hero-live-tag">
                            <span className="live-dot"></span>
                            AI Listening
                        </div>
                        <div className="hero-tag-divider"></div>
                        <div className="hero-tag-right">Trusted by 2,000+ sales teams</div>
                    </div>

                    <div className="hero-title-group" ref={titleRef}>
                        <h1 className="hero-t1">
                            Close deals. <br />
                            <span className="hero-gradient-text">Under pressure.</span>
                        </h1>
                        <p className="hero-t3">
                            klyro.ai provides real-time AI suggestions and objection handling during live calls. Win every conversation with confidence.
                        </p>
                    </div>

                    <div className="hero-bottom-bar">
                        <div className="hero-cta-group">
                            <button className="btn btn-primary hero-cta-btn interactive" onClick={onGetStarted}>
                                Get Started Free
                                <ChevronRight size={18} />
                            </button>
                        </div>

                        <div className="hero-stats-row">
                            {[
                                { n: '4×', l: 'faster' },
                                { n: '94%', l: 'coverage' },
                                { n: '22%', l: 'lift' },
                            ].map((s, i) => (
                                <div className="hero-stat" key={i}>
                                    <span className="stat-n">{s.n}</span>
                                    <span className="stat-l">{s.l}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="hero-card-wrapper" ref={cardRef}>
                    <div className="hero-card glass shadow-premium">
                        <div className="hero-card-header">
                            <div className="hch-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <span className="hch-title">klyro.ai — Live Analysis</span>
                        </div>

                        <div className="hero-card-body">
                            <div className="hcb-block">
                                <span className="hcb-who">Prospect</span>
                                <p className="hcb-text-prospect">"We love the tool, but the budget is already fixed for Q2."</p>
                            </div>
                            
                            <div className="hcb-live-indicator">
                                <span className="pulse-indicator"></span>
                                AI Suggestion
                            </div>

                            <div className="hcb-response">
                                <p className="hcb-text-ai">
                                    "Understood. Most teams start with our pilot program to show ROI before Q3 planning. Shall I explain how that works?"
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="hero-card-blur"></div>
                </div>
            </div>
        </section>
    );
};

export default Hero;

