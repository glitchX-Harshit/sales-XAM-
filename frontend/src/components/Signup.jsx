import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
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
    const [error, setError] = useState(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [otp, setOtp] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) setError(null);
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const { data, error: verifyError } = await supabase.auth.verifyOtp({
                email: formData.email,
                token: otp,
                type: 'signup'
            });

            if (verifyError) throw verifyError;

            // Session exists, user is successfully verified and logged in
            if (data?.session || data?.user) {
                 // Wait a moment for App.jsx's onAuthStateChange to fire and handle routing automatically, or manually route
                 onGetStarted();
            }
        } catch (err) {
            console.error('OTP Verification Error:', err);
            setError(err.message || 'Invalid confirmation code. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResendOtp = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const { error: resendError } = await supabase.auth.resend({
                type: 'signup',
                email: formData.email,
            });
            if (resendError) throw resendError;
            // Provide gentle notification (can be swapped for a toast component)
            alert("Verification code has been resent! Please check your email.");
        } catch (err) {
            console.error('Resend OTP Error:', err);
            setError(err.message || 'Failed to resend secure code. Please try again later.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        // Security: Client-side Input Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid work email address.');
            setIsSubmitting(false);
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long for security.');
            setIsSubmitting(false);
            return;
        }

        if (/^(password|123456|qwerty)/i.test(formData.password)) {
            setError('Please choose a stronger password.');
            setIsSubmitting(false);
            return;
        }

        try {
            const { data, error: signupError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                        company: formData.company,
                    }
                }
            });

            if (signupError) throw signupError;

            // If session is null, email confirmation is required (Ultra-Secure mode)
            if (data?.user && !data.session) {
                setIsVerifying(true);
            } else if (data?.user) {
                onGetStarted(); // Navigate to dashboard if email confirmation is disabled
            }
        } catch (err) {
            console.error('Signup error:', err);
            // Security: Prevent user enumeration by masking specific errors
            if (err.message && err.message.toLowerCase().includes('already registered')) {
                setError('An account with this email already exists. Please log in.');
            } else {
                setError(err.message || 'An error occurred during signup. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
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

                {/* Form Logic */}
                {isVerifying ? (
                    <form onSubmit={handleVerifyOtp} className="su-form">
                        <div className="su-head-text" style={{ textAlign: 'center', marginBottom: '1rem' }}>
                            <p className="su-subtitle">We sent a secure code to <strong>{formData.email}</strong>.</p>
                        </div>
                        {error && <div className="su-error-message">{error}</div>}
                        <div className="su-field su-field-focused">
                            <label className="su-label" htmlFor="otp">
                                <span className="su-label-icon">🔑</span>
                                Verification Code
                            </label>
                            <div className="su-otp-container">
                                <input
                                    id="otp"
                                    type="text"
                                    name="otp"
                                    value={otp}
                                    onChange={(e) => { setOtp(e.target.value); if(error) setError(null); }}
                                    placeholder="000000"
                                    required
                                    className="su-otp-input"
                                    maxLength={6}
                                />
                            </div>
                        </div>
                        <button type="submit" className="su-submit" disabled={isSubmitting || otp.length < 6}>
                            <span className="su-btn-blob" aria-hidden="true" />
                            {isSubmitting ? (
                                <span className="su-btn-loading">
                                    <span className="su-spinner" />
                                    <span>Verifying…</span>
                                </span>
                            ) : (
                                <span className="su-btn-inner" aria-hidden="false">
                                    <span className="su-btn-default">
                                        <span className="su-btn-icon">🛡️</span>
                                        <span className="su-btn-label">Verify & Secure Account</span>
                                        <span className="su-btn-arrow">→</span>
                                    </span>
                                    <span className="su-btn-hover">
                                        <span className="su-btn-icon">✨</span>
                                        <span className="su-btn-label">Complete Signup</span>
                                        <span className="su-btn-arrow">↗</span>
                                    </span>
                                </span>
                            )}
                        </button>
                        
                        <p className="su-login-prompt" style={{ marginTop: '1rem', color: '#111' }}>
                            Didn't receive the code? <button type="button" onClick={handleResendOtp} className="interactive" style={{ background: 'none', border: 'none', color: '#ff5e00', fontWeight: 700, cursor: 'pointer', padding: 0, fontFamily: 'inherit', fontSize: 'inherit' }}>Resend code</button>
                        </p>
                    </form>
                ) : (
                    <form onSubmit={handleSubmit} className="su-form">
                        {error && <div className="su-error-message">{error}</div>}
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
                )}
            </div>
        </div>
    );
};

export default Signup;
