import { Ear, Zap, Shield, Layers } from 'lucide-react';
import './Features.css';

const STATS = [
    { value: 4, suffix: '×', label: 'Faster objection detection than manual monitoring' },
    { value: 94, suffix: '%', label: 'Coverage across the most common sales objections' },
    { value: 22, suffix: '%', label: 'Average increase in close rates for active users' },
];

const Features = () => {
    return (
        <section className="features-section" id="features">
            <div className="container">
                {/* Header */}
                <div className="feat-header">
                    <div className="feat-header-eyebrow">Capabilities</div>
                    <h2 className="feat-header-title">
                        <div className="feat-header-line">Listen. <em>Detect.</em> Close.</div>
                    </h2>
                </div>

                {/* Stats row */}
                <div className="feat-stats-row">
                    {STATS.map((s, i) => (
                        <div className="feat-stat-card" key={i}>
                            <div className="feat-stat-number">
                                <span className="stat-counter">{s.value}</span>
                                <span className="stat-suf">{s.suffix}</span>
                            </div>
                            <p className="feat-stat-label">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Bento grid */}
                <div className="feat-bento">
                    <div className="feat-card span-2 interactive">
                        <div className="feat-icon-wrap"><Ear size={24} color="#7c3aed" /></div>
                        <h3>Detect Objections <em>In-Real-Time.</em></h3>
                        <p>klyro.ai monitors tonality, keyword velocity, and hesitation patterns to surface objections the instant a prospect starts hedging. No more catching yourself off-guard.</p>
                    </div>

                    <div className="feat-card interactive">
                        <div className="feat-icon-wrap"><Zap size={24} color="#7c3aed" /></div>
                        <h3>Instant Calm</h3>
                        <p>Reduce cognitive load and stay fully present — never scramble for words again. Our suggestions are there when you need them.</p>
                    </div>

                    <div className="feat-card interactive">
                        <div className="feat-icon-wrap"><Shield size={24} color="#7c3aed" /></div>
                        <h3>Battle-Tested Scripts</h3>
                        <p>10,000+ winning responses curated from the world's top-performing sales calls. Instant access to the best response for any situation.</p>
                    </div>

                    <div className="feat-card span-2 interactive">
                        <div className="feat-icon-wrap"><Layers size={24} color="#7c3aed" /></div>
                        <h3>Works Where You Work.</h3>
                        <p>Native integration with Zoom, Google Meet, Teams, Salesforce, and every major CRM. No browser extensions, no plugins. Just speak.</p>
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
