import React from 'react';
import { useLocation, Link } from 'react-router-dom';

// --- NEW: Detailed Suggestions with Icons ---
const suggestions = {
    normal: {
        title: "You're in a good place!",
        className: "normal",
        message: "It's wonderful that you're feeling well. Maintaining mental wellness is a journey. Here are some tips to keep your spirits high.",
        list: [
            { icon: "☀️", text: "Practice Gratitude: Take a moment each day to write down three things you're thankful for." },
            { icon: "🏃", text: "Stay Active: Regular physical activity is a powerful mood booster. A short walk can make a big difference." },
            { icon: "🤝", text: "Connect with Others: Spend quality time with friends and family who uplift you." },
            { icon: "🧠", text: "Mindful Moments: Try a 5-minute mindfulness exercise to stay present and reduce stress." }
        ]
    },
    depression: {
        title: "It's okay to not be okay.",
        className: "depression",
        message: "Thank you for sharing. These feelings can be heavy, but you've already taken a brave first step. Here are some small, manageable actions that might help.",
        list: [
            { icon: "🚶", text: "Gentle Movement: If you can, try a short 10-minute walk outside. Sunlight and fresh air can help." },
            { icon: "🎵", text: "Comforting Media: Listen to a favorite soothing playlist or watch a comforting movie or show." },
            { icon: "✏️", text: "Express Yourself: Write down your thoughts in a journal without judgment. It's just for you." },
            { icon: "🗣️", text: "Reach Out: Consider talking to a trusted friend or family member. You don't have to carry this alone." }
        ]
    },
    severe: {
        title: "Your feelings are valid and important.",
        className: "severe",
        message: "It sounds like things are incredibly tough right now. Please know that support is available. Your well-being is the top priority.",
        list: [
            { icon: "🆘", text: "Seek Professional Help: Please consider speaking with a therapist or counselor. They are trained to help you navigate these feelings." },
            { icon: "📞", text: "Use a Helpline: If you're in crisis, confidential support is available 24/7. You can call or text a crisis line." },
            { icon: "❤️", text: "Be Kind to Yourself: Allow yourself to rest. You are dealing with a lot. Lower your expectations for what you 'should' be doing." },
            { icon: "🤝", text: "Create a Safety Plan: Identify trusted contacts and resources you can turn to when you feel overwhelmed." }
        ]
    }
};

function Results() {
    const location = useLocation();
    const { prediction } = location.state || { prediction: 'Normal' };

    let resultType;
    if (prediction.toLowerCase().includes('severe')) {
        resultType = 'severe';
    } else if (prediction.toLowerCase().includes('depression')) {
        resultType = 'depression';
    } else {
        resultType = 'normal';
    }

    const resultData = suggestions[resultType];

    return (
        <div className="results-container">
            {/* --- Main Diagnosis Card --- */}
            <div className={`results-card ${resultData.className}`}>
                <h2>{resultData.title}</h2>
                <p>{resultData.message}</p>
            </div>

            {/* --- NEW: Stunning Suggestions Box --- */}
            <div className="suggestions-container">
                <h3>Here are some things that might help:</h3>
                <div className="suggestion-list">
                    {resultData.list.map((item, index) => (
                        <div key={index} className="suggestion-item">
                            <div className="suggestion-icon">{item.icon}</div>
                            <p>{item.text}</p>
                        </div>
                    ))}
                </div>
            </div>

            <Link to="/" className="back-button">
                Back to Home
            </Link>
        </div>
    );
}

export default Results;