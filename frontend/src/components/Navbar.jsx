import { useEffect, useState } from 'react';
import './Navbar.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="navbar-container">
                <div className="logo text-orange interactive">NX.AI</div>
                <div className="nav-links">
                    <a href="#features" className="interactive">Features</a>
                    <a href="#demo" className="interactive">Demo</a>
                    <a href="#pricing" className="interactive">Pricing</a>
                </div>
                <div className="nav-actions">
                    <button className="btn btn-primary btn-sm interactive">Get nx.ai</button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
