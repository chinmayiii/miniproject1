import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function ChoicesPage() {
    const navigate = useNavigate();

    return (
        <>
            <header>
                <h1>Mental Health Compass</h1>
                <p className="tagline">Your guide to understanding and navigating your feelings.</p>
            </header>
            <main className="home-main">
                <h2>How would you like to begin?</h2>
                <div className="choice-container">
                    <div className="choice-card" onClick={() => navigate('/questionnaire')}>
                        <div className="card-icon">📝</div>
                        <h3>9-Question Survey</h3>
                        <p>Answer a few questions for a quick assessment of your mental state over the last week.</p>
                        <span className="card-link">Start Survey &rarr;</span>
                    </div>
                    <div className="choice-card" onClick={() => navigate('/chatbot')}>
                        <div className="card-icon">💬</div>
                        <h3>Talk to Compass</h3>
                        <p>Chat with our empathetic AI bot to explore your feelings in a safe, supportive space.</p>
                        <span className="card-link">Start Chatting &rarr;</span>
                    </div>
                </div>
            </main>
        </>
    );
}

export default ChoicesPage;