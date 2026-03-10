import { useState } from 'react';
import './CallBriefingForm.css';

const CallBriefingForm = ({ onStartCall }) => {
    const [formData, setFormData] = useState({
        client_name: '',
        client_industry: '',
        client_role: '',
        product_name: '',
        call_goal: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8000/call/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to start call session');
            }

            const data = await response.json();
            if (data.context_id) {
                onStartCall(data.context_id, formData);
            } else {
                throw new Error('No context ID returned');
            }
        } catch (err) {
            setError(err.message || 'An error occurred during briefing submission.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="cb-overlay">
            <div className="cb-container">
                <div className="cb-header">
                    <h2>Pre-Call Briefing</h2>
                    <p>Provide context to the AI before the call begins.</p>
                </div>
                {error && <div className="cb-error">{error}</div>}
                <form className="cb-form" onSubmit={handleSubmit}>
                    <div className="cb-form-group">
                        <label>Client Name</label>
                        <input
                            type="text"
                            name="client_name"
                            value={formData.client_name}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Sarah Chen"
                        />
                    </div>
                    <div className="cb-form-group">
                        <label>Client Industry</label>
                        <input
                            type="text"
                            name="client_industry"
                            value={formData.client_industry}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Marketing Agency"
                        />
                    </div>
                    <div className="cb-form-group">
                        <label>Client Role</label>
                        <input
                            type="text"
                            name="client_role"
                            value={formData.client_role}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Founder"
                        />
                    </div>
                    <div className="cb-form-group">
                        <label>Product Being Sold</label>
                        <input
                            type="text"
                            name="product_name"
                            value={formData.product_name}
                            onChange={handleChange}
                            required
                            placeholder="e.g., AI Sales Assistant"
                        />
                    </div>
                    <div className="cb-form-group">
                        <label>Goal of the Call</label>
                        <textarea
                            name="call_goal"
                            value={formData.call_goal}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Close monthly SaaS subscription"
                        />
                    </div>
                    <button type="submit" className="cb-submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Starting...' : 'Start Call Session'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CallBriefingForm;
