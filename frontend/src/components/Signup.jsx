import { useState } from 'react';
import './Signup.css';

const Signup = ({ onBack, onGetStarted, onLogin }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
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
            onGetStarted(); // Navigate to dashboard after signup
        }, 1500);
    };

    const FIELDS = [
        { name: 'firstName', label: 'First Name', placeholder: 'Sarah', icon: '👤', col: 1, type: 'text' },
        { name: 'lastName', label: 'Last Name', placeholder: 'Chen', icon: '👤', col: 1, type: 'text' },
        { name: 'email', label: 'Work Email', placeholder: 'sarah@company.com', icon: '✉️', col: 'full', type: 'email' },
        { name: 'company', label: 'Company Name', placeholder: 'Acme Corp', icon: '🏢', col: 'full', type: 'text' },
        { name: 'password', label: 'Password', placeholder: '••••••••', icon: '🔒', col: 'full', type: 'password' },
    ];

    const leftFields = FIELDS.filter((f) => f.col === 1);
    const fullFields = FIELDS.filter((f) => f.col === 'full');

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
            {f.name === 'password' && (
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
            <div className="su-blob su-blob-1" />
            <div className="su-blob su-blob-2" />
            <div className="su-grid" />

            {/* Back Button */}
            <button className="su-back interactive" onClick={onBack}>
                ← Back to home
            </button>

            <div className="su-card">
                {/* Header */}
                <div className="su-head">
                    <div className="su-logo-mark">
                        <span className="su-logo-pulse" />
                    </div>
                    <div className="su-head-text">
                        <div className="su-eyebrow">Create Account</div>
                        <h1 className="su-title">
                            Join klyro.ai<br />
                            <span className="su-title-accent">and close more deals</span>
                        </h1>
                        <p className="su-subtitle">
                            Start using the world's most advanced AI sales assistant today. 
                        </p>
                    </div>
                </div>

                {/* Divider */}
                <div className="su-divider" />

                {/* Form */}
                <form onSubmit={handleSubmit} className="su-form">
                    <div className="su-grid-fields">
                        <div className="su-col">
                            {leftFields[0] && renderField(leftFields[0])}
                        </div>
                        <div className="su-col">
                            {leftFields[1] && renderField(leftFields[1])}
                        </div>
                    </div>

                    {/* Full-width fields */}
                    {fullFields.map(renderField)}

                    <button type="submit" className="su-submit" disabled={isSubmitting}>
                        {/* Liquid fill blob */}
                        <span className="su-btn-blob" aria-hidden="true" />

                        {isSubmitting ? (
                            <span className="su-btn-loading">
                                <span className="su-spinner" />
                                <span>Creating account…</span>
                            </span>
                        ) : (
                            <span className="su-btn-inner" aria-hidden="false">
                                {/* Default state */}
                                <span className="su-btn-default">
                                    <span className="su-btn-icon">⚡</span>
                                    <span className="su-btn-label">Create Account</span>
                                    <span className="su-btn-arrow">→</span>
                                </span>
                                {/* Hover state */}
                                <span className="su-btn-hover">
                                    <span className="su-btn-icon">✨</span>
                                    <span className="su-btn-label">Welcome aboard</span>
                                    <span className="su-btn-arrow">↗</span>
                                </span>
                            </span>
                        )}
                    </button>
                    
                    <p className="su-login-prompt">
                        Already have an account? <a href="#" className="interactive" onClick={(e) => { e.preventDefault(); onLogin(); }}>Log in</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;
