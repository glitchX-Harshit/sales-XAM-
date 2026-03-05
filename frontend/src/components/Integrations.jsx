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

const Integrations = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.int-header-line',
                { clipPath: 'inset(0 100% 0 0)' },
                {
                    clipPath: 'inset(0 0% 0 0)',
                    duration: 1.2, stagger: 0.18, ease: 'power4.inOut',
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
                }
            );

            gsap.fromTo('.int-app-pill',
                { scale: 0.85, opacity: 0, y: 20 },
                {
                    scale: 1, opacity: 1, y: 0,
                    duration: 0.6, stagger: 0.08, ease: 'back.out(1.7)',
                    scrollTrigger: { trigger: '.int-apps-cloud', start: 'top 80%' }
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section className="int-section" id="integrations" ref={sectionRef}>
            <div className="container">
                <div className="int-layout">
                    <div className="int-text">
                        <div className="int-eyebrow">Works everywhere</div>
                        <h2 className="int-title">
                            <span className="int-header-line">In every app</span>
                            <span className="int-header-line font-serif"><em>you already use.</em></span>
                        </h2>
                        <p className="int-desc">
                            nx.ai sits at the OS level — no plugins to install, no bots to invite, no awkward "Recording" banners. It just listens.
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
                            <span className="font-serif">nx.ai</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Integrations;
