import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, LogOut, Phone, History, LayoutDashboard, BarChart2, Settings, ChevronRight } from 'lucide-react';

const OverviewTab = ({ user, navigate }) => (
    <div>
        <div style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '2rem' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Welcome back{user?.name ? `, ${user.name}` : ''}!</h1>
            <p style={{ color: 'var(--color-text-dim)', fontSize: '1.1rem', marginBottom: '2rem' }}>Ready to crush your next sales call?</p>
            <button 
                className="interactive" 
                onClick={() => navigate('/call-brief')}
                style={{ background: 'var(--color-primary)', color: '#fff', border: 'none', padding: '1rem 2rem', fontSize: '1.1rem', borderRadius: '8px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}
            >
                <Phone size={20} /> Start New Call
            </button>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><History size={20} /> Recent Calls</h2>
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '3rem', textAlign: 'center', color: 'var(--color-text-dim)' }}>
                You haven't made any calls yet. Start your first call above!
            </div>
        </div>
    </div>
);

const AnalyticsTab = () => (
    <div>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Analytics Dashboard</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            {['Total Calls', 'Avg Deal Health', 'Objections Handled', 'Win Rate'].map((metric, i) => (
                <div key={i} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1.5rem' }}>
                    <div style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{metric}</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{['12', '84%', '34', '18%'][i]}</div>
                </div>
            ))}
        </div>
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1.5rem', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-dim)' }}>
            [Interactive Chart Placeholder]
        </div>
    </div>
);

const HistoryTab = () => (
    <div>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Call History</h2>
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden' }}>
            {['Closing sync with Acme Corp', 'Discovery - TechStart', 'Follow-up w/ Globex'].map((call, i) => (
                <div key={i} className="interactive" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: i !== 2 ? '1px solid var(--color-border)' : 'none', cursor: 'pointer' }}>
                    <div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.25rem' }}>{call}</div>
                        <div style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem' }}>{['Today, 2:30 PM', 'Yesterday, 10:00 AM', 'Oct 12, 4:15 PM'][i]} • {['45 min', '22 min', '15 min'][i]}</div>
                    </div>
                    <ChevronRight size={20} color="var(--color-text-dim)" />
                </div>
            ))}
        </div>
    </div>
);

const SettingsTab = ({ user }) => (
    <div style={{ maxWidth: '600px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Settings</h2>
        
        <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Profile</h3>
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1.5rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', color: 'var(--color-text-dim)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Email Address</label>
                    <input type="email" disabled value={user?.email || ''} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'rgba(255,255,255,0.05)', color: '#fff' }} />
                </div>
                <div>
                    <label style={{ display: 'block', color: 'var(--color-text-dim)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Display Name</label>
                    <input type="text" placeholder="John Doe" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'rgba(255,255,255,0.05)', color: '#fff' }} />
                </div>
            </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Integrations</h3>
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontWeight: 'bold' }}>Salesforce CRM</div>
                        <div style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem' }}>Sync call notes automatically</div>
                    </div>
                    <button style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>Connect</button>
                </div>
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'analytics', label: 'Analytics', icon: BarChart2 },
        { id: 'history', label: 'Call History', icon: History },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#000', color: '#fff' }}>
            {/* Sidebar */}
            <aside style={{ width: '260px', minWidth: '260px', background: 'var(--color-surface)', borderRight: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Zap size={16} color="#fff" />
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>klyro.ai</span>
                </div>

                <nav style={{ flex: 1, padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {navItems.map(item => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.75rem 1rem',
                                    background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                                    color: isActive ? '#fff' : 'var(--color-text-dim)',
                                    border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left',
                                    transition: 'all 0.2s ease', fontWeight: isActive ? 600 : 400
                                }}
                                onMouseOver={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                                onMouseOut={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                            >
                                <Icon size={18} color={isActive ? 'var(--color-primary)' : 'currentColor'} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                <div style={{ padding: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), #4c1d95)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                            {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user?.email || 'User'}</div>
                            <div style={{ color: 'var(--color-text-dim)', fontSize: '0.8rem' }}>Free Plan</div>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout} 
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', color: 'var(--color-text-dim)', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.color = 'var(--color-text-dim)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '3rem 4rem', overflowY: 'auto' }}>
                {activeTab === 'overview' && <OverviewTab user={user} navigate={navigate} />}
                {activeTab === 'analytics' && <AnalyticsTab />}
                {activeTab === 'history' && <HistoryTab />}
                {activeTab === 'settings' && <SettingsTab user={user} />}
            </main>
        </div>
    );
};

export default Dashboard;
