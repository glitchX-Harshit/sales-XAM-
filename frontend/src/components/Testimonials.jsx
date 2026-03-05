import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star } from 'lucide-react';
import './Testimonials.css';

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
    {
        text: "nx.ai single-handedly increased our team's close rate by 22% in the first quarter. I can't imagine selling without it.",
        author: "Sarah J.",
        role: "VP of Sales, TechCorp",
        emoji: "🚀"
    },
    {
        text: "It's like having a senior AE whisper perfect responses into my ear on every live call. Game. Changer.",
        author: "Mike T.",
        role: "Solutions Architect",
        emoji: "💬"
    },
    {
        text: "I used to dread discovery calls. Now I walk in knowing I have the perfect response to any objection.",
        author: "Elena R.",
        role: "Account Executive",
        emoji: "⚡"
    },
    {
        text: "We replaced our clunky call recording software entirely. nx.ai is faster, smarter, and totally invisible.",
        author: "David K.",
        role: "Founder",
        emoji: "✦"
    },
    {
        text: "The objection detection is basically a cheat code for enterprise sales. 3 months in, numbers speak for themselves.",
        author: "Jessica M.",
        role: "Sales Director",
        emoji: "📈"
    },
    {
        text: "ROI within 10 days. Our entire SDR team now insists on using it for every call.",
        author: "Brian L.",
        role: "Head of Revenue",
        emoji: "🎯"
    },
];

const Testimonials = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {

            // ── Header reveal ──
            gsap.fromTo('.testi-header > *',
                { y: 40, opacity: 0 },
                {
                    y: 0, opacity: 1, stagger: 0.12, duration: 0.9, ease: 'power3.out',
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
                }
            );

            // ── Parallax: each card moves at a different rate ──
            gsap.utils.toArray('.testi-parallax-card').forEach((card, i) => {
                const speed = (i % 3 === 0) ? -60 : (i % 3 === 1) ? -30 : -90;
                gsap.fromTo(card,
                    { y: 80 + Math.abs(speed), opacity: 0 },
                    {
                        y: 0, opacity: 1,
                        duration: 0.9, ease: 'power3.out',
                        scrollTrigger: { trigger: '.testi-grid', start: 'top 85%' }
                    }
                );
                // Ongoing parallax while scrolling
                gsap.to(card, {
                    y: speed,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '.testi-grid',
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1.5 + i * 0.2
                    }
                });
            });

            // ── Marquee rows ──
            gsap.to('.testi-track-1', { x: '-50%', ease: 'none', duration: 32, repeat: -1 });
            gsap.fromTo('.testi-track-2', { x: '-50%' }, { x: '0%', ease: 'none', duration: 26, repeat: -1 });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const doubled = [...TESTIMONIALS, ...TESTIMONIALS];

    return (
        <section className="testi-section" id="testimonials" ref={sectionRef}>

            <div className="container testi-header">
                <div className="testi-eyebrow">Wall of Love</div>
                <h2 className="testi-title">
                    2,000+ teams already{' '}
                    <em className="font-serif">winning more.</em>
                </h2>
                <p className="testi-subtitle">Real results from real salespeople.</p>
            </div>

            {/* ── Parallax card grid ── */}
            <div className="testi-grid container">
                {TESTIMONIALS.map((t, i) => (
                    <div className="testi-parallax-card" key={i} style={{ '--card-index': i }}>
                        <div className="tpc-emoji">{t.emoji}</div>
                        <div className="tpc-stars">
                            {[...Array(5)].map((_, si) => <Star key={si} size={13} fill="#ffbd2e" color="#ffbd2e" />)}
                        </div>
                        <p className="tpc-text">"{t.text}"</p>
                        <div className="tpc-author">
                            <div className="tpc-avatar" style={{ background: `hsl(${i * 55}, 60%, 60%)` }}>{t.author[0]}</div>
                            <div>
                                <div className="tpc-name">{t.author}</div>
                                <div className="tpc-role">{t.role}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Infinite dual-direction marquee ── */}
            <div className="testi-marquee-wrap">
                <div className="testi-row-overflow">
                    <div className="testi-track testi-track-1">
                        {doubled.map((t, i) => (
                            <div className="testi-mini-card" key={i}>
                                <div className="tmc-stars">
                                    {[...Array(5)].map((_, si) => <Star key={si} size={11} fill="#ffbd2e" color="#ffbd2e" />)}
                                </div>
                                <p>"{t.text}"</p>
                                <span>— {t.author}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="testi-row-overflow">
                    <div className="testi-track testi-track-2">
                        {[...doubled].reverse().map((t, i) => (
                            <div className="testi-mini-card dark" key={i}>
                                <div className="tmc-stars">
                                    {[...Array(5)].map((_, si) => <Star key={si} size={11} fill="#ffbd2e" color="#ffbd2e" />)}
                                </div>
                                <p>"{t.text}"</p>
                                <span>— {t.author}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </section>
    );
};

export default Testimonials;
