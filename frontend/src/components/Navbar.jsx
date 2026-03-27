import { useEffect, useState } from 'react';
import './Navbar.css';

const LINKS = [
    { label: 'Features', href: '#features' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Integrations', href: '#integrations' },
    { label: 'Pricing', href: '#pricing' },
];

const Navbar = ({ onSignup, onLogin }) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <nav className={`nb ${scrolled ? 'nb-scrolled' : ''}`}>
            <div className="nb-inner">
                {/* Logo */}
                <a href="#" className="nb-logo interactive">
                    <span className="nb-logo-mark">
                        <span className="nb-logo-pulse"></span>
                    </span>
                    <span className="nb-logo-text">
                        klyro<span className="nb-logo-dot">.</span><span className="nb-logo-ai">ai</span>
                    </span>
                </a>

                {/* Nav links — center pill */}
                <div className="nb-links-pill">
                    {LINKS.map(l => (
                        <a key={l.href} href={l.href} className="nb-link interactive">
                            {l.label}
                        </a>
                    ))}
                </div>

                {/* Right actions */}
                <div className="nb-actions">
                    <a href="#" className="nb-signin interactive" onClick={(e) => { e.preventDefault(); onLogin(); }}>Log in</a>
                    <button className="nb-cta interactive" onClick={onSignup}>
                        Get Started
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
