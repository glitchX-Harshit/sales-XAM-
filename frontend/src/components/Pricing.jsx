import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check } from 'lucide-react';
import './Pricing.css';

const Pricing = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Scale and pop up the pricing tiers
            gsap.fromTo('.pricing-card',
                { y: 100, opacity: 0, scale: 0.9 },
                {
                    y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.2, ease: 'back.out(1.2)',
                    scrollTrigger: {
                        trigger: '.pricing-grid',
                        start: 'top 80%'
                    }
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section className="container pricing-section" id="pricing" ref={sectionRef}>
            <div className="pricing-header">
                <h2 className="pricing-title">
                    <span className="font-serif">Simple pricing,</span><br />
                    massive return.
                </h2>
                <p className="pricing-desc">Start closing more deals today. Upgrade when your team expands.</p>
            </div>

            <div className="pricing-grid">

                {/* Basic Tier */}
                <div className="pricing-card">
                    <div className="pricing-tier-name">Starter</div>
                    <div className="pricing-price">
                        <span className="currency">$</span><span className="amount">49</span><span className="period">/mo</span>
                    </div>
                    <p className="pricing-sub">Perfect for solo founders and freelancers.</p>
                    <button className="btn btn-outline-dark interactive pricing-btn w-100">Start free trial</button>
                    <ul className="pricing-features">
                        <li><Check size={18} color="#000" /> Unlimited transcriptions</li>
                        <li><Check size={18} color="#000" /> Basic objection detection</li>
                        <li><Check size={18} color="#000" /> Desktop app (Mac/Win)</li>
                        <li className="disabled"><Check size={18} color="#ccc" /> Team analytics dashboard</li>
                        <li className="disabled"><Check size={18} color="#ccc" /> Custom knowledge base integration</li>
                    </ul>
                </div>

                {/* Pro Tier (Highlighted) */}
                <div className="pricing-card featured">
                    <div className="pricing-badge">Most Popular</div>
                    <div className="pricing-tier-name" style={{ color: '#fff' }}>Professional</div>
                    <div className="pricing-price" style={{ color: '#fff' }}>
                        <span className="currency">$</span><span className="amount">129</span><span className="period">/user/mo</span>
                    </div>
                    <p className="pricing-sub" style={{ color: '#ddd' }}>For sales teams who need the ultimate edge.</p>
                    <button className="btn btn-primary interactive pricing-btn w-100" style={{ background: '#fff', color: '#000' }}>Get Started</button>
                    <ul className="pricing-features">
                        <li style={{ color: '#fff' }}><Check size={18} color="#ebd9ff" /> Everything in Starter</li>
                        <li style={{ color: '#fff' }}><Check size={18} color="#ebd9ff" /> Advanced real-time suggestions</li>
                        <li style={{ color: '#fff' }}><Check size={18} color="#ebd9ff" /> Salesforce / HubSpot integration</li>
                        <li style={{ color: '#fff' }}><Check size={18} color="#ebd9ff" /> Custom knowledge base API</li>
                        <li style={{ color: '#fff' }}><Check size={18} color="#ebd9ff" /> Priority 24/7 support</li>
                    </ul>
                </div>

            </div>
        </section>
    );
};

export default Pricing;
