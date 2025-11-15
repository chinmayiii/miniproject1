import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function WelcomePage() {
    const navigate = useNavigate();

    return (
        <div className="welcome-container">
            <div className="welcome-content">
                <svg className="header-logo large" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h1 className="welcome-title">Mental Health Compass</h1>
                <p className="welcome-tagline">A safe space to understand and navigate your feelings. <br />You are not alone.</p>
                <button className="welcome-button" onClick={() => navigate('/home')}>
                    Get Started
                </button>
            </div>
        </div>
    );
}

export default WelcomePage;