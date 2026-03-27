import './ObjectionHandling.css';

const OBJECTIONS = [
    {
        type: 'warning',
        label: '💰 Budget Concern',
        text: '"$5,000 is way over what we allocated for this quarter."',
        footer: 'High-probability objection'
    },
    {
        type: 'danger',
        label: '🧩 Complexity Risk',
        text: '"We tried another AI tool last year and it was literally impossible to set up."',
        footer: 'Onboarding focus needed'
    },
    {
        type: 'error',
        label: '🔗 Integration Gap',
        text: '"If this doesn\'t sync with HubSpot, it\'s a non-starter for my team."',
        footer: 'Native integration available'
    }
];

const ObjectionHandling = () => {
    return (
        <section className="obj-section" id="objections">
            <div className="container">
                {/* Header */}
                <div className="obj-header">
                    <div className="obj-eyebrow">Handling Objections</div>
                    <h2 className="obj-title">
                        Surface <em>hidden friction</em> <br />
                        before you lose the deal.
                    </h2>
                    <p className="obj-desc">
                        klyro.ai detects subtle tonality shifts and hesitation patterns, 
                        alerting you to objections the second they surface.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="obj-cards-container">
                    {OBJECTIONS.map((obj, i) => (
                        <div key={i} className={`obj-card ${obj.type} interactive`}>
                            <div className="obj-card-header">
                                {obj.label}
                            </div>
                            <p>{obj.text}</p>
                            <div className="obj-card-footer">
                                {obj.footer}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ObjectionHandling;
