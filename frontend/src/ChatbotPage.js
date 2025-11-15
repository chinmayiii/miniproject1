import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const API_URL = 'http://127.0.0.1:5000';

function ChatbotPage() {
    const navigate = useNavigate();
    const [chatInput, setChatInput] = useState('');
    const [chatLog, setChatLog] = useState([
        { sender: 'bot', text: "I'm Compass, a bot designed to listen. How are you feeling today?" }
    ]);
    const [isBotTyping, setIsBotTyping] = useState(false);
    const chatLogRef = useRef(null);

    useEffect(() => {
        if (chatLogRef.current) {
            chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
        }
    }, [chatLog, isBotTyping]);

    const handleChatSubmit = async (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const userMsg = { sender: 'user', text: chatInput };
        // Add user message and immediately show the typing indicator
        setChatLog(prevLog => [...prevLog, userMsg]);
        setIsBotTyping(true);
        setChatInput('');

        try {
            const response = await fetch(`${API_URL}/chat_real`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Send the history including the new user message
                body: JSON.stringify({ history: [...chatLog, userMsg] }) 
            });

            if (!response.ok) {
                throw new Error('Failed to get a response from the server.');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let isFirstChunk = true;

            // As soon as the first piece of data arrives, turn off the "typing" indicator
            // and create the bot's message box.
            reader.read().then(function processText({ done, value }) {
                if (done) {
                    setIsBotTyping(false);
                    return;
                }

                if (isFirstChunk) {
                    setIsBotTyping(false); // Turn off typing indicator
                    isFirstChunk = false;
                    // Add the bot's message with the first chunk
                    setChatLog(prevLog => [...prevLog, { sender: 'bot', text: decoder.decode(value) }]);
                } else {
                    // For all other chunks, just append the text
                    setChatLog(prevLog => {
                        const newLog = [...prevLog];
                        newLog[newLog.length - 1].text += decoder.decode(value);
                        return newLog;
                    });
                }
                
                // Continue reading the stream
                reader.read().then(processText);
            });

        } catch (error) {
            setIsBotTyping(false);
            setChatLog(prevLog => [...prevLog, { sender: 'bot', text: error.message }]);
        }
    };

    // --- NEW FUNCTION TO HANDLE ENDING THE CONVERSATION ---
    const handleEndConversation = async () => {
        // Prevent ending if there's only the initial greeting
        if (chatLog.length <= 1) {
            alert("Please chat a little before getting a summary.");
            return;
        }
        setIsBotTyping(true); // Show a loading state
        try {
            const response = await fetch(`${API_URL}/summarize_chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ history: chatLog })
            });
            const data = await response.json();
            if (response.ok) {
                // --- THIS IS THE CORRECTED LINE ---
                navigate('/results', { state: { from: 'chatbot', summary: data.summary, prediction: data.prediction } });
            } else {
                throw new Error(data.error || "Failed to get summary.");
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setIsBotTyping(false);
        }
    };

    return (
        <>
            <header>
                <button className="back-button" onClick={() => navigate('/')}>&larr; Back to Home</button>
                <h1>Chat with Compass</h1>
            </header>
            <main>
                <div className="container full-height">
                    <div className="chat-window">
                        <div className="chat-log" ref={chatLogRef}>
                            {chatLog.map((msg, index) => (
                                <div key={index} className={msg.sender === 'user' ? 'user-msg' : 'bot-msg'}>
                                    {msg.text}
                                </div>
                            ))}
                            {isBotTyping && <div className="bot-msg typing-indicator"><span></span><span></span><span></span></div>}
                        </div>
                        <form onSubmit={handleChatSubmit} className="chat-form">
                            <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Type your message..." required disabled={isBotTyping} />
                            <button type="submit" disabled={isBotTyping}>Send</button>
                        </form>
                    </div>
                    {/* --- THE NEW BUTTON IS HERE --- */}
                    <button onClick={handleEndConversation} className="end-chat-button" disabled={isBotTyping}>
                        End Conversation & Get Summary
                    </button>
                </div>
            </main>
        </>
    );
}

export default ChatbotPage;