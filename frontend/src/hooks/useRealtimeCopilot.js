import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

export const useRealtimeCopilot = (wsUrl = 'ws://localhost:8000/ws') => {
    const [isConnected, setIsConnected] = useState(false);
    const [transcript, setTranscript] = useState([]);
    const [latestObjection, setLatestObjection] = useState(null);
    const [latestSuggestion, setLatestSuggestion] = useState(null);
    const ws = useRef(null);

    useEffect(() => {
        let isMounted = true;

        const connectWs = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            if (!isMounted) return;

            const finalUrl = token ? `${wsUrl}?token=${token}` : wsUrl;
            ws.current = new WebSocket(finalUrl);

            ws.current.onopen = () => {
                setIsConnected(true);
                console.log('Connected to klyro.ai copilot backend securely');
            };

            ws.current.onclose = () => {
                setIsConnected(false);
                console.log('Disconnected from klyro.ai copilot backend');
            };

            ws.current.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    if (data.type === 'objectionDetect') {
                        setLatestObjection(data.objection);
                        setTimeout(() => setLatestObjection(null), 8000);
                    } else if (data.type === 'aiSuggestion') {
                        setLatestSuggestion(data.suggestion);
                        setTimeout(() => setLatestSuggestion(null), 12000);
                    } else if (data.type === 'transcriptUpdate') {
                        setTranscript(prev => [...prev, data]);
                    }
                } catch (err) {
                    console.error('WebSocket message parse error:', err);
                }
            };
        };

        connectWs();

        return () => {
            isMounted = false;
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [wsUrl]);

    // Method to simulate speaking (since actual mic recording -> Deepgram is complex for this browser sandbox)
    const simulateSpeech = useCallback((text, speaker = 'prospect') => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            const payload = { type: 'transcriptUpdate', text, speaker };
            ws.current.send(JSON.stringify(payload));
            setTranscript(prev => [...prev, payload]);
        }
    }, []);

    return {
        isConnected,
        transcript,
        latestObjection,
        latestSuggestion,
        simulateSpeech
    };
};
