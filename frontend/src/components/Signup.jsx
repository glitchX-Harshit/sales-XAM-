import { useState } from 'react';
import { ArrowLeft, User, Mail, Lock, CheckCircle, ArrowRight } from 'lucide-react';
import './Signup.css';

const Signup = ({ onBack, onSwitchToLogin, onSignupSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            onSignupSuccess();
        }, 1500);
    };

    return (
        <div className="su-overlay">
            {/* Background elements */}
            <div className="su-blob su-blob-1"></div>
            <div className="su-blob su-blob-2"></div>
            <div className="su-grid"></div>

            {/* Back button */}
            <button className="su-back interactive" onClick={onBack}>
                <ArrowLeft size={16} />
                <span>Back</span>
            </button>

            {/* Signup card */}
            <div className="su-card">
                <div className="su-head">
                    <div className="su-logo-mark">
                        <CheckCircle size={24} color="#fff" />
                    </div>
                    <div className="su-head-text">
                        <h2 className="su-title">Get Started<span className="footer-logo-dot">.</span></h2>
                        <p className="su-subtitle">Create your account and start closing more deals today.</p>
                    </div>
                </div>

                <form className="su-form" onSubmit={handleSubmit}>
                    <div className="su-field">
                        <label className="su-label">Full Name</label>
                        <input 
                            type="text" 
                            className="su-input" 
                            placeholder="John Doe"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    <div className="su-field">
                        <label className="su-label">Work Email</label>
                        <input 
                            type="email" 
                            className="su-input" 
                            placeholder="john@company.com"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>

                    <div className="su-field">
                        <label className="su-label">Password</label>
                        <input 
                            type="password" 
                            className="su-input" 
                            placeholder="••••••••"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>

                    <button className="su-submit interactive" type="submit" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Continue'}
                    </button>
                </form>

                <p className="su-login-prompt">
                    Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }}>Log in</a>
                </p>
            </div>
        </div>
    );
};

export default Signup;
