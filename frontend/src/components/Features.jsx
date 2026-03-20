import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Ear, Zap, Shield, Layers } from 'lucide-react';
import './Features.css';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
    { value: 4, suffix: '×', label: 'Faster objection detection than manual monitoring' },
    { value: 94, suffix: '%', label: 'Coverage across the most common sales objections' },
    { value: 22, suffix: '%', label: 'Average increase in close rates for active users' },
];

const Features = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {

            // Horizontal line reveals for the section header
            gsap.fromTo('.feat-header-line',
                { clipPath: 'inset(0 100% 0 0)' },
                {
                    clipPath: 'inset(0 0% 0 0)',
                    duration: 1.2, stagger: 0.2, ease: 'power4.inOut',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 75%'
                    }
                }
            );

            // Animated number counters
            document.querySelectorAll('.stat-counter').forEach(el => {
                const target = parseFloat(el.getAttribute('data-target'));
                ScrollTrigger.create({
                    trigger: el,
                    start: 'top 85%',
                    once: true,
                    onEnter: () => {
                        gsap.fromTo(el, { innerText: 0 }, {
                            innerText: target,
                            duration: 1.8,
                            ease: 'power2.out',
                            snap: { innerText: target % 1 === 0 ? 1 : 0.1 },
                            onUpdate() { el.innerText = (Math.round(el.innerText * 10) / 10).toString(); }
                        });
                    }
                });
            });

            // Bento cards scroll reveal
            gsap.fromTo('.feat-card',
                { y: 80, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.feat-bento',
                        start: 'top 80%'
                    }
                }
            );

            // Horizontal parallax on the big card visual
            gsap.to('.feat-orb-blob', {
                x: 40,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.feat-bento',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 2
                }
            });

        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section className="features-section" ref={sectionRef} id="features">
            <div className="container">

                {/* Section header — editorial style */}
                <div className="feat-header">
                    <div className="feat-header-eyebrow">What klyro.ai does</div>
                    <h2 className="feat-header-title">
                        <div className="feat-header-line">Listen.<em className="font-serif"> Detect.</em></div>
                        <div className="feat-header-line">Close.</div>
                    </h2>
                </div>

                {/* Animated stats row */}
                <div className="feat-stats-row">
                    {STATS.map((s, i) => (
                        <div className="feat-stat-card" key={i}>
                            <div className="feat-stat-number">
                                <span className="stat-counter" data-target={s.value}>{s.value}</span>
                                <span className="stat-suf">{s.suffix}</span>
                            </div>
                            <p className="feat-stat-label">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Bento grid */}
                <div className="feat-bento">

                    {/* MAIN WIDE CARD */}
                    <div className="feat-card feat-card-dark span-2 interactive">
                        <div className="feat-card-body">
                            <div className="feat-icon-wrap"><Ear size={22} color="#fff" /></div>
                            <h3>Detect Objections<br /><em className="font-serif">before they kill the deal.</em></h3>
                            <p>klyro.ai monitors tonality, keyword velocity, and hesitation patterns to surface objections the instant a prospect starts hedging. No more catching yourself off-guard.</p>
                        </div>
                        <div className="feat-card-visual">
                            <div className="feat-orb-blob"></div>
                            <div className="feat-pulse-rings">
                                <div></div><div></div><div></div>
                            </div>
                            <div className="feat-objection-chip">"I need to think about it..."</div>
                        </div>
                    </div>

                    {/* SMALL CARD 1 */}
                    <div className="feat-card interactive">
                        <div className="feat-icon-wrap dark"><Zap size={22} color="#ff5e00" /></div>
                        <h3>Instant Calm</h3>
                        <p>Reduce cognitive load and stay fully present — never scramble for words again.</p>
                    </div>

                    {/* SMALL CARD 2 */}
                    <div className="feat-card interactive">
                        <div className="feat-icon-wrap dark"><Shield size={22} color="#ff5e00" /></div>
                        <h3>Battle-Tested Scripts</h3>
                        <p>10,000+ winning responses curated from the world's top-performing sales calls.</p>
                    </div>

                    {/* WIDE BOTTOM CARD */}
                    <div className="feat-card feat-card-accent span-2 interactive">
                        <div className="feat-card-body">
                            <div className="feat-icon-wrap accent-icon"><Layers size={22} color="#111" /></div>
                            <h3>Works where you work.</h3>
                            <p>Native integration with Zoom, Google Meet, Teams, Salesforce, and every major CRM. No browser extensions, no plugins. Just speak.</p>
                        </div>
                        <div className="feat-apps-row">
                            {['Zoom', 'Meet', 'Teams', 'Slack', 'Salesforce', 'HubSpot'].map(app => (
                                <div className="feat-app-badge" key={app}>{app}</div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Features;
