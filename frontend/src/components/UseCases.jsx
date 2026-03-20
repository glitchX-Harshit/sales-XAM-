import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Download, Mic, Code2, Headphones, Scale, Users, BookOpen, Zap, Shield } from 'lucide-react';
import './UseCases.css';

gsap.registerPlugin(ScrollTrigger);

const PERSONAS = [
    {
        id: 'sales',
        label: 'Sales',
        icon: Zap,
        color: '#ff5e00',
        bg: '#fff2ec',
        title: 'Close deals without freezing.',
        desc: 'klyro.ai listens to your calls, detects objections the second they surface, and surfaces the perfect response — so you never lose your footing again.',
        stat: { n: '22%', l: 'Higher close rate' },
        preview: '"I think we need to think about it..." → ⚡ Detected: Stall objection → "That\'s fair — most teams feel that way at first. Let me show you what made the difference for [Company]."',
    },
    {
        id: 'leaders',
        label: 'Leaders',
        icon: Shield,
        color: '#7c5cbf',
        bg: '#f4f0ff',
        title: 'Think at the speed of leadership.',
        desc: 'Dictate strategy memos, team updates, and executive summaries between back-to-back meetings. klyro.ai turns your thoughts into polished documents instantly.',
        stat: { n: '3×', l: 'Faster decision docs' },
        preview: '"Draft: Focus next quarter on EMEA expansion, prioritize enterprise accounts above 500 seats..." → ✓ Structured memo ready in 4 seconds',
    },
    {
        id: 'developers',
        label: 'Developers',
        icon: Code2,
        color: '#27c93f',
        bg: '#edfff0',
        title: 'Code at the speed of thought.',
        desc: 'Dictate code comments, commit messages, PR descriptions, and documentation in natural language. Works native with Cursor, VS Code, and GitHub.',
        stat: { n: '40%', l: 'Less context switching' },
        preview: '"Write a commit: refactored auth middleware to support multi-tenant sessions, fixes issue #341" → ✓ Commit message formatted & ready',
    },
    {
        id: 'support',
        label: 'Support',
        icon: Headphones,
        color: '#0099ff',
        bg: '#eef7ff',
        title: 'Resolve tickets 4× faster.',
        desc: 'Dictate comprehensive, empathetic responses without the typing. See CSAT scores climb as your team spends more time thinking, less time typing.',
        stat: { n: '4×', l: 'Faster ticket resolution' },
        preview: '"Tell the customer we apologize for the delays and that their refund will be processed within 3 business days" → ✓ Professional reply drafted',
    },
    {
        id: 'creators',
        label: 'Creators',
        icon: Mic,
        color: '#ff3d71',
        bg: '#fff0f4',
        title: 'Turn voice into viral content.',
        desc: 'Draft scripts, outline video essays, write blog posts, or brainstorm angles just by talking. From idea to draft in seconds, not hours.',
        stat: { n: '5×', l: 'Faster content output' },
        preview: '"YouTube script: 5 reasons why most people fail at content creation — hook with failure stat, pivot to mindset framework..." → ✓ Script outline ready',
    },
    {
        id: 'lawyers',
        label: 'Lawyers',
        icon: Scale,
        color: '#d4a017',
        bg: '#fffbec',
        title: 'Document. Dictate. Done.',
        desc: 'Case notes, contract summaries, and client briefs — transcribed accurately with legal vocabulary preserved. Stays entirely on-device.',
        stat: { n: '60%', l: 'Less admin time' },
        preview: '"Note for case file: plaintiff alleges breach of fiduciary duty under Section 12a of the Delaware Code, hearing scheduled for..." → ✓ Case note saved',
    },
    {
        id: 'students',
        label: 'Students',
        icon: BookOpen,
        color: '#17b0d4',
        bg: '#ecfcff',
        title: 'Learn at the speed of ideas.',
        desc: 'Outline essays, summarize lectures, and brainstorm arguments just by thinking out loud. No more staring at a blank page.',
        stat: { n: '2×', l: 'Faster essay drafts' },
        preview: '"Essay intro: argue that urban planning failures in the 20th century directly contributed to modern mental health crises..." → ✓ Thesis + outline ready',
    },
    {
        id: 'teams',
        label: 'Teams',
        icon: Users,
        color: '#ff5e00',
        bg: '#fff2ec',
        title: 'Meetings that actually move things.',
        desc: 'Capture action items and generate meeting summaries in real time. Everyone leaves knowing exactly what was decided and who owns it.',
        stat: { n: '80%', l: 'Fewer follow-up emails' },
        preview: '"End of standup: Alex owns the API refactor, deadline Thursday. Mia reviews designs by EOD. Meeting next Monday 10am." → ✓ Summary sent to Slack',
    },
];

