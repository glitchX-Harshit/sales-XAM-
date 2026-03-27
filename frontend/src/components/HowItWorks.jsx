import './HowItWorks.css';

const STEPS = [
    {
        num: 'Step 01',
        title: 'Join your call',
        sub: 'Open your sales call in Zoom, Google Meet, or Microsoft Teams. Start klyro.ai to begin listening and analyzing.',
        insight: 'No browser extensions required'
    },
    {
        num: 'Step 02',
        title: 'Real-time analysis',
        sub: 'Our AI engine listens to both sides of the conversation, detecting objections and buyer intent as they happen.',
        insight: '80ms Latency'
    },
    {
        num: 'Step 03',
        title: 'Close the deal',
        sub: 'Get instant, high-converting response suggestions and battle-tested scripts to win every negotiation.',
        insight: 'Win rate ↑22%'
    }
];

const HowItWorks = () => {
    return (
        <section className="hiw-section" id="how-it-works">
            <div className="container">
                {/* Header */}
                <div className="hiw-header">
                    <div className="hiw-eyebrow">The Process</div>
                    <h2 className="hiw-title">
                        <div className="hiw-section-line">Built for <em>speed.</em></div>
                        <div className="hiw-section-line">Designed for <em>results.</em></div>
                    </h2>
                </div>

                {/* Steps Grid */}
                <div className="hiw-steps">
                    {STEPS.map((s, i) => (
                        <div key={i} className="hiw-step">
                            <span className="hiw-step-num">{s.num}</span>
                            <h3 className="hiw-step-title">{s.title}</h3>
                            <p className="hiw-step-sub">{s.sub}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
