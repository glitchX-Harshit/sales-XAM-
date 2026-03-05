import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldAlert, AlertCircle, XCircle } from 'lucide-react';
import './ObjectionHandling.css';

const ObjectionHandling = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
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
                    nx.ai listens for subtle hesitation, pricing concerns, or competitive mentions, instantly flagging them so you know exactly what you're up against.
                </p>
            </div>

            <div className="obj-interactive-area">
                <div className="obj-bg-glow"></div>

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
