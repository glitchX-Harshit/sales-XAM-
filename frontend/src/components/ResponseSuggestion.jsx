import { Zap, Mic } from 'lucide-react';
import './ResponseSuggestion.css';

const ResponseSuggestion = () => {
    return (
        <section className="resp-section" id="response-suggestions">
            <div className="container">
                <div className="resp-layout">
                    {/* Text content */}
                    <div className="resp-text-content">
                        <div className="resp-eyebrow">
                            <Zap size={14} />
                            <span>AI Closing Engine</span>
                        </div>
                        <h2 className="resp-title">
                            Never scramble <br />
                            for <em>words </em> again.
                        </h2>
                        <p className="resp-desc">
                            Get high-converting, context-aware response suggestions 
                            the moment an objection is detected. 
                        </p>
                    </div>

                    {/* Interactive area */}
                    <div className="resp-interactive-area">
                        {/* Before/Standard */}
                        <div className="resp-card secondary">
                            <div className="resp-card-header">
                                Standard Response (Average)
                            </div>
                            <p>"Uh, let me check with my manager on the pricing for that..."</p>
                            <div className="resp-card-footer">
                                Logic: Defensive • Probability: 12%
                            </div>
                        </div>

                        {/* After/AI */}
                        <div className="resp-card primary interactive">
                            <div className="resp-card-header highlight">
                                <Mic size={14} />
                                ✦ klyro.ai Recommendation
                            </div>
                            <p>
                                "Our Starter plan at $49/seat is designed exactly for teams your size, 
                                and it usually sees a full ROI within the first 30 days. Shall we look at the numbers?"
                            </p>
                            <div className="resp-card-footer" style={{ color: '#7c3aed' }}>
                                Logic: Value-First • Probability: 94%
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ResponseSuggestion;
