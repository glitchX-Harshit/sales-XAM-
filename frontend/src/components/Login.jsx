import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import './Signup.css';

const Login = ({ onBack, onGetStarted, onSignup }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [focused, setFocused] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [isResettingPassword, setIsResettingPassword] = useState(false);
    const [resetEmailSent, setResetEmailSent] = useState(false);
    const [resetStep, setResetStep] = useState(1); // 1: Email, 2: OTP
    const [recoveryOtp, setRecoveryOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) setError(null);
    };

    const handleResetPasswordRequest = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(formData.email);
            if (resetError) throw resetError;
            setResetStep(2);
        } catch (err) {
            console.error('Reset Password request error:', err);
            setError(err.message || 'Failed to send reset code.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCompleteReset = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        // Military Grade: Password Strength Check
        if (newPassword.length < 8) {
            setError('New password must be at least 8 characters.');
            setIsSubmitting(false);
            return;
        }

        try {
            // 1. Verify OTP
            const { error: verifyError } = await supabase.auth.verifyOtp({
                email: formData.email,
                token: recoveryOtp,
                type: 'recovery'
            });
            if (verifyError) throw verifyError;

            // 2. Update Password (User is now authenticated via verifyOtp session)
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword
            });
            if (updateError) throw updateError;

            setResetEmailSent(true);
            setTimeout(() => {
                setIsResettingPassword(false);
                setResetStep(1);
                setResetEmailSent(false);
            }, 3000);
        } catch (err) {
            console.error('Complete Reset error:', err);
            setError(err.message || 'Failed to reset password. Check if the code is correct.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        // Security: Client-side Input Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address.');
            setIsSubmitting(false);
            return;
        }

        try {
            const { data, error: loginError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (loginError) throw loginError;

            if (data?.user) {
                onGetStarted(); // Navigate to dashboard after login
            }
        } catch (err) {
            console.error('Login error:', err);
            if (err.message === 'Email not confirmed') {
                setError('Email not confirmed. Please check your inbox for the verification code.');
            } else {
                setError('Invalid email or password.');
            }
        } finally {
            setIsSubmitting(false);
        }
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

                {/* Form Logic */}
                {isResettingPassword ? (
                    <div className="su-form">
                        {resetStep === 1 ? (
                            <form onSubmit={handleResetPasswordRequest}>
                                <div className="su-head-text" style={{ textAlign: 'center', marginBottom: '1rem' }}>
                                    <p className="su-subtitle">Enter your email and we'll send a <strong>6-digit secure code</strong> to reset your password.</p>
                                </div>
                                {error && <div className="su-error-message">{error}</div>}
                                
                                {renderField(FIELDS[0])} {/* Email field */}

                                <button type="submit" className="su-submit" disabled={isSubmitting}>
                                    <span className="su-btn-blob" aria-hidden="true" />
                                    {isSubmitting ? (
                                        <span className="su-btn-loading">
                                            <span className="su-spinner" />
                                            <span>Sending Code…</span>
                                        </span>
                                    ) : (
                                        <span className="su-btn-inner">
                                            <span className="su-btn-default">
                                                <span className="su-btn-icon">📧</span>
                                                <span className="su-btn-label">Send Reset Code</span>
                                                <span className="su-btn-arrow">→</span>
                                            </span>
                                            <span className="su-btn-hover">
                                                <span className="su-btn-icon">✨</span>
                                                <span className="su-btn-label">Send Security Code</span>
                                                <span className="su-btn-arrow">↗</span>
                                            </span>
                                        </span>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleCompleteReset}>
                                <div className="su-head-text" style={{ textAlign: 'center', marginBottom: '1rem' }}>
                                    <p className="su-subtitle">Code sent to <strong>{formData.email}</strong>. Enter it below with your new password.</p>
                                </div>
                                {error && <div className="su-error-message">{error}</div>}
                                {resetEmailSent && <div className="su-error-message" style={{background:'rgba(16,185,129,0.08)', color:'#059669', borderColor:'rgba(16,185,129,0.2)'}}>✅ Password updated! Logging you in...</div>}

                                <div className="su-field su-field-focused">
                                    <label className="su-label" htmlFor="recoveryOtp">
                                        <span className="su-label-icon">🔑</span>
                                        6-Digit Code
                                    </label>
                                    <div className="su-otp-container">
                                        <input
                                            id="recoveryOtp"
                                            type="text"
                                            value={recoveryOtp}
                                            onChange={(e) => setRecoveryOtp(e.target.value)}
                                            placeholder="000000"
                                            required
                                            className="su-otp-input"
                                            maxLength={6}
                                        />
                                    </div>
                                </div>

                                <div className="su-field">
                                    <label className="su-label" htmlFor="newPassword">
                                        <span className="su-label-icon">🔒</span>
                                        New Password
                                    </label>
                                    <input
                                        id="newPassword"
                                        type={showPassword ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="su-input"
                                    />
                                    <button 
                                        type="button" 
                                        className="su-pwd-toggle" 
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex="-1"
                                    >
                                        {showPassword ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                </div>

                                <button type="submit" className="su-submit" disabled={isSubmitting || recoveryOtp.length < 6}>
                                    <span className="su-btn-blob" aria-hidden="true" />
                                    {isSubmitting ? (
                                        <span className="su-btn-loading">
                                            <span className="su-spinner" />
                                            <span>Updating Password…</span>
                                        </span>
                                    ) : (
                                        <span className="su-btn-inner">
                                            <span className="su-btn-default">
                                                <span className="su-btn-icon">🛡️</span>
                                                <span className="su-btn-label">Verify & Update Password</span>
                                                <span className="su-btn-arrow">→</span>
                                            </span>
                                            <span className="su-btn-hover">
                                                <span className="su-btn-icon">✨</span>
                                                <span className="su-btn-label">Complete Security Reset</span>
                                                <span className="su-btn-arrow">↗</span>
                                            </span>
                                        </span>
                                    )}
                                </button>
                            </form>
                        )}
                        
                        <p className="su-login-prompt">
                            <a href="#" className="interactive" onClick={(e) => { e.preventDefault(); setIsResettingPassword(false); setResetStep(1); setResetEmailSent(false); setError(null); }}>← Back to login</a>
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="su-form">
                        {error && <div className="su-error-message">{error}</div>}
                        {FIELDS.map(renderField)}
                        
                        <div style={{ textAlign: 'right', marginTop: '-0.5rem', marginBottom: '1rem' }}>
                            <a href="#" onClick={(e) => { e.preventDefault(); setIsResettingPassword(true); setError(null); }} className="interactive" style={{ fontSize: '0.8rem', color: '#ff5e00', fontWeight: 600, textDecoration: 'none' }}>Forgot password?</a>
                        </div>

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
                )}
            </div>
        </div>
    );
};

export default Login;
