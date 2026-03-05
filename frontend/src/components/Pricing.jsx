import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, ArrowRight, Zap, Shield, Star } from 'lucide-react';
import './Pricing.css';

gsap.registerPlugin(ScrollTrigger);

const STARTER_FEATURES = [
    'Unlimited call transcriptions',
    'Real-time objection detection',
    'Desktop app (Mac + Windows)',
    'Basic analytics',
];

const PRO_FEATURES = [
    'Advanced real-time AI suggestions',
    'CRM integrations (SF, HubSpot)',
    'Custom knowledge base API',
    'Team analytics & coaching',
    'Slack & Notion sync',
    'Priority 24/7 support',
];

/* ── Scribble SVG annotation layer ── */
const ScribbleLayer = () => {
    const svgRef = useRef(null);

    useEffect(() => {
        if (!svgRef.current) return;
        const paths = svgRef.current.querySelectorAll('path, ellipse, circle');
        paths.forEach(p => {
            try {
                const len = p.getTotalLength ? p.getTotalLength() : 150;
                gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
            } catch (_) { }
        });

        gsap.to(svgRef.current.querySelectorAll('path, ellipse, circle'), {
            strokeDashoffset: 0,
            duration: 0.7,
            stagger: 0.18,
            ease: 'power3.inOut',
            scrollTrigger: { trigger: '.pricing-section', start: 'top 70%' }
        });

        gsap.fromTo('.pr-scrib-label',
            { opacity: 0, y: 6 },
            {
                opacity: 1, y: 0, duration: 0.5, stagger: 0.15, ease: 'power3.out',
                scrollTrigger: { trigger: '.pricing-section', start: 'top 70%', delay: 0.6 }
            }
        );
    }, []);

    return (
        <div className="pr-scrib-wrap" aria-hidden="true">
            <svg ref={svgRef} className="pr-scrib-svg" viewBox="0 0 1000 600" fill="none">

                {/* Oval circle around "Transparent pricing" in header */}
                <ellipse cx="210" cy="64" rx="175" ry="34"
                    stroke="#ff5e00" strokeWidth="2.2" fill="none"
                    style={{ transform: 'rotate(-2deg)', transformOrigin: '210px 64px' }} />

                {/* Oval around "$49" */}
                <ellipse cx="145" cy="295" rx="52" ry="26"
                    stroke="#ff5e00" strokeWidth="2" fill="none"
                    style={{ transform: 'rotate(-3deg)', transformOrigin: '145px 295px' }} />

                {/* Arrow from $49 label to side */}
                <path d="M 208 275 C 235 262 258 250 268 238"
                    stroke="rgba(0,0,0,0.3)" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M 268 238 L 256 240 M 268 238 L 265 250"
                    stroke="rgba(0,0,0,0.3)" strokeWidth="1.8" strokeLinecap="round" />

                {/* Oval around "$129" on pro side */}
                <ellipse cx="660" cy="295" rx="60" ry="28"
                    stroke="#fff" strokeWidth="2" fill="none"
                    strokeDasharray="6 4"
                    style={{ transform: 'rotate(2deg)', transformOrigin: '660px 295px' }} />

                {/* Wavy underline under "Most Popular" badge */}
                <path d="M 570 144 C 610 138 660 148 710 141 C 750 135 790 145 820 139"
                    stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" strokeLinecap="round" />

                {/* Arrow from "no credit card" text → bottom */}
                <path d="M 500 555 C 498 568 500 578 503 585"
                    stroke="rgba(0,0,0,0.25)" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M 503 585 L 495 575 M 503 585 L 511 576"
                    stroke="rgba(0,0,0,0.25)" strokeWidth="1.6" strokeLinecap="round" />

                {/* Curvy side arrow on left — points to starter card */}
                <path d="M 35 400 C 28 360 50 310 80 285"
                    stroke="#ff5e00" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M 80 285 L 68 292 M 80 285 L 82 298"
                    stroke="#ff5e00" strokeWidth="1.8" strokeLinecap="round" />

                {/* Squiggle near right side */}
                <path d="M 965 350 C 978 342 985 358 972 365 C 960 372 968 388 982 382"
                    stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" />

            </svg>

            {/* Hand-written Caveat labels */}
            <span className="pr-scrib-label" style={{ top: '6%', left: '5%', transform: 'rotate(-3deg)' }}>
                no hidden fees ✓
            </span>
            <span className="pr-scrib-label" style={{ top: '44%', left: '9%', transform: 'rotate(-5deg)', color: '#ff5e00' }}>
                solo closer? start here ↗
            </span>
            <span className="pr-scrib-label" style={{ top: '26%', left: '54%', transform: 'rotate(3deg)', color: 'rgba(255,255,255,0.55)' }}>
                teams love this ↓
            </span>
            <span className="pr-scrib-label" style={{ top: '44%', left: '56%', transform: 'rotate(-2deg)', color: 'rgba(255,255,255,0.45)' }}>
                best value ←
            </span>
            <span className="pr-scrib-label" style={{ bottom: '8%', left: '44%', transform: 'rotate(2deg)' }}>
                seriously, no card needed ↑
            </span>

        </div>
    );
};

