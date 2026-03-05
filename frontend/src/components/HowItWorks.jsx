import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './HowItWorks.css';

const HowItWorks = () => {
    const sectionRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {

            // Fade in and slide up text
            gsap.fromTo('.hiw-text > *',
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.2,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 70%',
                    }
                }
            );

            // Floating images parallax effect
            gsap.fromTo('.hiw-floating-img',
                { y: 100 },
                {
                    y: -50,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1
                    }
                }
            );

            // Animate recording bars
            gsap.utils.toArray('.hiw-bar').forEach((bar, index) => {
                gsap.to(bar, {
                    height: () => 10 + Math.random() * 40,
                    duration: 0.3 + Math.random() * 0.2,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    delay: index * 0.1
                });
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="container hiw-section" id="how-it-works" ref={sectionRef}>
            <div className="hiw-content" ref={contentRef}>
                <div className="hiw-text">
                    <span className="hiw-eyebrow">How it works</span>
                    <h2 className="hiw-title">
                        <span className="font-serif">Speak normally.</span><br />
                        Let nx.ai do the rest.
                    </h2>
                    <p className="hiw-desc">
                        No commands to memorize. No clunky interfaces. Just talk, and watch as your words are captured, analyzed, and polished in real-time.
                    </p>
                </div>

                <div className="hiw-visuals">
                    {/* Placeholder for floating images / UI elements */}
                    <div className="hiw-floating-img img-1">
                        <div className="mockup-card">
                            <div className="recording-indicator">
                                <div className="dot"></div> Listening...
                            </div>
                            <p className="mockup-text-small blur">I was thinking we need to rethink</p>
                            <p className="mockup-text-large">We should pivot our strategy to focus on...</p>
                        </div>
                    </div>

                    <div className="hiw-floating-img img-2">
                        <div className="hiw-orb"></div>
                    </div>

                    <div className="hiw-voice-visualizer">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="hiw-bar"></div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
