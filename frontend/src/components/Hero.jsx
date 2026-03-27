import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Download, ArrowDown } from 'lucide-react';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

const Hero = ({ onGetStarted }) => {
    const heroRef = useRef(null);
    const blob1Ref = useRef(null);
    const blob2Ref = useRef(null);
    const cardRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ delay: 0.1 });

            tl.fromTo('.hero-line-reveal',
                { clipPath: 'inset(0 0 100% 0)', y: 30 },
                { clipPath: 'inset(0 0 0% 0)', y: 0, duration: 1.1, stagger: 0.18, ease: 'power4.out' }
            )
                // ... existing GSAP logic ...
                .fromTo('.hero-meta-row', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.6')
                .fromTo('.hero-bottom-bar', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
                .fromTo('.hero-card', { opacity: 0, y: 40, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out' }, '-=0.6');

            /* Mouse tracking */
            const hero = heroRef.current;
            let mouseX = 0, mouseY = 0;
            let curX = 0, curY = 0;

            const onMove = (e) => {
                const r = hero.getBoundingClientRect();
                mouseX = ((e.clientX - r.left) / r.width - 0.5) * 2;
                mouseY = ((e.clientY - r.top) / r.height - 0.5) * 2;
            };

            const tick = () => {
                curX += (mouseX - curX) * 0.06;
                curY += (mouseY - curY) * 0.06;
                if (blob1Ref.current) gsap.set(blob1Ref.current, { x: curX * 50, y: curY * 30 });
                if (blob2Ref.current) gsap.set(blob2Ref.current, { x: curX * -35, y: curY * -25 });
                if (cardRef.current) {
                    gsap.set(cardRef.current, {
                        rotateY: curX * 7,
                        rotateX: curY * -5,
                        transformPerspective: 900
                    });
                }
            };

            gsap.ticker.add(tick);
            hero.addEventListener('mousemove', onMove);

            /* Scroll parallax */
            gsap.to('.hero-title-group', { y: 80, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 2 } });
            gsap.to('.hero-card', { y: -80, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1.5 } });

            /* Badge */
            gsap.to('.hero-badge-text', { rotation: 360, duration: 16, repeat: -1, ease: 'linear' });

            /* Live bars */
            gsap.utils.toArray('.live-bar').forEach((bar, i) => {
                gsap.to(bar, { scaleY: Math.random() * 0.85 + 0.15, duration: 0.25 + Math.random() * 0.3, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.07 });
            });

            /* Magnetic CTA */
            const cta = document.querySelector('.hero-cta-btn');
            if (cta) {
                cta.parentElement?.addEventListener('mousemove', (e) => {
                    const r = cta.getBoundingClientRect();
                    gsap.to(cta, { x: (e.clientX - (r.left + r.width / 2)) * 0.28, y: (e.clientY - (r.top + r.height / 2)) * 0.28, duration: 0.4, ease: 'power2.out' });
                });
                cta.parentElement?.addEventListener('mouseleave', () => {
                    gsap.to(cta, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
                });
            }

            return () => { hero.removeEventListener('mousemove', onMove); gsap.ticker.remove(tick); };
        }, heroRef);
        return () => ctx.revert();
    }, []);

    return (
        <section className="hero" ref={heroRef}>

            {/* ── LIGHT CANVAS ── */}
            <div className="hero-bg">
                <div className="hero-grain"></div>
                <div className="hero-blob blob-1" ref={blob1Ref}></div>
                <div className="hero-blob blob-2" ref={blob2Ref}></div>
                <div className="hero-grid"></div>
            </div>

            {/* ── INNER LAYOUT ── */}
            <div className="hero-inner container">
                <div className="hero-meta-row">
                    <div className="hero-live-tag">
                        <span className="live-dot"></span>
                        AI Listening Now
                    </div>
                    <div className="hero-tag-right">Trusted by 2,000+ sales teams</div>
                </div>

                <div className="hero-title-group">
                    <div className="hero-line-reveal">
                        <h1 className="hero-t1"><em className="hero-serif-em">Close deals.</em></h1>
                    </div>
                    <div className="hero-line-reveal">
                        <h1 className="hero-t2">Under pressure.</h1>
                    </div>
                    <div className="hero-line-reveal">
                        <h1 className="hero-t3">klyro.ai handles the rest.</h1>
                    </div>
                </div>

                <div className="hero-bottom-bar">
                    <div className="hero-cta-group">
                        <div className="hero-cta-wrap">
                            <button className="hero-cta-btn interactive" onClick={onGetStarted}>
                                <Download size={18} />
                                Get Started Free
                            </button>
                        </div>
                        <a href="#how-it-works" className="hero-scroll-link interactive">
                            <ArrowDown size={16} />
                            See how it works
                        </a>
                    </div>

                    <div className="hero-stats-row">
                        {[
                            { n: '4×', l: 'faster responses' },
                            { n: '94%', l: 'objection coverage' },
                            { n: '22%', l: 'higher close rate' },
                        ].map((s, i) => (
                            <div className="hero-stat" key={i}>
                                <span className="stat-n">{s.n}</span>
                                <span className="stat-l">{s.l}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── FLOATING AI CARD ── */}
            <div className="hero-card-wrapper">
                <div className="hero-card" ref={cardRef} style={{ transformStyle: 'preserve-3d' }}>
                    <div className="hero-card-header">
                        <div className="hch-dots">
                            <span style={{ background: '#ff5f56' }}></span>
                            <span style={{ background: '#ffbd2e' }}></span>
                            <span style={{ background: '#27c93f' }}></span>
                        </div>
                        <p className="hch-title">klyro.ai — Live Call</p>
                        <div className="hch-live">● LIVE</div>
                    </div>

                    <div className="hero-card-body">
                        <div className="hcb-block">
                            <span className="hcb-who">Prospect</span>
                            <p>"The pricing doesn't work for our budget..."</p>
                        </div>
                        <div className="hcb-alert">⚡ Pricing Objection Detected</div>
                        <div className="hcb-response">
                            <div className="hcb-response-label"><span className="resp-star">✦</span> klyro.ai Recommends</div>
                            <p>"Many clients start with our 5-seat plan and upgrade after seeing ROI. Want to walk through that?"</p>
                            <div className="hcb-response-stat"><span className="stat-dot"></span> 94% success on this objection</div>
                        </div>
                    </div>

                    <div className="hero-card-footer">
                        <div className="live-bars-group">
                            {[...Array(20)].map((_, i) => <div className="live-bar" key={i}></div>)}
                        </div>
                        <span className="livef-label">Listening...</span>
                    </div>
                </div>

                <div className="hero-badge">
                    <svg className="hero-badge-text" viewBox="0 0 160 160" width="160" height="160">
                        <defs>
                            <path id="bc" d="M 80,80 m -60,0 a 60,60 0 1,1 120,0 a 60,60 0 1,1 -120,0" />
                        </defs>
                        <text fontSize="12" letterSpacing="5" fill="rgba(0,0,0,0.3)" fontFamily="'Plus Jakarta Sans'" fontWeight="700">
                            <textPath href="#bc">CLOSE MORE • klyro.ai • WIN EVERY CALL •&nbsp;</textPath>
                        </text>
                    </svg>
                    <div className="badge-star">★</div>
                </div>
            </div>

            {/* ── TICKER ── */}
            <div className="hero-ticker">
                <div className="hero-ticker-inner">
                    {[...Array(10)].map((_, i) => (
                        <span className="ticker-item" key={i}>
                            REAL-TIME AI &nbsp;◆&nbsp; OBJECTION DETECTION &nbsp;◆&nbsp; WIN MORE DEALS &nbsp;◆&nbsp;
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hero;
