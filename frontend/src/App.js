import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './WelcomePage';
import ChoicesPage from './ChoicesPage';
import QuestionnairePage from './QuestionnairePage';
import ChatbotPage from './ChatbotPage';
import ResultsPage from './ResultsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/home" element={<ChoicesPage />} />
          <Route path="/questionnaire" element={<QuestionnairePage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;