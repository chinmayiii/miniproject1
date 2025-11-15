import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css'; // We will use the main CSS file

function HomePage() {
    const navigate = useNavigate();

    return (
        <>
            <header>
                <svg className="header-logo" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h1>Mental Health Compass</h1>
                <p className="tagline">Your guide to understanding and navigating your feelings.</p>
            </header>
            <main className="home-main">
                <h2>How would you like to begin?</h2>
                <div className="choice-container">
                    <div className="choice-card" onClick={() => navigate('/questionnaire')}>
                        <h3>9-Question Survey</h3>
                        <p>Answer a few questions for a quick assessment of your mental state over the last week.</p>
                        <span>Start Survey &rarr;</span>
                    </div>
                    <div className="choice-card" onClick={() => navigate('/chatbot')}>
                        <h3>Talk to Compass</h3>
                        <p>Chat with our empathetic AI bot to explore your feelings in a safe, supportive space.</p>
                        <span>Start Chatting &rarr;</span>
                    </div>
                </div>
            </main>
        </>
    );
}

export default HomePage;