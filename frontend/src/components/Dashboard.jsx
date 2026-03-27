import { useEffect, useRef, useState } from 'react';
import { useAudioStream } from '../audio/audioStreamClient';
import CallBriefingForm from './CallBriefingForm';
import { 
    Zap, 
    Mic, 
    History, 
    BarChart3, 
    Target, 
    Settings, 
    LogOut, 
    Clock, 
    LayoutGrid, 
    CheckCircle2, 
    TrendingUp, 
    MessageSquare,
    AlertCircle,
    BrainCircuit,
    Activity
} from 'lucide-react';
import './Dashboard.css';

/* ─────────────────────────────────────────
   OBJECTIONS & SUGGESTIONS MAPPING
───────────────────────────────────────── */
const OBJECTIONS = [
    { type: 'PRICING', label: '💰 Pricing Objection', color: '#7c3aed', desc: 'Prospect flagged budget concerns', confidence: 94 },
    { type: 'COMPLEXITY', label: '🧩 Complexity Concern', color: '#7c3aed', desc: 'Previous bad experience with AI tools', confidence: 88 },
    { type: 'INTEGRATION', label: '🔗 Integration Request', color: '#7c3aed', desc: 'HubSpot required — non-negotiable', confidence: 97 },
    { type: 'TIMELINE', label: '📅 Timeline Inquiry', color: '#7c3aed', desc: 'Asking about rollout speed', confidence: 82 },
];

