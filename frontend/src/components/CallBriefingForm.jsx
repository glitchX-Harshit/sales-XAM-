import { useState } from 'react';
import { 
    ArrowLeft, 
    User, 
    Building, 
    Target, 
    Sparkles, 
    CheckCircle2, 
    Briefcase,
    Zap
} from 'lucide-react';
import './CallBriefingForm.css';

const CallBriefingForm = ({ onStartCall, onBack }) => {
    const [formData, setFormData] = useState({
        client_name: '',
        client_industry: '',
        client_role: '',
        product_name: '',
        call_goal: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:8000/call/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to create call context');

            const data = await response.json();
            onStartCall(data.context_id, formData);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="cb-overlay">
            {/* Background elements */}
            <div className="cb-blob cb-blob-1"></div>
            <div className="cb-blob cb-blob-2"></div>
            <div className="cb-grid"></div>

            {/* Back button */}
            <button className="cb-back interactive" onClick={onBack}>
                <ArrowLeft size={16} />
                <span>Back</span>
            </button>

            {/* Card */}
            <div className="cb-card">
                <div className="cb-head">
                    <div className="cb-logo-mark">
                        <Zap size={20} color="#fff" />
                    </div>
                    <div className="cb-head-text">
                        <h2 className="cb-title">Call Briefing<span className="footer-logo-dot">.</span></h2>
                        <p className="cb-subtitle">Enter call details to prime the AI closing engine.</p>
                    </div>
                </div>

                <form className="cb-form" onSubmit={handleSubmit}>
                    <div className="cb-grid-fields">
                        <div className="cb-field">
                            <label className="cb-label"><User size={12} /> Prospect Name</label>
                            <input 
                                type="text" 
                                className="cb-input" 
                                placeholder="Sarah Chen"
                                required
                                value={formData.client_name}
                                onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                            />
                        </div>
                        <div className="cb-field">
                            <label className="cb-label"><Building size={12} /> Industry</label>
                            <input 
                                type="text" 
                                className="cb-input" 
                                placeholder="SaaS / Fintech"
                                required
                                value={formData.client_industry}
                                onChange={(e) => setFormData({...formData, client_industry: e.target.value})}
                            />
                        </div>
                        <div className="cb-field">
                            <label className="cb-label"><User size={12} /> Role / Title</label>
                            <input 
                                type="text" 
                                className="cb-input" 
                                placeholder="VP of Sales"
                                required
                                value={formData.client_role}
                                onChange={(e) => setFormData({...formData, client_role: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="cb-field">
                        <label className="cb-label"><Briefcase size={12} /> Your Product</label>
                        <input 
                            type="text" 
                            className="cb-input" 
                            placeholder="Enterprise CRM"
                            required
                            value={formData.product_name}
                            onChange={(e) => setFormData({...formData, product_name: e.target.value})}
                        />
                    </div>

                    <div className="cb-field">
                        <label className="cb-label"><Target size={12} /> Call Goal</label>
                        <textarea 
                            className="cb-textarea" 
                            placeholder="Close the Q3 pilot contract..."
                            required
                            value={formData.call_goal}
                            onChange={(e) => setFormData({...formData, call_goal: e.target.value})}
                        />
                    </div>

                    {error && <div className="cb-error">{error}</div>}

                    <button className="cb-submit interactive" type="submit" disabled={loading}>
                        <Sparkles size={16} style={{ marginRight: '8px' }} />
                        {loading ? 'Priming AI Engine...' : 'Start Assisted Call'}
                    </button>
                    
                    <p className="cb-footnote">
                        <CheckCircle2 size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        AI suggestions will optimize for your goal and product.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default CallBriefingForm;
