import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  mainStyle,
  cardStyle,
  titleStyle,
  buttonStyle,
  buttonHoverStyle,
  innerCardStyle,
  selectStyle,
  accentColor,
} from "./styles";

const questions = [
  "I couldn’t seem to experience any positive feeling at all.",
  "I found it difficult to work up the initiative to do things.",
  "I felt that I had nothing to look forward to.",
  "I felt down-hearted and blue.",
  "I was unable to become enthusiastic about anything.",
  "I felt I wasn’t worth much as a person.",
  "I felt that life was meaningless.",
  "I felt that I had lost interest in just about everything.",
  "I felt restless and couldn't relax.",
];

const options = [
  "Did not apply to me at all",
  "Applied to me to some degree, or some of the time",
  "Applied to me to a considerable degree, or a good part of time",
  "Applied to me very much, or most of the time",
];

function Questionnaire() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const [hover, setHover] = useState(false);

  const handleChange = (qIdx, value) => {
    const newAnswers = [...answers];
    newAnswers[qIdx] = value;
    setAnswers(newAnswers);
  };

  // Prevent form submission from reloading the page
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Button clicked, navigating to result...");
    // Scoring logic
    const score = answers.filter(
      (a) => a === options[2] || a === options[3]
    ).length;
    let result = "Normal";
    let suggestions = [
      "Keep up your healthy habits!",
      "Stay connected with friends.",
    ];
    if (score >= 6) {
      result = "Depression";
      suggestions = [
        "Consult a therapist",
        "Try meditation",
        "Reach out to loved ones",
      ];
    } else if (score >= 4) {
      result = "Moderate State";
      suggestions = [
        "Consider talking to a counselor or therapist.",
        "Practice regular self-care and mindfulness.",
        "Reach out to supportive friends or family.",
      ];
    } else if (score >= 2) {
      result = "Mild State";
      suggestions = [
        "Practice mindfulness",
        "Talk to someone you trust",
        "Exercise regularly",
      ];
    }
    navigate("/result", { state: { result, suggestions } });
  };

  return (
    <div style={{...mainStyle, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
      <div style={{...cardStyle, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontSize: "2.2rem", padding: "96px 120px"}}>
        <h2 style={{...titleStyle, fontSize: "3.2rem", marginBottom: "38px"}}>
          Over the last week, how often have you been bothered by any of the following problems?
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{...innerCardStyle, fontSize: "2rem", padding: "72px 90px"}}>
            {questions.map((q, idx) => (
              <div key={idx} style={{ marginBottom: "32px", textAlign: "left" }}>
                <div
                  style={{
                    fontWeight: 900,
                    marginBottom: "16px",
                    color: accentColor,
                    fontSize: "2rem",
                    letterSpacing: "2px",
                    textShadow: `0 2px 16px ${accentColor}55`
                  }}
                >
                  <span style={{marginRight: "18px", fontSize: "2rem"}}>❓</span>{idx + 1}. {q}
                </div>
                <select
                  style={{...selectStyle, marginBottom: "32px", fontSize: "1.5rem", padding: "22px", borderRadius: "18px"}}
                  value={answers[idx]}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  {options.map((opt, i) => (
                    <option key={i} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <button
            type="submit"
            style={hover ? { ...buttonStyle, ...buttonHoverStyle, fontSize: "2.2rem", padding: "38px 90px", marginTop: "56px" } : { ...buttonStyle, fontSize: "2.2rem", padding: "38px 90px", marginTop: "56px" }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            Submit Questionnaire
          </button>
        </form>
      </div>
    </div>
  );
}

export default Questionnaire;