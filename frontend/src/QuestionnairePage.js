import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const API_URL = 'http://127.0.0.1:5000';

const questions = [
    { id: 3, text: "I couldn’t seem to experience any positive feeling at all." },
    { id: 5, text: "I found it difficult to work up the initiative to do things." },
    { id: 10, text: "I felt that I had nothing to look forward to." },
    { id: 13, text: "I felt down-hearted and blue." },
    { id: 16, text: "I was unable to become enthusiastic about anything." },
    { id: 17, text: "I felt I wasn’t worth much as a person." },
    { id: 21, text: "I felt that life was meaningless." },
    { id: 26, text: "I felt that I had lost interest in just about everything." },
    { id: 34, text: "I felt that life wasn't worthwhile." }
];

const options = [
    { label: "Did not apply to me at all", value: 1 },
    { label: "Applied to me to some degree", value: 2 },
    { label: "Applied to me a considerable degree", value: 3 },
    { label: "Applied to me very much", value: 4 },
];

function QuestionnairePage() {
    const navigate = useNavigate();
    const [answers, setAnswers] = useState(() => {
        const initialAnswers = {};
        questions.forEach(q => { initialAnswers[`Q${q.id}A`] = 1; });
        return initialAnswers;
    });

    const handleAnswerChange = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [`Q${questionId}A`]: parseInt(value) }));
    };

    const handleQuestionnaireSubmit = async (e) => {
        e.preventDefault();
        try {
            const features = questions.map(q => answers[`Q${q.id}A`]);
            const response = await fetch(`${API_URL}/predict_questionnaire`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ features: features })
            });
            const data = await response.json();
            navigate('/results', { state: { from: 'questionnaire', prediction: data.prediction } });
        } catch (error) {
            console.error('Error submitting questionnaire:', error);
        }
    };

    return (
        <>
            <header>
                <button className="back-button" onClick={() => navigate('/')}>&larr; Back to Home</button>
                <h1>9-Question Health Survey</h1>
            </header>
            <main>
                <div className="container">
                    <p>Over the last week, how often have you been bothered by any of the following problems?</p>
                    <form onSubmit={handleQuestionnaireSubmit}>
                        {questions.map((q, index) => (
                            <div key={q.id} className="question">
                                <label>{index + 1}. {q.text}</label>
                                <select value={answers[`Q${q.id}A`]} onChange={e => handleAnswerChange(q.id, e.target.value)}>
                                    {options.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                                </select>
                            </div>
                        ))}
                        <p style={{textAlign: 'center', marginTop: '20px', fontStyle: 'italic'}}>
                            You can answer as many questions as you like. Click the button when you're ready.
                        </p>
                        <button type="submit">Get My Assessment</button>
                    </form>
                </div>
            </main>
        </>
    );
}

export default QuestionnairePage;