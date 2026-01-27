import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  mainStyle,
  cardStyle,
  titleStyle,
  subtitleStyle,
  buttonStyle,
  buttonHoverStyle,
  accentColor,
} from "./styles";

// Conversation rating function
function rateConversation(messages) {
  let score = 0;
  messages.forEach(msg => {
    if (msg.sender === "user") {
      const text = msg.text.toLowerCase();
      if (
        text.includes("dying") || text.includes("die") || text.includes("suicide") || text.includes("kill myself") || text.includes("end my life") || text.includes("hurt myself") || text.includes("self-harm") || text.includes("jumping off")
      ) {
        score += 18; // Severe crisis
      } else if (
        text.includes("idk") || text.includes("confused") || text.includes("wtf") || text.includes("hell") || text.includes("what is happening")
      ) {
        score += 15; // Severe confusion/distress
      } else if (
        text.includes("don't want") || text.includes("dont want") || text.includes("no") || text.includes("not now") || text.includes("stop") || text.includes("hate") || text.includes("don't wanna") || text.includes("dont wanna")
      ) {
        score += 13; // Moderate avoidance
      } else if (
        text.includes("sad") || text.includes("depressed") || text.includes("unhappy")
      ) {
        score += 12; // Moderate sadness
      } else if (
        text.includes("angry") || text.includes("mad") || text.includes("upset") || text.includes("annoyed") || text.includes("frustrated")
      ) {
        score += 10; // Mild anger
      } else if (
        text.includes("alone") || text.includes("lonely")
      ) {
        score += 8; // Mild loneliness
      } else if (
        text.includes("fine") || text.includes("good") || text.includes("okay") || text.includes("better")
      ) {
        score += 3; // Positive
      } else if (text.length < 5) {
        score += 2; // Neutral/short
      } else {
        score += 5; // Default mild concern
      }
    }
  });
  // Normalize score to 1-20 scale
  score = Math.min(20, Math.max(1, Math.round(score / messages.filter(m => m.sender === "user").length)));
  let state = "Normal";
  if (score >= 16) state = "Severe";
  else if (score >= 11) state = "Moderate";
  else if (score >= 6) state = "Mild";
  return { score, state };
}

