import { Check, Zap, Shield, Star } from 'lucide-react';
import './Pricing.css';

const STARTER_FEATURES = [
    'Unlimited call transcriptions',
    'Real-time objection detection',
    'Desktop app (Mac + Windows)',
    'Basic analytics',
];

const PRO_FEATURES = [
    'Advanced real-time AI suggestions',
    'CRM integrations (SF, HubSpot)',
    'Custom knowledge base API',
    'Team analytics & coaching',
    'Slack & Notion sync',
    'Priority 24/7 support',
];

const Pricing = () => {
    return (
        <section className="pricing-section" id="pricing">
            <div className="container">
                {/* Header */}
                <div className="pr-header">
                    <div className="pr-eyebrow">Investment</div>
                    <h2 className="pr-title">
                        Transparent pricing. <br />
                        <span className="pr-italic">Massive return.</span>
                    </h2>
                    <p className="pr-desc">No contracts. No setup fees. Cancel anytime.</p>
                </div>

                {/* Cards row */}
                <div className="pr-cards">
                    {/* ── STARTER ── */}
                    <div className="pricing-card pr-starter">
                        <div className="pr-card-tag">
                            <Zap size={13} /> Starter
                        </div>
                        <div className="pr-price-row">
                            <span className="pr-curr">$</span>
                            <span className="pr-num">49</span>
                            <span className="pr-per">/mo</span>
                        </div>
                        <p className="pr-tagline">For solo closers who want the edge.</p>
                        <ul className="pr-features">
                            {STARTER_FEATURES.map((f, i) => (
                                <li key={i}><Check size={14} />{f}</li>
                            ))}
                        </ul>
                        <button className="btn btn-outline interactive pr-btn-outline">
                            Start Free Trial
                        </button>
                    </div>

                    {/* ── PRO ── */}
                    <div className="pricing-card pr-pro">
                        <div className="pr-pro-badge">
                            <Star size={11} fill="#fff" color="#fff" /> Popular
                        </div>
                        <div className="pr-card-tag">
                            <Shield size={13} /> Professional
                        </div>
                        <div className="pr-price-row">
                            <span className="pr-curr">$</span>
                            <span className="pr-num">129</span>
                            <span className="pr-per">/user/mo</span>
                        </div>
                        <p className="pr-tagline">For teams who need the full arsenal.</p>
                        <ul className="pr-features">
                            {PRO_FEATURES.map((f, i) => (
                                <li key={i}><Check size={14} />{f}</li>
                            ))}
                        </ul>
                        <button className="btn btn-primary interactive pr-btn-primary">
                            Get Started
                        </button>
                    </div>

                    {/* ── ENTERPRISE ── */}
                    <div className="pricing-card pr-enterprise">
                        <div className="pr-card-tag">Enterprise</div>
                        <div className="pr-price-row">
                            <span className="pr-num">Custom</span>
                        </div>
                        <p className="pr-tagline">For large teams with specific needs.</p>
                        <ul className="pr-features">
                            <li><Check size={14} /> Everything in Pro</li>
                            <li><Check size={14} /> SSO & SAML</li>
                            <li><Check size={14} /> Dedicated CSM</li>
                            <li><Check size={14} /> Custom Training</li>
                        </ul>
                        <button className="btn btn-outline interactive pr-btn-outline">
                            Contact Sales
                        </button>
                    </div>
                </div>

                <p className="pr-footnote">
                    All plans include a <strong>14-day free trial</strong>. No credit card required.
                </p>
            </div>
        </section>
    );
};

export default Pricing;
