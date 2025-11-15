import React, { useState } from 'react';
import axios from 'axios';
import './Chatbot.css'; // We will create this file next

const API_URL = 'http://127.0.0.1:5000'; // Your Python "brain"

function Chatbot() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { text: "Hi! I'm a bot designed to listen. How are you feeling today?", isBot: true }
    ]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { text: input, isBot: false };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setInput(''); // Clear input box immediately

        try {
            // Send the user's text to your Flask server
            const response = await axios.post(`${API_URL}/predict_chat`, {
                text: input
            });

            // Get the bot's full empathetic reply
            const botReply = response.data.bot_reply;
            const botMessage = { text: botReply, isBot: true };

            setMessages(prevMessages => [...prevMessages, botMessage]);

        } catch (error) {
            console.error("Error connecting to the server:", error);
            const errorMessage = { text: "Sorry, I can't connect to my 'brain' right now.", isBot: true };
            setMessages(prevMessages => [...prevMessages, errorMessage]);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.isBot ? 'bot' : 'user'}`}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <form className="chat-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}

export default Chatbot;