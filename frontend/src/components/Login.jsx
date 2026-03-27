import { useState } from 'react';
import { ArrowLeft, User, Mail, Lock, CheckCircle, ArrowRight } from 'lucide-react';
import './Signup.css';

const Login = ({ onBack, onSwitchToSignup, onLoginSuccess }) => {
    const [formData, setFormData] = useState({
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
            onLoginSuccess();
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

            {/* Login card */}
            <div className="su-card">
                <div className="su-head">
                    <div className="su-logo-mark">
                        <Lock size={20} color="#fff" />
                    </div>
                    <div className="su-head-text">
                        <h2 className="su-title">Welcome Back<span className="footer-logo-dot">.</span></h2>
                        <p className="su-subtitle">Log in to your account and pick up where you left off.</p>
                    </div>
                </div>

                <form className="su-form" onSubmit={handleSubmit}>
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
                        {loading ? 'Logging in...' : 'Sign In'}
                    </button>
                </form>

                <p className="su-login-prompt">
                    Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToSignup(); }}>Sign up for free</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
