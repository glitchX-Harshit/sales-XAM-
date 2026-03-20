import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ArrowRight } from 'lucide-react';
import './ResponseSuggestion.css';

const ResponseSuggestion = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Title animation
            gsap.fromTo('.resp-title-wrapper > *',
                { y: 50, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 75%'
                    }
                }
            );

            // Cascading suggestion cards
            gsap.fromTo('.resp-card',
                {
                    x: 100,
                    opacity: 0,
                    scale: 0.9
                },
                {
                    x: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.resp-interactive-area',
                        start: 'top 70%'
                    }
                }
            );

            // Typing simulation for the prominent response
            const typingText = "That completely makes sense. Let's look at how the ROI balances out that initial investment in Q3...";
            const targetElement = document.querySelector('.typing-target');

            if (targetElement) {
                ScrollTrigger.create({
                    trigger: '.resp-interactive-area',
                    start: 'top 50%',
                    once: true,
                    onEnter: () => {
                        let i = 0;
                        targetElement.innerHTML = '';
                        const interval = setInterval(() => {
                            if (i < typingText.length) {
                                targetElement.innerHTML += typingText.charAt(i);
                                i++;
                            } else {
                                clearInterval(interval);
                            }
                        }, 30);
                    }
                });
            }

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="container resp-section" id="suggestions" ref={sectionRef}>
            <div className="resp-layout">

                <div className="resp-text-content">
                    <div className="resp-title-wrapper">
                        <span className="resp-eyebrow"><Sparkles size={16} /> Instant Brilliance</span>
                        <h2 className="resp-title">
                            <span className="font-serif">Winning responses,</span><br />
                            served on a platter.
                        </h2>
                        <p className="resp-desc">
                            When the pressure is on, klyro.ai feeds you the exact words you need to navigate tough questions, reposition value, and keep the momentum going.
                        </p>

                        <button className="btn btn-primary interactive mt-8">
                            See it in action <ArrowRight size={18} />
                        </button>
                    </div>
                </div>

                <div className="resp-interactive-area">
                    <div className="resp-card secondary">
                        <div className="resp-card-header">Alternative Suggestion</div>
                        <p>"Actually, many of our clients start with the foundational plan to prove value fast before upgrading..."</p>
                    </div>

                    <div className="resp-card primary">
                        <div className="resp-card-header highlight">
                            <Sparkles size={16} /> Top Recommendation
                        </div>
                        <p className="typing-target">Loading response...</p>
                        <div className="resp-card-footer">
                            <span>94% Success Rate</span>
                        </div>
                    </div>

                    <div className="resp-card secondary">
                        <div className="resp-card-header">Case Study Pivot</div>
                        <p>"That reminds me of how Acme Corp handled their Q3 rollout. They actually found that..."</p>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default ResponseSuggestion;
