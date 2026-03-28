import { useEffect, useRef } from 'react';
import { Download, ArrowDown } from 'lucide-react';
import './Hero.css';

const Hero = ({ onGetStarted }) => {
    return (
        <section className="hero">
            {/* ── BACKGROUND ── */}
            <div className="hero-bg">
                <div className="hero-blob"></div>
                <div className="hero-grid"></div>
            </div>

            <div className="container hero-inner">
                {/* ── META ── */}
                <div className="hero-meta-row">
                    <div className="hero-live-tag">
                        <span className="live-dot"></span>
                        AI Listening Now
                    </div>
                    <div className="hero-tag-right">Trusted by 2,000+ sales teams</div>
                </div>

                {/* ── TITLE ── */}
                <div className="hero-title-group">
                    <h1 className="hero-t1">
                        Close deals. <br />
                        <span className="hero-serif-em">Under pressure.</span>
                    </h1>
                    <h2 className="hero-t2">klyro.ai handles the rest.</h2>
                    <p className="hero-t3">
                        Real-time AI objection handling and response suggestions for high-performance sales teams. Win every call, every time.
                    </p>
                </div>

                {/* ── BOTTOM BAR ── */}
                <div className="hero-bottom-bar">
                    <div className="hero-cta-group">
                        <button className="btn btn-primary hero-cta-btn interactive" onClick={onGetStarted}>
                            <Download size={18} />
                            Get Started Free
                        </button>
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

                {/* ── AI CARD PREVIEW ── */}
                <div className="hero-card-wrapper">
                    <div className="hero-card">
                        <div className="hero-card-header">
                            <div className="hch-dots">
                                <span style={{ background: '#ff5f56' }}></span>
                                <span style={{ background: '#ffbd2e' }}></span>
                                <span style={{ background: '#27c93f' }}></span>
                            </div>
                            <span className="hch-title">klyro.ai — Live Call</span>
                            <span className="hch-live" style={{ color: '#ff5f56', fontSize: '10px', fontWeight: 'bold' }}>● LIVE</span>
                        </div>

                        <div className="hero-card-body">
                            <div className="hcb-block">
                                <span className="hcb-who">Prospect</span>
                                <p style={{ fontSize: '0.9rem', color: '#fff' }}>"The pricing doesn't work for our budget..."</p>
                            </div>
                            <div className="hcb-alert">⚡ Pricing Objection Detected</div>
                            <div className="hcb-response">
                                <span className="hcb-response-label">✦ klyro.ai Recommends</span>
                                <p style={{ fontSize: '0.85rem', color: '#a0a0a0' }}>
                                    "Many clients start with our 5-seat plan and upgrade after seeing ROI. Want to walk through that?"
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
