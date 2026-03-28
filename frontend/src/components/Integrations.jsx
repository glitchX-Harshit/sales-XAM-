import './Integrations.css';

const APPS = [
    { name: 'Zoom', color: '#2D8CFF' },
    { name: 'Google Meet', color: '#00AC47' },
    { name: 'Teams', color: '#6264A7' },
    { name: 'Slack', color: '#4A154B' },
    { name: 'Salesforce', color: '#00A1E0' },
    { name: 'HubSpot', color: '#FF7A59' },
    { name: 'Notion', color: '#000000' },
    { name: 'Clari', color: '#F8A155' },
    { name: 'Gong', color: '#E82B6D' },
];

const Integrations = () => {
    return (
        <section className="int-section" id="integrations">
            <div className="container">
                <div className="int-layout">
                    {/* Text content */}
                    <div className="int-text">
                        <div className="int-eyebrow">Integrations</div>
                        <h2 className="int-title">
                            Works where <br />
                            <em>you work.</em>
                        </h2>
                        <p className="int-desc">
                            Connect klyro.ai with your existing sales stack in seconds. No complex setup, no browser extensions, just seamless data flow.
                        </p>
                    </div>

                    {/* Apps cloud */}
                    <div className="int-apps-cloud">
                        {APPS.map((app, i) => (
                            <div 
                                key={app.name} 
                                className="int-app-pill interactive"
                                style={{ '--app-color': app.color }}
                            >
                                <span className="int-app-dot"></span>
                                {app.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Integrations;
