import React from "react";
import { useLocation } from "react-router-dom";
import {
  mainStyle,
  cardStyle,
  suggestionBoxStyle,
  accentColor,
} from "./styles";

function Result() {
  const location = useLocation();
  const { result, suggestions } = location.state || {};

  // Icon for suggestion (can use emoji or SVG)
  const icons = ["🌱", "💡", "🌟", "🧘‍♂️", "🤝", "😊", "🏃‍♂️"];

  // Color mapping for mental state levels
  const stateColors = {
    Severe: { bg: "#ff4d4f", color: "#fff", border: "#b71c1c" }, // Red
    Depression: { bg: "#ff4d4f", color: "#fff", border: "#b71c1c" }, // Red for Depression
    Moderate: { bg: "#ffec3d", color: "#232946", border: "#b59f00" }, // Yellow
    Mild: { bg: "#23d6c5", color: "#232946", border: "#1b7f6b" }, // Teal
    Normal: { bg: "#43d96b", color: "#232946", border: "#1b7f6b" }, // Green
    default: { bg: "#232946", color: accentColor, border: accentColor },
  };
  // Determine state level from result string
  let level = "default";
  if (result) {
    if (result.toLowerCase().includes("depression")) level = "Depression";
    else if (result.toLowerCase().includes("severe")) level = "Severe";
    else if (result.toLowerCase().includes("moderate state")) level = "Moderate";
    else if (result.toLowerCase().includes("moderate")) level = "Moderate";
    else if (result.toLowerCase().includes("mild state")) level = "Mild";
    else if (result.toLowerCase().includes("mild")) level = "Mild";
    else if (result.toLowerCase().includes("normal")) level = "Normal";
  }
  const stateStyle = {
    background: stateColors[level].bg,
    color: stateColors[level].color,
    borderRadius: "44px",
    padding: "56px 0",
    fontWeight: 1000,
    fontSize: "3.2rem",
    marginBottom: "56px",
    boxShadow: `0 16px 64px 0 ${stateColors[level].bg}55`,
    border: `4px solid ${stateColors[level].border}`,
    textAlign: "center",
    letterSpacing: "4px",
    textShadow: `0 4px 32px ${stateColors[level].bg}88`
  };
  return (
    <div style={{...mainStyle, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
      <div style={{ ...cardStyle, maxWidth: "600px", padding: "48px 40px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {/* Big rectangular box for mental state */}
        <div style={stateStyle}>
          <span style={{fontSize: "2.1rem", marginRight: "10px"}}>🧠</span>{result ? result : "No result"}
        </div>
        <h3 style={{ color: accentColor, fontWeight: 900, marginBottom: "24px", fontSize: "1.35rem", textShadow: `0 1px 8px ${accentColor}55` }}>
          <span style={{fontSize: "1.3rem", marginRight: "8px"}}>🌱</span> Suggestions for you:
        </h3>
        <div>
          {suggestions &&
            suggestions.map((s, i) => (
              <div key={i} style={{
                  ...suggestionBoxStyle,
                  background: i % 2 === 0 ? accentColor : "#e0eaff",
                  color: i % 2 === 0 ? "#232946" : accentColor,
                  fontWeight: 900,
                  fontSize: "2rem",
                  borderLeft: `10px solid ${accentColor}`,
                  boxShadow: `0 8px 32px ${accentColor}22`,
                  marginBottom: "28px",
                  alignItems: "center"
                }}>
                  <span style={{ fontSize: "2.2rem", marginRight: "18px" }}>
                    {icons[i % icons.length]}
                  </span>
                  <span>{s}</span>
                </div>
            ))}
        </div>
        <button
          style={{
            marginTop: "56px",
            background: `linear-gradient(90deg, ${accentColor} 0%, #6ec6ff 100%)`,
            color: "#070F2B",
            border: "none",
            borderRadius: "32px",
            padding: "38px 90px",
            fontSize: "2.2rem",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: `0 12px 48px ${accentColor}22`,
            letterSpacing: "2.5px",
            textTransform: "uppercase",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onClick={() => window.location.href = "/home"}
        >
            <span style={{fontSize: "2rem", marginRight: "18px"}}>🏠</span> Back to Home
        </button>
      </div>
    </div>
  );
}

export default Result;