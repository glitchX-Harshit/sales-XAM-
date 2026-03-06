import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import './Navbar.css';

const LINKS = [
    { label: 'Features', href: '#features' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Integrations', href: '#integrations' },
    { label: 'Pricing', href: '#pricing' },
];

const Navbar = ({ onGetStarted }) => {
    const [scrolled, setScrolled] = useState(false);
    const navRef = useRef(null);

    /* Scroll state */
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    /* Entrance slide-down after loader */
    useEffect(() => {
        gsap.fromTo(navRef.current,
            { y: -24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.2 }
        );
    }, []);

    return (
        <nav className={`nb ${scrolled ? 'nb-scrolled' : ''}`} ref={navRef}>
            <div className="nb-inner">

                {/* Logo */}
                <a href="#" className="nb-logo interactive">
                    <span className="nb-logo-mark">
                        <span className="nb-logo-pulse"></span>
                    </span>
                    <span className="nb-logo-text">
                        <span className="nb-logo-nx">nx</span
                        ><span className="nb-logo-dot">.</span
                        ><span className="nb-logo-ai">ai</span>
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
                    <a href="#" className="nb-signin interactive">Sign in</a>
                    <button className="nb-cta interactive" onClick={onGetStarted}>
                        Get started
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
