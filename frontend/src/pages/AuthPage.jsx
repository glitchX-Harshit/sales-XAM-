import { useState, useEffect } from 'react';
import Login from '../components/Login';
import Signup from '../components/Signup';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthPage = () => {
    const location = useLocation();
    const [view, setView] = useState(location.state?.view || 'login');
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state?.view) {
            setView(location.state.view);
        }
    }, [location.state]);

    const handleSuccess = () => {
        navigate('/dashboard');
    };

    if (view === 'signup') {
        return <Signup 
            onBack={() => navigate('/')} 
            onSignupSuccess={handleSuccess} 
            onSwitchToLogin={() => setView('login')}
        />;
    }

    return <Login 
        onBack={() => navigate('/')} 
        onLoginSuccess={handleSuccess} 
        onSwitchToSignup={() => setView('signup')}
    />;
};

export default AuthPage;
