import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Download } from 'lucide-react';
import './UseCases.css';

const PERSONAS = [
    {
        id: 'accessibility',
        label: 'Accessibility',
        title: 'nx.ai for Accessibility',
        desc: 'Speak freely and naturally. Let nx.ai capture your thoughts without the physical strain of typing. Stay connected and engaged effortlessly.',
    },
    {
        id: 'creators',
        label: 'Creators',
        title: 'nx.ai for Creators',
        desc: 'Draft scripts, outline videos, or write blogs at the speed of thought. Turn your spoken ideas into polished drafts in seconds.',
    },
    {
        id: 'support',
        label: 'Customer Support',
        title: 'nx.ai for Support Teams',
        desc: 'Resolve tickets faster by dictating comprehensive, empathetic responses. Save hours of typing and improve customer satisfaction.',
    },
    {
        id: 'developers',
        label: 'Developers',
        title: 'nx.ai for Developers',
        desc: 'Dictate in natural language and let nx.ai translate—perfect for Cursor, VS Code, or wherever you build. From commit messages to refactors, stay in the zone.',
    },
    {
        id: 'lawyers',
        label: 'Lawyers',
        title: 'nx.ai for Lawyers',
        desc: 'Dictate case notes, emails, and briefs instantly securely. Focus on the legal specifics without being bogged down by transcription.',
    },
    {
        id: 'leaders',
        label: 'Leaders',
        title: 'nx.ai for Leaders',
        desc: 'Communicate vision clearly and quickly. Dictate memos, strategy docs, and team updates between meetings.',
    },
    {
        id: 'sales',
        label: 'Sales',
        title: 'nx.ai for Sales',
        desc: 'Listen to prospects, detect objections, and formulate winning responses instantly. Never freeze on a discovery call again.',
    },
    {
        id: 'students',
        label: 'Students',
        title: 'nx.ai for Students',
        desc: 'Write essays, summarize lectures, and brainstorm project ideas simply by talking them out loud.',
    },
    {
        id: 'teams',
        label: 'Teams',
        title: 'nx.ai for Teams',
        desc: 'Keep everyone on the same page. Quickly generate meeting summaries and action items through collaborative audio notes.',
    }
];

const UseCases = () => {
    const [activePersona, setActivePersona] = useState(PERSONAS[3]);

    const contentRef = useRef(null);
    const sectionRef = useRef(null);
    const containerRef = useRef(null);
    const illustrationRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Pure Parallax on the illustration / right side
            gsap.fromTo(illustrationRef.current,
                { y: 50 },
                {
                    y: -50,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const handlePersonaClick = (persona) => {
        if (activePersona.id === persona.id) return;

        // Quick fade out/in animation for content swap
        gsap.to(contentRef.current, {
            opacity: 0,
            y: 10,
            duration: 0.15,
            onComplete: () => {
                setActivePersona(persona);
                gsap.to(contentRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });
    };
    return (
        <section className="use-cases-section" id="use-cases" ref={sectionRef}>
            <div className="container use-cases-container" ref={containerRef}>

                {/* Left Column: Title and Pills */}
                <div className="use-cases-left">
                    <h2 className="use-cases-title font-serif">
                        <span>nx.ai is made</span><br />
                        <span className="highlight">for you</span>
                    </h2>

                    <div className="persona-pills">
                        {PERSONAS.map((persona) => (
                            <button
                                key={persona.id}
                                className={`persona-pill interactive ${activePersona.id === persona.id ? 'active' : ''}`}
                                onClick={() => handlePersonaClick(persona)}
                            >
                                {persona.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Column: Illustration + Content */}
                <div className="use-cases-right">
                    <div className="use-cases-illustration" ref={illustrationRef}>
                        <div className="placeholder-person">
                            <div className="head"></div>
                            <div className="body">
                                <div className="laptop">
                                    <div className="screen"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="use-cases-content" ref={contentRef}>
                        <h3 className="content-title">
                            <span className="font-serif">nx.ai for </span>
                            <span className="font-serif highlight">{activePersona.label}</span>
                        </h3>
                        <p className="content-desc">{activePersona.desc}</p>

                        <div className="content-actions">
                            <button className="btn btn-outline-dark interactive content-btn">Learn more</button>
                            <button className="btn btn-primary interactive content-btn">
                                <Download size={16} /> Download for Windows
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default UseCases;
