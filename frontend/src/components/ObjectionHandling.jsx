import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldAlert, AlertCircle, XCircle } from 'lucide-react';
import './ObjectionHandling.css';

const ObjectionHandling = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        // ... existing GSAP logic ...
        const ctx = gsap.context(() => {
            // Title reveal
            gsap.fromTo('.obj-title-wrapper > *',
                { y: 50, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 75%'
                    }
                }
            );

            // Card stack animation - crazy scroll parallax
            const cards = gsap.utils.toArray('.obj-card');

            cards.forEach((card, index) => {
                gsap.fromTo(card,
                    {
                        y: 150 + (index * 50),
                        opacity: 0,
                        rotationX: 45,
                        scale: 0.8
                    },
                    {
                        y: 0,
                        opacity: 1,
                        rotationX: 0,
                        scale: 1,
                        duration: 1.2,
                        ease: 'back.out(1.2)',
                        scrollTrigger: {
                            trigger: '.obj-interactive-area',
                            start: 'top 80%',
                            end: 'center 40%',
                            scrub: 1
                        }
                    }
                );
            });

            // Background pulse
            gsap.to('.obj-bg-glow', {
                scale: 1.5,
                opacity: 0.8,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="container obj-section" id="objections" ref={sectionRef}>
            <div className="obj-title-wrapper">
                <h2 className="obj-title">
                    <span className="font-serif">Detect Objections</span><br />
                    Before they derail the deal.
                </h2>
                <p className="obj-desc">
                    klyro.ai listens for subtle hesitation, pricing concerns, or competitive mentions, instantly flagging them so you know exactly what you're up against.
                </p>
            </div>

            <div className="obj-interactive-area">
                <div className="obj-bg-glow"></div>

                {/* ── Scribble SVG overlay ── */}
                <svg className="obj-scrib-svg" viewBox="0 0 700 520" fill="none" aria-hidden="true">
                    {/* Wavy underline near top card */}
                    <path d="M 160 95 C 210 89 290 100 370 93 C 430 88 490 98 540 92"
                        stroke="#ff5e00" strokeWidth="2.2" strokeLinecap="round" />

                    {/* Curved arrow pointing → second card */}
                    <path d="M 620 195 C 648 210 660 235 645 258"
                        stroke="#111" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M 645 258 L 633 248 M 645 258 L 655 250"
                        stroke="#111" strokeWidth="1.8" strokeLinecap="round" />

                    {/* Dashed circle around last card */}
                    <ellipse cx="350" cy="420" rx="200" ry="38"
                        stroke="#ff3d71" strokeWidth="1.6"
                        strokeDasharray="7 5" fill="none"
                        style={{ transform: 'rotate(-1.5deg)', transformOrigin: '350px 420px' }} />

                    {/* Small tick arrow near first label */}
                    <path d="M 148 68 C 140 55 148 42 160 38"
                        stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M 160 38 L 150 42 M 160 38 L 162 50"
                        stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" strokeLinecap="round" />

                    {/* Squiggle accent between card 2 and 3 */}
                    <path d="M 160 330 C 190 323 220 335 250 327 C 280 319 310 332 340 325"
                        stroke="rgba(0,0,0,0.12)" strokeWidth="1.4" strokeLinecap="round" />
                </svg>

                {/* Annotation labels */}
                <span className="obj-scrib-label" style={{ top: '10%', left: '19%', transform: 'rotate(-4deg)' }}>
                    klyro.ai hears this ↓
                </span>
                <span className="obj-scrib-label" style={{ top: '38%', right: '4%', transform: 'rotate(3deg)', color: '#ff5e00' }}>
                    instantly ↙
                </span>
                <span className="obj-scrib-label" style={{ bottom: '14%', left: '24%', transform: 'rotate(-2deg)', color: '#ff3d71' }}>
                    the hardest one →
                </span>

                <div className="obj-cards-container">
                    <div className="obj-card warning">
                        <div className="obj-card-header">
                            <ShieldAlert size={20} /> Pricing Concern Detected
                        </div>
                        <p>"It seems a bit expensive for our current Q3 budget..."</p>
                    </div>

                    <div className="obj-card danger">
                        <div className="obj-card-header">
                            <AlertCircle size={20} /> Competitor Mentioned
                        </div>
                        <p>"We've also been looking at Salesforce to do this."</p>
                    </div>

                    <div className="obj-card error">
                        <div className="obj-card-header">
                            <XCircle size={20} /> Timeline Objection
                        </div>
                        <p>"I don't think my team has the bandwidth to implement this right now."</p>
                    </div>
                </div>
            </div>

        </section>
    );
};

export default ObjectionHandling;
