import React from "react";
import { useNavigate } from "react-router-dom";
import { mainStyle, cardStyle, subtitleStyle, buttonStyle } from "./styles";

import { accentColor } from "./styles";

function Home() {
  const navigate = useNavigate();
  return (
    <div style={{...mainStyle, justifyContent: "center", alignItems: "center", display: "flex"}}>
      <div style={{...cardStyle, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
        <span style={{
          fontSize: "5.2rem",
          marginBottom: "18px",
          color: accentColor,
          filter: `drop-shadow(0 0 12px ${accentColor}) drop-shadow(0 0 24px #23d6c5)`
        }}>🧭</span>
        <h1
          style={{
            color: accentColor,
            textShadow: `0 4px 32px ${accentColor}88, 0 0px 60px #070F2B`,
            letterSpacing: "6px",
            textTransform: "uppercase",
            margin: 0,
            textAlign: "center"
          }}
        >
          Mental Health Compass
        </h1>
        <button style={{...buttonStyle, fontSize: "1.3rem", marginTop: "32px"}} onClick={() => navigate("/options")}>Go to Options</button>
      </div>
    </div>
  );
}

export default Home;