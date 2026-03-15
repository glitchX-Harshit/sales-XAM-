import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useAudioStream } from '../audio/audioStreamClient';
import CallBriefingForm from './CallBriefingForm';
import './Dashboard.css';


/* ─────────────────────────────────────────
   MOCK DATA — cycles through realistic scenarios
───────────────────────────────────────── */
const TRANSCRIPT_LINES = [
    { speaker: 'rep', text: 'Hi Sarah, glad we could connect today. I wanted to walk you through how nx.ai can transform your team\'s performance.' },
    { speaker: 'prospect', text: 'Sure, but I\'ll be honest — we\'ve tried AI tools before and they were too complex.' },
    { speaker: 'rep', text: 'That\'s a super fair concern. What specifically felt complex — the setup, the interface, or the AI output itself?' },
    { speaker: 'prospect', text: 'Mostly the pricing doesn\'t fit our current budget. We\'re a 12-person team.' },
    { speaker: 'rep', text: 'Got it. A lot of 10–15 seat teams start with our Starter plan and see ROI within 30 days. Want me to walk through the numbers?' },
    { speaker: 'prospect', text: 'Maybe. We also need it to integrate with HubSpot — that\'s non-negotiable.' },
    { speaker: 'rep', text: 'Perfect news — HubSpot is a native integration, two-click setup. I can show you a live demo right now.' },
    { speaker: 'prospect', text: 'Okay, that actually sounds promising. What\'s the rollout timeline?' },
];

const OBJECTIONS = [
    { type: 'PRICING', label: '💰 Pricing Objection', color: '#ff5e00', desc: 'Prospect flagged budget concerns', confidence: 94 },
    { type: 'COMPLEXITY', label: '🧩 Complexity Concern', color: '#7c5cbf', desc: 'Previous bad experience with AI tools', confidence: 88 },
    { type: 'INTEGRATION', label: '🔗 Integration Request', color: '#0ea5e9', desc: 'HubSpot required — non-negotiable', confidence: 97 },
    { type: 'TIMELINE', label: '📅 Timeline Inquiry', color: '#27c93f', desc: 'Asking about rollout speed', confidence: 82 },
];

const SUGGESTIONS = [
    {
        objection: 'PRICING',
        tag: 'Pricing Objection',
        tagColor: '#ff5e00',
        title: 'ROI First Approach',
        body: '"Many 10–15 seat teams start with our Starter plan at $29/seat and see measurable ROI within 30 days — that\'s a full payback before month two."',
        stat: '94% success rate',
        alt: 'Offer a pilot with 3 seats for 14 days, zero cost.',
    },
    {
        objection: 'COMPLEXITY',
        tag: 'Complexity Concern',
        tagColor: '#7c5cbf',
        title: 'Simplicity Proof',
        body: '"Our average onboarding is 12 minutes. Your team can be live before end of day — no IT required, no custom config."',
        stat: '88% close rate on this response',
        alt: 'Offer a live sandbox demo on the call right now.',
    },
    {
        objection: 'INTEGRATION',
        tag: 'Integration Request',
        tagColor: '#0ea5e9',
        title: 'Native HubSpot Connect',
        body: '"HubSpot is a native, two-click integration. All call data, objection notes, and AI suggestions sync directly to your CRM in real-time."',
        stat: '97% satisfaction on integrations',
        alt: 'Screen share and show live sync in 2 minutes.',
    },
    {
        objection: 'TIMELINE',
        tag: 'Timeline Inquiry',
        tagColor: '#27c93f',
        title: 'Speed-to-Value',
        body: '"Teams go live in under 15 minutes. We handle migration, we handle setup. Most reps close their first nx.ai-assisted deal within week one."',
        stat: '82% teams live same-day',
        alt: 'Offer a dedicated onboarding call tomorrow morning.',
    },
];

