import React from "react";
import { useNavigate } from "react-router-dom";
import { mainStyle, accentColor, optionBoxStyle, optionBoxHoverStyle } from "./styles";

const getBoxStyle = (hovered) => ({
  ...optionBoxStyle,
  ...(hovered ? optionBoxHoverStyle : {}),
  position: "relative",
  overflow: "hidden",
  borderImage: hovered
    ? `linear-gradient(135deg, ${accentColor} 40%, #fff 100%) 1`
    : undefined,
  boxShadow: hovered
    ? `0 8px 32px 0 ${accentColor}99, 0 0 40px ${accentColor}33`
    : optionBoxStyle.boxShadow,
});

function Options() {
  const navigate = useNavigate();
  const [hovered, setHovered] = React.useState(null);

  return (
    <div style={{ ...mainStyle, position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      {/* Decorative blurred teal circle for depth */}
      <div style={{
        position: "absolute",
        top: "10%",
        left: "5%",
        width: "220px",
        height: "220px",
        background: `${accentColor}`,
        opacity: 0.18,
        filter: "blur(48px)",
        borderRadius: "50%",
        zIndex: 0,
      }} />
      <div style={{ textAlign: "center", marginTop: "120px", zIndex: 1, width: "100%", maxWidth: "900px", marginLeft: "auto", marginRight: "auto" }}>
        <h2 style={{ color: accentColor, fontWeight: 900, marginBottom: "32px", fontSize: "2.5rem", letterSpacing: "2px", textTransform: "uppercase", textShadow: `0 2px 16px ${accentColor}88` }}>
           Choose an Option
        </h2>
        <div style={{ display: "flex", justifyContent: "center", gap: "48px" }}>
          <div
              style={getBoxStyle(hovered === "q")}
              onMouseEnter={() => setHovered("q")}
              onMouseLeave={() => setHovered(null)}
              onClick={() => navigate("/questionnaire")}
            >
              <span style={{ fontSize: "4rem", display: "block", marginBottom: "18px", textShadow: `0 4px 32px ${accentColor}88` }}>📝</span>
              <span style={{ fontSize: "2.2rem", fontWeight: 1000, letterSpacing: "2.5px", color: accentColor, textShadow: `0 2px 16px ${accentColor}55` }}>Questionnaire</span>
              <div style={{ fontSize: "1.7rem", color: "#e0eaff", marginTop: "18px", fontWeight: 700 }}>
                Take a quick self-assessment
              </div>
            </div>
          <div
              style={getBoxStyle(hovered === "c")}
              onMouseEnter={() => setHovered("c")}
              onMouseLeave={() => setHovered(null)}
              onClick={() => navigate("/chatbot")}
            >
              <span style={{ fontSize: "4rem", display: "block", marginBottom: "18px", textShadow: `0 4px 32px ${accentColor}88` }}>💬</span>
              <span style={{ fontSize: "2.2rem", fontWeight: 1000, letterSpacing: "2.5px", color: accentColor, textShadow: `0 2px 16px ${accentColor}55` }}>Chatbot</span>
              <div style={{ fontSize: "1.7rem", color: "#e0eaff", marginTop: "18px", fontWeight: 700 }}>
                Chat with your AI companion
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Options;