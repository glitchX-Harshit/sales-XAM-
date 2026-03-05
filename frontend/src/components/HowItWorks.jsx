import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './HowItWorks.css';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
    {
        num: '01',
        title: 'You join the call',
        sub: 'nx.ai starts listening the moment your meeting begins — no commands, no setup.',
        insight: 'Runs invisibly across Zoom, Meet, and Teams.',
    },
    {
        num: '02',
        title: 'AI detects objections',
        sub: 'Prospect signals hesitation? nx.ai catches it in under 0.5 seconds.',
        insight: 'Trained on 10,000+ real discovery call transcripts.',
    },
    {
        num: '03',
        title: 'Winning reply surfaces',
        sub: 'A precision-crafted response appears on your screen — invisible to the prospect.',
        insight: '94% success rate on detected objections.',
    },
    {
        num: '04',
        title: 'You close the deal',
        sub: 'Speak with authority. The prospect has no idea you had a secret weapon.',
        insight: 'Users report 22% higher close rates within 30 days.',
    },
];

/* ── The scratch reveals text lines, one at a time ── */
const REVEAL_LINES = [
    { top: '12%', left: '8%', text: '73% of lost deals fail at the objection stage.', size: '2.8rem' },
    { top: '28%', left: '55%', text: 'Your competitor already uses AI in every call.', size: '2.2rem' },
    { top: '46%', left: '12%', text: 'Silence kills commissions.', size: '3.8rem', italic: true },
    { top: '62%', left: '40%', text: 'nx.ai gave back an average of $186k in recovered deals per team, per quarter.', size: '1.6rem' },
    { top: '79%', left: '5%', text: 'The best closers don\'t wing it. They prepare.', size: '2rem' },
];

const ScratchSection = () => {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const mountedRef = useRef(false);

    useEffect(() => {
        const section = containerRef.current;
        const canvas = canvasRef.current;
        if (!canvas || !section) return;

        const ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width = section.offsetWidth;
            canvas.height = section.offsetHeight;
            // Fill with the black mask
            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw a dim instruction hint
            ctx.font = '600 0.85rem Plus Jakarta Sans, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgba(255,255,255,0.1)';
            ctx.font = 'bold 14px Plus Jakarta Sans, sans-serif';
            ctx.fillText('MOVE YOUR CURSOR TO REVEAL', canvas.width / 2, canvas.height / 2);
        };

        resize();
        window.addEventListener('resize', resize);

        const scratch = (e) => {
            const r = canvas.getBoundingClientRect();
            const x = (e.clientX ?? e.touches?.[0].clientX) - r.left;
            const y = (e.clientY ?? e.touches?.[0].clientY) - r.top;

            ctx.globalCompositeOperation = 'destination-out';
            // Large soft brush — just moving cursor scratches
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, 90);
            gradient.addColorStop(0, 'rgba(0,0,0,1)');
            gradient.addColorStop(0.6, 'rgba(0,0,0,0.7)');
            gradient.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.beginPath();
            ctx.arc(x, y, 90, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        };

        section.addEventListener('mousemove', scratch);
        section.addEventListener('touchmove', (e) => scratch(e), { passive: true });

        return () => {
            section.removeEventListener('mousemove', scratch);
            section.removeEventListener('touchmove', scratch);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <div className="hiw-scratch-section" ref={containerRef}>
            {/* What's revealed underneath */}
            <div className="hiw-scratch-revealed">
                {REVEAL_LINES.map((line, i) => (
                    <div
                        key={i}
                        className={`hiw-reveal-line ${line.italic ? 'italic' : ''}`}
                        style={{ top: line.top, left: line.left, fontSize: line.size }}
                    >
                        {line.text}
                    </div>
                ))}
            </div>
            {/* The black canvas mask on top */}
            <canvas ref={canvasRef} className="hiw-scratch-canvas" />
        </div>
    );
};

const HowItWorks = () => {
    const sectionRef = useRef(null);
    const stepsRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.hiw-section-line',
                { clipPath: 'inset(0 100% 0 0)' },
                {
                    clipPath: 'inset(0 0% 0 0)',
                    duration: 1.2, stagger: 0.2, ease: 'power4.inOut',
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
                }
            );

            gsap.fromTo('.hiw-step',
                { y: 60, opacity: 0 },
                {
                    y: 0, opacity: 1,
                    duration: 0.8, stagger: 0.15, ease: 'power3.out',
                    scrollTrigger: { trigger: stepsRef.current, start: 'top 80%' }
                }
            );

            gsap.utils.toArray('.hiw-bar').forEach((bar, i) => {
                gsap.to(bar, {
                    scaleY: Math.random() * 0.85 + 0.15,
                    duration: 0.25 + Math.random() * 0.25,
                    repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.07
                });
            });

            gsap.fromTo('.hiw-step-line',
                { scaleY: 0 },
                {
                    scaleY: 1, duration: 1.5, stagger: 0.2, ease: 'power2.inOut',
                    scrollTrigger: { trigger: stepsRef.current, start: 'top 70%' }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="hiw-section" id="how-it-works" ref={sectionRef}>
            <div className="container">
                <div className="hiw-header">
                    <div className="hiw-eyebrow">How it works</div>
                    <h2 className="hiw-title">
                        <span className="hiw-section-line">Speak normally.</span>
                        <span className="hiw-section-line font-serif">
                            <em>nx.ai handles</em>
                        </span>
                        <span className="hiw-section-line">the hard part.</span>
                    </h2>
                </div>

                <div className="hiw-steps" ref={stepsRef}>
                    {STEPS.map((step, i) => (
                        <div className="hiw-step" key={i}>
                            <div className="hiw-step-left">
                                <div className="hiw-step-num">{step.num}</div>
                                <div className="hiw-step-line"></div>
                            </div>
                            <div className="hiw-step-right">
                                <h3 className="hiw-step-title">{step.title}</h3>
                                <p className="hiw-step-sub">{step.sub}</p>
                                <div className="hiw-step-insight">{step.insight}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="hiw-visualizer">
                    <div className="hiw-viz-inner">
                        {[...Array(40)].map((_, i) => (
                            <div className="hiw-bar" key={i}></div>
                        ))}
                    </div>
                    <div className="hiw-viz-label">nx.ai — Processing live audio</div>
                </div>
            </div>

            {/* ── SCRATCH REVEAL ZONE ── */}
            <ScratchSection />
        </section>
    );
};

export default HowItWorks;
