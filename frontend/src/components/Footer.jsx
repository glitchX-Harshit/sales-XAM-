import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer-section">
            <div className="container">

                {/* Top 3 Columns */}
                <div className="footer-links-grid">
                    <div className="footer-column">
                        <h3 className="font-serif">Company</h3>
                        <ul>
                            <li><a href="#" className="interactive">About</a></li>
                            <li><a href="#" className="interactive">Careers</a></li>
                            <li><a href="#" className="interactive">Trust Center</a></li>
                            <li><a href="#" className="interactive">Become an Affiliate</a></li>
                            <li><a href="#" className="interactive">Media Kit</a></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h3 className="font-serif">Product</h3>
                        <ul>
                            <li><a href="#" className="interactive">What's New</a></li>
                            <li><a href="#" className="interactive">Use Cases</a></li>
                            <li><a href="#" className="interactive">Flow for Students</a></li>
                            <li><a href="#" className="interactive">Flow for Non-Profits</a></li>
                            <li><a href="#" className="interactive">Flow for Android</a></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h3 className="font-serif">Resources</h3>
                        <ul>
                            <li><a href="#" className="interactive">Workflows</a></li>
                            <li><a href="#" className="interactive">Vibe Coding</a></li>
                            <li><a href="#" className="interactive">Talk to Support</a></li>
                            <li><a href="#" className="interactive">Talk to Sales</a></li>
                            <li><a href="#" className="interactive">Help Center</a></li>
                        </ul>
                    </div>
                </div>

                {/* Large Bottom Logo */}
                <div className="footer-bottom-logo">
                    <div className="animated-volume-icon">
                        <div className="bar bar1"></div>
                        <div className="bar bar2"></div>
                        <div className="bar bar3"></div>
                        <div className="bar bar4"></div>
                    </div>
                    <div className="logo-text">klyro.ai</div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