function Chatbot() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How are you feeling today?" }
  ]);
  const [input, setInput] = useState("");
  const [hover, setHover] = useState(false);

  const getBotResponse = (userText) => {
    const text = userText.toLowerCase();
    // Crisis detection
    // Confusion or anger
    if (text.includes("wtf") || text.includes("wt") || text.includes("hell") || text.includes("confused") || text.includes("idk") || text.includes("don't know") || text.includes("dont know")) {
      return "It sounds like things feel really overwhelming or confusing right now. I'm here to help you sort through your feelings. Can you tell me a bit more about what's on your mind?";
    }
    if (text.includes("angry") || text.includes("mad") || text.includes("upset") || text.includes("annoyed") || text.includes("frustrated")) {
      return "I'm sorry you're feeling this way. Want to talk about what's making you feel angry or upset? Sometimes sharing can help lighten the load.";
    }
    // Direct questions about bot identity
    if (text.includes("who are you") || text.includes("what are you") || text.includes("are you real") || text.includes("bot") || text.includes("ai")) {
      return "I'm an AI companion here to support you and listen. My goal is to help you feel heard and offer gentle guidance. How can I help you today?";
    }
    // Sadness
    if (text.includes("sad") || text.includes("depressed") || text.includes("unhappy")) {
      return "I'm really sorry you're feeling this way. Can you share what happened or what's on your mind? I'm here to listen and help you through this.";
    }
    // Resistance or avoidance
    if (text.includes("don't want") || text.includes("dont want") || text.includes("no") || text.includes("not now") || text.includes("stop") || text.includes("hate")) {
      return "That's okay. If you ever feel like talking, I'm here for you. Would you like some tips to feel a little better right now?";
    }
    // Positive feelings
    if (text.includes("fine") || text.includes("good") || text.includes("okay") || text.includes("better")) {
      return "I'm glad to hear that! If you ever need support or just want to chat, I'm here for you.";
    }
    // Help or support
    if (text.includes("help") || text.includes("support") || text.includes("tips")) {
      return "Here are a few things that might help: try deep breathing, take a short walk, or reach out to someone you trust. Would you like more suggestions?";
    }
    // Loneliness
    if (text.includes("alone") || text.includes("lonely")) {
      return "Feeling alone can be really hard. Remember, you matter and people care about you. Would you like to talk about ways to feel more connected?";
    }
    // Goodbye
    if (text.includes("bye") || text.includes("exit") || text.includes("leave")) {
      return "Take care! If you ever want to talk again, I'll be here for you.";
    }
    // Short messages
    if (text.length < 5) {
      return "I'm here to listen whenever you're ready to share more.";
    }
    // Default
    return "Thank you for opening up. Can you tell me more about what's happening or how I can support you?";
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setMessages([...messages, { sender: "user", text: userText }]);
    setInput("");
    setTimeout(() => {
      setMessages(msgs => [
        ...msgs,
        { sender: "bot", text: getBotResponse(userText) }
      ]);
    }, 800);
  };

  const handleFinish = () => {
    // Rate the conversation and show result
    const analysis = rateConversation(messages);
    let suggestions = [];
    if (analysis.state === "Severe") {
      suggestions = [
        "Please reach out to a mental health professional or helpline immediately.",
        "Talk to someone you trust about your feelings.",
        "Try grounding techniques and deep breathing."
      ];
    } else if (analysis.state === "Moderate") {
      suggestions = [
        "Consider speaking with a counselor or therapist.",
        "Practice mindfulness and journaling.",
        "Connect with supportive friends or family."
      ];
    } else if (analysis.state === "Mild") {
      suggestions = [
        "Take a short walk or do light exercise.",
        "Try relaxation techniques like deep breathing.",
        "Reach out to someone you trust if you need to talk."
      ];
    } else {
      suggestions = [
        "Keep up your self-care routines.",
        "Stay connected with friends and family.",
        "Practice gratitude and mindfulness."
      ];
    }
    navigate("/result", {
      state: {
        result: `Chatbot Analysis: ${analysis.state} (${analysis.score}/20)`,
        suggestions
      }
    });
  };

  return (
    <div style={{...mainStyle, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
      <div style={{...cardStyle, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 56px", maxWidth: "600px"}}>
        <h2 style={{...titleStyle, fontSize: "3.5rem"}}>Chatbot</h2>
        <p style={{...subtitleStyle, fontSize: "1.5rem", marginBottom: "28px"}}>Chat with our AI to get personalized support.</p>
        <div style={{
          background: "#232946",
          borderRadius: "24px",
          padding: "28px",
          height: "260px",
          overflowY: "auto",
          marginBottom: "28px",
          boxShadow: `0 4px 18px ${accentColor}22`,
          border: `2px solid ${accentColor}`
        }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{
              textAlign: msg.sender === "user" ? "right" : "left",
              marginBottom: "16px"
            }}>
              <span style={{
                display: "inline-block",
                background: msg.sender === "user" ? accentColor : "#1B1A55",
                color: "#fff",
                borderRadius: "16px",
                padding: "16px 28px",
                fontWeight: "bold",
                fontSize: "1.35rem",
                maxWidth: "80%",
                boxShadow: `0 4px 12px ${accentColor}22`,
                letterSpacing: "1.5px"
              }}>
                {msg.text}
              </span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "10px", marginBottom: "18px" }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: "18px",
              borderRadius: "14px",
              border: `2px solid ${accentColor}`,
              fontSize: "1.25rem",
              background: "#232946",
              color: accentColor,
              fontWeight: 700,
              letterSpacing: "1.2px"
            }}
            onKeyDown={e => e.key === "Enter" && handleSend()}
          />
          <button
            type="button"
            style={hover ? { ...buttonStyle, ...buttonHoverStyle, background: accentColor, color: "#070F2B" } : { ...buttonStyle, background: accentColor, color: "#070F2B" }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={handleSend}
          >
            <span style={{fontSize: "1.2rem", marginRight: "4px"}}>💬</span> Send
          </button>
        </div>
        <button
          style={hover ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={handleFinish}
        >
          Finish Chat
        </button>
      </div>
    </div>
  );
}

export default Chatbot;