const Dashboard = ({ onExit }) => {
    const dashRef = useRef(null);
    const transcriptEndRef = useRef(null);
    const [callDuration, setCallDuration] = useState(0);
    const [isListening, setIsListening] = useState(false);
    const [wavePhase, setWavePhase] = useState(0);
    const [transcript, setTranscript] = useState([]);
    const [latestObjection, setLatestObjection] = useState(null);
    const [suggestionHistory, setSuggestionHistory] = useState([]);
    const [dealHealthScore, setDealHealthScore] = useState(50);
    const [callContext, setCallContext] = useState(null);
    const [contextId, setContextId] = useState(null);
    const [showBriefing, setShowBriefing] = useState(true);
    const [dealStage, setDealStage] = useState('discovery');
    const [coachingTip, setCoachingTip] = useState(null);
    const [showTabTip, setShowTabTip] = useState(false);
    const [spinStage, setSpinStage] = useState('situation');

    // MICROPHONE WEBSOCKET STREAM
    const wsUrl = contextId ? `ws://localhost:8000/ws/audio?context_id=${contextId}` : 'ws://localhost:8000/ws/audio';
    const { startRecording, stopRecording, isRecording } = useAudioStream(wsUrl);

    const handleToggleListen = async () => {
        if (isListening) {
            stopRecording();
            setIsListening(false);
            setShowTabTip(false);
        } else {
            setShowTabTip(true);
            setTimeout(() => setShowTabTip(false), 8000);

            const success = await startRecording({
                onTranscript: (t) => setTranscript((prev) => [...prev, t]),
                onAiAnalysis: (analysis) => {
                    const { spin_stage, objection_type, suggested_response, coaching_tip, next_best_question } = analysis;

                    if (spin_stage) setSpinStage(spin_stage);

                    if (objection_type && objection_type !== 'none') {
                        setLatestObjection({ type: objection_type });
                        setTimeout(() => setLatestObjection(null), 8000);
                    }

                    if (analysis.deal_signal) {
                        setDealHealthScore(prev => {
                            let change = 0;
                            if (analysis.deal_signal === 'positive') change = 10;
                            else if (analysis.deal_signal === 'neutral') change = 2;
                            else if (analysis.deal_signal === 'negative') change = -8;
                            const target = Math.min(100, Math.max(0, prev + change));
                            return Math.round(prev * 0.4 + target * 0.6);
                        });
                    }

                    if (suggested_response) {
                        const newSuggestion = {
                            id: Date.now(),
                            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            text: suggested_response,
                            strategy: analysis.strategy_used || coaching_tip || "Guidance",
                            persuasion: analysis.intent ? `Intent: ${analysis.intent}` : (analysis.persuasion_strategy || "Strategy"),
                            type: analysis.topic || objection_type || 'none',
                            nextQuestion: next_best_question
                        };
                        setSuggestionHistory(prev => [...prev, newSuggestion].slice(-10));
                    }

                    if (analysis.deal_stage) setDealStage(analysis.deal_stage);
                    if (analysis.coaching_tip) setCoachingTip(analysis.coaching_tip);
                }
            });
            if (success) setIsListening(true);
        }
    };

    const handleStartCall = (id, contextData) => {
        setContextId(id);
        setCallContext(contextData);
        setShowBriefing(false);
    };

    /* ── Call timer */
    useEffect(() => {
        const timer = setInterval(() => setCallDuration(d => d + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    /* ── Wave animation */
    useEffect(() => {
        const wave = setInterval(() => setWavePhase(p => p + 1), 100);
        return () => clearInterval(wave);
    }, []);

    /* ── Auto-scroll transcript */
    useEffect(() => {
        if (transcriptEndRef.current) {
            transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [transcript]);

    const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

    const waveHeights = Array.from({ length: 40 }, (_, i) =>
        Math.abs(Math.sin((i + wavePhase) * 0.3)) * 0.8 + 0.1
    );

    if (showBriefing) {
        return <CallBriefingForm onStartCall={handleStartCall} onBack={onExit} />;
    }

    return (
        <div className="db-root" ref={dashRef}>
            {/* ── AMBIENT BACKGROUND */}
            <div className="db-ambient">
                <div className="db-blob db-blob-1" />
                <div className="db-blob db-blob-2" />
                <div className="db-grid" />
            </div>

            {/* ── SIDEBAR */}
            <aside className="db-sidebar">
                <div className="db-sidebar-logo">
                    <span className="db-logo-mark"><Zap size={18} color="#fff" /></span>
                    <span className="db-logo-text">klyro<span className="db-logo-dot">.</span>ai</span>
                </div>

                <nav className="db-nav">
                    <button className="db-nav-item active"><Activity size={18} /> Live Call</button>
                    <button className="db-nav-item"><History size={18} /> History</button>
                    <button className="db-nav-item"><BarChart3 size={18} /> Analytics</button>
                    <button className="db-nav-item"><Target size={18} /> Playbooks</button>
                    <button className="db-nav-item"><Settings size={18} /> Settings</button>
                </nav>

                <div className="db-sidebar-footer">
                    <div className="db-user-chip">
                        <div className="db-user-avatar">JR</div>
                        <div className="db-user-info">
                            <span className="db-user-name">Jake Rivera</span>
                            <span className="db-user-role">Account Executive</span>
                        </div>
                    </div>
                    <button className="db-nav-item" onClick={onExit}><LogOut size={18} /> Exit</button>
                </div>
            </aside>

            {/* ── MAIN CONTENT */}
            <div className="db-main">
                <header className="db-topbar">
                    <div className="db-call-info">
                        <div className="db-live-badge">
                            <span className="db-live-dot" />
                            {isListening ? 'LIVE' : 'IDLE'}
                        </div>
                        <span className="db-call-name">{callContext ? callContext.client_name : 'New Sales Call'}</span>
                        <span className="db-call-duration"><Clock size={14} style={{ marginRight: '4px' }} /> {formatTime(callDuration)}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className={`db-listen-toggle ${isListening ? 'on' : ''}`} onClick={handleToggleListen}>
                            <Mic size={16} />
                            {isListening ? 'Listening' : 'Start Listening'}
                        </button>
                        <button className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }} onClick={onExit}>End</button>
                    </div>
                </header>

                <div className="db-panels-grid">
                    {/* LEFT PANEL */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* WAVEFORM */}
                        <div className="db-panel">
                            <div className="db-panel-header">
                                <span className="db-panel-title">Audio Stream</span>
                            </div>
                            <div className="db-waveform">
                                {waveHeights.map((h, i) => (
                                    <div key={i} className="db-wave-bar" style={{ height: `${isListening ? h * 100 : 10}%` }} />
                                ))}
                            </div>
                        </div>

                        {/* OBJECTIONS */}
                        <div className="db-panel" style={{ flex: 1 }}>
                            <div className="db-panel-header">
                                <span className="db-panel-title">Objection Radar</span>
                            </div>
                            <div className="db-objections-list">
                                {OBJECTIONS.map((obj) => (
                                    <div key={obj.type} className={`db-objection-item ${latestObjection?.type === obj.type ? 'detected' : ''}`}>
                                        {obj.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* MIDDLE PANEL - SUGGESTIONS */}
                    <div className="db-panel">
                        <div className="db-panel-header">
                            <span className="db-panel-title">Suggested Response</span>
                            <span className="db-live-badge"><BrainCircuit size={12} /> AI AI COACH</span>
                        </div>
                        <div className="db-suggestion-content">
                            {suggestionHistory.length > 0 ? (
                                <>
                                    <span className="db-suggestion-label">{suggestionHistory[suggestionHistory.length-1].strategy}</span>
                                    <p className="db-suggestion-text">
                                        "{suggestionHistory[suggestionHistory.length-1].text}"
                                    </p>
                                    {suggestionHistory[suggestionHistory.length-1].nextQuestion && (
                                        <div style={{ color: 'var(--color-primary)', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <TrendingUp size={16} />
                                            Follow up: {suggestionHistory[suggestionHistory.length-1].nextQuestion}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div style={{ textAlign: 'center', color: 'var(--color-text-dim)', marginTop: '4rem' }}>
                                    <MessageSquare size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                    <p>Listening for cues...</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT PANEL - TRANSCRIPT & HEALTH */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* HEALTH */}
                        <div className="db-panel" style={{ height: '200px' }}>
                             <div className="db-panel-header">
                                <span className="db-panel-title">Deal Health</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-primary)' }}>{dealHealthScore}%</div>
                            </div>
                        </div>

                        {/* TRANSCRIPT */}
                        <div className="db-panel" style={{ flex: 1 }}>
                             <div className="db-panel-header">
                                <span className="db-panel-title">Transcript</span>
                            </div>
                            <div className="db-transcript-scroll">
                                {transcript.map((msg, i) => (
                                    <div key={i} className="chat-bubble prospect">
                                        <span className="chat-speaker-label">Prospect</span>
                                        <p className="chat-text">{msg.text}</p>
                                    </div>
                                ))}
                                <div ref={transcriptEndRef} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
