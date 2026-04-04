import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { gsap } from 'gsap';
import './Signup.css';

const Signup = ({ onBack, onSwitchToLogin, onSignupSuccess }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const cardRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(cardRef.current, {
                y: 30,
                opacity: 0,
                duration: 1,
                ease: 'power4.out',
                delay: 0.1
            });
            
            gsap.from('.su-form > *, .su-head > *', {
                y: 20,
                opacity: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: 'power3.out',
                delay: 0.3
            });
        });
        return () => ctx.revert();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('http://localhost:8000/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, password: formData.password })
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.detail || 'Failed to create account');
            }
            const data = await res.json();
            login(data.access_token, { id: data.user_id, email: data.email });
            onSignupSuccess();
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <div className="su-overlay">
            <div className="su-blob su-blob-1"></div>
            <div className="su-blob su-blob-2"></div>
            <div className="su-grid"></div>

            <button className="su-back interactive" onClick={onBack}>
                <ArrowLeft size={16} />
                <span>Back</span>
            </button>

            <div className="su-card shadow-premium" ref={cardRef}>
                <div className="su-head">
                    <div className="su-logo-mark">
                        <CheckCircle size={24} color="var(--color-white)" />
                    </div>
                    <h2 className="su-title">Get started</h2>
                    <p className="su-subtitle">Join 2,000+ sales professionals closing faster with AI.</p>
                </div>

                <form className="su-form" onSubmit={handleSubmit}>
                    <div className="su-field">
                        <label className="su-label">Work Email</label>
                        <input 
                            type="email" 
                            className="su-input" 
                            placeholder="name@company.com"
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

                    {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.8125rem', textAlign: 'center', fontWeight: 600 }}>{error}</div>}

                    <button className="su-submit interactive" type="submit" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Continue'}
                    </button>
                </form>

                <p className="su-login-prompt">
                    Already using klyro? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }}>Log in</a>
                </p>
            </div>
        </div>
    );
};

export default Signup;


