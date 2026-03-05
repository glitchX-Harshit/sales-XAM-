import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, Zap, Shield, ArrowRight } from 'lucide-react';
import './Pricing.css';

gsap.registerPlugin(ScrollTrigger);

const Pricing = () => {
    const sectionRef = useRef(null);
    const physicsContainerRef = useRef(null);
    const physicsCanvasRef = useRef(null);
    const physicsTriggered = useRef(false);

    /* ── Matter.js physics inside the Pro card ── */
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

                const W = container.offsetWidth;
                const H = container.offsetHeight;

                const engine = Engine.create({ gravity: { x: 0, y: 0.7 } });
                const render = Render.create({
                    canvas,
                    engine,
                    options: { width: W, height: H, wireframes: false, background: 'transparent' },
                });

                const ground = Bodies.rectangle(W / 2, H + 10, W + 20, 20, { isStatic: true, render: { fillStyle: 'transparent' } });
                const wallL = Bodies.rectangle(-10, H / 2, 20, H, { isStatic: true, render: { fillStyle: 'transparent' } });
                const wallR = Bodies.rectangle(W + 10, H / 2, 20, H, { isStatic: true, render: { fillStyle: 'transparent' } });
                World.add(engine.world, [ground, wallL, wallR]);

                const CHIPS = [
                    'Close rate ↑22%', 'Real-time', '94% match',
                    'Zoom', 'Salesforce', 'AI-powered',
                    'No plugins', 'Win more', '14-day free',
                    'HubSpot', 'Always on', 'Invisible',
                ];

                const COLORS = ['#ff5e00', 'rgba(255,255,255,0.15)', 'rgba(255,255,255,0.08)'];

                CHIPS.forEach((label, idx) => {
                    const w = Math.max(label.length * 8 + 36, 80);
                    const color = COLORS[idx % COLORS.length];
                    const body = Bodies.rectangle(
                        Math.random() * (W - w) + w / 2,
                        -Math.random() * H * 0.8 - 20,
                        w, 30,
                        {
                            restitution: 0.45, friction: 0.3, frictionAir: 0.015,
                            render: { fillStyle: color },
                            label,
                            chamfer: { radius: 15 },
                        }
                    );
                    World.add(engine.world, body);
                });

                Events.on(render, 'afterRender', () => {
                    const ctx = render.context;
                    engine.world.bodies.forEach(body => {
                        if (body.isStatic || !body.label || body.label.length < 2) return;
                        const { x, y } = body.position;
                        ctx.save();
                        ctx.translate(x, y);
                        ctx.rotate(body.angle);
                        ctx.font = 'bold 11px Plus Jakarta Sans, sans-serif';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        const isOrange = body.render.fillStyle === '#ff5e00';
                        ctx.fillStyle = isOrange ? '#fff' : 'rgba(255,255,255,0.8)';
                        ctx.fillText(body.label, 0, 0);
                        ctx.restore();
                    });
                });

                Runner.run(Runner.create(), engine);
                Render.run(render);
            }
        });
    }, []);

    /* ── Scroll entrance ── */
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.pricing-header > *',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
            );
            gsap.fromTo('.pricing-card',
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.15, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.pricing-grid', start: 'top 82%' } }
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
                        Transparent pricing.
                        <br />
                        <em className="font-serif">Massive return.</em>
                    </h2>
                    <p className="pricing-desc">No contracts. No setup fees. Cancel anytime.</p>
                </div>

                <div className="pricing-grid">

                    {/* ── STARTER ── */}
                    <div className="pricing-card pricing-starter">
                        <div className="pricing-card-inner">
                            <div className="pricing-icon-wrap">
                                <Zap size={20} color="#ff5e00" />
                            </div>
                            <div className="pricing-tier">Starter</div>
                            <div className="pricing-amount">
                                <span className="pa-curr">$</span>
                                <span className="pa-num">49</span>
                                <span className="pa-per">/mo</span>
                            </div>
                            <p className="pricing-tagline">For solo closers who want the edge.</p>

                            <button className="pricing-btn-outline interactive">
                                Start free trial <ArrowRight size={15} />
                            </button>

                            <div className="pricing-divider">
                                <span>What's included</span>
                            </div>

                            <ul className="pricing-features-list">
                                <li><Check size={15} /> Unlimited call transcriptions</li>
                                <li><Check size={15} /> Real-time objection detection</li>
                                <li><Check size={15} /> Desktop app (Mac + Windows)</li>
                                <li className="dimmed"><Check size={15} /> Team analytics dashboard</li>
                                <li className="dimmed"><Check size={15} /> Custom knowledge base</li>
                                <li className="dimmed"><Check size={15} /> CRM integrations</li>
                            </ul>
                        </div>
                    </div>

                    {/* ── PRO (featured) ── */}
                    <div className="pricing-card pricing-pro">
                        <div className="pricing-featured-badge">Most Popular</div>
                        <div className="pricing-card-inner">
                            <div className="pricing-icon-wrap pricing-icon-dark">
                                <Shield size={20} color="#fff" />
                            </div>
                            <div className="pricing-tier" style={{ color: 'rgba(255,255,255,0.4)' }}>Professional</div>
                            <div className="pricing-amount">
                                <span className="pa-curr">$</span>
                                <span className="pa-num">129</span>
                                <span className="pa-per">/user/mo</span>
                            </div>
                            <p className="pricing-tagline" style={{ color: 'rgba(255,255,255,0.5)' }}>For teams who need the full arsenal.</p>

                            <button className="pricing-btn-primary interactive">
                                Get started →
                            </button>

                            <div className="pricing-divider dark">
                                <span>Everything in Starter, plus:</span>
                            </div>

                            <ul className="pricing-features-list">
                                <li><Check size={15} /> Advanced real-time AI suggestions</li>
                                <li><Check size={15} /> CRM integrations (SF, HubSpot)</li>
                                <li><Check size={15} /> Custom knowledge base API</li>
                                <li><Check size={15} /> Team analytics &amp; coaching</li>
                                <li><Check size={15} /> Slack &amp; Notion sync</li>
                                <li><Check size={15} /> Priority 24/7 support</li>
                            </ul>

                            {/* Physics canvas */}
                            <div className="pricing-physics-container" ref={physicsContainerRef}>
                                <canvas ref={physicsCanvasRef} className="pricing-physics-canvas" />
                            </div>
                        </div>
                    </div>

                </div>

                <p className="pricing-footer-note">
                    All plans include a <strong>14-day free trial</strong>. No credit card required.
                </p>

            </div>
        </section>
    );
};

export default Pricing;
