import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, ArrowRight } from 'lucide-react';
import './Pricing.css';

gsap.registerPlugin(ScrollTrigger);

// Words/chips that will fall with Matter.js physics
const PHYSICS_WORDS = [
    'Close rate ↑22%', '4× faster', 'Real-time', '94% match',
    'Zoom', 'Salesforce', 'AI-powered', 'No plugins', 'Win more',
    '14-day free', 'Invisible', 'Always on',
];

const PricingPhysics = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const triggered = useRef(false);

    useEffect(() => {
        let engine, runner, render;

        const initPhysics = async () => {
            const Matter = await import('matter-js');
            const { Engine, Render, Runner, Bodies, Body, World, Events } = Matter;

            const container = containerRef.current;
            if (!container) return;

            const W = container.offsetWidth;
            const H = container.offsetHeight;

            engine = Engine.create({ gravity: { x: 0, y: 0.6 } });
            render = Render.create({
                canvas: canvasRef.current,
                engine,
                options: {
                    width: W,
                    height: H,
                    wireframes: false,
                    background: 'transparent',
                }
            });

            // Ground + side walls
            const ground = Bodies.rectangle(W / 2, H + 10, W, 20, { isStatic: true, render: { fillStyle: 'transparent' } });
            const wallL = Bodies.rectangle(-10, H / 2, 20, H, { isStatic: true, render: { fillStyle: 'transparent' } });
            const wallR = Bodies.rectangle(W + 10, H / 2, 20, H, { isStatic: true, render: { fillStyle: 'transparent' } });

            World.add(engine.world, [ground, wallL, wallR]);

            // Create floating label bodies with random positions above the canvas
            PHYSICS_WORDS.forEach((word) => {
                const colors = ['#ff5e00', '#111111', '#7c5cbf', '#27c93f', '#ffbd2e'];
                const color = colors[Math.floor(Math.random() * colors.length)];
                const w = word.length * 9 + 40;
                const body = Bodies.rectangle(
                    Math.random() * (W - w) + w / 2,
                    -Math.random() * H - 50,
                    w, 36,
                    {
                        restitution: 0.5,
                        friction: 0.3,
                        frictionAir: 0.02,
                        render: {
                            fillStyle: color,
                            strokeStyle: 'transparent',
                            lineWidth: 0,
                        },
                        label: word,
                        chamfer: { radius: 18 },
                    }
                );
                World.add(engine.world, body);
            });

            // Draw pill labels on canvas using the after-render event
            Events.on(render, 'afterRender', () => {
                const ctx = render.context;
                engine.world.bodies.forEach(body => {
                    if (body.isStatic || !body.label || body.label.length < 2) return;
                    const { x, y } = body.position;
                    const angle = body.angle;
                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(angle);
                    ctx.font = 'bold 11px Plus Jakarta Sans, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = body.render.fillStyle === '#111111' ? '#fff' :
                        body.render.fillStyle === '#ff5e00' ? '#fff' : '#111';
                    ctx.fillText(body.label, 0, 0);
                    ctx.restore();
                });
            });

            Runner.run(Runner.create(), engine);
            Render.run(render);
        };

        // Trigger physics on scroll into view
        ScrollTrigger.create({
            trigger: containerRef.current,
            start: 'top 70%',
            once: true,
            onEnter: () => {
                if (!triggered.current) {
                    triggered.current = true;
                    initPhysics();
                }
            }
        });

        return () => {
            if (render) {
                const Matter = require('matter-js');
                Matter.Render.stop(render);
                Matter.Runner.stop(runner);
                Matter.Engine.clear(engine);
            }
        };
    }, []);

    return (
        <div className="pricing-physics-container" ref={containerRef}>
            <canvas ref={canvasRef} className="pricing-physics-canvas" />
        </div>
    );
};

const Pricing = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.pricing-card',
                { y: 80, opacity: 0, scale: 0.95 },
                {
                    y: 0, opacity: 1, scale: 1,
                    duration: 1, stagger: 0.2, ease: 'power3.out',
                    scrollTrigger: { trigger: '.pricing-grid', start: 'top 80%' }
                }
            );
            gsap.fromTo('.pricing-header > *',
                { y: 40, opacity: 0 },
                {
                    y: 0, opacity: 1, stagger: 0.1, duration: 0.9,
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section className="pricing-section" id="pricing" ref={sectionRef}>
            <div className="container">
                <div className="pricing-header">
                    <div className="pricing-eyebrow">Pricing</div>
                    <h2 className="pricing-title">
                        Simple pricing,<br />
                        <em className="font-serif">massive return.</em>
                    </h2>
                    <p className="pricing-desc">Start closing more deals today. No long-term contract required.</p>
                </div>

                <div className="pricing-grid">

                    {/* Starter */}
                    <div className="pricing-card">
                        <div className="pricing-tier">Starter</div>
                        <div className="pricing-amount">
                            <span className="pa-curr">$</span>
                            <span className="pa-num">49</span>
                            <span className="pa-per">/mo</span>
                        </div>
                        <p className="pricing-tagline">For solo closers and freelancers.</p>
                        <button className="pricing-btn-outline interactive">
                            Start free trial <ArrowRight size={16} />
                        </button>
                        <ul className="pricing-features-list">
                            <li><Check size={16} /> Unlimited transcriptions</li>
                            <li><Check size={16} /> Basic objection detection</li>
                            <li><Check size={16} /> Desktop app (Mac + Windows)</li>
                            <li className="disabled"><Check size={16} /> Team analytics</li>
                            <li className="disabled"><Check size={16} /> Custom knowledge base</li>
                        </ul>
                    </div>

                    {/* Pro — with Matter.js physics inside */}
                    <div className="pricing-card pricing-featured">
                        <div className="pricing-featured-badge">Most Popular</div>
                        <div className="pricing-tier" style={{ color: 'rgba(255,255,255,0.4)' }}>Professional</div>
                        <div className="pricing-amount">
                            <span className="pa-curr">$</span>
                            <span className="pa-num">129</span>
                            <span className="pa-per">/user/mo</span>
                        </div>
                        <p className="pricing-tagline" style={{ color: 'rgba(255,255,255,0.55)' }}>For teams who need the ultimate edge.</p>
                        <button className="pricing-btn-primary interactive">Get Started →</button>
                        <ul className="pricing-features-list">
                            <li><Check size={16} /> Everything in Starter</li>
                            <li><Check size={16} /> Advanced real-time suggestions</li>
                            <li><Check size={16} /> CRM integrations (SF, HubSpot)</li>
                            <li><Check size={16} /> Custom knowledge base API</li>
                            <li><Check size={16} /> Priority 24/7 support</li>
                        </ul>

                        {/* 🎱 MATTER.JS PHYSICS CANVAS */}
                        <PricingPhysics />
                    </div>

                </div>

                <p className="pricing-footer-note">All plans include a 14-day free trial. No credit card required.</p>
            </div>
        </section>
    );
};

export default Pricing;
