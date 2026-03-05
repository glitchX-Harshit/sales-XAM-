import { useEffect, useState } from 'react';
import './Navbar.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="navbar-container">
                <div className="logo interactive">
                    <span className="logo-dot"></span>
                    nx.ai
                </div>

                <div className="nav-links">
                    <a href="#features" className="nav-link interactive">Features</a>
                    <a href="#how-it-works" className="nav-link interactive">How it works</a>
                    <a href="#integrations" className="nav-link interactive">Integrations</a>
                    <a href="#pricing" className="nav-link interactive">Pricing</a>
                </div>

                <div className="nav-actions">
                    <a href="#" className="nav-login-link interactive">Sign in</a>
                    <button className="nav-cta-btn interactive">Get nx.ai →</button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
