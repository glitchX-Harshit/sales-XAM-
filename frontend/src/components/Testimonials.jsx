import { Star } from 'lucide-react';
import './Testimonials.css';

const TESTIMONIALS = [
    {
        name: 'Sarah Chen',
        handle: '@sarahsales',
        text: '“klyro.ai is like having a sales coach in my ear during every call. My close rate went from 18% to 32% in three weeks. Absolutely indispensable.”',
        avatar: 'SC',
        meta: 'AE at Acme Corp'
    },
    {
        name: 'James Rodriguez',
        handle: '@jamez_deals',
        text: '“The real-time objection detection is scary accurate. It catches things I normally miss when I’m focused on the pitch. Pure gold.”',
        avatar: 'JR',
        meta: 'SDR Leader'
    },
    {
        name: 'Elena Rossi',
        handle: '@elena_closer',
        text: '“I was skeptical about AI in sales, but klyro.ai actually helps me stay more human and present. No more awkward pauses.”',
        avatar: 'ER',
        meta: 'VP Sales'
    },
    {
        name: 'Marcus Thorne',
        handle: '@marcus_t',
        text: '“If you’re not using this, you’re literally leaving money on the table. The ROI was clear within the first 10 calls.”',
        avatar: 'MT',
        meta: 'Founding AE'
    },
    {
        name: 'Priya Patel',
        handle: '@priya_ps',
        text: '“The HubSpot integration is seamless. All my call notes and objections sync perfectly. Total game changer for my workflow.”',
        avatar: 'PP',
        meta: 'Account Manager'
    },
    {
        name: 'David Wilson',
        handle: '@dave_sales',
        text: '“Incredible tool. It helps our junior reps perform like seasoned veterans within their first month. Our onboarding time plummeted.”',
        avatar: 'DW',
        meta: 'Sales Enablement'
    }
];

const Testimonials = () => {
    return (
        <section className="tl-section" id="testimonials">
            <div className="container">
                <div className="tl-header">
                    <span className="tl-eyebrow">Social Proof</span>
                    <h2 className="tl-title">
                        Trusted by <em>closers</em> <br />
                        around the world.
                    </h2>
                    <p className="tl-subtitle">
                        Join 2,000+ sales professionals who use klyro.ai 
                        to win more deals every single day.
                    </p>
                </div>

                <div className="tl-masonry">
                    {TESTIMONIALS.map((t, i) => (
                        <div key={i} className="tl-card interactive">
                            <div className="tl-card-header">
                                <div className="tl-avatar">{t.avatar}</div>
                                <div className="tl-info">
                                    <div className="tl-name">{t.name}</div>
                                    <div className="tl-handle">{t.handle}</div>
                                </div>
                                <div className="tl-stars">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={12} fill="#7c3aed" color="#7c3aed" />
                                    ))}
                                </div>
                            </div>
                            <p className="tl-text">{t.text}</p>
                            <div className="tl-card-footer">
                                {t.meta}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
