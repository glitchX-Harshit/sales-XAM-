import { useState } from 'react';
import { Target, Users, TrendingUp, Handshake } from 'lucide-react';
import './UseCases.css';

const PERSONAS = [
    {
        id: 'ae',
        label: 'Account Executives',
        icon: <Target size={18} />,
        color: '#7c3aed',
        bg: 'rgba(124, 58, 237, 0.1)',
        stat: '22%',
        statLabel: 'Higher Close Rate',
        heading: 'Win more deals, faster.',
        desc: 'Stay fully present during discovery calls. klyro.ai handles the objection tracking and script navigation so you can focus on building trust.',
        preview: '“Your pricing is high compared to XYZ.” → klyro.ai: “We offer 24/7 priority support and custom integrations which XYZ lacks. Want to see the ROI dashboard?”'
    },
    {
        id: 'sdr',
        label: 'SDRs / BDRs',
        icon: <Users size={18} />,
        color: '#0ea5e9',
        bg: 'rgba(14, 165, 233, 0.1)',
        stat: '40%',
        statLabel: 'More Meetings Set',
        heading: 'Convert cold calls to meetings.',
        desc: 'Never get flustered by a brush-off. Get instant rebuttals for "send me an email" or "not interested right now" while you\'re still on the phone.',
        preview: '“Just send me an email.” → klyro.ai: “I certainly can, but usually people ask that because they’re busy. Are you heading into a meeting, or is it just bad timing?”'
    },
    {
        id: 'managers',
        label: 'Sales Managers',
        icon: <TrendingUp size={18} />,
        color: '#27c93f',
        bg: 'rgba(39, 201, 63, 0.1)',
        stat: '100%',
        statLabel: 'Playbook Compliance',
        heading: 'Coach your team at scale.',
        desc: 'Ensure every rep follows the approved playbook. klyro.ai automatically surfaces the right script at the right time during live calls.',
        preview: '“Manager Hint: Rep hasn’t mentioned the Q3 enterprise discount yet - notify now.”'
    },
    {
        id: 'leaders',
        label: 'Sales Leaders',
        icon: <Handshake size={18} />,
        color: '#f59e0b',
        bg: 'rgba(245, 158, 11, 0.1)',
        stat: '12%',
        statLabel: 'Market Insight Gain',
        heading: 'Real-time market intelligence.',
        desc: 'Understand exactly why deals are stalling across your entire organization. Aggregate objection data to refine your product and pricing strategy.',
        preview: '“Insight: 44% of lost deals in Q3 cited the same missing integration. Priority 1.”'
    }
];

const UseCases = () => {
    const [activeTab, setActiveTab] = useState('ae');
    const activePersona = PERSONAS.find(p => p.id === activeTab);

    return (
        <section className="uc-section" id="use-cases">
            <div className="container">
                <div className="uc-header">
                    <div className="uc-eyebrow">Personas</div>
                    <h2 className="uc-title">
                        Built for the <em>entire </em> <br />
                        sales organization.
                    </h2>
                    <p className="uc-subtitle">
                        Whether you\'re on the front lines or leading the team, 
                        klyro.ai gives you the competitive edge.
                    </p>
                </div>

                <div className="uc-layout">
                    {/* Sidebar Selector */}
                    <div className="uc-selector">
                        <div className="uc-persona-grid">
                            {PERSONAS.map(p => (
                                <button 
                                    key={p.id}
                                    className={`uc-persona-btn ${activeTab === p.id ? 'active' : ''}`}
                                    onClick={() => setActiveTab(p.id)}
                                >
                                    <span className="ucpb-icon" style={{ color: p.color }}>{p.icon}</span>
                                    <span className="ucpb-label">{p.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Panel */}
                    <div className="uc-panel">
                        <div className="uc-panel-inner">
                            <div className="uc-panel-stat-pill">
                                <span className="stat-n">{activePersona.stat}</span>
                                <span className="stat-l">{activePersona.statLabel}</span>
                            </div>
                            
                            <h3 className="uc-panel-heading">{activePersona.heading}</h3>
                            <p className="uc-panel-desc">{activePersona.desc}</p>
                            
                            <div className="uc-preview">
                                <span className="uc-preview-label">Live Preview</span>
                                <p className="uc-preview-text">{activePersona.preview}</p>
                            </div>
                            
                            <button className="btn btn-primary uc-btn-primary interactive">
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UseCases;
