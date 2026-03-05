import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Globe, MessageSquare, Database, Mail, Terminal, Layers } from 'lucide-react';
import './Integrations.css';

const INTEGRATIONS = [
    { id: 'zoom', icon: <Globe size={24} />, name: 'Zoom', color: '#2D8CFF' },
    { id: 'teams', icon: <MessageSquare size={24} />, name: 'Teams', color: '#6264A7' },
    { id: 'salesforce', icon: <Database size={24} />, name: 'Salesforce', color: '#00A1E0' },
    { id: 'gmail', icon: <Mail size={24} />, name: 'Gmail', color: '#EA4335' },
    { id: 'vscode', icon: <Terminal size={24} />, name: 'VS Code', color: '#007ACC' },
    { id: 'slack', icon: <Layers size={24} />, name: 'Slack', color: '#4A154B' },
];

const Integrations = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Fade in the title
            gsap.fromTo('.int-title-wrapper > *',
                { y: 30, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%'
                    }
                }
            );

            // Animate the integration pills scaling in
            gsap.fromTo('.int-pill',
                { scale: 0.8, opacity: 0, y: 20 },
                {
                    scale: 1, opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'back.out(1.5)',
                    scrollTrigger: {
                        trigger: '.int-grid',
                        start: 'top 85%'
                    }
                }
            );

            // Parallax scroll the connecting paths
            gsap.to('.int-path', {
                strokeDashoffset: 0,
                duration: 2,
                ease: 'power1.inOut',
                scrollTrigger: {
                    trigger: '.int-grid',
                    start: 'top 80%',
                    end: 'bottom center',
                    scrub: 1
                }
            });

        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section className="container int-section" id="integrations" ref={sectionRef}>
            <div className="int-title-wrapper">
                <h2 className="int-title">
                    <span className="font-serif">Works seamlessly</span><br />
                    in every app
                </h2>
                <p className="int-desc">
                    nx.ai runs quietly in the background, native to your operating system. No bots to invite, no awkward recording warnings. It just works wherever you type or talk.
                </p>
            </div>

            <div className="int-visual-area">
                <svg className="int-svg-bg" width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, zIndex: 0, overflow: 'visible' }}>
                    {/* Abstract connecting lines */}
                    <path className="int-path p1" d="M 10 50 Q 150 20 300 100 T 600 50" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="2" strokeDasharray="1000" strokeDashoffset="1000" />
                    <path className="int-path p2" d="M 50 150 Q 250 180 400 100 T 800 150" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="2" strokeDasharray="1000" strokeDashoffset="1000" />
                </svg>

                <div className="int-grid">
                    {INTEGRATIONS.map(int => (
                        <div key={int.id} className="int-pill interactive" style={{ '--int-color': int.color }}>
                            <div className="int-icon">{int.icon}</div>
                            <span className="int-name">{int.name}</span>
                        </div>
                    ))}
                    {/* nx.ai central hub item */}
                    <div className="int-pill central interactive">
                        <span className="font-serif">nx.ai</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Integrations;
