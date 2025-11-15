import React, { useState } from 'react';
import axios from 'axios';
import './Questionnaire.css'; // We will create this file next

const API_URL = 'http://127.0.0.1:5000'; // Your Python "brain"

const phqQuestions = [
    { id: 'q1', text: 'Little interest or pleasure in doing things' },
    { id: 'q2', text: 'Feeling down, depressed, or hopeless' },
    { id: 'q3', text: 'Trouble falling or staying asleep, or sleeping too much' },
    { id: 'q4', text: 'Feeling tired or having little energy' },
    { id: 'q5', text: 'Poor appetite or overeating' },
    { id: 'q6', text: 'Feeling bad about yourself—or that you are a failure' },
    { id: 'q7', text: 'Trouble concentrating on things (e.g., reading)' },
    { id: 'q8', text: 'Moving/speaking slowly, or being fidgety/restless' },
    { id: 'q9', text: 'Thoughts that you would be better off dead' }
];

const scoreOptions = [
    { text: 'Not at all', value: 0 },
    { text: 'Several days', value: 1 },
    { text: 'More than half the days', value: 2 },
    { text: 'Nearly every day', value: 3 }
];

function Questionnaire() {
    const [phqScores, setPhqScores] = useState({
        q1: 0, q2: 0, q3: 0, q4: 0, q5: 0, q6: 0, q7: 0, q8: 0, q9: 0
    });
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPhqScores(prevScores => ({ ...prevScores, [name]: parseInt(value) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setResult(null);

        try {
            const response = await axios.post(`${API_URL}/submit_questionnaire`, phqScores);
            setResult(response.data);
        } catch (error) {
            console.error("Error submitting questionnaire:", error);
            setResult({
                severity: 'Error',
                suggestion: 'Could not connect to the server. Please try again later.'
            });
        }
        setIsLoading(false);
    };

    const handleRetake = () => {
        setResult(null);
        setPhqScores({ q1: 0, q2: 0, q3: 0, q4: 0, q5: 0, q6: 0, q7: 0, q8: 0, q9: 0 });
    };

    return (
        <div className="questionnaire-container">
            {!result ? (
                <form onSubmit={handleSubmit}>
                    <h2>PHQ-9 Wellbeing Questionnaire</h2>
                    <p>Over the last 2 weeks, how often have you been bothered by:</p>
                    
                    {phqQuestions.map((question) => (
                        <div className="question-block" key={question.id}>
                            <p className="question-text">{question.text}</p>
                            <div className="options-group">
                                {scoreOptions.map((option) => (
                                    <label key={option.value} className="radio-label">
                                        <input
                                            type="radio" name={question.id} value={option.value}
                                            checked={phqScores[question.id] === option.value}
                                            onChange={handleChange}
                                        />
                                        {option.text}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                    
                    <button type="submit" className="submit-btn" disabled={isLoading}>
                        {isLoading ? 'Calculating...' : 'Get My Result'}
                    </button>
                </form>
            ) : (
                <div className="result-container">
                    <h2>Your Result</h2>
                    <p className="result-score">Total Score: {result.total_score}</p>
                    <p className="result-severity">{result.severity}</p>
                    <p className="result-suggestion">{result.suggestion}</p>
                    <button onClick={handleRetake} className="submit-btn retake-btn">
                        Retake Test
                    </button>
                </div>
            )}
        </div>
    );
}

export default Questionnaire;