const UseCases = () => {
    const [active, setActive] = useState(PERSONAS[0]);
    const [hovered, setHovered] = useState(null);
    const sectionRef = useRef(null);
    const cardRef = useRef(null);
    const contentRef = useRef(null);
    const previewRef = useRef(null);

    /* ── 3D tilt the right panel on mouse move ── */
    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        let rafId;
        let targetX = 0, targetY = 0, curX = 0, curY = 0;

        const onMove = (e) => {
            const r = card.getBoundingClientRect();
            targetX = ((e.clientX - r.left) / r.width - 0.5) * 14;
            targetY = ((e.clientY - r.top) / r.height - 0.5) * -10;
        };

        const onLeave = () => { targetX = 0; targetY = 0; };

        const tick = () => {
            curX += (targetX - curX) * 0.08;
            curY += (targetY - curY) * 0.08;
            gsap.set(card, { rotateY: curX, rotateX: curY, transformPerspective: 900 });
            rafId = requestAnimationFrame(tick);
        };

        card.addEventListener('mousemove', onMove);
        card.addEventListener('mouseleave', onLeave);
        rafId = requestAnimationFrame(tick);

        return () => {
            card.removeEventListener('mousemove', onMove);
            card.removeEventListener('mouseleave', onLeave);
            cancelAnimationFrame(rafId);
        };
    }, []);

    /* ── Scroll reveal ── */
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.uc-header > *',
                { y: 50, opacity: 0 },
                {
                    y: 0, opacity: 1, stagger: 0.12, duration: 0.9, ease: 'power3.out',
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
                }
            );
            gsap.fromTo('.uc-persona-grid > *',
                { scale: 0.85, opacity: 0 },
                {
                    scale: 1, opacity: 1, stagger: 0.06, duration: 0.5, ease: 'back.out(1.5)',
                    scrollTrigger: { trigger: '.uc-persona-grid', start: 'top 80%' }
                }
            );
            gsap.fromTo('.uc-panel',
                { y: 60, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 1, ease: 'power3.out',
                    scrollTrigger: { trigger: '.uc-panel', start: 'top 80%' }
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const switchPersona = (persona) => {
        if (persona.id === active.id) return;
        gsap.to(contentRef.current, {
            opacity: 0, y: 12, duration: 0.15,
            onComplete: () => {
                setActive(persona);
                gsap.to(contentRef.current, { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' });
            }
        });
        // Animate the typing preview
        if (previewRef.current) {
            gsap.fromTo(previewRef.current,
                { opacity: 0, x: -10 },
                { opacity: 1, x: 0, duration: 0.4, delay: 0.2, ease: 'power2.out' }
            );
        }
    };

    const Icon = active.icon;

    return (
        <section className="uc-section" id="use-cases" ref={sectionRef}>
            {/* ── Header ── */}
            <div className="container uc-header">
                <div className="uc-eyebrow">Who it's for</div>
                <h2 className="uc-title">
                    <span className="font-serif"><em>klyro.ai</em> is made</span>{' '}
                    <span className="uc-title-plain">for you.</span>
                </h2>
                <p className="uc-subtitle">
                    Select your role. See exactly what klyro.ai does for you.
                </p>
            </div>

            <div className="container uc-layout">
                {/* ── Left: Persona Selector Grid ── */}
                <div className="uc-selector">
                    <div className="uc-persona-grid">
                        {PERSONAS.map((p) => {
                            const PIcon = p.icon;
                            const isActive = active.id === p.id;
                            return (
                                <button
                                    key={p.id}
                                    className={`uc-persona-btn interactive ${isActive ? 'active' : ''}`}
                                    style={{ '--persona-color': p.color, '--persona-bg': p.bg }}
                                    onClick={() => switchPersona(p)}
                                    onMouseEnter={() => setHovered(p.id)}
                                    onMouseLeave={() => setHovered(null)}
                                >
                                    <div className="ucpb-icon">
                                        <PIcon size={18} />
                                    </div>
                                    <span className="ucpb-label">{p.label}</span>
                                    {isActive && <div className="ucpb-active-dot"></div>}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ── Right: Animated Panel ── */}
                <div className="uc-panel" ref={cardRef} style={{ transformStyle: 'preserve-3d' }}>
                    <div className="uc-panel-inner" ref={contentRef}>
                        {/* Panel top bar */}
                        <div className="uc-panel-bar" style={{ background: active.color }}>
                            <div className="uc-panel-dots">
                                <span></span><span></span><span></span>
                            </div>
                            <span className="uc-panel-title-bar">klyro.ai — {active.label}</span>
                            <div className="uc-panel-live">● LIVE</div>
                        </div>

                        {/* Main content */}
                        <div className="uc-panel-body">
                            <div className="uc-panel-stat-pill" style={{ color: active.color, borderColor: active.color + '33', background: active.bg }}>
                                <span className="stat-n">{active.stat.n}</span>
                                <span className="stat-l">{active.stat.l}</span>
                            </div>

                            <h3 className="uc-panel-heading">{active.title}</h3>
                            <p className="uc-panel-desc">{active.desc}</p>

                            {/* Interactive typing preview */}
                            <div className="uc-preview" ref={previewRef}>
                                <div className="uc-preview-label">
                                    <span style={{ color: active.color }}>✦</span> Live example
                                </div>
                                <div className="uc-preview-text">
                                    {active.preview}
                                </div>
                            </div>

                            <div className="uc-panel-actions">
                                <button className="uc-btn-primary interactive" style={{ background: active.color }}>
                                    <Download size={16} /> Try for free
                                </button>
                                <button className="uc-btn-ghost interactive">Learn more →</button>
                            </div>
                        </div>

                        {/* Decorative blob */}
                        <div className="uc-panel-blob" style={{ background: active.color }}></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UseCases;
