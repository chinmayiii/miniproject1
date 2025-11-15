import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './App.css';

// --- Suggestion Data (no changes needed here) ---
const suggestionsData = {
    Normal: {
        title: "Your results appear to be in a healthy range.",
        className: "result-normal",
        message: "It's wonderful that you're feeling well. Maintaining good mental hygiene is just as important as physical health. Here are a few ideas to keep your spirits high:",
        actions: [
            { icon: "👟", text: "Go for a mindful walk and notice your surroundings." },
            { icon: "🎵", text: "Listen to an album that makes you happy or calm." },
            { icon: "📖", text: "Spend 15 minutes reading a book for pleasure." },
            { icon: "☀️", text: "Get some sunlight, if possible." },
        ]
    },
    Depression: {
        title: "Your results suggest you may be feeling down.",
        className: "result-depression",
        message: "It's brave of you to take this step. When you're feeling low, small actions can make a big difference. Please consider these gentle suggestions, and remember it's okay to ask for help:",
        actions: [
            { icon: "🗣️", text: "Talk about your feelings with a trusted friend or family member." },
            { icon: "💧", text: "Ensure you're hydrated and have a balanced meal." },
            { icon: "📝", text: "Write down three things you can see, hear, and feel right now." },
            { icon: "🛌", text: "Aim for a consistent sleep schedule." },
        ]
    },
    Severe: {
        title: "Your results suggest things may be very difficult right now.",
        className: "result-severe",
        message: "Thank you for trusting us. It sounds like you're carrying a heavy burden. The most important step you can take is to reach out to a professional who can provide the support you deserve. You are not alone in this.",
        urgent: "Please consider speaking with a doctor, therapist, or a crisis support service. Your well-being is the top priority.",
        actions: [
            { icon: "👩‍⚕️", text: "Schedule an appointment with a healthcare professional." },
            { icon: "🤝", text: "Reach out to a local mental health support line." },
            { icon: "❤️", text: "Tell someone you trust that you are struggling." },
        ]
    },
};

function ResultsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { from, prediction, summary } = location.state || { from: 'Unknown' };

    // Get the corresponding data for the prediction (works for both paths)
    const resultData = suggestionsData[prediction] || {};

    return (
        <>
            <header>
                <button className="back-button" onClick={() => navigate('/home')}>&larr; Back to Choices</button>
                <h1>Your Assessment</h1>
            </header>
            <main>
                <div className="container result-page-container">
                    {/* Main Result Card - UNIFIED LOGIC */}
                    <div className={`result-card ${resultData.className || 'result-chatbot'}`}>
                        <h2>{from === 'chatbot' ? 'Summary of Your Conversation' : resultData.title}</h2>
                        <p>{from === 'chatbot' ? summary : resultData.message}</p>
                        {resultData.urgent && <p className="urgent-text">{resultData.urgent}</p>}
                    </div>

                    {/* Suggestions Grid (shows for both if a prediction exists) */}
                    {prediction && resultData.actions && (
                        <div className="suggestions-container">
                            <h3>Actionable Suggestions</h3>
                            <div className="grid-container">
                                {resultData.actions.map((action, index) => (
                                    <div key={index} className="suggestion-card">
                                        <div className="suggestion-icon">{action.icon}</div>
                                        <div className="suggestion-text">{action.text}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Disclaimer and Button */}
                    <p className="disclaimer">
                        <strong>Disclaimer:</strong> This is not a medical diagnosis. This tool is for informational purposes only. Please consult with a healthcare professional for any health concerns.
                    </p>
                    <button onClick={() => navigate('/')}>Return to Welcome Page</button>
                </div>
            </main>
        </>
    );
}

export default ResultsPage;