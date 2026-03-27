import { useState } from 'react';
import './Signup.css';

const Login = ({ onBack, onGetStarted, onSignup }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [focused, setFocused] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            onGetStarted(); // Navigate to dashboard after login
        }, 1200);
    };

    const FIELDS = [
        { name: 'email', label: 'Work Email', placeholder: 'sarah@company.com', icon: '✉️', type: 'email' },
        { name: 'password', label: 'Password', placeholder: '••••••••', icon: '🔒', type: 'password' },
    ];

    const renderField = (f) => (
        <div key={f.name} className={`su-field ${focused === f.name ? 'su-field-focused' : ''}`}>
            <label className="su-label" htmlFor={f.name}>
                <span className="su-label-icon">{f.icon}</span>
                {f.label}
            </label>
            <input
                id={f.name}
                type={f.name === 'password' ? (showPassword ? 'text' : 'password') : f.type}
                name={f.name}
                value={formData[f.name]}
                onChange={handleChange}
                onFocus={() => setFocused(f.name)}
                onBlur={() => setFocused('')}
                placeholder={f.placeholder}
                required
                className="su-input"
            />
            {f.type === 'password' && (
                <button 
                    type="button" 
                    className="su-pwd-toggle interactive" 
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
            )}
        </div>
    );

    return (
        <div className="su-overlay">
            {/* Ambient blobs matching the aesthetic */}
            <div className="su-blob su-blob-1" style={{ animationDelay: '-4s' }} />
            <div className="su-blob su-blob-2" style={{ animationDelay: '-7s' }} />
            <div className="su-grid" />

            {/* Back Button */}
            <button className="su-back interactive" onClick={onBack}>
                ← Back to home
            </button>

            <div className="su-card" style={{ maxWidth: '440px' }}>
                {/* Header */}
                <div className="su-head">
                    <div className="su-logo-mark">
                        <span className="su-logo-pulse" />
                    </div>
                    <div className="su-head-text">
                        <div className="su-eyebrow">Welcome Back</div>
                        <h1 className="su-title">
                            Log in to klyro.ai
                        </h1>
                    </div>
                </div>

                {/* Divider */}
                <div className="su-divider" style={{ marginBottom: '2rem' }} />

                {/* Form */}
                <form onSubmit={handleSubmit} className="su-form">
                    
                    {FIELDS.map(renderField)}

                    <button type="submit" className="su-submit" disabled={isSubmitting}>
                        {/* Liquid fill blob */}
                        <span className="su-btn-blob" aria-hidden="true" />

                        {isSubmitting ? (
                            <span className="su-btn-loading">
                                <span className="su-spinner" />
                                <span>Logging in…</span>
                            </span>
                        ) : (
                            <span className="su-btn-inner" aria-hidden="false">
                                {/* Default state */}
                                <span className="su-btn-default">
                                    <span className="su-btn-icon">⚡</span>
                                    <span className="su-btn-label">Log in</span>
                                    <span className="su-btn-arrow">→</span>
                                </span>
                                {/* Hover state */}
                                <span className="su-btn-hover">
                                    <span className="su-btn-icon">✨</span>
                                    <span className="su-btn-label">Welcome back</span>
                                    <span className="su-btn-arrow">↗</span>
                                </span>
                            </span>
                        )}
                    </button>
                    
                    <p className="su-login-prompt">
                        Don't have an account? <a href="#" className="interactive" onClick={(e) => { e.preventDefault(); onSignup(); }}>Register Now</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
