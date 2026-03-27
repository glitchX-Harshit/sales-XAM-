import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer-section">
            <div className="container">
                {/* Top Links Grid */}
                <div className="footer-links-grid">
                    <div className="footer-column">
                        <h3>Company</h3>
                        <ul>
                            <li><a href="#" className="interactive">About Us</a></li>
                            <li><a href="#" className="interactive">Careers</a></li>
                            <li><a href="#" className="interactive">Security</a></li>
                            <li><a href="#" className="interactive">Terms of Service</a></li>
                            <li><a href="#" className="interactive">Privacy Policy</a></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h3>Product</h3>
                        <ul>
                            <li><a href="#" className="interactive">Features</a></li>
                            <li><a href="#" className="interactive">Integrations</a></li>
                            <li><a href="#" className="interactive">Pricing</a></li>
                            <li><a href="#" className="interactive">Desktop App</a></li>
                            <li><a href="#" className="interactive">Enterprise</a></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h3>Resources</h3>
                        <ul>
                            <li><a href="#" className="interactive">Documentation</a></li>
                            <li><a href="#" className="interactive">API Reference</a></li>
                            <li><a href="#" className="interactive">Sales Guide</a></li>
                            <li><a href="#" className="interactive">Support Center</a></li>
                            <li><a href="#" className="interactive">Status</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom">
                    <div className="footer-bottom-logo">
                        <div className="footer-logo-text">
                            klyro<span className="footer-logo-dot">.</span>ai
                        </div>
                    </div>
                    <div className="footer-copyright">
                        © 2026 klyro.ai. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
