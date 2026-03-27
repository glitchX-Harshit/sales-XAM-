import { useState } from 'react';
import './CallBriefingForm.css';

const FIELDS = [
    {
        name: 'client_name',
        label: 'Client Name',
        placeholder: 'e.g. Sarah Chen',
        icon: '👤',
        type: 'input',
        col: 1,
    },
    {
        name: 'client_role',
        label: 'Client Role',
        placeholder: 'e.g. Founder, VP of Sales',
        icon: '🏷',
        type: 'input',
        col: 1,
    },
    {
        name: 'client_industry',
        label: 'Industry',
        placeholder: 'e.g. Marketing Agency',
        icon: '🏢',
        type: 'input',
        col: 2,
    },
    {
        name: 'product_name',
        label: 'Product Being Sold',
        placeholder: 'e.g. AI Sales Assistant',
        icon: '📦',
        type: 'input',
        col: 2,
    },
    {
        name: 'call_goal',
        label: 'Goal of This Call',
        placeholder: 'e.g. Close monthly SaaS subscription, book a follow-up demo…',
        icon: '🎯',
        type: 'textarea',
        col: 'full',
    },
];

const CallBriefingForm = ({ onStartCall, onBack }) => {
    const [formData, setFormData] = useState({
        client_name: '',
        client_industry: '',
        client_role: '',
        product_name: '',
        call_goal: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [focused, setFocused] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            const response = await fetch('http://localhost:8000/call/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!response.ok) throw new Error('Failed to start call session');
            const data = await response.json();
            if (data.context_id) {
                onStartCall(data.context_id, formData);
            } else {
                throw new Error('No context ID returned');
            }
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const leftFields  = FIELDS.filter((f) => f.col === 1);
    const rightFields = FIELDS.filter((f) => f.col === 2);
    const fullFields  = FIELDS.filter((f) => f.col === 'full');

    const renderField = (f) => (
        <div key={f.name} className={`cb-field ${focused === f.name ? 'cb-field-focused' : ''}`}>
            <label className="cb-label" htmlFor={f.name}>
                <span className="cb-label-icon">{f.icon}</span>
                {f.label}
            </label>
            {f.type === 'textarea' ? (
                <textarea
                    id={f.name}
                    name={f.name}
                    value={formData[f.name]}
                    onChange={handleChange}
                    onFocus={() => setFocused(f.name)}
                    onBlur={() => setFocused('')}
                    placeholder={f.placeholder}
                    required
                    className="cb-input cb-textarea"
                />
            ) : (
                <input
                    id={f.name}
                    type="text"
                    name={f.name}
                    value={formData[f.name]}
                    onChange={handleChange}
                    onFocus={() => setFocused(f.name)}
                    onBlur={() => setFocused('')}
                    placeholder={f.placeholder}
                    required
                    className="cb-input"
                />
            )}
        </div>
    );

    return (
        <div className="cb-overlay">
            {/* Ambient blobs matching Dashboard */}
            <div className="cb-blob cb-blob-1" />
            <div className="cb-blob cb-blob-2" />
            <div className="cb-grid" />

            {/* Back Button */}
            <button className="cb-back interactive" onClick={onBack}>
                ← Back to home
            </button>

            <div className="cb-card">
                {/* Header */}
                <div className="cb-head">
                    <div className="cb-logo-mark">
                        <span className="cb-logo-pulse" />
                    </div>
                    <div className="cb-head-text">
                        <div className="cb-eyebrow">Pre-Call Briefing</div>
                        <h1 className="cb-title">
                            Brief the AI<br />
                            <span className="cb-title-accent">before the call begins</span>
                        </h1>
                        <p className="cb-subtitle">
                            Give context once — the AI will adapt every suggestion in real-time to your specific deal.
                        </p>
                    </div>
                </div>

                {/* Divider */}
                <div className="cb-divider" />

                {/* Form */}
                <form onSubmit={handleSubmit} className="cb-form">
                    <div className="cb-grid-fields">
                        <div className="cb-col">
                            {leftFields.map(renderField)}
                        </div>
                        <div className="cb-col">
                            {rightFields.map(renderField)}
                        </div>
                    </div>

                    {/* Full-width fields */}
                    {fullFields.map(renderField)}

                    {error && (
                        <div className="cb-error">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <button type="submit" className="cb-submit" disabled={isSubmitting}>
                        {/* Liquid fill blob */}
                        <span className="cb-btn-blob" aria-hidden="true" />

                        {isSubmitting ? (
                            <span className="cb-btn-loading">
                                <span className="cb-spinner" />
                                <span>Initializing AI context…</span>
                            </span>
                        ) : (
                            <span className="cb-btn-inner" aria-hidden="false">
                                {/* Default state — slides out up on hover */}
                                <span className="cb-btn-default">
                                    <span className="cb-btn-icon">⚡</span>
                                    <span className="cb-btn-label">Start Call Session</span>
                                    <span className="cb-btn-arrow">→</span>
                                </span>
                                {/* Hover state — slides in from below on hover */}
                                <span className="cb-btn-hover">
                                    <span className="cb-btn-icon">🚀</span>
                                    <span className="cb-btn-label">Let's go</span>
                                    <span className="cb-btn-arrow">↗</span>
                                </span>
                            </span>
                        )}
                    </button>
                </form>

                {/* Footer note */}
                <p className="cb-footnote">
                    🔒 Context is session-scoped and never stored after the call ends.
                </p>
            </div>
        </div>
    );
};

export default CallBriefingForm;
