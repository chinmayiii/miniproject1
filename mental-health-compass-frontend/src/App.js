import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Options from "./components/Options";
import Questionnaire from "./components/Questionnaire";
import Chatbot from "./components/Chatbot";
import Result from "./components/Result";
import Login from "./Login";

function App() {
  const [loggedIn, setLoggedIn] = useState(() => !!localStorage.getItem("jwt_token"));

  // Redirect to /options after login
  React.useEffect(() => {
    if (loggedIn && window.location.pathname === "/login") {
      window.location.replace("/options");
    }
  }, [loggedIn]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login onLogin={() => setLoggedIn(true)} />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/options"
          element={loggedIn ? <Options /> : <Navigate to="/login" replace />} />
        <Route
          path="/questionnaire"
          element={loggedIn ? <Questionnaire /> : <Navigate to="/login" replace />} />
        <Route
          path="/chatbot"
          element={loggedIn ? <Chatbot /> : <Navigate to="/login" replace />} />
        <Route
          path="/result"
          element={loggedIn ? <Result /> : <Navigate to="/login" replace />} />
        {/* Redirect to login after Home */}
        <Route path="*" element={<Navigate to={loggedIn ? "/options" : "/"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;