const Pricing = () => {
    const sectionRef = useRef(null);
    const physicsContainerRef = useRef(null);
    const physicsCanvasRef = useRef(null);
    const physicsTriggered = useRef(false);

    /* Matter.js physics in Pro card */
    useEffect(() => {
        ScrollTrigger.create({
            trigger: physicsContainerRef.current,
            start: 'top 70%',
            once: true,
            onEnter: async () => {
                if (physicsTriggered.current) return;
                physicsTriggered.current = true;
                const Matter = await import('matter-js');
                const { Engine, Render, Runner, Bodies, World, Events } = Matter;
                const container = physicsContainerRef.current;
                const canvas = physicsCanvasRef.current;
                if (!container || !canvas) return;
                const W = container.offsetWidth, H = container.offsetHeight;
                const engine = Engine.create({ gravity: { x: 0, y: 0.8 } });
                const render = Render.create({ canvas, engine, options: { width: W, height: H, wireframes: false, background: 'transparent' } });
                World.add(engine.world, [
                    Bodies.rectangle(W / 2, H + 10, W + 20, 20, { isStatic: true, render: { fillStyle: 'transparent' } }),
                    Bodies.rectangle(-10, H / 2, 20, H, { isStatic: true, render: { fillStyle: 'transparent' } }),
                    Bodies.rectangle(W + 10, H / 2, 20, H, { isStatic: true, render: { fillStyle: 'transparent' } }),
                ]);
                ['Close rate ↑22%', 'Real-time', '94% match', 'Zoom', 'Salesforce', 'No plugins', 'Win more', '14-day free', 'HubSpot'].forEach((label, idx) => {
                    const w = Math.max(label.length * 8 + 36, 80);
                    const body = Bodies.rectangle(Math.random() * (W - w) + w / 2, -Math.random() * H * 0.8 - 20, w, 28,
                        { restitution: 0.4, friction: 0.3, frictionAir: 0.015, render: { fillStyle: idx % 3 === 0 ? '#ff5e00' : 'rgba(255,255,255,0.12)' }, label, chamfer: { radius: 14 } });
                    World.add(engine.world, body);
                });
                Events.on(render, 'afterRender', () => {
                    const ctx = render.context;
                    engine.world.bodies.forEach(b => {
                        if (b.isStatic || !b.label || b.label.length < 2) return;
                        ctx.save(); ctx.translate(b.position.x, b.position.y); ctx.rotate(b.angle);
                        ctx.font = 'bold 10px Plus Jakarta Sans, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                        ctx.fillStyle = b.render.fillStyle === '#ff5e00' ? '#fff' : 'rgba(255,255,255,0.7)';
                        ctx.fillText(b.label, 0, 0); ctx.restore();
                    });
                });
                Runner.run(Runner.create(), engine); Render.run(render);
            }
        });
    }, []);

    /* Scroll entrance */
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.pr-eyebrow, .pr-title, .pr-desc',
                { y: 36, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.12, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
            );
            gsap.fromTo('.pricing-card',
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.18, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.pr-cards', start: 'top 82%' } }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section className="pricing-section" id="pricing" ref={sectionRef}>
            <ScribbleLayer />

            <div className="container">

                {/* Header */}
                <div className="pr-header">
                    <div className="pr-eyebrow">Pricing</div>
                    <h2 className="pr-title">
                        Transparent pricing.
                        <br />
                        <em className="pr-italic">Massive return.</em>
                    </h2>
                    <p className="pr-desc">No contracts. No setup fees. Cancel anytime.</p>
                </div>

                {/* Cards row */}
                <div className="pr-cards">

                    {/* ── STARTER ── */}
                    <div className="pricing-card pr-starter">
                        <div className="pr-card-tag">
                            <Zap size={13} /> Starter
                        </div>

                        <div className="pr-price-row">
                            <span className="pr-curr">$</span>
                            <span className="pr-num">49</span>
                            <span className="pr-per">/mo</span>
                        </div>
                        <p className="pr-tagline">For solo closers who want the edge.</p>

                        <ul className="pr-features">
                            {STARTER_FEATURES.map((f, i) => <li key={i}><Check size={14} />{f}</li>)}
                            <li className="pr-feat-locked"><span className="pr-lock">+</span> Pro features</li>
                        </ul>

                        <button className="pr-btn-outline interactive">
                            Start free trial <ArrowRight size={14} />
                        </button>
                    </div>

                    {/* ── PRO ── */}
                    <div className="pricing-card pr-pro">
                        <div className="pr-pro-badge">
                            <Star size={11} fill="#ffbd2e" color="#ffbd2e" /> Most Popular
                        </div>

                        <div className="pr-card-tag pr-card-tag-dark">
                            <Shield size={13} /> Professional
                        </div>

                        <div className="pr-price-row">
                            <span className="pr-curr">$</span>
                            <span className="pr-num">129</span>
                            <span className="pr-per">/user/mo</span>
                        </div>
                        <p className="pr-tagline pr-tagline-dark">For teams who need the full arsenal.</p>

                        <ul className="pr-features pr-features-dark">
                            {PRO_FEATURES.map((f, i) => <li key={i}><Check size={14} />{f}</li>)}
                        </ul>

                        <button className="pr-btn-primary interactive">
                            Get started →
                        </button>

                        {/* Physics chips */}
                        <div className="pr-physics-box" ref={physicsContainerRef}>
                            <canvas ref={physicsCanvasRef} className="pr-physics-canvas" />
                        </div>
                    </div>

                    {/* ── ENTERPRISE ── */}
                    <div className="pricing-card pr-enterprise">
                        <div className="pr-card-tag">
                            Enterprise
                        </div>
                        <div className="pr-price-row">
                            <span className="pr-num pr-num-custom">Custom</span>
                        </div>
                        <p className="pr-tagline">For large teams with custom needs.</p>

                        <ul className="pr-features">
                            <li><Check size={14} /> Everything in Pro</li>
                            <li><Check size={14} /> SSO & SAML</li>
                            <li><Check size={14} /> Dedicated CSM</li>
                            <li><Check size={14} /> Custom training data</li>
                            <li><Check size={14} /> SLA guarantee</li>
                        </ul>

                        <button className="pr-btn-ghost interactive">
                            Talk to sales →
                        </button>
                    </div>

                </div>

                <p className="pr-footnote">
                    All plans include a <strong>14-day free trial</strong>. No credit card required.
                </p>
            </div>
        </section>
    );
};

export default Pricing;