const DEAL_STAGES = [
    { key: 'discovery',          label: 'Discovery',          icon: '🔍', color: '#0ea5e9' },
    { key: 'problem_exploration', label: 'Problem Exploration', icon: '🧩', color: '#7c5cbf' },
    { key: 'solution_framing',   label: 'Solution Framing',   icon: '💡', color: '#27c93f' },
    { key: 'objection_handling', label: 'Objection Handling', icon: '🛡', color: '#ff5e00' },
    { key: 'negotiation',        label: 'Negotiation',        icon: '🤝', color: '#f59e0b' },
    { key: 'closing',            label: 'Closing',            icon: '🎯', color: '#ec4899' },
];

const DealStageIndicator = ({ stage }) => {
    const activeIdx = DEAL_STAGES.findIndex(s => s.key === stage);
    return (
        <div className="db-deal-stage-bar">
            {DEAL_STAGES.map((s, idx) => {
                const isActive = s.key === stage;
                const isPast = idx < activeIdx;
                return (
                    <div key={s.key} className={`db-deal-stage-step ${isActive ? 'active' : ''} ${isPast ? 'past' : ''}`}
                        style={{ '--stage-color': s.color }}>
                        <span className="db-dss-icon">{s.icon}</span>
                        <span className="db-dss-label">{s.label}</span>
                        {idx < DEAL_STAGES.length - 1 && (
                            <div className={`db-dss-connector ${isPast || isActive ? 'filled' : ''}`}
                                style={{ background: isPast || isActive ? s.color : undefined }} />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

const Dashboard = ({ onExit }) => {
    const dashRef = useRef(null);
    const transcriptEndRef = useRef(null);
    const [callDuration, setCallDuration] = useState(0);
    const [isListening, setIsListening] = useState(false); // start off initially until explicit join
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

    // New states from Sales AI Engine
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
            // Show guidance tip before browser popup appears
            setShowTabTip(true);
            setTimeout(() => setShowTabTip(false), 8000);

            const success = await startRecording({
                onTranscript: (t) => setTranscript((prev) => [...prev, t]),
                onAiAnalysis: (analysis) => {
                    const { spin_stage, objection_type, suggested_response, coaching_tip, next_best_question } = analysis;

                    if (spin_stage) setSpinStage(spin_stage);
                    if (spin_stage) setSpinStage(spin_stage);

                    if (objection_type && objection_type !== 'none') {
                        setLatestObjection({ type: objection_type });
                        setTimeout(() => setLatestObjection(null), 8000);
                    } else if (analysis.type && analysis.type !== 'none') {
                        // Fallback mapping if type is used instead of objection_type for radar UI
                        setLatestObjection({ type: analysis.type });
                        setTimeout(() => setLatestObjection(null), 8000);
                    }

                    if (analysis.deal_signal) {
                        setDealHealthScore(prev => {
                            let change = 0;
                            if (analysis.deal_signal === 'positive') change = 10;
                            else if (analysis.deal_signal === 'neutral') change = 2;
                            else if (analysis.deal_signal === 'negative') change = -8;

                            const target = Math.min(100, Math.max(0, prev + change));
                            return Math.round(prev * 0.4 + target * 0.6); // slight smoothing
                        });
                    }

                    if (suggested_response) {
                        const newSuggestion = {
                            id: Date.now(),
                            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                            text: suggested_response,
                            strategy: analysis.strategy_used || coaching_tip || "Guidance",
                            persuasion: analysis.intent ? `Intent: ${analysis.intent}` : (analysis.persuasion_strategy || "Strategy"),
                            type: analysis.topic || objection_type || 'none',
                            nextQuestion: next_best_question
                        };
                        setSuggestionHistory(prev => [...prev, newSuggestion].slice(-20)); // Keep last 20
                    }

                    if (analysis.deal_stage) {
                        setDealStage(analysis.deal_stage);
                    }

                    if (analysis.coaching_tip) {
                        setCoachingTip(analysis.coaching_tip);
                    }
                }
            });
            if (success) setIsListening(true);
            else console.error('Failed to start microphone');
        }
    };

    const handleStartCall = (id, contextData) => {
        setContextId(id);
        setCallContext(contextData);
        setShowBriefing(false);
    };

    /* ── Entrance animation */
    useEffect(() => {
        if (showBriefing) return; // wait till briefing is done
        const ctx = gsap.context(() => {
            gsap.fromTo('.db-sidebar', { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out' });
            gsap.fromTo('.db-topbar', { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' });
            gsap.fromTo('.db-panel', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out', delay: 0.2 });
            gsap.fromTo('.db-metric-card', { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'back.out(1.7)', delay: 0.4 });
        }, dashRef);
        return () => ctx.revert();
    }, [showBriefing]);

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

    /* ── Auto-scroll transcript to bottom */
    useEffect(() => {
        if (transcriptEndRef.current) {
            transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [transcript]);

    const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

    const waveHeights = Array.from({ length: 28 }, (_, i) =>
        Math.abs(Math.sin((i + wavePhase) * 0.4)) * 0.8 + 0.1
    );

    return (
        <div className="db-root" ref={dashRef}>
            {showBriefing && <CallBriefingForm onStartCall={handleStartCall} />}

            {/* ── AMBIENT BACKGROUND */}
            <div className="db-ambient">
                <div className="db-blob db-blob-1" />
                <div className="db-blob db-blob-2" />
                <div className="db-grid" />
            </div>

            {/* ── SIDEBAR */}
            <aside className="db-sidebar">
                <div className="db-sidebar-logo">
                    <span className="db-logo-mark"><span className="db-logo-pulse" /></span>
                    <span className="db-logo-text">
                        <span className="db-logo-nx">nx</span>
                        <span className="db-logo-dot">.</span>
                        <span className="db-logo-ai">ai</span>
                    </span>
                </div>

                <nav className="db-nav">
                    {[
                        { icon: '⚡', label: 'Live Call', active: true },
                        { icon: '📋', label: 'History' },
                        { icon: '📊', label: 'Analytics' },
                        { icon: '🎯', label: 'Playbooks' },
                        { icon: '🔗', label: 'Integrations' },
                        { icon: '⚙️', label: 'Settings' },
                    ].map((item) => (
                        <button key={item.label} className={`db-nav-item ${item.active ? 'active' : ''}`}>
                            <span className="db-nav-icon">{item.icon}</span>
                            <span className="db-nav-label">{item.label}</span>
                            {item.active && <span className="db-nav-pip" />}
                        </button>
                    ))}
                </nav>

                <div className="db-sidebar-footer">
                    <div className="db-user-chip">
                        <div className="db-user-avatar">JR</div>
                        <div className="db-user-info">
                            <span className="db-user-name">Jake Rivera</span>
                            <span className="db-user-role">Account Executive</span>
                        </div>
                    </div>
                    <button className="db-exit-btn" onClick={onExit}>← Back</button>
                </div>
            </aside>

            {/* ── MAIN CONTENT */}
            <div className="db-main">
                {/* TOP BAR */}
                <header className="db-topbar">
                    <div className="db-topbar-left">
                        <div className="db-live-badge">
                            <span className="db-live-dot" style={{ background: isListening ? '#ff3d71' : '#666' }} />
                            {isListening ? 'LIVE CALL' : 'WAITING FOR AUDIO'}
                        </div>
                        <div className="db-call-info">
                            <span className="db-call-name">{callContext ? `${callContext.client_name} · ${callContext.client_industry}` : 'Sarah Chen · Acme Corp'}</span>
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '3px' }}>
                                <span className="db-call-duration" style={{ fontSize: '0.85rem' }}>{formatTime(callDuration)}</span>
                                {isListening && (
                                    <span className="db-spin-badge" style={{ fontSize: '0.7rem', fontWeight: 600, padding: '2px 6px', background: '#7c5cbf40', color: '#c5a3ff', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        STAGE: {spinStage}
                                    </span>
                                )}
                                {callContext && (
                                    <>
                                        <span className="db-spin-badge" style={{ fontSize: '0.7rem', fontWeight: 600, padding: '2px 6px', background: '#27c93f20', color: '#27c93f', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            Product: {callContext.product_name}
                                        </span>
                                        <span className="db-spin-badge" style={{ fontSize: '0.7rem', fontWeight: 600, padding: '2px 6px', background: '#0ea5e920', color: '#0ea5e9', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            Goal: {callContext.call_goal}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="db-topbar-right">
                        <button
                            className={`db-listen-toggle ${isListening ? 'on' : 'off'}`}
                            onClick={handleToggleListen}
                            style={{ cursor: 'pointer', border: 'none', background: isListening ? '#27c93f18' : '#222', color: isListening ? '#27c93f' : '#fff' }}
                        >
                            <span className="db-toggle-dot" style={{ background: isListening ? '#27c93f' : '#666' }} />
                            {isListening ? 'mic live' : 'join audio'}
                        </button>
                        <button className="db-end-btn" onClick={onExit}>End Call</button>
                    </div>
                </header>

                {/* TAB AUDIO GUIDANCE TIP */}
                {showTabTip && (
                    <div style={{
                        margin: '0 2rem',
                        padding: '0.65rem 1rem',
                        background: 'linear-gradient(135deg, rgba(124,92,191,0.12), rgba(14,165,233,0.08))',
                        border: '1px solid rgba(124,92,191,0.25)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: '#7c5cbf',
                        flexShrink: 0,
                        animation: 'txSlide 0.3s ease-out'
                    }}>
                        <span style={{ fontSize: '1rem' }}>🖥️</span>
                        <span>
                            Select your <strong>Zoom / Google Meet / Teams</strong> tab and enable{' '}
                            <strong>"Share tab audio"</strong> so Clerio can listen to the call.
                        </span>
                    </div>
                )}

                {/* DEAL STAGE INDICATOR */}
                <DealStageIndicator stage={dealStage} />

                {/* PANELS GRID */}
                <div className="db-panels-grid">

                    {/* ── LIVE WAVEFORM PANEL */}
                    <div className="db-panel db-panel-wave">
                        <div className="db-panel-header">
                            <span className="db-panel-title">🎙 Voice Stream</span>
                            <span className="db-panel-tag">HD · 44kHz</span>
                        </div>
                        <div className="db-waveform">
                            {waveHeights.map((h, i) => (
                                <div
                                    key={i}
                                    className="db-wave-bar"
                                    style={{ transform: `scaleY(${isListening ? h : 0.05})`, transition: 'transform 0.15s ease' }}
                                />
                            ))}
                        </div>
                        <div className="db-sentiment-row">
                            <div className="db-sentiment-item">
                                <span className="db-sentiment-dot" style={{ background: '#27c93f' }} />
                                <span>Prospect Tone: Curious</span>
                            </div>
                            <div className="db-sentiment-item">
                                <span className="db-sentiment-dot" style={{ background: '#0ea5e9' }} />
                                <span>Rep Confidence: High</span>
                            </div>
                            <div className="db-sentiment-item">
                                <span className="db-sentiment-dot" style={{ background: '#ff5e00' }} />
                                <span>Call Momentum: ↑ Rising</span>
                            </div>
                        </div>
                    </div>

                    {/* ── LIVE TRANSCRIPT */}
                    <div className="db-panel db-panel-transcript">
                        <div className="db-panel-header">
                            <span className="db-panel-title">📝 Live Transcript</span>
                            <span className="db-panel-tag">Real-time · Whisper AI</span>
                        </div>
                        <div className="db-transcript-scroll" id="transcript-container">
                            {transcript.length === 0 && <div style={{ padding: '1rem', opacity: 0.5 }}>Waiting for dialogue...</div>}
                            {transcript.map((line, i) => {
                                const isUser = line.speaker === 'user';
                                return (
                                    <div key={i} className={`chat-row ${isUser ? 'chat-user' : 'chat-prospect'}`}>
                                        <div className="chat-bubble">
                                            <span className="chat-speaker-label">{isUser ? 'You' : 'Prospect'}</span>
                                            <p className="chat-text">{line.text}</p>
                                        </div>
                                    </div>
                                );
                            })}
                            {isListening && (
                                <div className="db-typing-indicator chat-prospect-typing">
                                    <span /><span /><span />
                                </div>
                            )}
                            <div ref={transcriptEndRef} />
                        </div>
                    </div>

                    {/* ── OBJECTION RADAR */}
                    <div className="db-panel db-panel-objections">
                        <div className="db-panel-header">
                            <span className="db-panel-title">🎯 Objection Radar</span>
                            <span className="db-panel-tag">{latestObjection ? '1 detected' : 'Scanning...'}</span>
                        </div>
                        <div className="db-objections-list">
                            {OBJECTIONS.map((obj, i) => {
                                const isDetected = latestObjection && latestObjection.type.toUpperCase() === obj.type;
                                const isActive = isDetected;
                                return (
                                    <div
                                        key={obj.type}
                                        className={`db-objection-item ${isDetected ? 'detected' : 'pending'} ${isActive ? 'active db-objection-flash' : ''}`}
                                        style={{ '--obj-color': obj.color }}
                                    >
                                        <div className="db-obj-indicator" style={{ background: isDetected ? obj.color : 'rgba(0,0,0,0.08)' }} />
                                        <div className="db-obj-info">
                                            <span className="db-obj-label" style={{ color: isDetected ? obj.color : 'rgba(17,17,17,0.3)' }}>
                                                {obj.label}
                                            </span>
                                            <span className="db-obj-desc" style={{ opacity: isDetected ? 1 : 0.3 }}>{obj.desc}</span>
                                        </div>
                                        {isDetected && (
                                            <div className="db-obj-confidence" style={{ color: obj.color }}>
                                                {obj.confidence}%
                                            </div>
                                        )}
                                        {!isDetected && <div className="db-obj-pending">—</div>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── AI SUGGESTION ENGINE */}
                    <div className="db-panel db-panel-suggestion" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="db-panel-header" style={{ flexShrink: 0 }}>
                            <span className="db-panel-title">✦ AI Response Coach</span>
                            <span className="db-panel-tag">Powered by Llama 3.3</span>
                        </div>

                        <div className="db-suggestion-history" style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {suggestionHistory.length > 0 ? (
                                suggestionHistory.map((sugg, idx) => {
                                    const isLatest = idx === suggestionHistory.length - 1;
                                    return (
                                        <div key={sugg.id} className={`db-suggestion-body ${isLatest ? 'db-suggestion-latest' : 'db-suggestion-past'}`} style={{ opacity: isLatest ? 1 : 0.65, transition: 'opacity 0.2s', borderBottom: isLatest ? 'none' : '1px solid rgba(255,255,255,0.05)', paddingBottom: isLatest ? '0' : '1rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                    <div className="db-sugg-tag" style={{ background: isLatest ? '#27c93f18' : 'transparent', color: isLatest ? '#27c93f' : '#888', borderColor: isLatest ? '#27c93f40' : '#444', padding: isLatest ? undefined : '2px 8px' }}>
                                                        {isLatest ? '⚡ Latest Recommendation' : 'Past Suggestion'}
                                                    </div>
                                                    <div className="db-sugg-tag" style={{ background: '#0ea5e918', color: '#0ea5e9', borderColor: '#0ea5e940' }}>
                                                        {sugg.persuasion}
                                                    </div>
                                                    {sugg.type !== 'none' && (
                                                        <div className="db-sugg-tag" style={{ background: '#ff5e0018', color: '#ff5e00', borderColor: '#ff5e0040' }}>
                                                            Obj: {sugg.type}
                                                        </div>
                                                    )}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: '#888', background: '#222', padding: '2px 6px', borderRadius: '4px' }}>
                                                    {sugg.timestamp}
                                                </div>
                                            </div>

                                            <div className="db-sugg-title" style={{ fontSize: isLatest ? '1.1rem' : '0.95rem' }}>{sugg.strategy}</div>
                                            <div className="db-sugg-quote" style={{ fontSize: isLatest ? '1.05rem' : '0.9rem' }}>"{sugg.text}"</div>

                                            {sugg.nextQuestion && isLatest && (
                                                <div className="db-sugg-stat" style={{ color: '#0ea5e9', background: '#0ea5e910', padding: '6px 10px', borderRadius: '6px', marginTop: '10px' }}>
                                                    <span className="db-sugg-dot" style={{ background: '#0ea5e9' }} />
                                                    <strong style={{ opacity: 0.8, marginRight: '4px' }}>Ask Next:</strong> {sugg.nextQuestion}
                                                </div>
                                            )}
                                            {coachingTip && isLatest && (
                                                <div className="db-sugg-stat" style={{ color: '#7c5cbf', background: '#7c5cbf10', padding: '6px 10px', borderRadius: '6px', marginTop: '8px', borderLeft: '3px solid #7c5cbf50' }}>
                                                    <span className="db-sugg-dot" style={{ background: '#7c5cbf' }} />
                                                    <strong style={{ opacity: 0.8, marginRight: '4px' }}>🧠 Coaching:</strong> {coachingTip}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="db-suggestion-empty" style={{ margin: 'auto' }}>
                                    <div className="db-sugg-idle-icon">✦</div>
                                    <p>Listening for objections…</p>
                                    <span>AI will accumulate real-time responses and history as your prospect speaks.</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── DEAL HEALTH SCORE */}
                    <div className="db-panel db-panel-health">
                        <div className="db-panel-header">
                            <span className="db-panel-title">📈 Deal Health</span>
                            <span className="db-panel-tag">Live scoring</span>
                        </div>
                        <div className="db-health-score">
                            <div className="db-score-ring">
                                <svg viewBox="0 0 100 100" className="db-score-svg">
                                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="8" />
                                    <circle cx="50" cy="50" r="42" fill="none" stroke="#27c93f" strokeWidth="8"
                                        strokeDasharray={`${2 * Math.PI * 42 * (dealHealthScore / 100)} ${2 * Math.PI * 42 * (1 - (dealHealthScore / 100))}`}
                                        strokeLinecap="round" transform="rotate(-90 50 50)" style={{ transition: 'stroke-dasharray 0.5s ease-out' }} />
                                </svg>
                                <div className="db-score-label">
                                    <span className="db-score-number">{dealHealthScore}</span>
                                    <span className="db-score-sub">/100</span>
                                </div>
                            </div>
                            <div className="db-health-factors">
                                {[
                                    { label: 'Engagement', val: 82, color: '#27c93f' },
                                    { label: 'Objections Resolved', val: 60, color: '#ff5e00' },
                                    { label: 'Next Steps Clear', val: 45, color: '#0ea5e9' },
                                    { label: 'Decision Maker', val: 90, color: '#7c5cbf' },
                                ].map((f) => (
                                    <div key={f.label} className="db-health-factor">
                                        <div className="db-hf-top">
                                            <span className="db-hf-label">{f.label}</span>
                                            <span className="db-hf-val" style={{ color: f.color }}>{f.val}%</span>
                                        </div>
                                        <div className="db-hf-bar">
                                            <div className="db-hf-fill" style={{ width: `${f.val}%`, background: f.color }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── PLAYBOOK PROGRESS */}
                    <div className="db-panel db-panel-playbook">
                        <div className="db-panel-header">
                            <span className="db-panel-title">🗺 Playbook Progress</span>
                            <span className="db-panel-tag">SaaS Discovery</span>
                        </div>
                        <div className="db-playbook-steps">
                            {[
                                { step: 'Rapport & Intro', done: true },
                                { step: 'Pain Discovery', done: true },
                                { step: 'Feature Demo', done: true },
                                { step: 'Handle Objections', done: true, active: true },
                                { step: 'Pricing Discussion', done: false },
                                { step: 'Next Steps + Close', done: false },
                            ].map((s, i) => (
                                <div key={i} className={`db-step ${s.done ? 'done' : ''} ${s.active ? 'current' : ''}`}>
                                    <div className="db-step-dot">
                                        {s.done ? '✓' : i + 1}
                                    </div>
                                    <span className="db-step-label">{s.step}</span>
                                    {s.active && <span className="db-step-now">NOW</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
