import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
`;

const Box = styled.div`
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(44, 62, 80, 0.12);
  padding: 48px 32px;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 2.2rem;
  font-weight: 700;
  color: #1976d2;
  margin-bottom: 24px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 18px;
  border: 1px solid #bdbdbd;
  border-radius: 8px;
  font-size: 1.1rem;
  background: #f7fafc;
  transition: border 0.2s;
  &:focus {
    border-color: #1976d2;
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px 0;
  background: linear-gradient(90deg, #1976d2 0%, #26c6da 100%);
  color: #fff;
  font-size: 1.2rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(44, 62, 80, 0.08);
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.2s;
  &:hover {
    background: linear-gradient(90deg, #1565c0 0%, #00acc1 100%);
  }
`;

const Error = styled.div`
  color: #d32f2f;
  font-size: 1rem;
  margin-bottom: 12px;
  text-align: center;
`;

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      console.log("Login response:", data); // Debug log
      if (res.ok && data.token) {
        setError("");
        localStorage.setItem("jwt_token", data.token); // Store token for future requests
        if (onLogin) onLogin();
        navigate("/home");
      } else {
        setError(data.error || "Login failed.");
      }
    } catch (err) {
      setError("Network error. Try again.");
      console.error("Login error:", err);
    }
    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupError("");
    setSignupSuccess("");
    if (!signupEmail || !signupPassword) {
      setSignupError("Please enter both email and password.");
      return;
    }
    try {
      const res = await fetch("http://127.0.0.1:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signupEmail, password: signupPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setSignupSuccess("Signup successful! You can now log in.");
        setSignupError("");
        setSignupEmail("");
        setSignupPassword("");
      } else {
        setSignupError(data.error || "Signup failed.");
      }
    } catch {
      setSignupError("Network error. Try again.");
    }
  };

  return (
    <Container>
      <Box>
        {!showSignup ? (
          <>
            <Title>Login</Title>
            {error && <Error>{error}</Error>}
            <form onSubmit={handleLogin} style={{ width: "100%" }}>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" disabled={loading}>{loading ? "Signing In..." : "Sign In"}</Button>
            </form>
            <div style={{ marginTop: 16 }}>
              <span>New user? </span>
              <a href="#" style={{ color: "#1976d2", textDecoration: "underline", cursor: "pointer" }} onClick={() => setShowSignup(true)}>
                Sign Up
              </a>
            </div>
          </>
        ) : (
          <>
            <Title>Sign Up</Title>
            {signupError && <Error>{signupError}</Error>}
            {signupSuccess && <div style={{ color: "#388e3c", marginBottom: 12, textAlign: "center" }}>{signupSuccess}</div>}
            <form onSubmit={handleSignup} style={{ width: "100%" }}>
              <Input
                type="email"
                placeholder="Email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                autoFocus
              />
              <Input
                type="password"
                placeholder="Password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
              />
              <Button type="submit">Sign Up</Button>
            </form>
            <div style={{ marginTop: 16 }}>
              <span>Already have an account? </span>
              <a href="#" style={{ color: "#1976d2", textDecoration: "underline", cursor: "pointer" }} onClick={() => setShowSignup(false)}>
                Login
              </a>
            </div>
          </>
        )}
      </Box>
    </Container>
  );
}

export default Login;
