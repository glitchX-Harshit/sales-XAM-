import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Download } from 'lucide-react';
import './Hero.css';

const Hero = () => {
    const containerRef = useRef(null);
    const textTitleRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            // Simple fade in for the entire hero content
            tl.fromTo('.hero-content-wrapper > *',
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power3.out', delay: 0.3 }
            );

            // Rotate wavy text
            gsap.to('.wavy-text-track', {
                rotation: 360,
                duration: 30,
                repeat: -1,
                ease: 'linear'
            });

            // Animate bottom wavy text like a marquee
            gsap.fromTo('.scrolling-text',
                { attr: { startOffset: '100%' } },
                { attr: { startOffset: '-100%' }, duration: 25, ease: 'linear', repeat: -1 }
            );

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="hero container" ref={containerRef}>
            {/* Background Wavy Elements resembling Wispr Flow */}
            <div className="wavy-bg-decorator top-left">
                <svg viewBox="0 0 200 200" className="wavy-text-track">
                    <path id="curve1" d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0" fill="transparent" />
                    <text className="wavy-text-content">
                        <textPath href="#curve1" startOffset="0%">
                            never miss a beat • always prepared • close more deals •
                        </textPath>
                    </text>
                </svg>
            </div>

            <div className="hero-content-wrapper">
                <h1 className="hero-title" ref={textTitleRef}>
                    <span className="font-serif hero-serif">Don't hesitate,</span>{' '}
                    <span className="hero-sans">just close</span>
                </h1>

                <p className="hero-subtitle">
                    The voice-to-text AI that detects objections and
                    <br />supplies winning responses during your calls.
                </p>

                <div className="hero-cta">
                    <button className="btn btn-primary interactive hero-main-btn">
                        <Download size={18} />
                        Download for Windows
                    </button>
                </div>

                <p className="hero-disclaimer">
                    Available on Mac, Windows, iPhone, and Android
                </p>

                <div className="bottom-decorator">
                    <div className="voice-pill">
                        <div className="recording-bars">
                            <span></span><span></span><span></span><span></span><span></span>
                            <span></span><span></span><span></span><span></span><span></span>
                            <span></span><span></span><span></span><span></span><span></span>
                        </div>
                    </div>
                    <svg viewBox="0 0 800 100" className="bottom-wavy-track">
                        <path id="curve2" d="M 0,50 Q 200,100 400,50 T 800,50" fill="transparent" stroke="none" />
                        <text className="wavy-text-content">
                            <textPath href="#curve2" startOffset="100%" className="scrolling-text">
                                There's been a lot of back and forth, and honestly the whole thing has been a bit chaotic. It feels like... There's been a lot of back and forth, and honestly the whole thing has been a bit chaotic. It feels like...
                            </textPath>
                        </text>
                    </svg>
                </div>
            </div>
        </section>
    );
};

export default Hero;
