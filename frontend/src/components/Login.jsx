import { useState } from 'react';
import { ArrowLeft, User, Mail, Lock, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Signup.css';

const Login = ({ onBack, onSwitchToSignup, onLoginSuccess }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('http://localhost:8000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (!res.ok) throw new Error('Invalid email or password');
            const data = await res.json();
            login(data.access_token, { id: data.user_id, email: data.email });
            onLoginSuccess();
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
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

                    {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

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
