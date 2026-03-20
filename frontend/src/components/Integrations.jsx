import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Integrations.css';

gsap.registerPlugin(ScrollTrigger);

const APPS = [
    { name: 'Zoom', color: '#2D8CFF' },
    { name: 'Teams', color: '#6264A7' },
    { name: 'Google Meet', color: '#00897B' },
    { name: 'Salesforce', color: '#00A1E0' },
    { name: 'HubSpot', color: '#FF7A59' },
    { name: 'Slack', color: '#4A154B' },
    { name: 'Notion', color: '#000000' },
    { name: 'VS Code', color: '#007ACC' },
];

/* 
  Snake path — a series of sinuous S-curves that travels
  across the full width of the section from top-left to bottom-right.
  ViewBox: 1400 × 800, so we can scale it freely with CSS.
*/
const SNAKE_PATH = `
  M -50,120
  C 200,20  400,280  700,160
  S 1050,30  1200,180
  S 1500,320 1700,200
  S 1950,80  2100,220
  C 2250,320 2100,500 1800,460
  S 1400,340 1100,480
  S 700,600  400,500
  S 100,400  -50,520
  C -150,620 100,720  350,680
  S 750,580  1000,700
  S 1300,800 1600,740
  S 1900,640 2100,760
`;

const Integrations = () => {
    const sectionRef = useRef(null);
    const path1Ref = useRef(null);
    const path2Ref = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {

            /* ── Animate SVG snake stroke on scroll ── */
            [path1Ref, path2Ref].forEach((ref, idx) => {
                const el = ref.current;
                if (!el) return;

                // Get total path length and set starting state
                const length = el.getTotalLength();
                gsap.set(el, {
                    strokeDasharray: length,
                    strokeDashoffset: length,
                });

                // Draw stroke as user scrolls through section
                gsap.to(el, {
                    strokeDashoffset: 0,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%',
                        end: 'bottom 20%',
                        scrub: 1.5 + idx * 0.5,
                    },
                });
            });

            /* ── Text header reveal ── */
            gsap.fromTo('.int-header-line',
                { clipPath: 'inset(0 100% 0 0)' },
                {
                    clipPath: 'inset(0 0% 0 0)',
                    duration: 1.2, stagger: 0.18, ease: 'power4.inOut',
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
                }
            );

            /* ── Pills pop in ── */
            gsap.fromTo('.int-app-pill',
                { scale: 0.85, opacity: 0, y: 20 },
                {
                    scale: 1, opacity: 1, y: 0,
                    duration: 0.7, stagger: 0.08, ease: 'back.out(1.7)',
                    scrollTrigger: { trigger: '.int-apps-cloud', start: 'top 80%' }
                }
            );

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="int-section" id="integrations" ref={sectionRef}>

            {/* ── SVG SNAKE BACKGROUND ── */}
            <div className="int-svg-bg" aria-hidden="true">
                <svg
                    className="int-snake-svg"
                    viewBox="0 0 2100 900"
                    preserveAspectRatio="xMidYMid slice"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Shadow/thickness layer — slightly offset, more opaque */}
                    <path
                        ref={path1Ref}
                        d={SNAKE_PATH}
                        stroke="rgba(255,94,0,0.12)"
                        strokeWidth="80"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                    />
                    {/* Crisp top stroke layer */}
                    <path
                        ref={path2Ref}
                        d={SNAKE_PATH}
                        stroke="rgba(255,94,0,0.5)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="12 18"
                        fill="none"
                    />
                </svg>
            </div>

            <div className="container">
                <div className="int-layout">
                    <div className="int-text">
                        <div className="int-eyebrow">Works everywhere</div>
                        <h2 className="int-title">
                            <span className="int-header-line">In every app</span>
                            <span className="int-header-line font-serif"><em>you already use.</em></span>
                        </h2>
                        <p className="int-desc">
                            klyro.ai sits at the OS level — no plugins to install, no bots to invite, no awkward "Recording" banners. It just listens.
                        </p>
                    </div>

                    <div className="int-apps-cloud">
                        {APPS.map((app, i) => (
                            <div className="int-app-pill interactive" key={i} style={{ '--app-color': app.color }}>
                                <div className="int-app-dot"></div>
                                <span>{app.name}</span>
                            </div>
                        ))}
                        <div className="int-central-hub">
                            <span className="font-serif">klyro.ai</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Integrations;
